"""
Image utility functions: resizing, format conversion, saving.
"""

import uuid
from pathlib import Path

import cv2
import numpy as np
from PIL import Image

from app.config import MAX_IMAGE_SIZE, UPLOAD_DIR


def read_image_from_bytes(image_bytes: bytes) -> np.ndarray:
    """Decode raw image bytes into a BGR numpy array (OpenCV format)."""
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if img is None:
        raise ValueError("Could not decode image")
    return img


def resize_image(img: np.ndarray, max_size: int = MAX_IMAGE_SIZE) -> np.ndarray:
    """Resize image so the longest edge does not exceed max_size. Preserves aspect ratio."""
    h, w = img.shape[:2]
    if max(h, w) <= max_size:
        return img
    scale = max_size / max(h, w)
    new_w, new_h = int(w * scale), int(h * scale)
    return cv2.resize(img, (new_w, new_h), interpolation=cv2.INTER_AREA)


def bgr_to_rgb(img: np.ndarray) -> np.ndarray:
    """Convert BGR (OpenCV default) to RGB."""
    return cv2.cvtColor(img, cv2.COLOR_BGR2RGB)


def save_upload(image_bytes: bytes, filename: str = None) -> str:
    """Save uploaded image to disk. Returns the saved file path."""
    if filename is None:
        filename = f"{uuid.uuid4().hex}.jpg"
    filepath = UPLOAD_DIR / filename
    filepath.write_bytes(image_bytes)
    return str(filepath)


def crop_face(img: np.ndarray, bbox: list[int], margin: float = 0.2) -> np.ndarray:
    """
    Crop a face from an image with a percentage margin.
    bbox: [x1, y1, x2, y2]
    """
    h, w = img.shape[:2]
    x1, y1, x2, y2 = bbox

    face_w = x2 - x1
    face_h = y2 - y1
    margin_w = int(face_w * margin)
    margin_h = int(face_h * margin)

    x1 = max(0, x1 - margin_w)
    y1 = max(0, y1 - margin_h)
    x2 = min(w, x2 + margin_w)
    y2 = min(h, y2 + margin_h)

    return img[y1:y2, x1:x2]
