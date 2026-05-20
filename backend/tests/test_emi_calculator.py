from fastapi.testclient import TestClient

from main import app

client = TestClient(app)

def test_emi_calculator_valid():
    response = client.post("/api/calculators/emi", json={
        "principal": 100000,
        "annual_rate": 10.5,
        "tenure_months": 12
    })
    assert response.status_code == 200
    data = response.json()
    assert "emi" in data
    assert "total_payment" in data
    assert "total_interest" in data
    assert "schedule" in data
    assert len(data["schedule"]) == 12

def test_emi_calculator_negative():
    response = client.post("/api/calculators/emi", json={
        "principal": -100000,
        "annual_rate": 10.5,
        "tenure_months": 12
    })
    assert response.status_code == 422
