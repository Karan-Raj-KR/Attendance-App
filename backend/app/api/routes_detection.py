"""
API routes for face detection in classroom images.
"""

import logging

from fastapi import APIRouter, File, UploadFile, Form, HTTPException

from app.models.attendance import DetectionResponse, DetectedFace, AbsentStudent
from app.services.face_detection import detect_faces
from app.services.matching_service import match_faces
from app.utils.image_utils import read_image_from_bytes, save_upload

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/detect", tags=["Detection"])


@router.post("", response_model=DetectionResponse)
async def detect_attendance(
    image: UploadFile = File(..., description="Classroom photo (JPEG/PNG)"),
    section_id: int = Form(..., description="Section ID to match against"),
):
    """
    Upload a classroom image. Detects all faces and matches them
    against registered students in the given section.
    """
    # Read and validate image
    image_bytes = await image.read()
    if not image_bytes:
        raise HTTPException(status_code=400, detail="Empty image file")

    try:
        img_bgr = read_image_from_bytes(image_bytes)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid image format")

    # Save the upload
    saved_path = save_upload(image_bytes, image.filename)
    logger.info(f"Saved uploaded image to {saved_path}")

    # Detect faces + generate embeddings
    detected_faces = detect_faces(img_bgr)

    if not detected_faces:
        # No faces found — return all students as absent
        from app.database.queries import get_students_by_section
        all_students = get_students_by_section(section_id)
        return DetectionResponse(
            total_faces_detected=0,
            results=[],
            absent_students=[
                AbsentStudent(
                    student_id=s["id"],
                    student_id_number=s["student_id_number"],
                    name=s["name"]
                ) for s in all_students
            ]
        )

    # Match against stored embeddings
    match_results = match_faces(detected_faces, section_id)

    return DetectionResponse(
        total_faces_detected=len(detected_faces),
        results=[DetectedFace(**r) for r in match_results["results"]],
        absent_students=[AbsentStudent(**a) for a in match_results["absent_students"]],
    )
