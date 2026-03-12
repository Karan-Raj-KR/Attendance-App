"""
FAISS-based vector index for fast student embedding search.

Uses IndexFlatIP (inner product) on L2-normalized embeddings,
which is equivalent to cosine similarity. One index per section.
"""

import logging
from typing import Optional

import faiss
import numpy as np

from app.config import EMBEDDING_DIM
from app.database.queries import get_embeddings_by_section, get_sections
from app.utils.embedding_utils import bytes_to_embedding, normalize_embedding

logger = logging.getLogger(__name__)


class SectionIndex:
    """FAISS index + metadata for a single section."""

    def __init__(self, section_id: int):
        self.section_id = section_id
        self.index: faiss.IndexFlatIP = faiss.IndexFlatIP(EMBEDDING_DIM)
        self.id_map: list[int] = []          # row → student_id
        self.name_map: dict[int, str] = {}   # student_id → name
        self.idnum_map: dict[int, str] = {}  # student_id → student_id_number

    @property
    def size(self) -> int:
        return self.index.ntotal

    def add(
        self,
        student_id: int,
        name: str,
        student_id_number: str,
        embedding: np.ndarray,
    ):
        """Add a single L2-normalized embedding to the index."""
        vec = normalize_embedding(embedding).astype(np.float32).reshape(1, -1)
        self.index.add(vec)
        self.id_map.append(student_id)
        self.name_map[student_id] = name
        self.idnum_map[student_id] = student_id_number

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

            if idx < 0 or idx >= len(self.id_map):
                results.append({
                    "student_id": None,
                    "student_id_number": None,
                    "name": None,
                    "confidence": 0.0,
                })
            else:
                sid = self.id_map[idx]
                results.append({
                    "student_id": sid,
                    "student_id_number": self.idnum_map.get(sid),
                    "name": self.name_map.get(sid),
                    "confidence": score,
                })

        return results


class FaissIndexManager:
    """
    Manages per-section FAISS indexes.

    Singleton — import `faiss_manager` from this module.
    """

    _instance: Optional["FaissIndexManager"] = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._indexes: dict[int, SectionIndex] = {}
        return cls._instance

    # ── Build / Rebuild ──────────────────────────────────────────────────

    def rebuild_section(self, section_id: int) -> SectionIndex:
        """
        Rebuild the FAISS index for a single section from the database.

        Groups multiple embeddings per student by averaging them
        (gallery representation) before inserting into the index.
        """
        stored = get_embeddings_by_section(section_id)
        section_idx = SectionIndex(section_id)

        if not stored:
            logger.info(f"Section {section_id}: no embeddings, empty index created")
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

        self._indexes[section_id] = section_idx
        logger.info(
            f"Section {section_id}: FAISS index rebuilt with "
            f"{section_idx.size} students"
        )
        return section_idx

    def rebuild_all(self):
        """Rebuild FAISS indexes for every section that has students."""
        sections = get_sections()
        total = 0
        for sec in sections:
            idx = self.rebuild_section(sec["id"])
            total += idx.size
        logger.info(f"✅ FAISS indexes rebuilt: {len(sections)} sections, {total} total vectors")

    # ── Runtime Operations ───────────────────────────────────────────────

    def get_index(self, section_id: int) -> SectionIndex:
        """Get (or lazily build) the index for a section."""
        if section_id not in self._indexes:
            self.rebuild_section(section_id)
        return self._indexes[section_id]

    def add_embedding(
        self,
        section_id: int,
        student_id: int,
        name: str,
        student_id_number: str,
        embedding: np.ndarray,
    ):
        """
        Add a new embedding to the in-memory FAISS index.

        NOTE: For simplicity this appends the raw embedding rather than
        re-averaging. Call rebuild_section() for a full refresh.
        """
        idx = self.get_index(section_id)
        idx.add(
            student_id=student_id,
            name=name,
            student_id_number=student_id_number,
            embedding=embedding,
        )
        logger.info(
            f"Added embedding for student {student_id} ({name}) "
            f"to section {section_id} FAISS index (size={idx.size})"
        )

    def search(
        self,
        section_id: int,
        query_embeddings: np.ndarray,
        k: int = 1,
    ) -> list[dict]:
        """Search the FAISS index for a given section."""
        idx = self.get_index(section_id)
        return idx.search(query_embeddings, k=k)


# ── Module-level singleton ───────────────────────────────────────────────
faiss_manager = FaissIndexManager()
