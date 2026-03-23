"""
Database connection and table creation.

Supports both SQLite (local dev) and PostgreSQL (production) based on DATABASE_URL.
"""

import sqlite3
import logging
from typing import Any
from app.config import DATABASE_URL

logger = logging.getLogger(__name__)

# Detect database backend
_is_postgres = DATABASE_URL.startswith("postgresql://") or DATABASE_URL.startswith("postgres://")


def get_connection():
    """
    Get a database connection.
    Returns sqlite3.Connection or psycopg2.connection depending on DATABASE_URL.
    """
    if _is_postgres:
        import psycopg2
        import psycopg2.extras

        conn = psycopg2.connect(DATABASE_URL)
        conn.autocommit = False
        return conn
    else:
        # Strip the sqlite:/// prefix to get the file path
        db_path = DATABASE_URL.replace("sqlite:///", "")
        conn = sqlite3.connect(db_path)
        conn.row_factory = sqlite3.Row
        conn.execute("PRAGMA journal_mode=WAL")
        conn.execute("PRAGMA foreign_keys=ON")
        return conn


def _row_to_dict(row, cursor=None) -> dict:
    """Convert a database row to a dict regardless of backend."""
    if _is_postgres:
        if cursor and cursor.description:
            columns = [desc[0] for desc in cursor.description]
            return dict(zip(columns, row))
        return dict(row) if isinstance(row, dict) else {}
    else:
        return dict(row)


def execute_query(sql: str, params: tuple = (), fetch: str = "none") -> Any:
    """
    Execute a SQL query with automatic backend handling.

    Args:
        sql: SQL string with %(name)s or ? placeholders (auto-converted)
        params: Query parameters
        fetch: "none", "one", "all", or "lastrowid"

    Returns:
        Depends on fetch: None, dict, list[dict], or int
    """
    conn = get_connection()
    try:
        if _is_postgres:
            import psycopg2.extras
            cursor = conn.cursor()
        else:
            cursor = conn.cursor()

        # Convert ? placeholders to %s for PostgreSQL
        if _is_postgres:
            sql = sql.replace("?", "%s")

        cursor.execute(sql, params)

        if fetch == "lastrowid":
            if _is_postgres:
                row = cursor.fetchone()
                result = row[0] if row else None
            else:
                result = cursor.lastrowid
            conn.commit()
        elif fetch == "one":
            row = cursor.fetchone()
            result = _row_to_dict(row, cursor) if row else None
        elif fetch == "all":
            rows = cursor.fetchall()
            result = [_row_to_dict(r, cursor) for r in rows]
        else:
            result = None
            conn.commit()

        return result
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def execute_script(sql: str):
    """Execute a multi-statement SQL script."""
    conn = get_connection()
    try:
        if _is_postgres:
            cursor = conn.cursor()
            cursor.execute(sql)
            conn.commit()
        else:
            conn.executescript(sql)
            conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def init_db():
    """Create all tables if they don't exist."""
    if _is_postgres:
        sql = """
            CREATE TABLE IF NOT EXISTS sections (
                id          SERIAL PRIMARY KEY,
                name        TEXT NOT NULL,
                course_name TEXT NOT NULL,
                instructor_name TEXT,
                schedule    TEXT,
                created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS students (
                id                  SERIAL PRIMARY KEY,
                student_id_number   TEXT NOT NULL UNIQUE,
                name                TEXT NOT NULL,
                section_id          INTEGER NOT NULL REFERENCES sections(id),
                avatar_path         TEXT,
                created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS student_embeddings (
                id                SERIAL PRIMARY KEY,
                student_id        INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
                embedding         BYTEA NOT NULL,
                source_image_path TEXT,
                created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS attendance_sessions (
                id              SERIAL PRIMARY KEY,
                section_id      INTEGER NOT NULL REFERENCES sections(id),
                created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                image_path      TEXT,
                total_students  INTEGER DEFAULT 0,
                present_count   INTEGER DEFAULT 0,
                absent_count    INTEGER DEFAULT 0
            );

            CREATE TABLE IF NOT EXISTS attendance_records (
                id              SERIAL PRIMARY KEY,
                session_id      INTEGER NOT NULL REFERENCES attendance_sessions(id) ON DELETE CASCADE,
                student_id      INTEGER NOT NULL REFERENCES students(id),
                status          TEXT NOT NULL DEFAULT 'absent',
                confidence      REAL DEFAULT 0.0,
                timestamp       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE INDEX IF NOT EXISTS idx_students_section
                ON students(section_id);
            
            CREATE INDEX IF NOT EXISTS idx_embeddings_student
                ON student_embeddings(student_id);
            
            CREATE INDEX IF NOT EXISTS idx_records_session
                ON attendance_records(session_id);
        """
    else:
        sql = """
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
                created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
                image_path      TEXT,
                total_students  INTEGER DEFAULT 0,
                present_count   INTEGER DEFAULT 0,
                absent_count    INTEGER DEFAULT 0,
                FOREIGN KEY (section_id) REFERENCES sections(id)
            );

            CREATE TABLE IF NOT EXISTS attendance_records (
                id              INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id      INTEGER NOT NULL,
                student_id      INTEGER NOT NULL,
                status          TEXT NOT NULL DEFAULT 'absent',
                confidence      REAL DEFAULT 0.0,
                timestamp       DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (session_id) REFERENCES attendance_sessions(id) ON DELETE CASCADE,
                FOREIGN KEY (student_id) REFERENCES students(id)
            );

            CREATE INDEX IF NOT EXISTS idx_students_section
                ON students(section_id);
            
            CREATE INDEX IF NOT EXISTS idx_embeddings_student
                ON student_embeddings(student_id);
            
            CREATE INDEX IF NOT EXISTS idx_records_session
                ON attendance_records(session_id);
        """

    execute_script(sql)
    logger.info(f"Database initialized ({'PostgreSQL' if _is_postgres else 'SQLite'})")
