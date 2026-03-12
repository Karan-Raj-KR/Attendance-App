"""
Embedding serialization utilities: numpy <-> SQLite blob.
"""

import numpy as np
from app.config import EMBEDDING_DIM


def embedding_to_bytes(embedding: np.ndarray) -> bytes:
    """Convert a 512-dim float32 numpy array to bytes for SQLite storage."""
    assert embedding.shape == (EMBEDDING_DIM,), f"Expected ({EMBEDDING_DIM},), got {embedding.shape}"
    return embedding.astype(np.float32).tobytes()


def bytes_to_embedding(blob: bytes) -> np.ndarray:
    """Convert bytes from SQLite back to a 512-dim float32 numpy array."""
    return np.frombuffer(blob, dtype=np.float32).copy()


def normalize_embedding(embedding: np.ndarray) -> np.ndarray:
    """L2-normalize an embedding vector."""
    norm = np.linalg.norm(embedding)
    if norm == 0:
        return embedding
    return embedding / norm
