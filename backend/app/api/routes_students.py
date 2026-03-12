"""
API routes for student and section management.
"""

import logging
from pathlib import Path

from fastapi import APIRouter, File, UploadFile, Form, HTTPException, Query
from typing import Optional

from app.config import DATASET_DIR
from app.models.student import (
    StudentRegisterRequest,
    StudentResponse,
    SectionCreateRequest,
    SectionResponse,
)
from app.database.queries import (
    create_student,
    get_students_by_section,
    get_student_by_id_number,
    save_embedding,
    create_section,
    get_sections,
    get_section,
)
from app.services.face_detection import detect_faces
from app.utils.image_utils import read_image_from_bytes
from app.utils.embedding_utils import embedding_to_bytes

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/students", tags=["Students"])


# ── Section Endpoints ────────────────────────────────────────────────────

@router.post("/sections", response_model=SectionResponse)
async def create_new_section(body: SectionCreateRequest):
    """Create a new class section."""
    section_id = create_section(
        name=body.name,
        course_name=body.course_name,
        instructor_name=body.instructor_name,
        schedule=body.schedule,
    )
    section = get_section(section_id)
    return SectionResponse(**section)


@router.get("/sections", response_model=list[SectionResponse])
async def list_sections():
    """List all sections."""
    sections = get_sections()
    return [SectionResponse(**s) for s in sections]


# ── Student Endpoints ────────────────────────────────────────────────────

@router.post("/register")
async def register_student(
    student_id_number: str = Form(...),
    name: str = Form(...),
    section_id: int = Form(...),
    images: list[UploadFile] = File(..., description="1-5 face training images"),
):
    """
    Register a new student with training images.
    For each image, a face is detected, an embedding is generated, and stored.
    """
    if len(images) < 1 or len(images) > 5:
        raise HTTPException(status_code=400, detail="Please provide 1 to 5 images")

    # Check if section exists
    section = get_section(section_id)
    if not section:
        raise HTTPException(status_code=404, detail=f"Section {section_id} not found")

    # Check for duplicate student ID
    existing = get_student_by_id_number(student_id_number)
    if existing:
        raise HTTPException(status_code=409, detail=f"Student {student_id_number} already registered")

    # Create student record
    student_db_id = create_student(
        student_id_number=student_id_number,
        name=name,
        section_id=section_id,
    )

    # Process each training image
    student_dir = DATASET_DIR / student_id_number
    student_dir.mkdir(parents=True, exist_ok=True)
    embeddings_saved = 0

    for idx, img_file in enumerate(images):
        image_bytes = await img_file.read()
        if not image_bytes:
            continue

        try:
            img_bgr = read_image_from_bytes(image_bytes)
        except ValueError:
            logger.warning(f"Skipping invalid image {idx} for student {student_id_number}")
            continue

        # Save training image to disk
        img_path = student_dir / f"{idx + 1}.jpg"
        img_path.write_bytes(image_bytes)

        # Detect face and extract embedding
        faces = detect_faces(img_bgr)
        if not faces:
            logger.warning(f"No face detected in image {idx} for student {student_id_number}")
            continue

        # Take the largest / highest-confidence face from the training image
        best_face = max(faces, key=lambda f: f["det_score"])
        embedding = best_face["embedding"]

        # Save embedding to database
        save_embedding(
            student_id=student_db_id,
            embedding_blob=embedding_to_bytes(embedding),
            source_image_path=str(img_path),
        )
        embeddings_saved += 1

    if embeddings_saved == 0:
        raise HTTPException(
            status_code=422,
            detail="No faces could be detected in any of the provided images"
        )

    return {
        "message": f"Student {name} registered successfully",
        "student_id": student_db_id,
        "student_id_number": student_id_number,
        "embeddings_saved": embeddings_saved,
    }


@router.get("", response_model=list[StudentResponse])
async def list_students(section_id: int = Query(..., description="Section ID")):
    """List all students in a section."""
    students = get_students_by_section(section_id)
    return [StudentResponse(**s) for s in students]
