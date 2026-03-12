"""
SQLite database connection and table creation.
"""

import sqlite3
from pathlib import Path
from app.config import DATABASE_PATH


def get_connection() -> sqlite3.Connection:
    """Get a SQLite connection with row factory enabled."""
    conn = sqlite3.connect(str(DATABASE_PATH))
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    return conn


def init_db():
    """Create all tables if they don't exist."""
    conn = get_connection()
    cursor = conn.cursor()

    cursor.executescript("""
        CREATE TABLE IF NOT EXISTS sections (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            name        TEXT NOT NULL,
            course_name TEXT NOT NULL,
            instructor_name TEXT,
            schedule    TEXT,
            created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS students (
            id                  INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id_number   TEXT NOT NULL UNIQUE,
            name                TEXT NOT NULL,
            section_id          INTEGER NOT NULL,
            avatar_path         TEXT,
            created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (section_id) REFERENCES sections(id)
        );

        CREATE TABLE IF NOT EXISTS student_embeddings (
            id                INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id        INTEGER NOT NULL,
            embedding         BLOB NOT NULL,
            source_image_path TEXT,
            created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS attendance_sessions (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            section_id      INTEGER NOT NULL,
            session_date    DATE NOT NULL,
            image_path      TEXT,
            total_detected  INTEGER DEFAULT 0,
            total_present   INTEGER DEFAULT 0,
            total_absent    INTEGER DEFAULT 0,
            created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (section_id) REFERENCES sections(id)
        );

        CREATE TABLE IF NOT EXISTS attendance_records (
            id                  INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id          INTEGER NOT NULL,
            student_id          INTEGER NOT NULL,
            status              TEXT NOT NULL DEFAULT 'absent',
            confidence          REAL DEFAULT 0.0,
            bbox                TEXT,
            manually_corrected  INTEGER DEFAULT 0,
            created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (session_id) REFERENCES attendance_sessions(id) ON DELETE CASCADE,
            FOREIGN KEY (student_id) REFERENCES students(id)
        );

        -- Index for fast section-scoped embedding lookups
        CREATE INDEX IF NOT EXISTS idx_students_section
            ON students(section_id);
        
        CREATE INDEX IF NOT EXISTS idx_embeddings_student
            ON student_embeddings(student_id);
        
        CREATE INDEX IF NOT EXISTS idx_records_session
            ON attendance_records(session_id);
    """)

    conn.commit()
    conn.close()
