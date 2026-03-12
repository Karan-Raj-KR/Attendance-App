"""
Pydantic schemas for detection-related responses and attendance save request.
Kept in this file for backward compatibility with routes_detection.py.
"""

from pydantic import BaseModel
from typing import Optional

from app.models.attendance_record import AttendanceRecordInput


# ── Detection Response Models ────────────────────────────────────────────

class DetectedFace(BaseModel):
    student_id: Optional[int] = None
    student_id_number: Optional[str] = None
    name: Optional[str] = None
    status: str                          # "present" | "uncertain" | "unmatched"
    confidence: float
    bbox: Optional[list[int]] = None     # [x, y, w, h]


class AbsentStudent(BaseModel):
    student_id: int
    student_id_number: str
    name: str


class DetectionResponse(BaseModel):
    total_faces_detected: int
    results: list[DetectedFace]
    absent_students: list[AbsentStudent]


# ── Attendance Save Request ──────────────────────────────────────────────

class AttendanceSaveRequest(BaseModel):
    section_id: int
    image_path: Optional[str] = None
    records: list[AttendanceRecordInput]
