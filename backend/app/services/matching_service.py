"""
Face matching service: compare detected embeddings against stored student embeddings
using FAISS for fast vector similarity search.
"""

import logging

import numpy as np

from app.config import CONFIDENCE_PRESENT, CONFIDENCE_UNCERTAIN
from app.database.queries import get_students_by_section
from app.ml.faiss_index import faiss_manager

logger = logging.getLogger(__name__)


def match_faces(
    detected_faces: list[dict],
    section_id: int
) -> dict:
    """
    Match detected face embeddings against the FAISS index for a section.

    Returns:
        {
            "results": [ { student_id, name, status, confidence, bbox }, ... ],
            "absent_students": [ { student_id, name }, ... ]
        }
    """
    # Build query matrix from detected faces: (N, 512)
    query_embeddings = np.stack(
        [f["embedding"] for f in detected_faces]
    ).astype(np.float32)

    # Search FAISS index
    search_results = faiss_manager.search(
        section_id=section_id,
        query_embeddings=query_embeddings,
        k=1,
    )

    # Classify each detection
    matched_student_ids = set()
    results = []

    for i, (face, match) in enumerate(zip(detected_faces, search_results)):
        student_id = match["student_id"]
        confidence = match["confidence"]

        if student_id is not None and confidence >= CONFIDENCE_PRESENT:
            status = "present"
            matched_student_ids.add(student_id)
            results.append({
                "student_id": student_id,
                "student_id_number": match["student_id_number"],
                "name": match["name"],
                "status": status,
                "confidence": round(confidence, 3),
                "bbox": face["bbox"],
            })
        elif student_id is not None and confidence >= CONFIDENCE_UNCERTAIN:
            status = "uncertain"
            results.append({
                "student_id": student_id,
                "student_id_number": match["student_id_number"],
                "name": match["name"],
                "status": status,
                "confidence": round(confidence, 3),
                "bbox": face["bbox"],
            })
        else:
            results.append({
                "student_id": None,
                "student_id_number": None,
                "name": None,
                "status": "unmatched",
                "confidence": round(confidence, 3),
                "bbox": face["bbox"],
            })

    # Determine absent students (enrolled but not matched)
    all_students = get_students_by_section(section_id)
    absent_students = [
        {
            "student_id": s["id"],
            "student_id_number": s["student_id_number"],
            "name": s["name"],
        }
        for s in all_students
        if s["id"] not in matched_student_ids
    ]

    logger.info(
        f"FAISS matching complete: {len(results)} detections, "
        f"{len(absent_students)} absent"
    )
    return {"results": results, "absent_students": absent_students}
