#!/bin/bash
# setup.sh - Environment Setup Script for Smart Attendance System

echo "🚀 Starting Setup Pipeline for Smart Attendance System..."

# --- Frontend Setup ---
echo "\n📦 Setting up Frontend..."
cd frontend
if [ ! -d "node_modules" ]; then
    npm install
    echo "✅ Frontend dependencies installed."
else
    echo "⚡ Frontend dependencies already installed."
fi
cd ..

# --- Backend Setup ---
echo "\n🐍 Setting up Backend..."
cd backend
if [ ! -d "venv" ]; then
    python3 -m venv venv
    echo "✅ Virtual environment created."
fi

source venv/bin/activate
pip install -r requirements.txt
echo "✅ Backend dependencies installed."

# --- Database Initialization ---
# Uncomment if a database setup script is created
# python -m app.database.init_db
# echo "✅ Database initialized."

echo "\n🎉 Setup Complete! You can now run the application."
echo "To run the backend: cd backend && source venv/bin/activate && python -m app.main"
echo "To run the frontend: cd frontend && npm run dev"
