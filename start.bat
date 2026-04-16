@echo off
echo.
echo 🎮 ==================================
echo    GitQuest -- Starting Up
echo ======================================
echo.

where java >nul 2>&1 || (echo Java 17+ is required. & exit /b 1)
where mvn  >nul 2>&1 || (echo Maven is required. & exit /b 1)
where node >nul 2>&1 || (echo Node.js 18+ is required. & exit /b 1)

echo All required tools found.
echo.

IF NOT EXIST "frontend\node_modules" (
  echo Installing frontend dependencies...
  cd frontend
  npm install
  cd ..
)

echo Starting Spring Boot backend on port 8080...
start "GitQuest Backend" cmd /k "cd backend && mvn spring-boot:run"

echo Waiting 15 seconds for backend to start...
timeout /t 15 /nobreak >nul

echo Starting React frontend on port 3000...
start "GitQuest Frontend" cmd /k "cd frontend && npm start"

echo.
echo ======================================
echo GitQuest is starting!
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:8080
echo   H2 Console: http://localhost:8080/h2-console
echo ======================================
