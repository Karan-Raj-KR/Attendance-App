"""
Application configuration and settings.
"""

from pathlib import Path

# ── Paths ────────────────────────────────────────────────────────────────
BASE_DIR = Path(__file__).resolve().parent.parent          # backend/
DATABASE_PATH = BASE_DIR / "attendance.db"
UPLOAD_DIR = BASE_DIR / "uploads"
DATASET_DIR = BASE_DIR / "dataset" / "students"
MODEL_DIR = BASE_DIR / "models"

# Ensure directories exist
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
DATASET_DIR.mkdir(parents=True, exist_ok=True)
MODEL_DIR.mkdir(parents=True, exist_ok=True)

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
CORS_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "*",                             # Allow phone access on LAN
]
