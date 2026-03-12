"""
Attendance business logic: saving sessions, exporting reports.
"""

import csv
import io
import logging

from app.database.queries import (
    create_attendance_session,
    save_attendance_records,
    get_attendance_session,
    get_attendance_records,
    get_sessions_by_section,
    get_all_sessions,
    get_section,
    get_students_by_section,
)

logger = logging.getLogger(__name__)


def save_attendance(
    section_id: int,
    image_path: str,
    records: list[dict]
) -> int:
    """
    Save a confirmed attendance session with all records.
    Returns the session_id.
    """
    present_count = sum(1 for r in records if r["status"] == "present")
    absent_count = sum(1 for r in records if r["status"] == "absent")
    total_students = len(records)

    session_id = create_attendance_session(
        section_id=section_id,
        image_path=image_path,
        total_students=total_students,
        present_count=present_count,
        absent_count=absent_count,
    )

    save_attendance_records(session_id, records)
    logger.info(f"Saved attendance session {session_id}: {present_count} present, {absent_count} absent")
    return session_id


def export_attendance_csv(session_id: int) -> str:
    """
    Generate a CSV string for an attendance session.
    """
    session = get_attendance_session(session_id)
    if not session:
        raise ValueError(f"Session {session_id} not found")

    records = get_attendance_records(session_id)
    section = get_section(session["section_id"])

    output = io.StringIO()
    writer = csv.writer(output)

    # Header info
    writer.writerow(["Attendance Report"])
    writer.writerow(["Course", section["course_name"] if section else "Unknown"])
    writer.writerow(["Section", section["name"] if section else "Unknown"])
    writer.writerow(["Date", session["created_at"]])
    writer.writerow(["Total Students", session["total_students"]])
    writer.writerow(["Present", session["present_count"]])
    writer.writerow(["Absent", session["absent_count"]])
    writer.writerow([])

    # Data headers
    writer.writerow(["Student ID", "Name", "Status", "Confidence"])

    for record in records:
        writer.writerow([
            record.get("student_id_number", ""),
            record.get("student_name", ""),
            record["status"],
            round(record.get("confidence", 0), 3),
        ])

    return output.getvalue()
