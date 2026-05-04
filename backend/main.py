# backend/main.py
# Entry point for the FastAPI application.
# Full setup instructions: docs/phases/PHASE_2_BACKEND.md

from fastapi import FastAPI

app = FastAPI(
    title="ToolBox API",
    description="Backend API for ToolBox — community utility tools",
    version="0.1.0",
)

@app.get("/")
async def root():
    return {"message": "ToolBox API is running. Visit /docs for the API explorer."}
