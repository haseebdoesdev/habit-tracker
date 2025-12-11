"""
Authentication Tests
====================
Tests for user registration, login, and profile management.
"""

import pytest
from fastapi import status


class TestRegistration:
    """Test user registration endpoint."""
    
    def test_register_success(self, client):
        """Test successful user registration."""
        response = client.post("/api/auth/register", json={
            "email": "newuser@example.com",
            "username": "newuser",
            "password": "securepassword123",
            "password_confirm": "securepassword123"
        })
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert "user" in data
        assert data["user"]["email"] == "newuser@example.com"
        assert data["user"]["username"] == "newuser"
    
    def test_register_password_mismatch(self, client):
        """Test registration fails when passwords don't match."""
        response = client.post("/api/auth/register", json={
            "email": "test@example.com",
            "username": "testuser",
            "password": "password123",
            "password_confirm": "differentpassword"
        })
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "Passwords do not match" in response.json()["detail"]
    
    def test_register_duplicate_email(self, client, test_user):
        """Test registration fails with duplicate email."""
        response = client.post("/api/auth/register", json={
            "email": "test@example.com",  # Same as test_user
            "username": "differentuser",
            "password": "password123",
            "password_confirm": "password123"
        })
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "Email already registered" in response.json()["detail"]
    
    def test_register_duplicate_username(self, client, test_user):
        """Test registration fails with duplicate username."""
        response = client.post("/api/auth/register", json={
            "email": "different@example.com",
            "username": "testuser",  # Same as test_user
            "password": "password123",
            "password_confirm": "password123"
        })
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "Username already taken" in response.json()["detail"]
    
    def test_register_short_password(self, client):
        """Test registration fails with short password."""
        response = client.post("/api/auth/register", json={
            "email": "test@example.com",
            "username": "testuser",
            "password": "short",
            "password_confirm": "short"
        })
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


class TestLogin:
    """Test user login endpoint."""
    
    def test_login_success(self, client, test_user):
        """Test successful login."""
        response = client.post("/api/auth/login", json={
            "email": "test@example.com",
            "password": "testpassword123"
        })
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "Bearer"
    
    def test_login_wrong_password(self, client, test_user):
        """Test login fails with wrong password."""
        response = client.post("/api/auth/login", json={
            "email": "test@example.com",
            "password": "wrongpassword"
        })
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
    
    def test_login_nonexistent_email(self, client):
        """Test login fails with non-existent email."""
        response = client.post("/api/auth/login", json={
            "email": "nonexistent@example.com",
            "password": "password123"
        })
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


class TestCurrentUser:
    """Test current user endpoints."""
    
    def test_get_current_user(self, client, test_user, auth_headers):
        """Test getting current user profile."""
        response = client.get("/api/auth/me", headers=auth_headers)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["email"] == "test@example.com"
        assert data["username"] == "testuser"
    
    def test_get_current_user_unauthorized(self, client):
        """Test getting current user without auth fails."""
        response = client.get("/api/auth/me")
        assert response.status_code == status.HTTP_403_FORBIDDEN
    
    def test_refresh_token(self, client, auth_headers):
        """Test token refresh."""
        response = client.post("/api/auth/refresh", headers=auth_headers)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "access_token" in data


class TestPasswordUpdate:
    """Test password update endpoint."""
    
    def test_update_password_success(self, client, auth_headers):
        """Test successful password update."""
        response = client.put("/api/auth/password", headers=auth_headers, json={
            "current_password": "testpassword123",
            "new_password": "newpassword123",
            "new_password_confirm": "newpassword123"
        })
        assert response.status_code == status.HTTP_200_OK
    
    def test_update_password_wrong_current(self, client, auth_headers):
        """Test password update fails with wrong current password."""
        response = client.put("/api/auth/password", headers=auth_headers, json={
            "current_password": "wrongpassword",
            "new_password": "newpassword123",
            "new_password_confirm": "newpassword123"
        })
        assert response.status_code == status.HTTP_400_BAD_REQUEST
    
    def test_update_password_mismatch(self, client, auth_headers):
        """Test password update fails when new passwords don't match."""
        response = client.put("/api/auth/password", headers=auth_headers, json={
            "current_password": "testpassword123",
            "new_password": "newpassword123",
            "new_password_confirm": "differentpassword"
        })
        assert response.status_code == status.HTTP_400_BAD_REQUEST


class TestProfileUpdate:
    """Test profile update endpoint."""
    
    def test_update_profile_username(self, client, auth_headers):
        """Test updating username."""
        response = client.put("/api/auth/profile", headers=auth_headers, json={
            "username": "newusername"
        })
        assert response.status_code == status.HTTP_200_OK
        assert response.json()["username"] == "newusername"
    
    def test_update_profile_bio(self, client, auth_headers):
        """Test updating bio."""
        response = client.put("/api/auth/profile", headers=auth_headers, json={
            "bio": "This is my new bio"
        })
        assert response.status_code == status.HTTP_200_OK
    
    def test_update_profile_duplicate_username(self, client, test_user, test_user2, auth_headers):
        """Test updating to an existing username fails."""
        response = client.put("/api/auth/profile", headers=auth_headers, json={
            "username": "testuser2"  # Already taken by test_user2
        })
        assert response.status_code == status.HTTP_400_BAD_REQUEST

