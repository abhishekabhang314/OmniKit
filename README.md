# 🧰 OmniKit

> A community-built collection of everyday utility tools — QR generators, converters, calculators, and more. Free, fast, and open source.

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Python](https://img.shields.io/badge/Python-3.11+-yellow.svg)](https://python.org)
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg)](https://react.dev)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg)](https://fastapi.tiangolo.com)

---

## 📖 Table of Contents

- [About](#about)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Phases](#phases)
- [Getting Started](#getting-started)
- [Contributing](#contributing)
- [License](#license)

---

## About

**OmniKit** is an open-source, community-driven platform for everyday utility tools. Instead of Googling a different website for every small task, OmniKit brings them all together in one clean, fast interface.

Every tool runs on a **FastAPI Python backend** (all logic lives in Python) with a **Vite + React frontend**. Tools are registered in a central `tools.json` manifest — adding a new tool is just a Python file, a React component, and a JSON entry.

---

## Project Structure

```
OmniKit/
├── backend/                  # FastAPI Python backend
│   ├── main.py               # App entry point
│   ├── routers/              # One router per tool category
│   ├── tools/                # Pure Python logic per tool
│   ├── tests/                # Pytest test suite
│   └── requirements.txt
│
├── frontend/                 # Vite + React frontend
│   ├── src/
│   │   ├── registry/         # tools.json — single source of truth
│   │   ├── components/       # Shared UI components
│   │   ├── tools/            # One component per tool
│   │   └── pages/            # Route-level pages
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── docs/phases/              # Detailed phase-by-phase guides
├── .github/                  # Actions, templates, CODEOWNERS
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
└── README.md
```

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | Vite + React 18 | UI framework |
| Styling | Tailwind CSS | Utility-first styling |
| Routing | React Router v6 | Client-side routing |
| Backend | FastAPI | Python API framework |
| Validation | Pydantic v2 | Request/response schemas |
| Testing (BE) | Pytest | Backend unit tests |
| Testing (FE) | Vitest | Frontend unit tests |
| CI/CD | GitHub Actions | Automated checks & deploy |
| Hosting (FE) | Vercel | Frontend deployment |
| Hosting (BE) | Render | Backend deployment |

---

## Phases

| Phase | Name | Status |
|---|---|---|
| [Phase 1](docs/phases/PHASE_1_SETUP.md) | Project Setup & Repository | ⏳ Working |
| [Phase 2](docs/phases/PHASE_2_BACKEND.md) | FastAPI Backend Foundation | ⏳ Next |
| [Phase 3](docs/phases/PHASE_3_FRONTEND.md) | Vite + React Frontend Foundation | ⏳ Upcoming |
| [Phase 4](docs/phases/PHASE_4_FIRST_TOOLS.md) | First 3 Tools (End-to-End) | ⏳ Upcoming |
| [Phase 5](docs/phases/PHASE_5_DEPLOYMENT.md) | Deployment & CI/CD | ⏳ Upcoming |
| [Phase 6](docs/phases/PHASE_6_COMMUNITY.md) | Community & Contributions | ⏳ Upcoming |

---

## Getting Started (Windows)

### Prerequisites
- Python 3.11+
- Node.js 18+
- Git

```cmd
git clone https://github.com/abhishekabhang314/OmniKit.git
cd OmniKit

:: Backend
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload

:: Frontend (new terminal)
cd frontend
npm install
npm run dev
```

Full setup → [Phase 1 Guide](docs/phases/PHASE_1_SETUP.md)

---

## Contributing

Read the [Contributing Guide](CONTRIBUTING.md) before opening a PR.

1. Fork the repo
2. Add your tool (Python logic + React component + `tools.json` entry)
3. Open a PR using the template

---

## License

MIT © OmniKit Contributors.
