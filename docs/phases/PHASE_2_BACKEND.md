# Phase 2 — FastAPI Backend Foundation

> **Goal:** Build the FastAPI backend skeleton — app entry point, CORS config, category routers, error handling, and a working health check endpoint. No tools yet, just the foundation.

---

## Checklist

- [x] Virtual environment created and activated
- [x] Dependencies installed
- [x] `main.py` fully configured with CORS and routers
- [x] Category routers created (generators, converters, calculators)
- [x] `.env` file set up
- [x] Health check endpoint returns 200
- [x] API docs accessible at `/docs`
- [x] Basic test suite running with `pytest`

---

## Step 1 — Create & Activate Virtual Environment (Windows)

```cmd
cd backend
python -m venv venv
venv\Scripts\activate
```

You should see `(venv)` in your terminal prompt.

Install all dependencies:

```cmd
pip install -r requirements.txt
pip install -r requirements-dev.txt
```

---

## Step 2 — Environment Variables

Create `backend/.env`:

```env
# App
APP_ENV=development
APP_VERSION=0.1.0

# CORS — add your frontend URL here
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# (Add API keys here later, e.g. for currency converter)
# EXCHANGE_RATE_API_KEY=your_key_here
```

> ⚠️ Never commit `.env` to Git. It's already in `.gitignore`.

Create `backend/.env.example` (safe to commit — no real secrets):

```env
APP_ENV=development
APP_VERSION=0.1.0
ALLOWED_ORIGINS=http://localhost:5173
# EXCHANGE_RATE_API_KEY=
```

---

## Step 3 — Full `main.py`

Replace the placeholder `backend/main.py` with:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv

from routers import generators, converters, calculators

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("ToolBox API starting up...")
    yield
    print("ToolBox API shutting down...")

app = FastAPI(
    title="ToolBox API",
    description="Backend API for ToolBox — community utility tools",
    version=os.getenv("APP_VERSION", "0.1.0"),
    lifespan=lifespan,
)

# CORS — allow frontend to call the API
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(generators.router, prefix="/api/generators", tags=["Generators"])
app.include_router(converters.router, prefix="/api/converters", tags=["Converters"])
app.include_router(calculators.router, prefix="/api/calculators", tags=["Calculators"])

@app.get("/", tags=["Health"])
async def root():
    return {
        "status": "ok",
        "message": "ToolBox API is running",
        "docs": "/docs",
    }

@app.get("/health", tags=["Health"])
async def health():
    return {"status": "ok"}
```

Also add `python-dotenv` to `requirements.txt`:
```
python-dotenv==1.0.1
```

---

## Step 4 — Create Category Routers

### `backend/routers/generators.py`

```python
from fastapi import APIRouter

router = APIRouter()

# Tool endpoints will be added here in Phase 4
# Example structure:
# from tools.qr_code import QRRequest, QRResponse, generate_qr
# @router.post("/qr-code", response_model=QRResponse)
# async def qr_code(request: QRRequest):
#     return generate_qr(request)
```

### `backend/routers/converters.py`

```python
from fastapi import APIRouter

router = APIRouter()
```

### `backend/routers/calculators.py`

```python
from fastapi import APIRouter

router = APIRouter()
```

---

## Step 5 — Run the Backend

```cmd
cd backend
venv\Scripts\activate
uvicorn main:app --reload --port 8000
```

Visit:
- `http://localhost:8000/` → health check JSON
- `http://localhost:8000/docs` → Swagger UI (interactive API explorer)
- `http://localhost:8000/redoc` → ReDoc docs

---

## Step 6 — Write the First Tests

Create `backend/tests/__init__.py` (empty file).

Create `backend/tests/test_health.py`:

```python
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
```

Run tests:

```cmd
cd backend
pytest tests/ -v
```

Expected output:
```
PASSED tests/test_health.py::test_root
PASSED tests/test_health.py::test_health
2 passed in 0.XX s
```

---

## Step 7 — Configure `ruff` Linting

Create `backend/ruff.toml`:

```toml
line-length = 100
target-version = "py311"

[lint]
select = ["E", "F", "I"]
ignore = ["E501"]
```

Run linter:
```cmd
ruff check .
```

---

## Backend Folder Structure After Phase 2

```
backend/
├── main.py                  # App entry point, CORS, router registration
├── requirements.txt
├── requirements-dev.txt
├── .env                     # Local secrets (not committed)
├── .env.example             # Template (committed)
├── ruff.toml                # Linting config
├── routers/
│   ├── __init__.py
│   ├── generators.py        # Generators router (empty)
│   ├── converters.py        # Converters router (empty)
│   └── calculators.py       # Calculators router (empty)
├── tools/
│   └── __init__.py          # Tool logic goes here in Phase 4
└── tests/
    ├── __init__.py
    └── test_health.py       # Health check tests
```

---

## ✅ Phase 2 Complete

When all checkboxes at the top are done, move to **[Phase 3 — Vite + React Frontend Foundation](PHASE_3_FRONTEND.md)**.
