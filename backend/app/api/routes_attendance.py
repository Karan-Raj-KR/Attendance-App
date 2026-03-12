"""
API routes for attendance management and export.
"""

import logging
from typing import Optional

from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import StreamingResponse

from app.models.attendance import AttendanceSaveRequest
from app.models.attendance_session import AttendanceSessionResponse
from app.models.attendance_record import AttendanceRecordResponse
from app.services.attendance_service import save_attendance, export_attendance_csv
from app.database.queries import (
    get_attendance_records,
    get_sessions_by_section,
    get_all_sessions,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/attendance", tags=["Attendance"])


@router.post("/save")
async def save_confirmed_attendance(body: AttendanceSaveRequest):
    """
    Save instructor-confirmed attendance for a session.
    
    Request body:
    {
        "section_id": 1,
        "image_path": "uploads/image.jpg",
        "records": [
            { "student_id": 1, "status": "present", "confidence": 0.91 },
            { "student_id": 2, "status": "absent", "confidence": 0.0 }
        ]
    }
    """
    records = [r.model_dump() for r in body.records]

    session_id = save_attendance(
        section_id=body.section_id,
        image_path=body.image_path,
        records=records,
    )

    return {
        "message": "Attendance saved successfully",
        "session_id": session_id,
        "present": sum(1 for r in records if r["status"] == "present"),
        "absent": sum(1 for r in records if r["status"] == "absent"),
        "total_students": len(records),
    }


@router.get("/sessions", response_model=list[AttendanceSessionResponse])
async def list_sessions(section_id: Optional[int] = Query(None)):
    """
    List past attendance sessions.
    Optional: filter by section_id. If omitted, returns all sessions.
    
    Example response:
    [
        {
            "session_id": 12,
            "section": "Section A",
            "date": "2026-03-12",
            "present": 38,
            "absent": 4
        }
    ]
    """
    if section_id is not None:
        sessions = get_sessions_by_section(section_id)
    else:
        sessions = get_all_sessions()

    return [AttendanceSessionResponse(**s) for s in sessions]


@router.get("/records", response_model=list[AttendanceRecordResponse])
async def get_records(session_id: int = Query(...)):
    """
    Get attendance records for a specific session.
    """
    records = get_attendance_records(session_id)
    if not records:
        raise HTTPException(status_code=404, detail=f"No records found for session {session_id}")

    return [
        AttendanceRecordResponse(
            id=r["id"],
            session_id=r["session_id"],
            student_id=r["student_id"],
            student_id_number=r.get("student_id_number"),
            student_name=r.get("student_name"),
            status=r["status"],
            confidence=r["confidence"],
            timestamp=r.get("timestamp"),
        ) for r in records
    ]


@router.get("/export")
async def export_attendance(
    session_id: int = Query(...),
    format: str = Query("csv", description="Export format: csv"),
):
    """Export attendance report as CSV."""
    if format != "csv":
        raise HTTPException(status_code=400, detail="Only 'csv' format is currently supported")

    try:
        csv_content = export_attendance_csv(session_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

    return StreamingResponse(
        iter([csv_content]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=attendance_session_{session_id}.csv"}
    )
