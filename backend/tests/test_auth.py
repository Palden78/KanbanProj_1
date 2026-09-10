
"""
Registration, login, JWT tests
"""

import time

def test_user_registration(client):
    res = client.post("/users/", json={"username": "palden", "email": "palden@example.com", "password": "password123"})
    assert res.status_code == 201
    assert res.json()["email"] == "palden@example.com"

def test_duplicate_email_rejection(client):
    user_payload = {"username": "palden", "email": "palden@example.com", "password": "password123"}
    client.post("/users/", json=user_payload)
    
    # Try creating again
    res = client.post("/users/", json=user_payload)
    assert res.status_code == 409
    assert res.json()["detail"] == "A user with this email address already exists"

def test_login_success(client):
    client.post("/users/", json={"username": "palden", "email": "palden@example.com", "password": "password123"})
    res = client.post("/auth/login", json={"email": "palden@example.com", "password": "password123"})
    assert res.status_code == 200
    data = res.json()
    assert "token" in data
    assert "access_token" in data["token"]

def test_login_failure(client):
    client.post("/users/", json={"username": "palden", "email": "palden@example.com", "password": "password123"})
    res = client.post("/auth/login", json={"email": "palden@example.com", "password": "wrongpassword"})
    assert res.status_code == 401

def test_invalid_jwt(client):
    headers = {"Authorization": "Bearer invalid.jwt.token"}
    res = client.get("/users/me", headers=headers)
    assert res.status_code == 401
