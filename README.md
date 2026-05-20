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
- [Available Tools](#available-tools)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Adding a New Tool](#adding-a-new-tool)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

---

## 🌐 Live

| | URL |
|---|---|
| Frontend | https://omni-kit-tools.vercel.app |
| API | https://omnikit.onrender.com |

---

## About

**OmniKit** is an open-source, community-driven platform for everyday utility tools. Instead of Googling a different website for every small task, OmniKit brings them all together in one clean, fast, and unified interface.

Every tool runs on a **FastAPI Python backend** (where the core logic lives) combined with a highly responsive **Vite + React frontend**. Tools are registered dynamically in a central `tools.json` manifest.

---

## Available Tools

OmniKit currently includes the following tools, categorized for ease of use:

### ⚡ Generators
- **QR Code Generator:** Generate QR codes from any URL or text instantly.
- **Password Generator:** Generate strong, random passwords with custom rules (length, casing, symbols).
- **UUID Generator:** Generate completely random UUIDs (v4) for use in databases and APIs.

### 🔄 Converters
- **Unit Converter:** Convert between length, weight, temperature, and speed units.
- **Color Converter:** Convert colors interchangeably between HEX, RGB, and HSL formats.

### 🧮 Calculators
- **EMI Calculator:** Calculate loan EMI, total interest, and generate a full repayment schedule.
- **BMI Calculator:** Calculate your Body Mass Index and identify your health category.
- **Age Calculator:** Calculate exact age in years, months, and days from a given birth date.

---

## Architecture

OmniKit follows a strict separation of concerns, ensuring that business logic is cleanly isolated from the user interface:

```text
OmniKit/
├── backend/                  # FastAPI Python backend
│   ├── main.py               # App entry point
│   ├── routers/              # One router per tool category (generators, calculators, etc.)
│   ├── tools/                # Pure Python logic per tool
│   ├── tests/                # Pytest test suite
│   └── requirements.txt
│
├── frontend/                 # Vite + React frontend
│   ├── src/
│   │   ├── registry/         # tools.json — Single source of truth for dynamic routing
│   │   ├── components/       # Shared UI components (ToolCard, NavbarSearch, etc.)
│   │   ├── tools/            # One React component per tool
│   │   └── pages/            # Route-level pages
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
```

1. **Backend Layer:** Tools are encapsulated as pure Python functions in `backend/tools/`. These are exposed via categorized FastAPI routers in `backend/routers/`.
2. **Frontend Layer:** The React app handles the presentation. It fetches the manifest (`tools.json`) to dynamically construct the navigation and tool grids.
3. **Communication:** The frontend communicates with the backend via REST API calls to process inputs and return calculated outputs.

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

---

## Getting Started

### Prerequisites
- **Python 3.11+**
- **Node.js 18+**
- **Git**

### Installation

Clone the repository to your local machine:
```cmd
git clone https://github.com/abhishekabhang314/OmniKit.git
cd OmniKit
```

#### 1. Start the Backend
The backend utilizes Python and FastAPI. We recommend using a virtual environment.

```cmd
cd backend
python -m venv venv
venv\Scripts\activate   # On Mac/Linux use: source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```
*The backend API will be running at `http://localhost:8000`.*

#### 2. Start the Frontend
In a new terminal window, navigate to the frontend directory:

```cmd
cd frontend
npm install
npm run dev
```
*The frontend will be running at `http://localhost:5173`.*

> **Tip:** If you are on Windows, you can simply run the `dev.bat` script in the root directory to start both the frontend and backend simultaneously!

---

## Adding a New Tool

OmniKit is built to be highly extensible. To add a new tool, follow these 3 steps:

1. **Backend Logic (`backend/tools/`):** Create a new Python file for your logic and define your Pydantic request/response models. Hook it up to the appropriate router in `backend/routers/`.
2. **Frontend UI (`frontend/src/tools/`):** Create a React component for the user interface. It should send requests to your new FastAPI endpoint.
3. **Register the Tool (`frontend/src/registry/tools.json`):** Add an entry to the JSON manifest containing the `id`, `name`, `description`, `category`, and `route`. The application will dynamically handle the rest.

---

## Testing

The backend includes a comprehensive test suite using `pytest`.

```cmd
cd backend
venv\Scripts\activate
pytest
```

---

## Contributing

We welcome contributions of all kinds, especially new tools! 

Please read the [Contributing Guide](CONTRIBUTING.md) before opening a Pull Request.

1. Fork the repo
2. Create a new branch (`git checkout -b feature/amazing-tool`)
3. Make your changes (add logic, UI, and registry entry)
4. Commit your changes (`git commit -m 'Add Amazing Tool'`)
5. Push to the branch (`git push origin feature/amazing-tool`)
6. Open a Pull Request using the provided template

---

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for more information.
