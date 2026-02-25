#!/bin/bash

# PSU Agro Food - Quick Setup Script for macOS/Linux
# This script automates the project setup process

set -e  # Exit on error

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║   PSU Agro Food - Automated Setup Script (macOS/Linux)        ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL is not installed. Please install MySQL first."
    echo "   macOS: brew install mysql"
    echo "   Linux: sudo apt-get install mysql-server"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo "✅ MySQL is installed"
echo ""

# Step 1: Install backend dependencies
echo "📦 Step 1: Installing backend dependencies..."
cd backend
if [ ! -d "node_modules" ]; then
    npm install --quiet
    echo "✅ Backend dependencies installed"
else
    echo "⚠️  Backend modules already exist"
fi

# Step 2: Setup .env if it doesn't exist
echo ""
echo "⚙️  Step 2: Configuring environment..."
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "✅ Created .env file from .env.example"
    echo "   ⚠️  Please edit .env with your MySQL credentials"
    echo "   Then run: npm run setup-db"
    exit 0
else
    echo "✅ .env file already exists"
fi

# Step 3: Initialize database
echo ""
echo "🗄️  Step 3: Initializing database..."
node setup-database.js

# Step 4: Install frontend dependencies
echo ""
echo "📦 Step 4: Installing frontend dependencies..."
cd ../frontend
if [ ! -d "node_modules" ]; then
    npm install --quiet
    echo "✅ Frontend dependencies installed"
else
    echo "⚠️  Frontend modules already exist"
fi

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                  ✅ SETUP COMPLETED                           ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "🚀 To start the application:"
echo ""
echo "   Terminal 1 (Backend):"
echo "   $ cd backend && npm run dev"
echo ""
echo "   Terminal 2 (Frontend):"
echo "   $ cd frontend && npm run dev"
echo ""
echo "📱 Access the application:"
echo "   Frontend: http://localhost:5173/"
echo "   Backend:  http://localhost:5000/"
echo "   Admin:    http://localhost:5173/admin (admin / admin123)"
echo ""
