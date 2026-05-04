# Contributing to ToolBox

Thank you for your interest in contributing! This guide explains everything you need to know to add a new tool, fix a bug, or improve the docs.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Ways to Contribute](#ways-to-contribute)
- [Development Setup (Windows)](#development-setup-windows)
- [Adding a New Tool](#adding-a-new-tool)
- [Branch & Commit Conventions](#branch--commit-conventions)
- [Pull Request Process](#pull-request-process)
- [Review Criteria](#review-criteria)

---

## Code of Conduct

Please read our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to uphold it.

---

## Ways to Contribute

| Type | How |
|---|---|
| 🛠️ New tool | Follow the [Adding a New Tool](#adding-a-new-tool) guide |
| 🐛 Bug fix | Open an issue first, then a PR |
| 📝 Docs improvement | Edit any `.md` file and open a PR |
| 💡 Tool idea | Open a "New Tool Request" issue |
| 🎨 UI improvement | Open an issue describing the change |

---

## Development Setup (Windows)

### 1. Fork & Clone

```cmd
git clone https://github.com/abhishekabhang314/toolbox.git
cd toolbox
git remote add upstream https://github.com/ORIGINAL_OWNER/toolbox.git
```

### 2. Backend Setup

```cmd
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
pip install -r requirements-dev.txt
uvicorn main:app --reload --port 8000
```

API docs available at: `http://localhost:8000/docs`

### 3. Frontend Setup

Open a new terminal:

```cmd
cd frontend
npm install
npm run dev
```

Frontend available at: `http://localhost:5173`

---

## Adding a New Tool

Every tool requires exactly **3 changes**:

### Step 1 — Python Logic (`backend/tools/`)

Create `backend/tools/your_tool_name.py`:

```python
# backend/tools/your_tool_name.py

from pydantic import BaseModel

class YourToolRequest(BaseModel):
    input_field: str

class YourToolResponse(BaseModel):
    result: str

def run_your_tool(request: YourToolRequest) -> YourToolResponse:
    # All logic here using Python libraries
    result = some_library.process(request.input_field)
    return YourToolResponse(result=result)
```

Rules:
- Use existing Python libraries — no reinventing the wheel
- Keep logic pure (no side effects, no state)
- Add a docstring explaining what the tool does

### Step 2 — API Router (`backend/routers/`)

Add your endpoint to the relevant router (e.g., `backend/routers/generators.py`):

```python
from fastapi import APIRouter
from tools.your_tool_name import YourToolRequest, YourToolResponse, run_your_tool

router = APIRouter()

@router.post("/your-tool", response_model=YourToolResponse)
async def your_tool_endpoint(request: YourToolRequest):
    """Brief description of what this tool does."""
    return run_your_tool(request)
```

### Step 3 — Register in `tools.json`

Add an entry to `frontend/src/registry/tools.json`:

```json
{
  "id": "your-tool-name",
  "name": "Your Tool Name",
  "description": "One sentence describing what it does.",
  "category": "generators",
  "icon": "⚡",
  "route": "/generators/your-tool-name",
  "api": "/api/generators/your-tool",
  "tags": ["tag1", "tag2"],
  "featured": false,
  "new": true
}
```

Valid categories: `generators`, `converters`, `calculators`, `text`, `dev`, `image`

### Step 4 — Write Tests

Add `backend/tests/test_your_tool.py`:

```python
from tools.your_tool_name import YourToolRequest, run_your_tool

def test_your_tool_basic():
    req = YourToolRequest(input_field="test input")
    result = run_your_tool(req)
    assert result.result is not None

def test_your_tool_edge_case():
    # Test edge cases
    pass
```

Run tests:

```cmd
cd backend
pytest tests/ -v
```

### Step 5 — React Component (`frontend/src/tools/`)

Create `frontend/src/tools/YourToolName.jsx`. See Phase 3 guide for the component template.

---

## Branch & Commit Conventions

### Branch Names

```
feature/tool-qr-code-generator
feature/tool-unit-converter
fix/qr-code-empty-input-crash
docs/update-contributing-guide
chore/update-dependencies
```

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(tools): add QR code generator
fix(converters): handle empty unit input
docs: update contributing guide
chore: bump fastapi to 0.111
test(generators): add password generator edge cases
```

---

## Pull Request Process

1. Make sure all tests pass: `pytest tests/ -v`
2. Make sure the frontend builds: `npm run build`
3. Fill out the PR template completely
4. Link any related issues with `Closes #123`
5. Request a review — maintainers aim to respond within 48 hours

---

## Review Criteria

PRs are reviewed for:

- ✅ Tool works correctly with valid inputs
- ✅ Edge cases handled (empty input, invalid values)
- ✅ Uses a well-known Python library (no reinventing)
- ✅ Registered in `tools.json` correctly
- ✅ Tests included and passing
- ✅ No breaking changes to existing tools
- ✅ Code is readable and has comments where needed
