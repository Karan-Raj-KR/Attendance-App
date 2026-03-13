# Smart Attendance System

## Overview
An AI-powered Smart Attendance System that leverages face detection and recognition to automate classroom attendance. Built with modern full-stack technologies, it provides a seamless experience for capturing a classroom image and generating accurate attendance records instantaneously.

## Features
- **Real-Time Face Detection**: Accurately detects multiple faces in a classroom setting.
- **High-Accuracy Face Recognition**: Matches detected faces against existing student records using vector similarity search.
- **Efficient Vector Search**: Utilizes FAISS for lightning-fast face embeddings matching.
- **Modern User Interface**: A responsive, mobile-friendly frontend built with React and Tailwind CSS.
- **Robust Backend**: A fast and reliable REST API powered by FastAPI.

## Architecture Explanation
The system operates based on a pipeline of machine learning components and web services:
1. The **Frontend** captures or uploads a photo of the classroom, sending it to the backend.
2. The **Backend** receives the image and utilizes the InsightFace framework to perform **Face Detection**.
3. For each detected face, **Embeddings** are generated (a mathematical representation of facial features).
4. The system then queries a pre-built **FAISS Vector Index** with these embeddings to find the closest match among registered students.
5. High confidence matches are marked as Present, and the final attendance list is generated and returned to the frontend.

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: FastAPI, Python (aiosqlite)
- **Machine Learning**: InsightFace (RetinaFace, ArcFace), ONNXRuntime, OpenCV
- **Vector Search**: FAISS (Facebook AI Similarity Search)

## Project Structure
```text
Attendance-App
│
├── frontend/             # React + Vite application
│   ├── src/              # UI Components, Pages, and Layouts
│   ├── public/           # Static assets
│   ├── package.json      # Node dependencies
│   └── vite.config.js    # Vite configuration
│
├── backend/              # FastAPI application & ML logic
│   ├── app/              # API routes, database models, ML wrappers
│   ├── models/           # Downloaded ONNX model weights
│   ├── dataset/          # Stored student face data
│   ├── faiss_indexes/    # Pre-built FAISS vector indexes
│   ├── uploads/          # Temporary storage for uploaded images
│   ├── requirements.txt  # Python dependencies
│   └── main.py           # Application entry point
│
├── docs/                 # Documentation and architecture details
├── README.md             # This file
├── LICENSE               # Open-source license
├── .gitignore            # Git ignore definitions
└── docker-compose.yml    # Deployment configuration (Future)
```

## Installation Instructions

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
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

### Frontend Setup
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

## Usage Instructions
1. Make sure both the backend and frontend servers are running.
2. Open the frontend URL (usually `http://localhost:5173`) in your browser.
3. Register students by uploading their clear photo and details.
4. Navigate to the Capture page to upload an image of the current classroom.
5. The system will detect faces, identify students, and generate an attendance summary for review.

## Roadmap
- [ ] Containerize the application using Docker.
- [ ] Implement robust authentication and authorization.
- [ ] Integrate PostgreSQL and Redis for a production-ready database and caching layer.
- [ ] Add real-time notifications for attendance processing.
- [ ] Extensive unit test and integration test coverage.

## Screenshots
*(Screenshots references for future)*
- [Attendance Screen](docs/screenshots/attendance.png)
- [Face Detection Result](docs/screenshots/detection.png)
- [Student Recognition](docs/screenshots/recognition.png)

## License
MIT License. See [LICENSE](LICENSE) for more information.
