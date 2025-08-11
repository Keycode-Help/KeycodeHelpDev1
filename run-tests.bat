@echo off
echo ========================================
echo    Keycode Help - Running Tests
echo ========================================
echo.

echo Running Backend Tests...
echo.
cd kch-backend
echo "Running Maven tests..."
mvn test

echo.
echo ========================================
echo    Test Results
echo ========================================
echo.
echo If tests failed, check the output above for details.
echo Common issues:
echo - Database connection problems
echo - Missing environment variables
echo - Test data not set up
echo.
echo To skip tests during app startup, use: start-app.bat
echo.
pause
