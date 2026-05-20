from fastapi.testclient import TestClient

from main import app

client = TestClient(app)

def test_age_calculator_valid():
    response = client.post("/api/calculators/age", json={"birth_date": "1990-01-01"})
    assert response.status_code == 200
    data = response.json()
    assert "years" in data
    assert "months" in data
    assert "days" in data
    assert "total_days" in data

def test_age_calculator_future_date():
    response = client.post("/api/calculators/age", json={"birth_date": "2999-01-01"})
    assert response.status_code == 422

def test_age_calculator_invalid_format():
    response = client.post("/api/calculators/age", json={"birth_date": "01-01-1990"})
    assert response.status_code == 422
