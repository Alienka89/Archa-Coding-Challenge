from __future__ import annotations

from fastapi.testclient import TestClient


def _create_category(client: TestClient, name: str = "Meals") -> int:
    resp = client.post("/categories", json={"name": name})
    assert resp.status_code == 201
    return resp.json()["id"]


def _create_code(client: TestClient, category_id: int, code: str = "MEAL", description: str | None = None) -> dict:
    payload = {"code": code}
    if description is not None:
        payload["description"] = description
    resp = client.post(f"/categories/{category_id}/codes", json=payload)
    assert resp.status_code == 201
    return resp.json()


def test_create_code_ok(client: TestClient) -> None:
    category_id = _create_category(client)
    data = _create_code(client, category_id, code="MEAL", description="Meals and snacks")

    assert data["category_id"] == category_id
    assert data["code"] == "MEAL"
    assert data["description"] == "Meals and snacks"
    assert data["is_active"] is True


def test_create_code_trims_whitespace(client: TestClient) -> None:
    category_id = _create_category(client)
    data = _create_code(client, category_id, code="  MEAL  ")
    assert data["code"] == "MEAL"


def test_create_code_duplicate_within_category_returns_400(client: TestClient) -> None:
    category_id = _create_category(client)
    _create_code(client, category_id, code="MEAL")

    resp = client.post(f"/categories/{category_id}/codes", json={"code": "MEAL"})
    assert resp.status_code == 400
    assert resp.json()["detail"]["code"] == "duplicate_code"


def test_create_code_same_code_different_categories_ok(client: TestClient) -> None:
    cat1 = _create_category(client, name="Meals")
    cat2 = _create_category(client, name="Transport")

    code1 = _create_code(client, cat1, code="COMMON")
    code2 = _create_code(client, cat2, code="COMMON")

    assert code1["category_id"] == cat1
    assert code2["category_id"] == cat2
    assert code1["code"] == code2["code"] == "COMMON"


def test_list_codes_category_not_found_returns_404(client: TestClient) -> None:
    resp = client.get("/categories/999999/codes")
    assert resp.status_code == 404
    assert resp.json()["detail"]["code"] == "not_found"


def test_create_code_category_not_found_returns_404(client: TestClient) -> None:
    resp = client.post("/categories/999999/codes", json={"code": "MEAL"})
    assert resp.status_code == 404
    assert resp.json()["detail"]["code"] == "not_found"


def test_update_code_ok_updates_fields(client: TestClient) -> None:
    category_id = _create_category(client)
    created = _create_code(client, category_id, code="MEAL")
    code_id = created["id"]

    resp = client.put(f"/codes/{code_id}", json={"description": "Updated", "is_active": False})
    assert resp.status_code == 200
    data = resp.json()
    assert data["id"] == code_id
    assert data["description"] == "Updated"
    assert data["is_active"] is False
    assert data["code"] == "MEAL"

    # Ensure the change is persisted.
    listed = client.get(f"/categories/{category_id}/codes").json()
    assert any(c["id"] == code_id and c["description"] == "Updated" and c["is_active"] is False for c in listed)


def test_update_code_partial_update_preserves_other_fields(client: TestClient) -> None:
    category_id = _create_category(client)
    created = _create_code(client, category_id, code="MEAL")
    code_id = created["id"]

    resp = client.put(f"/codes/{code_id}", json={"description": "Only description"})
    assert resp.status_code == 200
    data = resp.json()
    assert data["description"] == "Only description"
    assert data["is_active"] is True


def test_update_code_empty_payload_no_change(client: TestClient) -> None:
    category_id = _create_category(client)
    created = _create_code(client, category_id, code="MEAL", description="Initial")
    code_id = created["id"]

    resp = client.put(f"/codes/{code_id}", json={})
    assert resp.status_code == 200
    data = resp.json()
    assert data["description"] == "Initial"
    assert data["is_active"] is True
    assert data["code"] == "MEAL"


def test_update_code_ignores_uneditable_fields(client: TestClient) -> None:
    category_id = _create_category(client)
    created = _create_code(client, category_id, code="MEAL")
    code_id = created["id"]

    # "code" is not part of the update schema and must not be modified.
    resp = client.put(f"/codes/{code_id}", json={"code": "NEW", "description": "Updated"})
    assert resp.status_code == 200
    data = resp.json()
    assert data["code"] == "MEAL"
    assert data["description"] == "Updated"


def test_update_code_not_found_returns_404(client: TestClient) -> None:
    resp = client.put("/codes/999999", json={"description": "Updated"})
    assert resp.status_code == 404
    assert resp.json()["detail"]["code"] == "not_found"


def test_create_code_blank_after_strip_returns_400(client: TestClient) -> None:
    category_id = _create_category(client)
    resp = client.post(f"/categories/{category_id}/codes", json={"code": "   "})
    assert resp.status_code == 400
    assert resp.json()["detail"]["code"] == "empty_code"
