"""
FAISS-based vector index for fast student embedding search.

Uses IndexFlatIP (inner product) on L2-normalized embeddings,
which is equivalent to cosine similarity. 
Persists `.index` and `.json` metadata to disk per section.
"""

import logging
import json
from pathlib import Path
from typing import Optional

import faiss
import numpy as np

from app.config import EMBEDDING_DIM, FAISS_INDEX_DIR
from app.database.queries import get_embeddings_by_section, get_sections
from app.utils.embedding_utils import bytes_to_embedding, normalize_embedding

logger = logging.getLogger(__name__)


class SectionIndex:
    """FAISS index + metadata for a single section with disk persistence."""

    def __init__(self, section_id: int):
        self.section_id = section_id
        self.index_path = FAISS_INDEX_DIR / f"section_{section_id}.index"
        self.meta_path = FAISS_INDEX_DIR / f"section_{section_id}_meta.json"
        
        self.index: faiss.IndexFlatIP = faiss.IndexFlatIP(EMBEDDING_DIM)
        # We store metadata parallel to the FAISS index (row N = self.metadata[N])
        self.metadata: list[dict] = []

    @property
    def size(self) -> int:
        return self.index.ntotal

    def save(self):
        """Save index and metadata to disk."""
        faiss.write_index(self.index, str(self.index_path))
        with open(self.meta_path, "w") as f:
            json.dump(self.metadata, f)

    def load(self) -> bool:
        """Load index from disk. Returns True if successful."""
        if not self.index_path.exists() or not self.meta_path.exists():
            return False

        try:
            self.index = faiss.read_index(str(self.index_path))
            with open(self.meta_path, "r") as f:
                self.metadata = json.load(f)
            
            # Sanity check
            if self.index.ntotal != len(self.metadata):
                logger.warning(f"Index mismatch for section {self.section_id}. Rebuilding...")
                return False
                
            return True
        except Exception as e:
            logger.error(f"Failed to load index for section {self.section_id}: {e}")
            return False

    def add(
        self,
        student_id: int,
        name: str,
        student_id_number: str,
        embedding: np.ndarray,
    ):
        """Add a single L2-normalized embedding to the index."""
        # Ensure embedding shape (1, 512) and type float32
        vec = normalize_embedding(embedding).astype(np.float32).reshape(1, -1)
        self.index.add(vec)
        self.metadata.append({
            "student_id": student_id,
            "name": name,
            "student_id_number": student_id_number,
        })

    def search(
        self,
        query_embeddings: np.ndarray,
        k: int = 1,
    ) -> list[dict]:
        """
        Search for the k nearest students for each query embedding.

        Args:
            query_embeddings: (N, 512) float32, L2-normalized
            k: number of neighbours per query

        Returns:
            List of dicts per query:
            {
                "student_id": int | None,
                "student_id_number": str | None,
                "name": str | None,
                "confidence": float,
            }
        """
        if self.index.ntotal == 0:
            return [
                {"student_id": None, "student_id_number": None, "name": None, "confidence": 0.0}
                for _ in range(len(query_embeddings))
            ]

        queries = query_embeddings.astype(np.float32)
        actual_k = min(k, self.index.ntotal)
        distances, indices = self.index.search(queries, actual_k)

        results = []
        for i in range(len(queries)):
            idx = int(indices[i][0])
            score = float(distances[i][0])

            if idx < 0 or idx >= len(self.metadata):
                results.append({
                    "student_id": None,
                    "student_id_number": None,
                    "name": None,
                    "confidence": 0.0,
                })
            else:
                meta = self.metadata[idx]
                results.append({
                    "student_id": meta["student_id"],
                    "student_id_number": meta.get("student_id_number"),
                    "name": meta.get("name"),
                    "confidence": score,
                })

        return results


class FaissIndexManager:
    """
    Manages per-section FAISS indexes and disk persistence.
    Provides requested functions: create_index, add_student_embedding, search_embedding, rebuild_index.
    """

    _instance: Optional["FaissIndexManager"] = None
    _indexes: dict[int, SectionIndex]

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._indexes = {}
        return cls._instance

    def create_index(self, section_id: int) -> SectionIndex:
        """
        Load an existing FAISS index from disk if available, otherwise return an empty index.
        """
        if section_id in self._indexes:
            return self._indexes[section_id]
            
        section_idx = SectionIndex(section_id)
        if section_idx.load():
            logger.info(f"Loaded FAISS index for section {section_id} from disk (size={section_idx.size})")
        else:
            logger.info(f"Initialized new FAISS index for section {section_id}")
            
        self._indexes[section_id] = section_idx
        return section_idx

    def rebuild_index(self, section_id: int) -> SectionIndex:
        """
        Force rebuild the FAISS index for a single section from the database and save to disk.
        Groups multiple embeddings per student by averaging them.
        """
        stored = get_embeddings_by_section(section_id)
        
        # Replace completely fresh to discard old items
        section_idx = SectionIndex(section_id)

        if not stored:
            logger.info(f"Section {section_id}: no embeddings, saving empty index.")
            section_idx.save()
            self._indexes[section_id] = section_idx
            return section_idx

        # Group embeddings by student and average
        student_groups: dict[int, dict] = {}
        for rec in stored:
            sid = rec["student_id"]
            if sid not in student_groups:
                student_groups[sid] = {
                    "name": rec["name"],
                    "student_id_number": rec["student_id_number"],
                    "embeddings": [],
                }
            student_groups[sid]["embeddings"].append(
                bytes_to_embedding(rec["embedding"])
            )

        for sid, info in student_groups.items():
            embs = np.stack(info["embeddings"])
            avg_emb = embs.mean(axis=0)
            avg_emb = normalize_embedding(avg_emb)

            section_idx.add(
                student_id=sid,
                name=info["name"],
                student_id_number=info["student_id_number"],
                embedding=avg_emb,
            )

        # Persist to disk
        section_idx.save()
        self._indexes[section_id] = section_idx
        
        logger.info(
            f"Section {section_id}: FAISS index rebuilt and saved to disk with "
            f"{section_idx.size} students"
        )
        return section_idx

    def rebuild_all(self):
        """Rebuild and save FAISS indexes for every section."""
        sections = get_sections()
        total = 0
        for sec in sections:
            idx = self.rebuild_index(sec["id"])
            total += idx.size
        logger.info(f"✅ FAISS indexes rebuilt and persisted: {len(sections)} sections, {total} vectors")

    def add_student_embedding(
        self,
        section_id: int,
        student_id: int,
        name: str,
        student_id_number: str,
        embedding: np.ndarray,
    ):
        """
        Add a new student embedding to the index and persist to disk.
        """
        idx = self.create_index(section_id)
        idx.add(
            student_id=student_id,
            name=name,
            student_id_number=student_id_number,
            embedding=embedding,
        )
        idx.save()
        logger.info(
            f"Added embedding for student {student_id} ({name}) "
            f"to section {section_id} FAISS index (size={idx.size})"
        )

    def search_embedding(
        self,
        section_id: int,
        query_embeddings: np.ndarray,
        k: int = 1,
    ) -> list[dict]:
        """Search the FAISS index for nearest neighbors."""
        idx = self.create_index(section_id)
        return idx.search(query_embeddings, k=k)


# ── Module-level singleton ───────────────────────────────────────────────
faiss_manager = FaissIndexManager()
