#!/bin/bash

# Auto-restart script for KCH Frontend and Backend Services
# This script ensures both services are always running and handles port conflicts

set -e  # Exit on any error

# Configuration
FRONTEND_DIR="kch-frontend"
BACKEND_DIR="kch-backend"
FRONTEND_PORT=5173
BACKEND_PORT=8080
FRONTEND_URL="http://localhost:$FRONTEND_PORT"
BACKEND_URL="http://localhost:$BACKEND_PORT"
LOG_FILE="service-monitor.log"
PID_FILE="service-monitor.pid"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

warn() {
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1" | tee -a "$LOG_FILE"
}

info() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')] INFO:${NC} $1" | tee -a "$LOG_FILE"
}

# Function to check if a port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0  # Port is in use
    else
        return 1  # Port is free
    fi
}

# Function to kill process using a specific port
kill_port() {
    local port=$1
    local pids=$(lsof -ti :$port 2>/dev/null)
    if [ ! -z "$pids" ]; then
        warn "Port $port is in use. Killing processes: $pids"
        kill -9 $pids 2>/dev/null || true
        sleep 2
        if check_port $port; then
            error "Failed to free port $port"
            return 1
        else
            log "Successfully freed port $port"
            return 0
        fi
    fi
    return 0
}

# Function to check if a service is healthy
check_service_health() {
    local url=$1
    local service_name=$2
    local max_retries=5
    local retry_count=0
    
    while [ $retry_count -lt $max_retries ]; do
        if curl -s --max-time 10 "$url" >/dev/null 2>&1; then
            return 0  # Service is healthy
        fi
        retry_count=$((retry_count + 1))
        sleep 2
    done
    
    warn "$service_name health check failed after $max_retries attempts"
    return 1
}

# Function to start frontend service
start_frontend() {
    if [ ! -d "$FRONTEND_DIR" ]; then
        error "Frontend directory '$FRONTEND_DIR' not found!"
        return 1
    fi
    
    cd "$FRONTEND_DIR"
    
    # Check if node_modules exists, install if not
    if [ ! -d "node_modules" ]; then
        log "Installing frontend dependencies..."
        npm install
    fi
    
    # Kill any process using the frontend port
    kill_port $FRONTEND_PORT
    
    log "Starting frontend service on port $FRONTEND_PORT..."
    nohup npm run dev > ../frontend.log 2>&1 &
    local frontend_pid=$!
    echo $frontend_pid > ../frontend.pid
    
    # Wait for service to start
    sleep 5
    
    if check_service_health "$FRONTEND_URL" "Frontend"; then
        log "Frontend service started successfully (PID: $frontend_pid)"
        return 0
    else
        error "Frontend service failed to start properly"
        return 1
    fi
}

# Function to start backend service
start_backend() {
    if [ ! -d "$BACKEND_DIR" ]; then
        error "Backend directory '$BACKEND_DIR' not found!"
        return 1
    fi
    
    cd "$BACKEND_DIR"
    
    # Check if Maven wrapper exists
    if [ ! -f "mvnw" ]; then
        error "Maven wrapper not found in backend directory!"
        return 1
    fi
    
    # Kill any process using the backend port
    kill_port $BACKEND_PORT
    
    log "Starting backend service on port $BACKEND_PORT..."
    nohup ./mvnw spring-boot:run > ../backend.log 2>&1 &
    local backend_pid=$!
    echo $backend_pid > ../backend.pid
    
    # Wait for service to start (Spring Boot takes longer)
    log "Waiting for backend service to start (this may take 1-2 minutes)..."
    sleep 30
    
    if check_service_health "$BACKEND_URL" "Backend"; then
        log "Backend service started successfully (PID: $backend_pid)"
        return 0
    else
        error "Backend service failed to start properly"
        return 1
    fi
}

# Function to stop a service
stop_service() {
    local service_name=$1
    local pid_file=$2
    
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if ps -p $pid > /dev/null 2>&1; then
            log "Stopping $service_name service (PID: $pid)..."
            kill $pid 2>/dev/null || true
            sleep 3
            
            # Force kill if still running
            if ps -p $pid > /dev/null 2>&1; then
                warn "Force killing $service_name service..."
                kill -9 $pid 2>/dev/null || true
            fi
            
            rm -f "$pid_file"
            log "$service_name service stopped"
        else
            log "$service_name service not running"
            rm -f "$pid_file"
        fi
    fi
}

# Function to stop all services
stop_all_services() {
    log "Stopping all services..."
    stop_service "Frontend" "frontend.pid"
    stop_service "Backend" "backend.pid"
    log "All services stopped"
}

# Function to check service status
check_service_status() {
    local service_name=$1
    local pid_file=$2
    local port=$3
    local url=$4
    
    echo -e "\n${BLUE}=== $service_name Status ===${NC}"
    
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if ps -p $pid > /dev/null 2>&1; then
            echo -e "Status: ${GREEN}Running${NC} (PID: $pid)"
            echo -e "Port: $port"
            echo -e "URL: $url"
            
            # Check if port is actually listening
            if check_port $port; then
                echo -e "Port Status: ${GREEN}Active${NC}"
            else
                echo -e "Port Status: ${RED}Not Listening${NC}"
            fi
            
            # Health check
            if check_service_health "$url" "$service_name" >/dev/null 2>&1; then
                echo -e "Health: ${GREEN}Healthy${NC}"
            else
                echo -e "Health: ${RED}Unhealthy${NC}"
            fi
        else
            echo -e "Status: ${RED}Not Running${NC} (stale PID file)"
            rm -f "$pid_file"
        fi
    else
        echo -e "Status: ${RED}Not Running${NC}"
    fi
}

# Function to restart a service
restart_service() {
    local service_name=$1
    local start_func=$2
    
    log "Restarting $service_name service..."
    stop_service "$service_name" "${service_name,,}.pid"
    sleep 2
    $start_func
}

# Function to monitor services
monitor_services() {
    log "Starting service monitor..."
    
    while true; do
        # Check frontend
        if [ -f "frontend.pid" ]; then
            local frontend_pid=$(cat "frontend.pid")
            if ! ps -p $frontend_pid > /dev/null 2>&1; then
                warn "Frontend service crashed (PID: $frontend_pid)"
                start_frontend
            elif ! check_service_health "$FRONTEND_URL" "Frontend" >/dev/null 2>&1; then
                warn "Frontend service unhealthy, restarting..."
                restart_service "Frontend" start_frontend
            fi
        else
            warn "Frontend service not running, starting..."
            start_frontend
        fi
        
        # Check backend
        if [ -f "backend.pid" ]; then
            local backend_pid=$(cat "backend.pid")
            if ! ps -p $backend_pid > /dev/null 2>&1; then
                warn "Backend service crashed (PID: $backend_pid)"
                start_backend
            elif ! check_service_health "$BACKEND_URL" "Backend" >/dev/null 2>&1; then
                warn "Backend service unhealthy, restarting..."
                restart_service "Backend" start_backend
            fi
        else
            warn "Backend service not running, starting..."
            start_backend
        fi
        
        # Wait before next check
        sleep 30
    done
}

# Function to show logs
show_logs() {
    local service=$1
    local lines=${2:-50}
    
    case $service in
        "frontend"|"f")
            if [ -f "frontend.log" ]; then
                echo -e "\n${BLUE}=== Frontend Logs (last $lines lines) ===${NC}"
                tail -n $lines frontend.log
            else
                echo "Frontend log file not found"
            fi
            ;;
        "backend"|"b")
            if [ -f "backend.log" ]; then
                echo -e "\n${BLUE}=== Backend Logs (last $lines lines) ===${NC}"
                tail -n $lines backend.log
            else
                echo "Backend log file not found"
            fi
            ;;
        "all")
            show_logs "frontend" $lines
            show_logs "backend" $lines
            ;;
        *)
            echo "Usage: $0 logs [frontend|backend|all] [lines]"
            ;;
    esac
}

# Function to cleanup
cleanup() {
    log "Shutting down services..."
    stop_all_services
    rm -f "$PID_FILE"
    exit 0
}

# Main script logic
main() {
    # Set up signal handlers
    trap cleanup SIGINT SIGTERM
    
    # Check if script is already running
    if [ -f "$PID_FILE" ]; then
        local existing_pid=$(cat "$PID_FILE")
        if ps -p $existing_pid > /dev/null 2>&1; then
            error "Service monitor is already running (PID: $existing_pid)"
            exit 1
        else
            warn "Removing stale PID file"
            rm -f "$PID_FILE"
        fi
    fi
    
    # Store current PID
    echo $$ > "$PID_FILE"
    
    # Parse command line arguments
    case "${1:-start}" in
        "start")
            log "Starting KCH services..."
            start_frontend
            start_backend
            log "All services started. Starting monitor..."
            monitor_services
            ;;
        "stop")
            stop_all_services
            ;;
        "restart")
            log "Restarting all services..."
            stop_all_services
            sleep 2
            start_frontend
            start_backend
            log "All services restarted"
            ;;
        "status")
            check_service_status "Frontend" "frontend.pid" $FRONTEND_PORT $FRONTEND_URL
            check_service_status "Backend" "backend.pid" $BACKEND_PORT $BACKEND_URL
            ;;
        "logs")
            show_logs "${2:-all}" "${3:-50}"
            ;;
        "frontend"|"f")
            case "${2:-start}" in
                "start") start_frontend ;;
                "stop") stop_service "Frontend" "frontend.pid" ;;
                "restart") restart_service "Frontend" start_frontend ;;
                *) echo "Usage: $0 frontend [start|stop|restart]" ;;
            esac
            ;;
        "backend"|"b")
            case "${2:-start}" in
                "start") start_backend ;;
                "stop") stop_service "Backend" "backend.pid" ;;
                "restart") restart_service "Backend" start_backend ;;
                *) echo "Usage: $0 backend [start|stop|restart]" ;;
            esac
            ;;
        "help"|"-h"|"--help")
            echo -e "${BLUE}KCH Service Manager${NC}"
            echo ""
            echo "Usage: $0 [command] [options]"
            echo ""
            echo "Commands:"
            echo "  start              Start all services and begin monitoring"
            echo "  stop               Stop all services"
            echo "  restart            Restart all services"
            echo "  status             Show status of all services"
            echo "  logs [service]     Show logs (frontend|backend|all)"
            echo "  frontend [cmd]     Frontend service control (start|stop|restart)"
            echo "  backend [cmd]      Backend service control (start|stop|restart)"
            echo "  help               Show this help message"
            echo ""
            echo "Examples:"
            echo "  $0 start           # Start all services and monitor"
            echo "  $0 status          # Check service status"
            echo "  $0 logs frontend   # Show frontend logs"
            echo "  $0 frontend restart # Restart only frontend"
            echo ""
            ;;
        *)
            error "Unknown command: $1"
            echo "Use '$0 help' for usage information"
            exit 1
            ;;
    esac
}

# Run main function
main "$@"
