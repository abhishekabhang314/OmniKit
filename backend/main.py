import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import calculators, converters, generators

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("OmniKit API starting up...")
    yield
    print("OmniKit API shutting down...")

app = FastAPI(
    title="OmniKit API",
    description="Backend API for OmniKit — community utility tools",
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
        "message": "OmniKit API is running",
        "docs": "/docs",
    }

@app.get("/health", tags=["Health"])
async def health():
    return {"status": "ok"}