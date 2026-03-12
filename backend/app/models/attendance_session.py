"""
Pydantic schemas for attendance sessions.
"""

from pydantic import BaseModel
from typing import Optional


class AttendanceSessionResponse(BaseModel):
    session_id: int
    section: str
    date: str
    present: int
    absent: int
    total_students: Optional[int] = 0
    image_path: Optional[str] = None
    created_at: Optional[str] = None
