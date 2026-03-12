"""
Raw SQL query functions for the attendance system.
"""

import json
import sqlite3
from typing import Optional

from app.database.database import get_connection


# ── Sections ─────────────────────────────────────────────────────────────

def create_section(name: str, course_name: str, instructor_name: str = None, schedule: str = None) -> int:
    conn = get_connection()
    cursor = conn.execute(
        "INSERT INTO sections (name, course_name, instructor_name, schedule) VALUES (?, ?, ?, ?)",
        (name, course_name, instructor_name, schedule)
    )
    conn.commit()
    section_id = cursor.lastrowid
    conn.close()
    return section_id


def get_sections() -> list[dict]:
    conn = get_connection()
    rows = conn.execute("SELECT * FROM sections ORDER BY created_at DESC").fetchall()
    conn.close()
    return [dict(r) for r in rows]


def get_section(section_id: int) -> Optional[dict]:
    conn = get_connection()
    row = conn.execute("SELECT * FROM sections WHERE id = ?", (section_id,)).fetchone()
    conn.close()
    return dict(row) if row else None


# ── Students ─────────────────────────────────────────────────────────────

def create_student(student_id_number: str, name: str, section_id: int, avatar_path: str = None) -> int:
    conn = get_connection()
    cursor = conn.execute(
        "INSERT INTO students (student_id_number, name, section_id, avatar_path) VALUES (?, ?, ?, ?)",
        (student_id_number, name, section_id, avatar_path)
    )
    conn.commit()
    student_id = cursor.lastrowid
    conn.close()
    return student_id


def get_students_by_section(section_id: int) -> list[dict]:
    conn = get_connection()
    rows = conn.execute(
        "SELECT * FROM students WHERE section_id = ? ORDER BY name",
        (section_id,)
    ).fetchall()
    conn.close()
    return [dict(r) for r in rows]


def get_student_by_id_number(student_id_number: str) -> Optional[dict]:
    conn = get_connection()
    row = conn.execute(
        "SELECT * FROM students WHERE student_id_number = ?",
        (student_id_number,)
    ).fetchone()
    conn.close()
    return dict(row) if row else None


# ── Embeddings ───────────────────────────────────────────────────────────

def save_embedding(student_id: int, embedding_blob: bytes, source_image_path: str = None) -> int:
    conn = get_connection()
    cursor = conn.execute(
        "INSERT INTO student_embeddings (student_id, embedding, source_image_path) VALUES (?, ?, ?)",
        (student_id, embedding_blob, source_image_path)
    )
    conn.commit()
    embed_id = cursor.lastrowid
    conn.close()
    return embed_id


def get_embeddings_by_section(section_id: int) -> list[dict]:
    """Load all embeddings for students in a given section."""
    conn = get_connection()
    rows = conn.execute("""
        SELECT se.id, se.student_id, se.embedding, s.student_id_number, s.name
        FROM student_embeddings se
        JOIN students s ON se.student_id = s.id
        WHERE s.section_id = ?
    """, (section_id,)).fetchall()
    conn.close()
    return [dict(r) for r in rows]


# ── Attendance Sessions ──────────────────────────────────────────────────

def create_attendance_session(
    section_id: int,
    image_path: str = None,
    total_students: int = 0,
    present_count: int = 0,
    absent_count: int = 0
) -> int:
    conn = get_connection()
    cursor = conn.execute(
        """INSERT INTO attendance_sessions 
           (section_id, image_path, total_students, present_count, absent_count) 
           VALUES (?, ?, ?, ?, ?)""",
        (section_id, image_path, total_students, present_count, absent_count)
    )
    conn.commit()
    session_id = cursor.lastrowid
    conn.close()
    return session_id


def get_attendance_session(session_id: int) -> Optional[dict]:
    conn = get_connection()
    row = conn.execute("SELECT * FROM attendance_sessions WHERE id = ?", (session_id,)).fetchone()
    conn.close()
    return dict(row) if row else None


# ── Attendance Records ───────────────────────────────────────────────────

def save_attendance_records(session_id: int, records: list[dict]):
    """Batch insert attendance records for a session."""
    conn = get_connection()
    for record in records:
        conn.execute(
            """INSERT INTO attendance_records 
               (session_id, student_id, status, confidence)
               VALUES (?, ?, ?, ?)""",
            (
                session_id,
                record["student_id"],
                record["status"],
                record.get("confidence", 0.0),
            )
        )
    conn.commit()
    conn.close()


def get_attendance_records(session_id: int) -> list[dict]:
    conn = get_connection()
    rows = conn.execute("""
        SELECT ar.id, ar.session_id, ar.student_id, ar.status, ar.confidence, ar.timestamp,
               s.student_id_number, s.name as student_name
        FROM attendance_records ar
        JOIN students s ON ar.student_id = s.id
        WHERE ar.session_id = ?
        ORDER BY s.name
    """, (session_id,)).fetchall()
    conn.close()
    return [dict(r) for r in rows]


def get_sessions_by_section(section_id: int) -> list[dict]:
    """Get all sessions for a section, including section name."""
    conn = get_connection()
    rows = conn.execute("""
        SELECT ats.id as session_id, sec.name as section, 
               DATE(ats.created_at) as date,
               ats.present_count as present, ats.absent_count as absent,
               ats.total_students, ats.image_path, ats.created_at
        FROM attendance_sessions ats
        JOIN sections sec ON ats.section_id = sec.id
        WHERE ats.section_id = ?
        ORDER BY ats.created_at DESC
    """, (section_id,)).fetchall()
    conn.close()
    return [dict(r) for r in rows]


def get_all_sessions() -> list[dict]:
    """Get all sessions across all sections."""
    conn = get_connection()
    rows = conn.execute("""
        SELECT ats.id as session_id, sec.name as section,
               DATE(ats.created_at) as date,
               ats.present_count as present, ats.absent_count as absent,
               ats.total_students, ats.image_path, ats.created_at
        FROM attendance_sessions ats
        JOIN sections sec ON ats.section_id = sec.id
        ORDER BY ats.created_at DESC
    """).fetchall()
    conn.close()
    return [dict(r) for r in rows]
