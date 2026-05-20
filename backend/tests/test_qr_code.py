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
