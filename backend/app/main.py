"""
Smart Attendance Backend — FastAPI Application Entry Point.

Starts the server, loads ML models at startup, and mounts all API routes.
"""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import CORS_ORIGINS
from app.database.database import init_db
from app.ml.model_loader import model_loader
from app.api.routes_detection import router as detection_router
from app.api.routes_students import router as students_router
from app.api.routes_attendance import router as attendance_router

# ── Logging ──────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s │ %(levelname)-7s │ %(name)s │ %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger(__name__)


# ── Lifespan ─────────────────────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load ML models and initialize database on startup."""
    logger.info("🚀 Starting Smart Attendance Backend...")

    # Initialize database tables
    init_db()
    logger.info("✅ Database initialized")

    # Load ML models (RetinaFace + ArcFace)
    model_loader.load_models(ctx_id=-1, det_size=(640, 640))
    logger.info("✅ ML models loaded")

    logger.info("🟢 Server ready")
    yield
    logger.info("🔴 Shutting down...")


# ── FastAPI App ──────────────────────────────────────────────────────────
app = FastAPI(
    title="Smart Attendance API",
    description="AI-powered classroom attendance using face detection and recognition.",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS — allow frontend origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Mount Routers ────────────────────────────────────────────────────────
app.include_router(detection_router)
app.include_router(students_router)
app.include_router(attendance_router)


# ── Health check ─────────────────────────────────────────────────────────
@app.get("/", tags=["Health"])
async def health_check():
    return {"status": "ok", "service": "Smart Attendance API", "version": "1.0.0"}


# ── Run directly ─────────────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
