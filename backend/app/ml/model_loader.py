"""
Singleton model loader for RetinaFace and ArcFace.
Models are loaded once at application startup and kept in memory.
"""

import logging
from typing import Optional

import insightface
from insightface.app import FaceAnalysis

logger = logging.getLogger(__name__)


class ModelLoader:
    """Singleton that holds loaded ML models."""

    _instance: Optional["ModelLoader"] = None
    _face_app: Optional[FaceAnalysis] = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def load_models(self, ctx_id: int = -1, det_size: tuple = (640, 640)):
        """
        Initialize InsightFace FaceAnalysis app.
        ctx_id: -1 = CPU, 0+ = GPU device id
        det_size: detection input size (width, height)
        """
        if self._face_app is not None:
            logger.info("Models already loaded, skipping.")
            return

        logger.info("Loading InsightFace models (RetinaFace + ArcFace)...")
        self._face_app = FaceAnalysis(
            name="buffalo_l",                # Includes both detection + recognition
            providers=["CPUExecutionProvider"]
        )
        self._face_app.prepare(ctx_id=ctx_id, det_size=det_size)
        logger.info("Models loaded successfully.")

    @property
    def face_app(self) -> FaceAnalysis:
        if self._face_app is None:
            raise RuntimeError("Models not loaded. Call load_models() first.")
        return self._face_app


# Module-level singleton
model_loader = ModelLoader()
