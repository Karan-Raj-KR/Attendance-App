"""
API routes for attendance management and export.
"""

import logging

from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import StreamingResponse

from app.models.attendance import (
    AttendanceSaveRequest,
    AttendanceSessionResponse,
    AttendanceRecordResponse,
)
from app.services.attendance_service import save_attendance, export_attendance_csv
from app.database.queries import (
    get_attendance_session,
    get_attendance_records,
    get_sessions_by_section,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/attendance", tags=["Attendance"])


@router.post("/save", response_model=AttendanceSessionResponse)
async def save_confirmed_attendance(body: AttendanceSaveRequest):
    """Save instructor-confirmed attendance for a session."""
    records = [r.model_dump() for r in body.records]

    session_id = save_attendance(
        section_id=body.section_id,
        session_date=body.session_date,
        image_path=body.image_path,
        records=records,
    )

    session = get_attendance_session(session_id)
    return AttendanceSessionResponse(**session)


@router.get("/sessions", response_model=list[AttendanceSessionResponse])
async def list_sessions(section_id: int = Query(...)):
    """List all attendance sessions for a section."""
    sessions = get_sessions_by_section(section_id)
    return [AttendanceSessionResponse(**s) for s in sessions]


@router.get("/records", response_model=list[AttendanceRecordResponse])
async def get_records(session_id: int = Query(...)):
    """Get all attendance records for a session."""
    records = get_attendance_records(session_id)
    result = []
    for r in records:
        result.append(AttendanceRecordResponse(
            id=r["id"],
            session_id=r["session_id"],
            student_id=r["student_id"],
            student_id_number=r.get("student_id_number"),
            student_name=r.get("student_name"),
            status=r["status"],
            confidence=r["confidence"],
            bbox=r.get("bbox"),
            manually_corrected=bool(r["manually_corrected"]),
            created_at=r.get("created_at"),
        ))
    return result


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
