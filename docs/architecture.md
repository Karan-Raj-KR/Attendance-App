# Smart Attendance System Architecture

## Overview
This document outlines the internal architecture of the Smart Attendance System, focusing on the Machine Learning and Data processing pipeline.

## 1. How Face Detection Works
When an image is submitted to the backend, the system utilizes the **RetinaFace** model (via the InsightFace library). RetinaFace is a robust, single-stage face detector that performs pixel-wise face localization. It detects faces even in crowded scenes and provides bounding boxes and facial landmarks (eyes, nose, mouth) which are crucial for face alignment.

## 2. How Embeddings Are Generated
Once faces are detected and aligned using the landmarks, the system processes these cropped face images through the **ArcFace** model. ArcFace generates a high-dimensional vector (embedding) for each face, typically 512 dimensions. Exploring the mathematical properties of this embedding space, faces of the same person are clustered closer together compared to faces of different people, making it ideal for identity verification.

## 3. How FAISS Vector Search Works
To quickly identify students from the generated embeddings, especially as the number of students grows, the system employs **FAISS (Facebook AI Similarity Search)**.
- **Indexing**: During student registration, their reference facial embedding is added to an optimized FAISS index.
- **Searching**: When processing classroom attendance, the embeddings from the classroom image are queried against the FAISS index. FAISS calculates the Euclidean distance or Cosine similarity to efficiently find the closest matching reference embedding in milliseconds.

## 4. How Attendance is Generated
1. **Detection & Matching**: The image is scanned, faces are detected, and their embeddings are computed and queried against FAISS.
2. **Confidence Thresholding**: Matches returned by FAISS are evaluated against a confidence threshold (e.g., Euclidean distance must be below a certain limit). Matches passing the threshold successfully identify the student.
3. **Session Processing**: A new Attendance Session is created. Students identified in the classroom are marked as `Present`.
4. **Finalization**: The system automatically flags any missing registered students in the current section as `Absent`. The final consolidated list is then returned to the client and saved securely in the database.
