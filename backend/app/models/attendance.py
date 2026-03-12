"""
Pydantic schemas for attendance-related requests and responses.
"""

from pydantic import BaseModel
from typing import Optional


# ── Requests ─────────────────────────────────────────────────────────────

class AttendanceRecordInput(BaseModel):
    student_id: int
    status: str                          # "present" | "absent" | "uncertain"
    confidence: float = 0.0
    bbox: Optional[list[int]] = None     # [x, y, w, h]
    manually_corrected: bool = False


class AttendanceSaveRequest(BaseModel):
    section_id: int
    session_date: str                    # "2026-03-12"
    image_path: Optional[str] = None
    records: list[AttendanceRecordInput]


# ── Responses ────────────────────────────────────────────────────────────

class DetectedFace(BaseModel):
    student_id: Optional[int] = None
    student_id_number: Optional[str] = None
    name: Optional[str] = None
    status: str                          # "present" | "uncertain" | "unmatched"
    confidence: float
    bbox: list[int]                      # [x, y, w, h]


class AbsentStudent(BaseModel):
    student_id: int
    student_id_number: str
    name: str


class DetectionResponse(BaseModel):
    total_faces_detected: int
    results: list[DetectedFace]
    absent_students: list[AbsentStudent]


class AttendanceSessionResponse(BaseModel):
    id: int
    section_id: int
    session_date: str
    total_detected: int
    total_present: int
    total_absent: int
    created_at: Optional[str] = None


class AttendanceRecordResponse(BaseModel):
    id: int
    session_id: int
    student_id: int
    student_id_number: Optional[str] = None
    student_name: Optional[str] = None
    status: str
    confidence: float
    bbox: Optional[str] = None
    manually_corrected: bool
    created_at: Optional[str] = None
