"""
Singleton model loader for InsightFace (RetinaFace and ArcFace).
Models are loaded once at application startup and kept in memory to prevent reloading overhead per request.
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
            logger.info("InsightFace models already loaded, skipping initialization.")
            return

        logger.info("Loading InsightFace models (RetinaFace + ArcFace)... This may take a moment.")
        # 'buffalo_l' includes both robust face detection and high-accuracy recognition embeddings
        app_instance = FaceAnalysis(
            name="buffalo_l",                
            providers=["CPUExecutionProvider"]
        )
        self._face_app = app_instance
        # Prepare the model with the specified context and detection size
        if app_instance is not None:
            app_instance.prepare(ctx_id=ctx_id, det_size=det_size)
        logger.info("InsightFace models loaded successfully into memory.")

    @property
    def face_app(self) -> FaceAnalysis:
        if self._face_app is None:
            raise RuntimeError("Models not loaded. Call load_models() during FastAPI startup BEFORE processing requests.")
        return self._face_app


# Module-level singleton instance for the entire application lifecycle
model_loader = ModelLoader()
