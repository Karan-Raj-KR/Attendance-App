"""
Image storage abstraction: Cloudflare R2 in production, local disk as fallback.
"""

import logging
from pathlib import Path

from app.config import (
    R2_ENABLED,
    R2_ACCOUNT_ID,
    R2_ACCESS_KEY,
    R2_SECRET_KEY,
    R2_BUCKET_NAME,
    DATASET_DIR,
)

logger = logging.getLogger(__name__)

_s3_client = None


def _get_s3_client():
    """Lazy-init the S3-compatible client for Cloudflare R2."""
    global _s3_client
    if _s3_client is None:
        import boto3

        _s3_client = boto3.client(
            "s3",
            endpoint_url=f"https://{R2_ACCOUNT_ID}.r2.cloudflarestorage.com",
            aws_access_key_id=R2_ACCESS_KEY,
            aws_secret_access_key=R2_SECRET_KEY,
        )
    return _s3_client


def upload_image(key: str, image_bytes: bytes) -> str:
    """
    Upload an image to R2 (or save locally if R2 is not configured).

    Args:
        key: Object key, e.g. "faces/STU001/1.jpg"
        image_bytes: Raw image bytes

    Returns:
        The storage path/key for reference.
    """
    if R2_ENABLED:
        client = _get_s3_client()
        client.put_object(
            Bucket=R2_BUCKET_NAME,
            Key=key,
            Body=image_bytes,
            ContentType="image/jpeg",
        )
        logger.info(f"Uploaded to R2: {key}")
        return f"r2://{R2_BUCKET_NAME}/{key}"
    else:
        # Fallback: save to local disk
        local_path = DATASET_DIR / key
        local_path.parent.mkdir(parents=True, exist_ok=True)
        local_path.write_bytes(image_bytes)
        logger.info(f"Saved locally: {local_path}")
        return str(local_path)
