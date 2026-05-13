@echo off
title OmniKit Dev Server

:: ─────────────────────────────────────────
::  OmniKit — Start Dev Servers
::  Runs FastAPI backend + Vite frontend
::  simultaneously in separate windows
:: ─────────────────────────────────────────

echo.
echo  ╔═══════════════════════════════════╗
echo  ║        OmniKit Dev Server         ║
echo  ║ Backend  →  http://localhost:8000 ║
echo  ║ Frontend →  http://localhost:5173 ║
echo  ╚═══════════════════════════════════╝
echo.

:: Check if backend venv exists
if not exist "..\py_venv\Scripts\activate.bat" (
    echo [ERROR] Virtual environment not found.
    echo Run this first:
    echo   cd ..\py_venv\Scripts\activate.bat
    echo   pip install -r requirements.txt
    echo.
    pause
    exit /b 1
)

:: Check if frontend node_modules exists
if not exist "frontend\node_modules" (
    echo [ERROR] Frontend dependencies not installed.
    echo Run this first:
    echo   cd frontend
    echo   npm install
    echo.
    pause
    exit /b 1
)

echo  Starting backend...
start "OmniKit — Backend (FastAPI)" cmd /k "cd backend && ..\..\py_venv\Scripts\activate && uvicorn main:app --reload --port 8000"

:: Small delay so backend has a head start
timeout /t 2 /nobreak >nul

echo  Starting frontend...
start "OmniKit — Frontend (Vite)" cmd /k "cd frontend && npm run dev"

echo.
echo  Both servers are starting in separate windows.
echo  Press any key to stop and close all servers.
echo.
pause >nul

:: Kill both servers when user presses a key
echo  Shutting down...
taskkill /fi "WindowTitle eq OmniKit — Backend (FastAPI)" /t /f >nul 2>&1
taskkill /fi "WindowTitle eq OmniKit — Frontend (Vite)" /t /f >nul 2>&1

echo  Done. Goodbye!
timeout /t 2 /nobreak >nul