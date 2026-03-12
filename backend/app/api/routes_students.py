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
from app.ml.faiss_index import faiss_manager

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


# ── Student Registration (Single Photo — Strict) ────────────────────────

@router.post("/register")
async def register_student(
    student_id_number: str = Form(...),
    name: str = Form(...),
    section_id: int = Form(...),
    image: UploadFile = File(..., description="Single face photo (JPEG/PNG)"),
):
    """
    Register a new student with a single face photo.

    Steps:
        1. Detect face in uploaded image
        2. Generate embedding using InsightFace
        3. Save student in database
        4. Store embedding vector
        5. Add embedding to FAISS index

    Errors if 0 or 2+ faces are detected in the image.
    """
    # Validate section exists
    section = get_section(section_id)
    if not section:
        raise HTTPException(status_code=404, detail=f"Section {section_id} not found")

    # Check for duplicate student ID
    existing = get_student_by_id_number(student_id_number)
    if existing:
        raise HTTPException(
            status_code=409,
            detail=f"Student {student_id_number} already registered",
        )

    # Read and validate the image
    image_bytes = await image.read()
    if not image_bytes:
        raise HTTPException(status_code=400, detail="Empty image file")

    try:
        img_bgr = read_image_from_bytes(image_bytes)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid image format")

    # Detect faces — enforce exactly one
    faces = detect_faces(img_bgr)

    if len(faces) == 0:
        raise HTTPException(
            status_code=422,
            detail="No face detected in the image. Please upload a clear face photo.",
        )

    if len(faces) > 1:
        raise HTTPException(
            status_code=422,
            detail=f"Multiple faces detected ({len(faces)}). Please upload a photo with only one face.",
        )

    face = faces[0]
    embedding = face["embedding"]

    # Save student record to database
    student_db_id = create_student(
        student_id_number=student_id_number,
        name=name,
        section_id=section_id,
    )

    # Save training image to disk
    student_dir = DATASET_DIR / student_id_number
    student_dir.mkdir(parents=True, exist_ok=True)
    img_path = student_dir / "1.jpg"
    img_path.write_bytes(image_bytes)

    # Save embedding to database
    save_embedding(
        student_id=student_db_id,
        embedding_blob=embedding_to_bytes(embedding),
        source_image_path=str(img_path),
    )

    # Add to in-memory FAISS index for immediate searchability
    faiss_manager.add_embedding(
        section_id=section_id,
        student_id=student_db_id,
        name=name,
        student_id_number=student_id_number,
        embedding=embedding,
    )

    logger.info(f"Student registered: {name} ({student_id_number}) → section {section_id}")

    return {
        "id": student_db_id,
        "name": name,
        "status": "registered",
    }


# ── Student Registration (Multi-Image — Batch) ──────────────────────────

@router.post("/register-batch")
async def register_student_batch(
    student_id_number: str = Form(...),
    name: str = Form(...),
    section_id: int = Form(...),
    images: list[UploadFile] = File(..., description="1-5 face training images"),
):
    """
    Register a new student with multiple training images (1–5).
    Uses the highest-confidence face from each image.
    """
    if len(images) < 1 or len(images) > 5:
        raise HTTPException(status_code=400, detail="Please provide 1 to 5 images")

    section = get_section(section_id)
    if not section:
        raise HTTPException(status_code=404, detail=f"Section {section_id} not found")

    existing = get_student_by_id_number(student_id_number)
    if existing:
        raise HTTPException(status_code=409, detail=f"Student {student_id_number} already registered")

    student_db_id = create_student(
        student_id_number=student_id_number,
        name=name,
        section_id=section_id,
    )

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

        img_path = student_dir / f"{idx + 1}.jpg"
        img_path.write_bytes(image_bytes)

        faces = detect_faces(img_bgr)
        if not faces:
            logger.warning(f"No face detected in image {idx} for student {student_id_number}")
            continue

        best_face = max(faces, key=lambda f: f["det_score"])
        embedding = best_face["embedding"]

        save_embedding(
            student_id=student_db_id,
            embedding_blob=embedding_to_bytes(embedding),
            source_image_path=str(img_path),
        )

        faiss_manager.add_embedding(
            section_id=section_id,
            student_id=student_db_id,
            name=name,
            student_id_number=student_id_number,
            embedding=embedding,
        )
        embeddings_saved += 1

    if embeddings_saved == 0:
        raise HTTPException(
            status_code=422,
            detail="No faces could be detected in any of the provided images",
        )

    return {
        "id": student_db_id,
        "name": name,
        "status": "registered",
        "embeddings_saved": embeddings_saved,
    }


@router.get("", response_model=list[StudentResponse])
async def list_students(section_id: int = Query(..., description="Section ID")):
    """List all students in a section."""
    students = get_students_by_section(section_id)
    return [StudentResponse(**s) for s in students]
