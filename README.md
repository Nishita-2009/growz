# Growz

AI-powered Business Intelligence and Growth Platform for MSMEs (Micro, Small, and Medium Enterprises).

Growz turns raw business data, sales numbers, and operational signals into actionable **Growth Missions**, dynamic **Growth Scores**, and automated **Opportunity Detection**.

---

## Architecture Overview

```
growz/
├── frontend/                     # Vite + React 19 + TypeScript + TailwindCSS + Zustand
│   ├── src/
│   │   ├── components/           # UI Components (dashboard, financials, inventory, customers, marketing, missions, intelligence, dataImport)
│   │   ├── data/                 # Demo/mock datasets (financials, inventory, customers, marketing, missions, dataImport)
│   │   ├── services/             # Intelligence calculation engines (Growth Score & Opportunity Detector)
│   │   ├── stores/               # Zustand state stores with localStorage persistence
│   │   ├── types/                # TypeScript interfaces & types
│   │   ├── pages/                # AppShell container & route wrappers
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── vite.config.ts
│   └── .env.example
├── backend/                      # FastAPI (Python 3.13) + Pandas + Pydantic + SQLAlchemy / SQLite / PostgreSQL
│   ├── app/
│   │   ├── api/                  # FastAPI routers & endpoint handlers (/api/v1/health, /api/data/upload, etc.)
│   │   ├── core/                 # Config & security settings
│   │   ├── db/                   # Database session & models
│   │   ├── schemas/              # Pydantic validation models
│   │   ├── services/             # In-memory file parsing & data validation services
│   │   ├── tests/                # Pytest test suite
│   │   └── main.py               # FastAPI application entrypoint
│   ├── requirements.txt
│   └── .env.example
├── docs/                         # Specifications & architecture documentation
├── .env.example                  # Root environment template
├── .gitignore                    # Git exclusions
└── README.md                     # Project overview & developer guide
```

---

## Technology Stack

### Frontend
- **Framework**: React 19 + Vite 8
- **Language**: TypeScript
- **Styling**: TailwindCSS 3 + Vanilla CSS (Dark SaaS theme with Glassmorphism)
- **State Management**: Zustand 5 (with `localStorage` persistence)
- **Icons**: Lucide React
- **Charts & Visuals**: Recharts 3

### Backend
- **Framework**: FastAPI (Python 3.13)
- **Data Engine**: Pandas + openpyxl + xlrd
- **Validation**: Pydantic 2
- **Testing**: Pytest
- **Database**: SQLite (local development) / PostgreSQL (production target)
- **ORM**: SQLAlchemy 2 + Alembic

---

## Environment Configuration

Copy the template environment files before starting:

```bash
# Root template
cp .env.example .env

# Frontend environment
cp frontend/.env.example frontend/.env

# Backend environment
cp backend/.env.example backend/.env
```

### Key Environment Variables

#### Frontend (`frontend/.env.example`)
```env
VITE_API_BASE_URL=http://localhost:8000
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

#### Backend (`backend/.env.example`)
```env
PROJECT_NAME="Growz"
API_V1_STR="/api/v1"
ENVIRONMENT="development"
DEBUG=True

# Database
USE_SQLITE=True
SQLITE_DB_FILE="growz.db"
POSTGRES_SERVER="localhost"
POSTGRES_PORT=5432
POSTGRES_USER="growz_user"
POSTGRES_PASSWORD=
POSTGRES_DB="growz_db"

# Third-Party Credentials (Optional for local demo mode)
FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=
GEMINI_API_KEY=
```

> ⚠️ **Important Security Note**: Never commit actual Firebase private keys, service account JSON files, or Gemini API keys to Git. All secrets are ignored by `.gitignore`.

---

## Installation & Local Setup

### 1. Frontend Setup

```bash
cd frontend

# Install Node dependencies
npm install

# Start Vite dev server
npm run dev
```

The frontend will start at `http://localhost:5173`.

### 2. Backend Setup

```bash
cd backend

# Create Python virtual environment
python -m venv venv

# Activate virtual environment
# Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Start FastAPI uvicorn server
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

The FastAPI backend will start at `http://localhost:8000`.
Interactive API docs are available at `http://localhost:8000/api/v1/docs`.

### 3. Run Backend Test Suite

```bash
cd backend
$env:PYTHONPATH="."  # Windows PowerShell
python -m pytest app/tests/test_data_import.py
```

---

## Current Application Status & Features

1. **Overview Dashboard (`/app`)**: Dynamic KPI metrics, Growth Index, Top Strengths & Weaknesses, and Discovered Opportunities.
2. **Growth Missions (`/app/missions` & `/app/missions/:id`)**: Actionable execution system with task checklists, completion confirmation dialogs, outcome measurement forms, and mission history archives.
3. **Growth Score Engine**: Multi-dimensional diagnostic engine evaluating 8 business categories (Revenue, Profitability, Customers, Marketing, Inventory, Operations, Cash Flow).
4. **Opportunity Detector (`/app/opportunities`)**: Proactive opportunity detection engine classifying insights by priority and category, with 1-click `"Turn into Mission"` conversion.
5. **Business Data Import (`/app/data`)**: Complete frontend data upload wizard (Upload → Preview → Column Mapping → Quality Check → Import Confirmation) backed by a FastAPI in-memory file processing service (`POST /api/data/upload`).
6. **Financial Analytics, Inventory, Customers, Marketing Modules**: Dedicated diagnostic views with interactive metrics, charts, and audit insights.

---

## Important Development Notes

- **Authentication**: Currently uses an local authentication mode fallback if Firebase keys are not configured. Real Firebase service accounts must be configured via environment variables or local ignored `firebase-service-account.json`.
- **Analytics Data**: Frontend analytics currently utilize structured demo datasets (`src/data/`) to allow immediate UI exploration without a live database.
- **Database Pipeline**: The backend includes in-memory CSV/XLSX parsing (`data_import_service.py`). Database persistence to PostgreSQL/SQLite tables is planned for the next step.
