"""
Pydantic schemas for attendance records.
"""

from pydantic import BaseModel
from typing import Optional


class AttendanceRecordInput(BaseModel):
    student_id: int
    status: str              # "present" | "absent"
    confidence: float = 0.0


class AttendanceRecordResponse(BaseModel):
    id: int
    session_id: int
    student_id: int
    student_id_number: Optional[str] = None
    student_name: Optional[str] = None
    status: str
    confidence: float
    timestamp: Optional[str] = None
