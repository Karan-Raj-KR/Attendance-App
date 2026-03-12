"""
Face detection service using InsightFace (RetinaFace under the hood).
"""

import logging

import numpy as np

from app.config import FACE_MIN_SIZE
from app.ml.model_loader import model_loader
from app.utils.image_utils import resize_image, bgr_to_rgb

logger = logging.getLogger(__name__)


def detect_faces(img_bgr: np.ndarray) -> list[dict]:
    """
    Detect all faces in a BGR image.

    Returns a list of dicts, each containing:
        - bbox:      [x1, y1, x2, y2]  (int)
        - landmarks: 5-point facial landmarks
        - det_score: detection confidence
        - embedding: 512-dim face embedding (float32)
    """
    # Resize for performance
    img_resized = resize_image(img_bgr)

    # InsightFace expects BGR (OpenCV default) — no conversion needed
    faces = model_loader.face_app.get(img_resized)

    results = []
    for face in faces:
        bbox = face.bbox.astype(int).tolist()  # [x1, y1, x2, y2]

        # Skip tiny faces
        face_w = bbox[2] - bbox[0]
        face_h = bbox[3] - bbox[1]
        if face_w < FACE_MIN_SIZE or face_h < FACE_MIN_SIZE:
            logger.debug(f"Skipping small face: {face_w}x{face_h}")
            continue

        result = {
            "bbox": bbox,
            "det_score": float(face.det_score),
            "landmarks": face.landmark_2d_106.tolist() if hasattr(face, 'landmark_2d_106') and face.landmark_2d_106 is not None else None,
            "embedding": face.normed_embedding  # Already L2-normalized by InsightFace
        }
        results.append(result)

    logger.info(f"Detected {len(results)} faces (filtered from {len(faces)} raw detections)")
    return results
