"""
Health Check Tests
==================
Tests for API health and root endpoints.
"""

import pytest
from fastapi import status


class TestHealthEndpoints:
    """Test health check and root endpoints."""
    
    def test_root_endpoint(self, client):
        """Test root endpoint returns API info."""
        response = client.get("/")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "message" in data
        assert "version" in data
        assert "docs" in data
    
    def test_health_endpoint(self, client):
        """Test health check endpoint."""
        response = client.get("/health")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "status" in data
        assert "api" in data
        assert data["api"] == "ok"
    
    def test_api_info_endpoint(self, client):
        """Test API info endpoint."""
        response = client.get("/api")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "version" in data
        assert "endpoints" in data
        assert "auth" in data["endpoints"]
        assert "habits" in data["endpoints"]

