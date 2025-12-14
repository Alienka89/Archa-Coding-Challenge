from __future__ import annotations

from fastapi.testclient import TestClient


def test_create_category_ok(client: TestClient) -> None:
    resp = client.post("/categories", json={"name": "Meals"})
    assert resp.status_code == 201
    data = resp.json()
    assert data["name"] == "Meals"
    assert data["is_active"] is True


def test_create_category_duplicate_name_returns_400(client: TestClient) -> None:
    client.post("/categories", json={"name": "Meals"})
    resp = client.post("/categories", json={"name": "Meals"})
    assert resp.status_code == 400
    assert resp.json()["detail"]["code"] == "duplicate_name"


def test_update_category_not_found_returns_404(client: TestClient) -> None:
    resp = client.put("/categories/999999", json={"name": "Updated", "is_active": False})
    assert resp.status_code == 404
    assert resp.json()["detail"]["code"] == "not_found"
