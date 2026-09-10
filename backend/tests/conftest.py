
"""
Database session and test client fixtures
"""

import pytest 
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from main import app 
from db.base import Base
from core.database import get_db

from sqlalchemy import event
from sqlalchemy.engine import Engine



# In-memory SQLite DB isolated for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@event.listens_for(Engine, "connect")
def set_sqlite_pragma(dbapi_connection, connection_record):
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.close()


@pytest.fixture()
def db_session():
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    try:
        yield session 
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)

@pytest.fixture()
def client(db_session):
    def _override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = _override_get_db
    with TestClient(app) as c :
        yield c 
    app.dependency_overrides.clear()


# Helper Fixtures for Auth Headers
@pytest.fixture
def user_a_headers(client):
    client.post("/users/", json={"username": "user_a", "email": "usera@example.com", "password": "password123"})
    response = client.post("/auth/login", json={"email": "usera@example.com", "password": "password123"})
    # Dig into ["token"]["access_token"]
    token = response.json()["token"]["access_token"]
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture
def user_b_headers(client):
    client.post("/users/", json={"username": "user_b", "email": "userb@example.com", "password": "password123"})
    response = client.post("/auth/login", json={"email": "userb@example.com", "password": "password123"})
    # Dig into ["token"]["access_token"]
    token = response.json()["token"]["access_token"]
    return {"Authorization": f"Bearer {token}"}