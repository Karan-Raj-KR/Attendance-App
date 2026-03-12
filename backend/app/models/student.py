"""
Pydantic schemas for student-related requests and responses.
"""

from pydantic import BaseModel
from typing import Optional


# ── Requests ─────────────────────────────────────────────────────────────

class StudentRegisterRequest(BaseModel):
    student_id_number: str
    name: str
    section_id: int


class SectionCreateRequest(BaseModel):
    name: str
    course_name: str
    instructor_name: Optional[str] = None
    schedule: Optional[str] = None


# ── Responses ────────────────────────────────────────────────────────────

class StudentResponse(BaseModel):
    id: int
    student_id_number: str
    name: str
    section_id: int
    avatar_path: Optional[str] = None
    created_at: Optional[str] = None


class SectionResponse(BaseModel):
    id: int
    name: str
    course_name: str
    instructor_name: Optional[str] = None
    schedule: Optional[str] = None
    created_at: Optional[str] = None
