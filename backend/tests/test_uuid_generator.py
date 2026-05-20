from fastapi.testclient import TestClient

from main import app

client = TestClient(app)

def test_uuid_generator_valid():
    response = client.post("/api/generators/uuid", json={
        "count": 5,
        "uppercase": True,
        "remove_hyphens": True
    })
    assert response.status_code == 200
    data = response.json()
    assert "uuids" in data
    assert len(data["uuids"]) == 5
    assert "-" not in data["uuids"][0]

def test_uuid_generator_default():
    response = client.post("/api/generators/uuid", json={})
    assert response.status_code == 200
    data = response.json()
    assert len(data["uuids"]) == 1
    assert "-" in data["uuids"][0]
