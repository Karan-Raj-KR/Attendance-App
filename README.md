# Smart Attendance System

A scalable AI-powered attendance system that detects and recognizes students from classroom images using face recognition and vector search. Built with a modern full-stack architecture designed for scalability across institutions.

---

## Overview
An AI-powered Smart Attendance System that leverages face detection and recognition to automate classroom attendance. The system automatically detects faces from a classroom photo, matches them against registered students using deep embeddings, and records attendance instantaneously.

## Features
- **Real-Time Face Detection**: Accurately detects multiple faces in a classroom setting using RetinaFace.
- **High-Accuracy Face Recognition**: Matches detected faces against existing student records using vector similarity search (ArcFace).
- **Efficient Vector Search**: Utilizes FAISS for lightning-fast face embeddings matching.
- **Section-Based Tracking**: Organize attendance by university sections or classes.
- **Modern User Interface**: A responsive, mobile-friendly frontend built with React and Tailwind CSS.
- **Robust Backend**: A fast and reliable REST API powered by FastAPI.

---

## System Architecture
The system operates based on a pipeline of machine learning components and web services:
1. **Frontend**: The React application captures or uploads a classroom photo.
2. **Backend**: The FastAPI server receives the image and utilizes the InsightFace framework for **Face Detection**.
3. **ML Pipeline**: 
   - Each detected face is converted into permanent **Embeddings**.
   - The system queries a **FAISS Vector Index** to find the closest match among registered students.
4. **Attendance Generation**: High-confidence matches are recorded as `Present`. Sessions are saved securely in the database.

---

## Tech Stack

### Frontend
- **React** (v19)
- **Vite**
- **Tailwind CSS**
- **Lucide React** (Icons)

### Backend
- **FastAPI**
- **Python**
- **Pydantic**
- **aiosqlite** (Development Database)

### Machine Learning
- **InsightFace** (RetinaFace, ArcFace)
- **FAISS** (Facebook AI Similarity Search)
- **ONNXRuntime**
- **OpenCV** & **NumPy**

### Infrastructure (Planned)
- **Docker** & **Docker Compose**
- **PostgreSQL** (Production Migration)
- **Redis** (Caching)
- **Cloud Object Storage** (S3 for student datasets)

---

## Project Structure
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
│   ├── app/              # API routes, services, and ML wrappers
│   ├── models/           # ONNX model weights
│   ├── dataset/          # Stored student face data
│   ├── faiss_indexes/    # Pre-built FAISS vector indexes
│   ├── uploads/          # Temporary storage for processing
│   ├── requirements.txt  # Python dependencies
│   └── main.py           # API entry point
│
├── docs/                 # Documentation and architecture details
├── README.md             # This file
├── LICENSE               # MIT License
├── .gitignore            # Git ignore definitions
└── docker-compose.yml    # Deployment configuration
```

---

## Installation Instructions

### Prerequisites
- Python 3.9+
- Node.js 18+

### 1. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m app.main
```
The API will be available at `http://localhost:8000`. API Docs: `http://localhost:8000/docs`.

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The application will be available at `http://localhost:5173`.

---

## Usage
1. **Register Students**: Upload clear photos and details to build the reference dataset.
2. **Capture Attendance**: Upload a classroom photo via the Capture page.
3. **Review**: The system detects faces and recognizes students. Review the matches and confirm.
4. **Export**: Export attendance sessions for institutional records.

---

## Roadmap & Upcoming Features
- [ ] **Multi-Tenant Architecture**: Support for multiple departments and universities.
- [ ] **Admin Dashboard**: Comprehensive analytics for attendance trends.
- [ ] **Mobile PWA Support**: Full offline-ready progressive web app.
- [ ] **Authentication System**: Secure login for professors and admins.
- [ ] **Cloud Storage**: Integration with AWS S3/Google Cloud Storage for images.
- [ ] **GPU Acceleration**: Faster ML inference using CUDA.

---

## Screenshots
Refer to the [docs/screenshots](docs/screenshots/) folder for visual guides.
- **Attendance Detection Screen**
- **Student Recognition Results**
- **Dashboard Overview**

---

## License
MIT License. See [LICENSE](LICENSE) for more information.
