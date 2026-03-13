# Smart Attendance System

A scalable AI-powered attendance system that detects and recognizes students from classroom images using face recognition and vector search.

The system automatically detects faces from a classroom photo, matches them against registered students, and records attendance.

Built with a modern full-stack architecture designed for scalability across universities.

---

# Features

* Face detection from classroom photos
* Face recognition using deep embeddings
* FAISS vector search for fast matching
* Automatic attendance generation
* Section-based attendance tracking
* Mobile-friendly web interface
* Real-time student detection results

---

# System Architecture

Frontend:
React + Vite

Backend:
FastAPI (Python)

Machine Learning:
InsightFace for face embeddings
FAISS for vector similarity search

Database:
SQLite (development)
PostgreSQL (planned for production)

Storage:
Local storage (development)
Cloud object storage planned

---

# Tech Stack

Frontend

* React
* Vite
* TailwindCSS

Backend

* FastAPI
* Python
* Pydantic

Machine Learning

* InsightFace
* FAISS
* NumPy

Infrastructure (Planned)

* Docker
* PostgreSQL
* Cloud storage
* Vercel / Railway deployment

---

# Project Structure

```
smart-attendance-system
│
├── frontend
│   └── React web application
│
├── backend
│   └── FastAPI backend with ML pipeline
│
├── docs
│   └── Documentation and architecture diagrams
```

---

# Installation

Clone the repository

```
git clone https://github.com/yourusername/smart-attendance-system.git
cd smart-attendance-system
```

---

# Backend Setup

```
cd backend
python -m venv venv
source venv/bin/activate

pip install -r requirements.txt

uvicorn app.main:app --reload
```

Backend will run on:

```
http://localhost:8000
```

API documentation:

```
http://localhost:8000/docs
```

---

# Frontend Setup

```
cd frontend

npm install
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

# Usage

1. Register students with face images.
2. Upload a classroom photo.
3. System detects and recognizes students.
4. Attendance is automatically generated.

---

# Current Status

Prototype working locally.

Upcoming improvements:

* Cloud deployment
* PostgreSQL migration
* S3 image storage
* Authentication system
* Multi-university architecture
* Performance optimization

---

# Roadmap

Planned features:

* Student registration portal
* Admin dashboard
* Multi-tenant university system
* Mobile PWA support
* Real-time attendance analytics
* GPU acceleration for ML inference

---

# Screenshots

Add screenshots in the docs/screenshots folder.

Example:

* Attendance detection screen
* Student recognition results
* Dashboard

---

# License

MIT License

This project is open source and free to use.
