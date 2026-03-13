# Smart Attendance System

A scalable AI-powered attendance system that detects and recognizes students from classroom images using face recognition and vector search. Built with a modern full-stack architecture designed for scalability across institutions.

---

## 2. Project Overview
An AI-powered Smart Attendance System that leverages face detection and recognition to automate classroom attendance. The system automatically detects faces from a classroom photo, matches them against registered students using deep embeddings, and records attendance instantaneously.

---

## 3. Problem Statement
Traditional attendance tracking in large university classrooms is time-consuming, prone to human error, and easily manipulated through proxy attendance. This system solves these issues by automating the attendance process using state-of-the-art computer vision, drastically reducing the time required to record attendance while ensuring high accuracy and cryptographic-level identity verification via facial embeddings.

---

## 4. Features
- **Real-Time Face Detection**: Accurately detects multiple faces in a classroom setting using RetinaFace.
- **High-Accuracy Face Recognition**: Matches detected faces against existing student records using vector similarity search (ArcFace).
- **Efficient Vector Search**: Utilizes FAISS for lightning-fast face embeddings matching.
- **Section-Based Tracking**: Organize attendance by university sections or classes.
- **Modern User Interface**: A responsive, mobile-friendly frontend built with React and Tailwind CSS.
- **Robust Backend**: A fast and reliable REST API powered by FastAPI.

---

## 5. Architecture Diagram
*(Placeholder for Architecture Diagram)*
![Architecture Diagram](docs/screenshots/architecture_diagram.png)

At a high level, the system operates as follows:
1. **Frontend**: The React application captures or uploads a classroom photo.
2. **Backend**: The FastAPI server receives the image and utilizes the InsightFace framework for Face Detection.
3. **ML Pipeline**: Each detected face is converted into permanent Embeddings. The system queries a FAISS Vector Index to find the closest match.
4. **Data Layer**: Results are stored in the database and returned to the client.

---

## 6. Tech Stack

### Frontend
- **React** (v19)
- **Vite**
- **Tailwind CSS**
- **Lucide React** (Icons)

### Backend
- **FastAPI**
- **Python**
- **Pydantic**

### Machine Learning
- **InsightFace** (RetinaFace, ArcFace)
- **FAISS** (Facebook AI Similarity Search)
- **ONNXRuntime**
- **NumPy**

### Infrastructure (Planned)
- **Docker** & **Docker Compose**
- **PostgreSQL** (Production Migration)
- **Redis** (Caching)
- **Cloud Object Storage** (S3 for student datasets)

---

## 7. Project Structure
```text
Attendance-App
│
├── frontend/             # React + Vite application
│   ├── src/              # UI Components, Pages, and Layouts
│   ├── public/           # Static assets/manifests
│   ├── package.json      # Node dependencies
│   └── vite.config.js    # Vite configuration
│
├── backend/              # FastAPI application & ML logic
│   ├── app/              # API routes, services, database
│   │   ├── api/
│   │   ├── database/
│   │   ├── ml/
│   │   ├── models/
│   │   ├── services/
│   │   └── utils/
│   ├── requirements.txt  # Python dependencies
│   └── main.py           # API entry point
│
├── docs/                 # Documentation and architecture details
│   ├── architecture.md   # Explanation of ML models
│   ├── api.md            # Detailed API documentation
│   └── screenshots/      # UI and diagram images
│
├── scripts/
│   └── setup.sh          # Environment setup script
│
├── README.md             # This file
├── LICENSE               # MIT License
├── .gitignore            # Git ignore definitions
└── docker-compose.yml    # Deployment configuration
```

---

## 8. Installation Guide

You can easily set up the whole environment using the provided `setup.sh` script:

```bash
chmod +x scripts/setup.sh
./scripts/setup.sh
```

Alternatively, follow the manual steps below.

---

## 9. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install the dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the FastAPI development server:
   ```bash
   python -m app.main
   # or
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```

The API will be available at `http://localhost:8000`. 
Swagger UI is available at `http://localhost:8000/docs`.

---

## 10. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173`.

---

## 11. API Documentation
A detailed API documentation is available at [docs/api.md](docs/api.md).

Key endpoints include:
- `POST /api/detect-faces`: Upload classroom image for detection.
- `POST /api/students`: Register a new student and generate embeddings.
- `POST /api/attendance/session`: Save finalized attendance records.

---

## 12. How Face Recognition Works
1. **Detection**: **RetinaFace** locates faces in the overcrowded classroom image.
2. **Alignment & Embedding**: **ArcFace** processes the cropped face, generating a 512-dimensional vector that acts as a unique mathematical signature for that person.
3. **Similarity Search**: The embedding is queried against a high-speed **FAISS Index**. If the distance to a registered student's vector is below a strict threshold (high confidence), the student is successfully recognized and marked present.

See [docs/architecture.md](docs/architecture.md) for more details.

---

## 13. Roadmap
- [ ] **Multi-Tenant Architecture**: Support for multiple departments and universities.
- [ ] **Admin Dashboard**: Comprehensive analytics for attendance trends.
- [ ] **Mobile PWA Support**: Full offline-ready progressive web app.
- [ ] **Authentication System**: Secure login for professors and admins.
- [ ] **Cloud Storage**: Integration with AWS S3/Google Cloud Storage for images.
- [ ] **GPU Acceleration**: Faster ML inference using CUDA via ONNX providers.

---

## 14. Screenshots
Screenshots of the application will be available in the [docs/screenshots](docs/screenshots/) folder.
- [Attendance UI](docs/screenshots/attendance_ui.png)
- [Face Detection Results](docs/screenshots/face_detection_results.png)
- [Student Recognition Results](docs/screenshots/recognition_results.png)

---

## 15. License
MIT License. See [LICENSE](LICENSE) for more information. This project is open source and free to use.
