#!/bin/bash
set -e

echo ""
echo "🎮 =================================="
echo "   GitQuest — Starting Up"
echo "======================================"
echo ""

# Check required tools
command -v java >/dev/null 2>&1 || { echo "❌ Java 17+ is required. Please install it."; exit 1; }
command -v mvn  >/dev/null 2>&1 || { echo "❌ Maven is required. Please install it."; exit 1; }
command -v node >/dev/null 2>&1 || { echo "❌ Node.js 18+ is required. Please install it."; exit 1; }
command -v npm  >/dev/null 2>&1 || { echo "❌ npm is required. Please install it."; exit 1; }

echo "✅ All required tools found."
echo ""

# GitHub OAuth check
if [ -z "$GITHUB_CLIENT_ID" ] || [ -z "$GITHUB_CLIENT_SECRET" ]; then
  echo "⚠️  WARNING: GITHUB_CLIENT_ID and/or GITHUB_CLIENT_SECRET not set."
  echo "   Edit backend/src/main/resources/application.properties OR export these env vars:"
  echo "   export GITHUB_CLIENT_ID=your_client_id"
  echo "   export GITHUB_CLIENT_SECRET=your_client_secret"
  echo ""
fi

# Install frontend deps if needed
if [ ! -d "frontend/node_modules" ]; then
  echo "📦 Installing frontend dependencies..."
  cd frontend && npm install --silent && cd ..
  echo "✅ Frontend dependencies installed."
  echo ""
fi

# Start backend
echo "🚀 Starting Spring Boot backend on port 8080..."
cd backend
mvn spring-boot:run -q &
BACKEND_PID=$!
cd ..

# Wait for backend to be ready
echo "⏳ Waiting for backend to start..."
for i in $(seq 1 30); do
  if curl -s http://localhost:8080/actuator/health >/dev/null 2>&1; then
    echo "✅ Backend is up!"
    break
  fi
  sleep 2
done

echo ""
echo "🌐 Starting React frontend on port 3000..."
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

echo ""
echo "======================================"
echo "✨ GitQuest is running!"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:8080"
echo "   H2 Console: http://localhost:8080/h2-console"
echo "======================================"
echo ""
echo "Press Ctrl+C to stop both servers."

# Cleanup on exit
trap "echo ''; echo 'Stopping...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" INT TERM

wait
