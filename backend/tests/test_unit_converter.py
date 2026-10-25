from fastapi.testclient import TestClient

from main import app

client = TestClient(app)

def test_unit_converter_valid():
    response = client.post("/api/converters/unit", json={
        "value": 1,
        "from_unit": "kilometer",
        "to_unit": "meter"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["result"] == 1000.0
    assert data["from_unit"] == "kilometer"
    assert data["to_unit"] == "meter"

def test_unit_converter_temperature():
    response = client.post("/api/converters/unit", json={
        "value": 100,
        "from_unit": "celsius",
        "to_unit": "fahrenheit"
    })
    assert response.status_code == 200
    assert response.json()["result"] == 212.0

def test_unit_converter_supported():
    response = client.get("/api/converters/unit/supported")
    assert response.status_code == 200
    data = response.json()
    assert "length" in data
    assert "weight" in data
    assert "temperature" in data
