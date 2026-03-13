# API Documentation

The Smart Attendance System provides a robust and fast API via FastAPI. Below are the core endpoints provided by the backend.

Base URL: `http://localhost:8000/api`

## Detection & Recognition

### `POST /detect-faces`
Analyzes an uploaded image, detects faces, extracts embeddings, and returns the results.
- **Request Body**: `multipart/form-data` containing the `file` (image).
- **Response**:
  ```json
  {
      "status": "success",
      "count": 3,
      "faces": [
          {
              "bbox": [100, 150, 200, 250],
              "confidence": 0.98,
              "embedding_preview": [...]
          }
      ]
  }
  ```

---

## Students Management

### `POST /students`
Registers a new student to the system and adds their facial embedding to the FAISS index.
- **Request Body**: `multipart/form-data` with:
  - `student_id`: String (e.g., "S12345")
  - `name`: String
  - `section`: String
  - `file`: Image file showing the student's face clearly.
- **Response**: `201 Created`

### `GET /students`
Retrieves a list of all registered students.
- **Response**: list of student objects.

### `GET /students/{student_id}`
Retrieves details of a specific student.

---

## Attendance

### `POST /attendance/session`
Creates a new attendance session after a successful face detection/recognition run.
- **Request Body**: JSON containing the section ID, date, and lists of present/absent students.
- **Response**: `{ "status": "success", "session_id": "123..." }`

### `GET /attendance/sessions`
Retrieves history records of all attendance sessions.

---

*(More detailed API schema is available interactively via Swagger UI directly at `http://localhost:8000/docs` while the backend is running).*
