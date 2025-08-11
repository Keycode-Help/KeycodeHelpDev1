# Keycode Help - Application Startup Script
# PowerShell version with better error handling

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Keycode Help - Starting Application" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Java is installed
try {
    $javaVersion = java -version 2>&1 | Select-String "version"
    if ($javaVersion) {
        Write-Host "✓ Java found: $javaVersion" -ForegroundColor Green
    }
} catch {
    Write-Host "✗ Java not found! Please install Java 21" -ForegroundColor Red
    exit 1
}

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    if ($nodeVersion) {
        Write-Host "✓ Node.js found: $nodeVersion" -ForegroundColor Green
    }
} catch {
    Write-Host "✗ Node.js not found! Please install Node.js 18+" -ForegroundColor Red
    exit 1
}

# Check if Maven is installed
try {
    $mvnVersion = mvn --version | Select-String "Apache Maven"
    if ($mvnVersion) {
        Write-Host "✓ Maven found: $mvnVersion" -ForegroundColor Green
    }
} catch {
    Write-Host "✗ Maven not found! Please install Maven" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Starting Backend (Spring Boot)..." -ForegroundColor Yellow
Write-Host ""

# Start Backend
$backendJob = Start-Job -ScriptBlock {
    Set-Location "kch-backend"
    Write-Host "Installing Maven dependencies (skipping tests)..." -ForegroundColor Blue
    mvn install -DskipTests
    Write-Host "Starting Spring Boot application..." -ForegroundColor Blue
    mvn spring-boot:run
}

Write-Host "Starting Frontend (React)..." -ForegroundColor Yellow
Write-Host ""

# Start Frontend
$frontendJob = Start-Job -ScriptBlock {
    Set-Location "kch-frontend"
    Write-Host "Installing npm dependencies..." -ForegroundColor Blue
    npm install
    Write-Host "Starting React development server..." -ForegroundColor Blue
    npm run dev
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    Both services are starting up..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend will be available at: http://localhost:8080" -ForegroundColor Green
Write-Host "Frontend will be available at: http://localhost:5173" -ForegroundColor Green
Write-Host ""
Write-Host "Note: Tests are skipped during startup to avoid blocking the app." -ForegroundColor Yellow
Write-Host "To run tests separately, use: mvn test" -ForegroundColor Yellow
Write-Host ""
Write-Host "Services are running in background jobs." -ForegroundColor Yellow
Write-Host "To stop services, run: Get-Job | Stop-Job" -ForegroundColor Yellow
Write-Host ""

# Wait for user input
Read-Host "Press Enter to close this window"

# Clean up jobs
Get-Job | Stop-Job
Get-Job | Remove-Job
