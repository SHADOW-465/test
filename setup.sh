#!/bin/bash

# Recipe Management System Setup Script
# This script sets up the MERN stack application

echo "🚀 Setting up Recipe Management System..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js (v16 or higher) first."
    exit 1
fi

# Check if MongoDB is running (optional check)
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB not found in PATH. Make sure MongoDB is installed and running."
fi

echo "📦 Installing backend dependencies..."
cd backend
npm install

echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install

echo "🔧 Setting up environment files..."
cd ../backend
if [ ! -f .env ]; then
    cp env.example .env
    echo "✅ Created .env file. Please update it with your MongoDB connection string."
else
    echo "✅ .env file already exists."
fi

echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update backend/.env with your MongoDB connection string"
echo "2. Run 'npm run seed' in the backend directory to populate the database"
echo "3. Start the backend: cd backend && npm run dev"
echo "4. Start the frontend: cd frontend && npm start"
echo ""
echo "The application will be available at http://localhost:3000"
