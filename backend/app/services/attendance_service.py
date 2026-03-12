"""
Attendance business logic: saving sessions, exporting reports.
"""

import csv
import io
import json
import logging
from datetime import date

from app.database.queries import (
    create_attendance_session,
    save_attendance_records,
    get_attendance_session,
    get_attendance_records,
    get_sessions_by_section,
    get_section,
)

logger = logging.getLogger(__name__)


def save_attendance(
    section_id: int,
    session_date: str,
    image_path: str,
    records: list[dict]
) -> int:
    """
    Save a confirmed attendance session with all records.
    Returns the session_id.
    """
    total_present = sum(1 for r in records if r["status"] == "present")
    total_absent = sum(1 for r in records if r["status"] == "absent")

    session_id = create_attendance_session(
        section_id=section_id,
        session_date=session_date,
        image_path=image_path,
        total_detected=len(records),
        total_present=total_present,
        total_absent=total_absent,
    )

    save_attendance_records(session_id, records)
    logger.info(f"Saved attendance session {session_id}: {total_present} present, {total_absent} absent")
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
    writer.writerow(["Date", session["session_date"]])
    writer.writerow(["Total Present", session["total_present"]])
    writer.writerow(["Total Absent", session["total_absent"]])
    writer.writerow([])

    # Data headers
    writer.writerow(["Student ID", "Name", "Status", "Confidence", "Manually Corrected"])

    for record in records:
        writer.writerow([
            record.get("student_id_number", ""),
            record.get("student_name", ""),
            record["status"],
            round(record.get("confidence", 0), 3),
            "Yes" if record.get("manually_corrected") else "No"
        ])

    return output.getvalue()
