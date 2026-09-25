"""
Database session and test client fixtures
"""

import os

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, event, text
from sqlalchemy.engine import make_url
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from main import app
from db.base import Base
from core.config import DB_URL
from core.database import get_db


POSTGRES_TEST_DATABASE_URL = os.getenv("POSTGRES_TEST_DATABASE_URL")

if POSTGRES_TEST_DATABASE_URL:
    test_database_url = make_url(POSTGRES_TEST_DATABASE_URL)
    if test_database_url.get_backend_name() != "postgresql":
        raise RuntimeError("POSTGRES_TEST_DATABASE_URL must use PostgreSQL")
    if test_database_url.database != "kanban_test":
        raise RuntimeError("PostgreSQL integration tests require the kanban_test database")

    engine = create_engine(POSTGRES_TEST_DATABASE_URL)
    using_postgresql = True
else:
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    using_postgresql = False

    @event.listens_for(engine, "connect")
    def set_sqlite_pragma(dbapi_connection, connection_record):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()


TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def truncate_postgresql_tables():
    with engine.begin() as connection:
        connection.execute(text('TRUNCATE TABLE task, "user" RESTART IDENTITY CASCADE'))


@pytest.fixture()
def db_session():
    if using_postgresql:
        truncate_postgresql_tables()
    else:
        Base.metadata.create_all(bind=engine)

    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.rollback()
        session.close()
        if using_postgresql:
            truncate_postgresql_tables()
        else:
            Base.metadata.drop_all(bind=engine)


@pytest.fixture()
def client(db_session):
    def _override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = _override_get_db
    try:
        with TestClient(app) as test_client:
            yield test_client
    finally:
        app.dependency_overrides.pop(get_db, None)


@pytest.fixture
def user_a_headers(client):
    client.post("/users/", json={"username": "user_a", "email": "usera@example.com", "password": "password123"})
    response = client.post("/auth/login", json={"email": "usera@example.com", "password": "password123"})
    token = response.json()["token"]["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def user_b_headers(client):
    client.post("/users/", json={"username": "user_b", "email": "userb@example.com", "password": "password123"})
    response = client.post("/auth/login", json={"email": "userb@example.com", "password": "password123"})
    token = response.json()["token"]["access_token"]
    return {"Authorization": f"Bearer {token}"}
