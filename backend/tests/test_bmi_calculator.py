from fastapi.testclient import TestClient

from main import app

client = TestClient(app)

def test_bmi_calculator_valid():
    response = client.post("/api/calculators/bmi", json={"weight_kg": 70, "height_cm": 175})
    assert response.status_code == 200
    data = response.json()
    assert "bmi" in data
    assert "category" in data

def test_bmi_calculator_negative():
    response = client.post("/api/calculators/bmi", json={"weight_kg": -10, "height_cm": 175})
    assert response.status_code == 422
