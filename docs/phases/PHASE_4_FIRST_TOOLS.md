# Phase 4 — First 3 Tools (End-to-End)

> **Goal:** Build the first 3 tools fully wired end-to-end: Python logic → FastAPI endpoint → React component. These become the reference pattern for all future contributors.

**Tools in this phase:**
1. QR Code Generator (`qrcode` library)
2. Unit Converter (stdlib `pint` or manual)
3. EMI Calculator (pure math)

---

## Checklist

- [x] QR Code Generator — Python logic + API + React UI
- [x] Unit Converter — Python logic + API + React UI
- [x] EMI Calculator — Python logic + API + React UI
- [x] All 3 tools have tests
- [x] All 3 tools accessible via the frontend
- [x] `tools.json` entries verified

---

## Tool 1 — QR Code Generator

### Backend: `backend/tools/qr_code.py`

```python
"""QR Code Generator — uses the `qrcode` library with Pillow."""

import qrcode
import base64
from io import BytesIO
from pydantic import BaseModel, HttpUrl, field_validator

class QRRequest(BaseModel):
    content: str
    size: int = 10          # box_size
    border: int = 4         # quiet zone boxes

    @field_validator('content')
    @classmethod
    def content_not_empty(cls, v):
        if not v.strip():
            raise ValueError('Content cannot be empty')
        return v

class QRResponse(BaseModel):
    image_base64: str       # PNG encoded as base64 data URI

def generate_qr(request: QRRequest) -> QRResponse:
    """Generate a QR code PNG and return it as a base64 data URI."""
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=request.size,
        border=request.border,
    )
    qr.add_data(request.content)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")
    buffer = BytesIO()
    img.save(buffer, format="PNG")
    encoded = base64.b64encode(buffer.getvalue()).decode("utf-8")

    return QRResponse(image_base64=f"data:image/png;base64,{encoded}")
```

### Router: add to `backend/routers/generators.py`

```python
from fastapi import APIRouter
from tools.qr_code import QRRequest, QRResponse, generate_qr

router = APIRouter()

@router.post("/qr-code", response_model=QRResponse)
async def qr_code(request: QRRequest):
    """Generate a QR code from any text or URL."""
    return generate_qr(request)
```

### Tests: `backend/tests/test_qr_code.py`

```python
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_qr_code_basic():
    response = client.post("/api/generators/qr-code", json={"content": "https://example.com"})
    assert response.status_code == 200
    data = response.json()
    assert data["image_base64"].startswith("data:image/png;base64,")

def test_qr_code_empty_content():
    response = client.post("/api/generators/qr-code", json={"content": ""})
    assert response.status_code == 422  # Validation error
```

---

## Tool 2 — Unit Converter

### Install library

```cmd
pip install pint
```

Add to `requirements.txt`: `pint==0.23`

### Backend: `backend/tools/unit_converter.py`

```python
"""Unit Converter — uses the `pint` library for unit conversions."""

from pint import UnitRegistry
from pydantic import BaseModel

ureg = UnitRegistry()

SUPPORTED_CATEGORIES = {
    "length": ["meter", "kilometer", "mile", "yard", "foot", "inch", "centimeter", "millimeter"],
    "weight": ["kilogram", "gram", "pound", "ounce", "ton"],
    "temperature": ["celsius", "fahrenheit", "kelvin"],
    "speed": ["meter_per_second", "kilometer_per_hour", "mile_per_hour", "knot"],
    "area": ["square_meter", "square_kilometer", "square_mile", "acre", "hectare"],
}

class UnitConvertRequest(BaseModel):
    value: float
    from_unit: str
    to_unit: str

class UnitConvertResponse(BaseModel):
    result: float
    from_unit: str
    to_unit: str
    formula: str

def convert_unit(request: UnitConvertRequest) -> UnitConvertResponse:
    """Convert a value from one unit to another using pint."""
    quantity = request.value * ureg(request.from_unit)
    converted = quantity.to(request.to_unit)
    result = round(converted.magnitude, 6)

    return UnitConvertResponse(
        result=result,
        from_unit=request.from_unit,
        to_unit=request.to_unit,
        formula=f"{request.value} {request.from_unit} = {result} {request.to_unit}",
    )

def get_supported_units() -> dict:
    return SUPPORTED_CATEGORIES
```

### Router: add to `backend/routers/converters.py`

```python
from fastapi import APIRouter
from tools.unit_converter import UnitConvertRequest, UnitConvertResponse, convert_unit, get_supported_units

router = APIRouter()

@router.post("/unit", response_model=UnitConvertResponse)
async def unit_convert(request: UnitConvertRequest):
    """Convert between units of length, weight, temperature, speed, and area."""
    return convert_unit(request)

@router.get("/unit/supported")
async def supported_units():
    """Return all supported unit categories and units."""
    return get_supported_units()
```

---

## Tool 3 — EMI Calculator

### Backend: `backend/tools/emi_calculator.py`

```python
"""EMI Calculator — pure Python math, no external library needed."""

from pydantic import BaseModel, field_validator
from typing import List

class EMIRequest(BaseModel):
    principal: float        # Loan amount
    annual_rate: float      # Annual interest rate (%)
    tenure_months: int      # Loan tenure in months

    @field_validator('principal', 'annual_rate', 'tenure_months')
    @classmethod
    def must_be_positive(cls, v):
        if v <= 0:
            raise ValueError('Value must be positive')
        return v

class MonthlyBreakdown(BaseModel):
    month: int
    emi: float
    principal_paid: float
    interest_paid: float
    balance: float

class EMIResponse(BaseModel):
    emi: float
    total_payment: float
    total_interest: float
    principal: float
    schedule: List[MonthlyBreakdown]

def calculate_emi(request: EMIRequest) -> EMIResponse:
    """Calculate EMI and full repayment schedule."""
    P = request.principal
    r = request.annual_rate / 12 / 100   # Monthly rate
    n = request.tenure_months

    # EMI formula: P * r * (1+r)^n / ((1+r)^n - 1)
    emi = P * r * (1 + r) ** n / ((1 + r) ** n - 1)
    emi = round(emi, 2)

    schedule = []
    balance = P

    for month in range(1, n + 1):
        interest_paid = round(balance * r, 2)
        principal_paid = round(emi - interest_paid, 2)
        balance = round(balance - principal_paid, 2)

        schedule.append(MonthlyBreakdown(
            month=month,
            emi=emi,
            principal_paid=principal_paid,
            interest_paid=interest_paid,
            balance=max(balance, 0),
        ))

    total_payment = round(emi * n, 2)
    total_interest = round(total_payment - P, 2)

    return EMIResponse(
        emi=emi,
        total_payment=total_payment,
        total_interest=total_interest,
        principal=P,
        schedule=schedule,
    )
```

### Router: add to `backend/routers/calculators.py`

```python
from fastapi import APIRouter
from tools.emi_calculator import EMIRequest, EMIResponse, calculate_emi

router = APIRouter()

@router.post("/emi", response_model=EMIResponse)
async def emi(request: EMIRequest):
    """Calculate loan EMI, total interest, and monthly repayment schedule."""
    return calculate_emi(request)
```

---

## React Components

Each tool gets a component in `frontend/src/tools/`. The `ToolPage.jsx` from Phase 3 needs to dynamically load the correct component based on `toolId`.

### Dynamic Tool Loading: update `frontend/src/pages/ToolPage.jsx`

```jsx
import { useParams, Link } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import tools from '../registry/tools.json'

const TOOL_COMPONENTS = {
  'qr-code-generator': lazy(() => import('../tools/QRCodeGenerator')),
  'unit-converter': lazy(() => import('../tools/UnitConverter')),
  'emi-calculator': lazy(() => import('../tools/EMICalculator')),
}

export default function ToolPage() {
  const { category, toolId } = useParams()
  const tool = tools.find(t => t.id === toolId)
  const ToolComponent = TOOL_COMPONENTS[toolId]

  if (!tool) return <div className="text-center py-20 text-gray-500">Tool not found.</div>

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link to={`/${category}`} className="text-sm text-gray-400 hover:text-brand-600">
          ← Back to {category}
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">
          {tool.icon} {tool.name}
        </h1>
        <p className="text-gray-500 text-sm mt-1">{tool.description}</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {ToolComponent ? (
          <Suspense fallback={<div className="text-center text-gray-400 py-8">Loading tool...</div>}>
            <ToolComponent />
          </Suspense>
        ) : (
          <div className="text-center text-gray-400 py-8">
            Tool UI coming soon.
          </div>
        )}
      </div>
    </div>
  )
}
```

See `CONTRIBUTING.md` for the React component template to follow when building each tool's UI.

---

## Run & Test Everything

```cmd
:: Backend
cd backend
venv\Scripts\activate
uvicorn main:app --reload

:: Frontend (new terminal)
cd frontend
npm run dev

:: Tests (new terminal)
cd backend
pytest tests/ -v
```

---

## ✅ Phase 4 Complete

When all checkboxes at the top are done, move to **[Phase 5 — Deployment & CI/CD](PHASE_5_DEPLOYMENT.md)**.
