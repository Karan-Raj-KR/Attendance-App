"""
Face matching service: compare detected embeddings against stored student embeddings.
"""

import logging

import numpy as np

from app.config import CONFIDENCE_PRESENT, CONFIDENCE_UNCERTAIN
from app.database.queries import get_embeddings_by_section, get_students_by_section
from app.utils.embedding_utils import bytes_to_embedding

logger = logging.getLogger(__name__)


def match_faces(
    detected_faces: list[dict],
    section_id: int
) -> dict:
    """
    Match detected face embeddings against all stored embeddings for a section.

    Returns:
        {
            "results": [ { student_id, name, status, confidence, bbox }, ... ],
            "absent_students": [ { student_id, name }, ... ]
        }
    """
    # Load stored embeddings for this section
    stored_records = get_embeddings_by_section(section_id)

    if not stored_records:
        logger.warning(f"No stored embeddings for section {section_id}")
        # Return all faces as unmatched
        results = []
        for face in detected_faces:
            results.append({
                "student_id": None,
                "student_id_number": None,
                "name": None,
                "status": "unmatched",
                "confidence": 0.0,
                "bbox": face["bbox"],
            })
        all_students = get_students_by_section(section_id)
        absent = [{"student_id": s["id"], "student_id_number": s["student_id_number"], "name": s["name"]} for s in all_students]
        return {"results": results, "absent_students": absent}

    # Build embedding matrix: (N_stored, 512)
    # Group by student — one student may have multiple embeddings
    student_map = {}  # student_id -> { name, id_number, embeddings: [] }
    for rec in stored_records:
        sid = rec["student_id"]
        if sid not in student_map:
            student_map[sid] = {
                "student_id": sid,
                "student_id_number": rec["student_id_number"],
                "name": rec["name"],
                "embeddings": []
            }
        student_map[sid]["embeddings"].append(bytes_to_embedding(rec["embedding"]))

    # For each student, average their embeddings (gallery representation)
    student_ids = []
    gallery_embeddings = []
    for sid, info in student_map.items():
        embs = np.stack(info["embeddings"])
        avg_emb = embs.mean(axis=0)
        avg_emb = avg_emb / np.linalg.norm(avg_emb)  # Re-normalize
        gallery_embeddings.append(avg_emb)
        student_ids.append(sid)

    gallery_matrix = np.stack(gallery_embeddings)  # (N_students, 512)

    # Build detected embedding matrix: (N_detected, 512)
    detected_embeddings = np.stack([f["embedding"] for f in detected_faces])  # (M, 512)

    # Cosine similarity via matrix multiplication (embeddings are L2-normalized)
    similarity_matrix = detected_embeddings @ gallery_matrix.T  # (M, N_students)

    # Match each detected face to the best student
    matched_student_ids = set()
    results = []

    for i, face in enumerate(detected_faces):
        similarities = similarity_matrix[i]
        best_idx = int(np.argmax(similarities))
        best_score = float(similarities[best_idx])
        best_student_id = student_ids[best_idx]

        if best_score >= CONFIDENCE_PRESENT:
            status = "present"
            matched_info = student_map[best_student_id]
            matched_student_ids.add(best_student_id)
            results.append({
                "student_id": best_student_id,
                "student_id_number": matched_info["student_id_number"],
                "name": matched_info["name"],
                "status": status,
                "confidence": round(best_score, 3),
                "bbox": face["bbox"],
            })
        elif best_score >= CONFIDENCE_UNCERTAIN:
            status = "uncertain"
            matched_info = student_map[best_student_id]
            results.append({
                "student_id": best_student_id,
                "student_id_number": matched_info["student_id_number"],
                "name": matched_info["name"],
                "status": status,
                "confidence": round(best_score, 3),
                "bbox": face["bbox"],
            })
        else:
            results.append({
                "student_id": None,
                "student_id_number": None,
                "name": None,
                "status": "unmatched",
                "confidence": round(best_score, 3),
                "bbox": face["bbox"],
            })

    # Determine absent students (enrolled but not matched)
    all_students = get_students_by_section(section_id)
    absent_students = [
        {"student_id": s["id"], "student_id_number": s["student_id_number"], "name": s["name"]}
        for s in all_students
        if s["id"] not in matched_student_ids
    ]

    logger.info(f"Matching complete: {len(results)} detections, {len(absent_students)} absent")
    return {"results": results, "absent_students": absent_students}
