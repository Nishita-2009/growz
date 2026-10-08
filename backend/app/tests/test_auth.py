import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.db.session import get_db
from app.models import Base, User, Organization, UserOrganization, RoleEnum, Business
from app.main import app

SQLALCHEMY_DATABASE_URL = "sqlite:///./test_auth.db"

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

@pytest.fixture(autouse=True)
def setup_db():
    app.dependency_overrides[get_db] = override_get_db
    with engine.begin() as conn:
        Base.metadata.create_all(bind=conn)
    yield
    with engine.begin() as conn:
        Base.metadata.drop_all(bind=conn)
    app.dependency_overrides.clear()

client = TestClient(app)

def test_unauthenticated_me():
    response = client.get("/api/v1/me")
    assert response.status_code == 403 or response.status_code == 401

def test_authenticated_me():
    headers = {"Authorization": "Bearer dev-token-testuser123"}
    response = client.get("/api/v1/me", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "testuser123@example.com"
    assert len(data["organizations"]) == 1

def test_jwt_bearer_me(monkeypatch):
    def mock_verify_token(token):
        return {
            "uid": "google-user-789",
            "email": "googleuser@example.com",
            "name": "Google User",
            "picture": None
        }
    monkeypatch.setattr("app.api.deps.verify_firebase_token", mock_verify_token)
    
    headers = {"Authorization": "Bearer sample-jwt-token"}
    response = client.get("/api/v1/me", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "googleuser@example.com"
    assert data["firebase_uid"] == "google-user-789"


