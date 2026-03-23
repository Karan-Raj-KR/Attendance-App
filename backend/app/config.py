"""
Application configuration and settings.

Reads from environment variables in production, falls back to local defaults for development.
"""

import os
from pathlib import Path

# ── Paths ────────────────────────────────────────────────────────────────
BASE_DIR = Path(__file__).resolve().parent.parent          # backend/

# ── Database ─────────────────────────────────────────────────────────────
# PostgreSQL in production, SQLite locally
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{BASE_DIR / 'attendance.db'}")

# ── File Storage ─────────────────────────────────────────────────────────
UPLOAD_DIR = BASE_DIR / "uploads"
DATASET_DIR = BASE_DIR / "dataset" / "students"
MODEL_DIR = BASE_DIR / "models"

# FAISS index directory — mount a Railway volume in production
FAISS_INDEX_DIR = Path(os.getenv("FAISS_INDEX_PATH", str(BASE_DIR / "faiss_indexes")))

# Ensure directories exist
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
DATASET_DIR.mkdir(parents=True, exist_ok=True)
MODEL_DIR.mkdir(parents=True, exist_ok=True)
FAISS_INDEX_DIR.mkdir(parents=True, exist_ok=True)

# ── Cloudflare R2 (S3-compatible) ────────────────────────────────────────
R2_ACCOUNT_ID = os.getenv("R2_ACCOUNT_ID")
R2_ACCESS_KEY = os.getenv("R2_ACCESS_KEY")
R2_SECRET_KEY = os.getenv("R2_SECRET_KEY")
R2_BUCKET_NAME = os.getenv("R2_BUCKET_NAME", "attendance-faces")

# True when all R2 credentials are configured
R2_ENABLED = all([R2_ACCOUNT_ID, R2_ACCESS_KEY, R2_SECRET_KEY])

# ── ML Settings ──────────────────────────────────────────────────────────
MAX_IMAGE_SIZE = 1280                # Resize longest edge to this
FACE_MIN_SIZE = 30                   # Discard detected faces smaller than this (px)
FACE_CROP_MARGIN = 0.2              # 20% margin around detected face
ARCFACE_INPUT_SIZE = (112, 112)      # ArcFace expected input dimensions
EMBEDDING_DIM = 512                  # ArcFace output embedding size

# ── Matching Thresholds ──────────────────────────────────────────────────
CONFIDENCE_PRESENT = 0.70            # >= this → present
CONFIDENCE_UNCERTAIN = 0.40          # >= this and < PRESENT → uncertain
                                     # < this → unmatched / absent

# ── Server ───────────────────────────────────────────────────────────────
_cors_env = os.getenv("CORS_ORIGINS")
if _cors_env:
    CORS_ORIGINS = [origin.strip() for origin in _cors_env.split(",")]
else:
    CORS_ORIGINS = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "*",                             # Allow phone access on LAN
    ]
