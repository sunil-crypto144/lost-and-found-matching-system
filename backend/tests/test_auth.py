import pytest

def test_user_registration(client):
    response = client.post(
        "/api/v1/auth/register",
        json={
            "name": "Test User",
            "email": "test@example.com",
            "password": "Password123!",
            "confirm_password": "Password123!"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == "test@example.com"

def test_duplicate_registration(client):
    user_payload = {
        "name": "Test User",
        "email": "test@example.com",
        "password": "Password123!",
        "confirm_password": "Password123!"
    }
    client.post("/api/v1/auth/register", json=user_payload)
    response = client.post("/api/v1/auth/register", json=user_payload)
    assert response.status_code == 400
    assert "already exists" in response.json()["detail"]

def test_login_success(client):
    client.post(
        "/api/v1/auth/register",
        json={
            "name": "Test User",
            "email": "test@example.com",
            "password": "Password123!",
            "confirm_password": "Password123!"
        }
    )
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "test@example.com", "password": "Password123!"}
    )
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_login_invalid_password(client):
    client.post(
        "/api/v1/auth/register",
        json={
            "name": "Test User",
            "email": "test@example.com",
            "password": "Password123!",
            "confirm_password": "Password123!"
        }
    )
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "test@example.com", "password": "WrongPassword"}
    )
    assert response.status_code == 401
