from fastapi.testclient import TestClient
import pytest

from app.main import app
from app.api.dependencies import current_user_id
from app.core.constants import DEMO_USER_ID

API_PREFIX = "/api/v1"


@pytest.fixture
def client():
    """HTTP client for testing the API."""

    app.dependency_overrides[current_user_id] = (  # disables authentication for tests
        lambda: DEMO_USER_ID
    )
    yield TestClient(app)
    app.dependency_overrides.clear()


@pytest.fixture
def seeded_data(client):
    """Populate database with seed data and return metadata."""
    response = client.post(f"{API_PREFIX}/dev/seed")
    assert response.status_code == 200
    return response.json()
