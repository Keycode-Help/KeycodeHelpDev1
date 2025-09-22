# KeycodeHelp Project Structure

## 📁 Directory Organization

```
KeycodeHelpDev1-1/
├── 📁 kch-backend/           # Spring Boot backend application
│   ├── src/main/java/        # Java source code (125 files)
│   ├── src/main/resources/   # Configuration files
│   ├── target/               # Build output (auto-generated)
│   └── pom.xml              # Maven configuration
├── 📁 kch-frontend/          # React frontend application
│   ├── src/                  # React source code
│   │   ├── components/       # React components (37 files)
│   │   ├── pages/            # Page components (38 files)
│   │   ├── services/         # API services (6 files)
│   │   └── utils/            # Utility functions (8 files)
│   ├── public/               # Static assets (1265+ files)
│   ├── scripts/              # Frontend-specific scripts
│   └── package.json          # Node.js dependencies
├── 📁 scripts/               # Shell scripts and automation
│   ├── start-dev.sh         # Start development environment
│   ├── stop-dev.sh          # Stop development environment
│   └── kill-ports.sh        # Kill processes on ports
├── 📁 docs/                  # Documentation and guides (67 files)
│   ├── clear-browser-cache.md
│   ├── clear-cache-commands.md
│   ├── PRODUCTION_SUPABASE_FIX.md
│   └── force-clear-cache.html
├── 📁 sql_files/             # Database scripts (43 files)
├── 📁 Dev images/            # Development images (50+ files)
├── .gitignore               # Git ignore rules (updated)
├── LICENSE                  # Project license
├── PROJECT_STRUCTURE.md     # This file
└── CLEANUP_PLAN.md          # Cleanup documentation
```

## 🚀 Quick Start

### First Time Setup

```bash
# Fix script permissions (run once)
chmod +x scripts/*.sh

# Or run the permission fix script
chmod +x fix-permissions.sh && ./fix-permissions.sh
```

### Development Environment

```bash
# Start both backend and frontend
./scripts/start-dev.sh

# Stop development environment
./scripts/stop-dev.sh

# Kill processes on ports 8080 and 5173
./scripts/kill-ports.sh
```

### Backend (Spring Boot)

```bash
cd kch-backend
mvn spring-boot:run
```

### Frontend (React + Vite)

```bash
cd kch-frontend
npm run dev
```

## 🔧 Configuration

- **Backend**: `kch-backend/src/main/resources/application.properties`
- **Frontend**: `kch-frontend/.env.production`
- **Database**: Supabase PostgreSQL
- **Deployment**:
  - Backend: Render.com
  - Frontend: Vercel.com

## 📝 Notes

- All shell scripts are organized in the `scripts/` directory
- Documentation is centralized in the `docs/` directory
- Logs are stored in the `logs/` directory
- The `.history/` folder (Cursor IDE local history) has been removed to reduce clutter
