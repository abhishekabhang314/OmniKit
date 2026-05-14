from fastapi.testclient import TestClient

from main import app

client = TestClient(app)

def test_color_converter_hex():
    response = client.post("/api/converters/color", json={"color": "#FF0000"})
    assert response.status_code == 200
    data = response.json()
    assert data["hex"] == "#FF0000"
    assert "rgb" in data
    assert "hsl" in data

def test_color_converter_rgb():
    response = client.post("/api/converters/color", json={"color": "rgb(0, 255, 0)"})
    assert response.status_code == 200
    data = response.json()
    assert data["hex"] == "#00FF00"

def test_color_converter_hsl():
    response = client.post("/api/converters/color", json={"color": "hsl(240, 100%, 50%)"})
    assert response.status_code == 200
    data = response.json()
    assert data["hex"] == "#0000FF"
