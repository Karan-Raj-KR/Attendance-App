"""
Raw SQL query functions for the attendance system.

Uses execute_query() for automatic SQLite/PostgreSQL compatibility.
"""

from typing import Optional
from app.database.database import execute_query, _is_postgres


# ── Sections ─────────────────────────────────────────────────────────────

def create_section(name: str, course_name: str, instructor_name: str = None, schedule: str = None) -> int:
    sql = "INSERT INTO sections (name, course_name, instructor_name, schedule) VALUES (?, ?, ?, ?)"
    if _is_postgres:
        sql += " RETURNING id"
    return execute_query(sql, (name, course_name, instructor_name, schedule), fetch="lastrowid")


def get_sections() -> list[dict]:
    return execute_query(
        "SELECT * FROM sections ORDER BY created_at DESC",
        fetch="all",
    )


def get_section(section_id: int) -> Optional[dict]:
    return execute_query(
        "SELECT * FROM sections WHERE id = ?",
        (section_id,),
        fetch="one",
    )


# ── Students ─────────────────────────────────────────────────────────────

def create_student(student_id_number: str, name: str, section_id: int, avatar_path: str = None) -> int:
    sql = "INSERT INTO students (student_id_number, name, section_id, avatar_path) VALUES (?, ?, ?, ?)"
    if _is_postgres:
        sql += " RETURNING id"
    return execute_query(sql, (student_id_number, name, section_id, avatar_path), fetch="lastrowid")


def get_students_by_section(section_id: int) -> list[dict]:
    return execute_query(
        "SELECT * FROM students WHERE section_id = ? ORDER BY name",
        (section_id,),
        fetch="all",
    )


def get_student_by_id_number(student_id_number: str) -> Optional[dict]:
    return execute_query(
        "SELECT * FROM students WHERE student_id_number = ?",
        (student_id_number,),
        fetch="one",
    )


# ── Embeddings ───────────────────────────────────────────────────────────

def save_embedding(student_id: int, embedding_blob: bytes, source_image_path: str = None) -> int:
    sql = "INSERT INTO student_embeddings (student_id, embedding, source_image_path) VALUES (?, ?, ?)"
    if _is_postgres:
        sql += " RETURNING id"
    return execute_query(sql, (student_id, embedding_blob, source_image_path), fetch="lastrowid")


def get_embeddings_by_section(section_id: int) -> list[dict]:
    return execute_query(
        """SELECT se.id, se.student_id, se.embedding, s.student_id_number, s.name
           FROM student_embeddings se
           JOIN students s ON se.student_id = s.id
           WHERE s.section_id = ?""",
        (section_id,),
        fetch="all",
    )


# ── Attendance Sessions ──────────────────────────────────────────────────

def create_attendance_session(
    section_id: int,
    image_path: str = None,
    total_students: int = 0,
    present_count: int = 0,
    absent_count: int = 0,
) -> int:
    sql = """INSERT INTO attendance_sessions 
             (section_id, image_path, total_students, present_count, absent_count) 
             VALUES (?, ?, ?, ?, ?)"""
    if _is_postgres:
        sql += " RETURNING id"
    return execute_query(
        sql,
        (section_id, image_path, total_students, present_count, absent_count),
        fetch="lastrowid",
    )


def get_attendance_session(session_id: int) -> Optional[dict]:
    return execute_query(
        "SELECT * FROM attendance_sessions WHERE id = ?",
        (session_id,),
        fetch="one",
    )


# ── Attendance Records ───────────────────────────────────────────────────

def save_attendance_records(session_id: int, records: list[dict]):
    """Batch insert attendance records for a session."""
    for record in records:
        execute_query(
            """INSERT INTO attendance_records 
               (session_id, student_id, status, confidence)
               VALUES (?, ?, ?, ?)""",
            (
                session_id,
                record["student_id"],
                record["status"],
                record.get("confidence", 0.0),
            ),
        )


def get_attendance_records(session_id: int) -> list[dict]:
    return execute_query(
        """SELECT ar.id, ar.session_id, ar.student_id, ar.status, ar.confidence, ar.timestamp,
                  s.student_id_number, s.name as student_name
           FROM attendance_records ar
           JOIN students s ON ar.student_id = s.id
           WHERE ar.session_id = ?
           ORDER BY s.name""",
        (session_id,),
        fetch="all",
    )


def get_sessions_by_section(section_id: int) -> list[dict]:
    """Get all sessions for a section, including section name."""
    return execute_query(
        """SELECT ats.id as session_id, sec.name as section, 
                  DATE(ats.created_at) as date,
                  ats.present_count as present, ats.absent_count as absent,
                  ats.total_students, ats.image_path, ats.created_at
           FROM attendance_sessions ats
           JOIN sections sec ON ats.section_id = sec.id
           WHERE ats.section_id = ?
           ORDER BY ats.created_at DESC""",
        (section_id,),
        fetch="all",
    )


def get_all_sessions() -> list[dict]:
    """Get all sessions across all sections."""
    return execute_query(
        """SELECT ats.id as session_id, sec.name as section,
                  DATE(ats.created_at) as date,
                  ats.present_count as present, ats.absent_count as absent,
                  ats.total_students, ats.image_path, ats.created_at
           FROM attendance_sessions ats
           JOIN sections sec ON ats.section_id = sec.id
           ORDER BY ats.created_at DESC""",
        fetch="all",
    )
