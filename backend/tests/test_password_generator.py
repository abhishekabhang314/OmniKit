from fastapi.testclient import TestClient

from main import app

client = TestClient(app)

def test_password_generator_valid():
    response = client.post("/api/generators/password", json={
        "length": 20,
        "include_uppercase": True,
        "include_lowercase": True,
        "include_numbers": True,
        "include_symbols": True
    })
    assert response.status_code == 200
    data = response.json()
    assert "password" in data
    assert len(data["password"]) == 20

def test_password_generator_short():
    response = client.post("/api/generators/password", json={"length": 2})
    assert response.status_code == 422
