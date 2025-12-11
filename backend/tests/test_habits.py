"""
Habit Tests
===========
Tests for habit CRUD operations and statistics.
"""

import pytest
from fastapi import status
from datetime import date


class TestCreateHabit:
    """Test habit creation endpoint."""
    
    def test_create_habit_success(self, client, auth_headers):
        """Test successful habit creation."""
        response = client.post("/api/habits/", headers=auth_headers, json={
            "title": "Morning Meditation",
            "description": "10 minutes of mindfulness",
            "frequency": "DAILY",
            "category": "HEALTH"
        })
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["title"] == "Morning Meditation"
        assert data["current_streak"] == 0
        assert data["is_active"] == True
    
    def test_create_habit_with_color(self, client, auth_headers):
        """Test habit creation with optional color."""
        response = client.post("/api/habits/", headers=auth_headers, json={
            "title": "Exercise",
            "frequency": "DAILY",
            "category": "FITNESS",
            "color": "#FF5733"
        })
        assert response.status_code == status.HTTP_201_CREATED
        assert response.json()["color"] == "#FF5733"
    
    def test_create_habit_unauthorized(self, client):
        """Test habit creation without auth fails."""
        response = client.post("/api/habits/", json={
            "title": "Test Habit",
            "frequency": "DAILY",
            "category": "OTHER"
        })
        assert response.status_code == status.HTTP_403_FORBIDDEN
    
    def test_create_habit_missing_title(self, client, auth_headers):
        """Test habit creation fails without title."""
        response = client.post("/api/habits/", headers=auth_headers, json={
            "frequency": "DAILY",
            "category": "OTHER"
        })
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


class TestGetHabits:
    """Test habit retrieval endpoints."""
    
    def test_get_all_habits(self, client, auth_headers, test_habit):
        """Test getting all user habits."""
        response = client.get("/api/habits/", headers=auth_headers)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data) >= 1
        assert any(h["title"] == "Morning Exercise" for h in data)
    
    def test_get_habits_filter_category(self, client, auth_headers, test_habit):
        """Test filtering habits by category."""
        response = client.get("/api/habits/?category=fitness", headers=auth_headers)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert all(h["category"] == "fitness" for h in data)
    
    def test_get_habits_filter_active(self, client, auth_headers, test_habit):
        """Test filtering habits by active status."""
        response = client.get("/api/habits/?is_active=true", headers=auth_headers)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert all(h["is_active"] == True for h in data)
    
    def test_get_single_habit(self, client, auth_headers, test_habit):
        """Test getting a single habit by ID."""
        response = client.get(f"/api/habits/{test_habit.id}", headers=auth_headers)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["title"] == "Morning Exercise"
    
    def test_get_habit_not_found(self, client, auth_headers):
        """Test getting non-existent habit returns 404."""
        response = client.get("/api/habits/99999", headers=auth_headers)
        assert response.status_code == status.HTTP_404_NOT_FOUND
    
    def test_get_other_users_habit(self, client, auth_headers_user2, test_habit):
        """Test user cannot access another user's habit."""
        response = client.get(f"/api/habits/{test_habit.id}", headers=auth_headers_user2)
        assert response.status_code == status.HTTP_404_NOT_FOUND


class TestUpdateHabit:
    """Test habit update endpoint."""
    
    def test_update_habit_title(self, client, auth_headers, test_habit):
        """Test updating habit title."""
        response = client.put(f"/api/habits/{test_habit.id}", headers=auth_headers, json={
            "title": "Evening Exercise"
        })
        assert response.status_code == status.HTTP_200_OK
        assert response.json()["title"] == "Evening Exercise"
    
    def test_update_habit_description(self, client, auth_headers, test_habit):
        """Test updating habit description."""
        response = client.put(f"/api/habits/{test_habit.id}", headers=auth_headers, json={
            "description": "Updated description"
        })
        assert response.status_code == status.HTTP_200_OK
        assert response.json()["description"] == "Updated description"
    
    def test_update_habit_frequency(self, client, auth_headers, test_habit):
        """Test updating habit frequency."""
        response = client.put(f"/api/habits/{test_habit.id}", headers=auth_headers, json={
            "frequency": "weekly"
        })
        assert response.status_code == status.HTTP_200_OK
    
    def test_update_habit_not_found(self, client, auth_headers):
        """Test updating non-existent habit."""
        response = client.put("/api/habits/99999", headers=auth_headers, json={
            "title": "Test"
        })
        assert response.status_code == status.HTTP_404_NOT_FOUND
    
    def test_update_other_users_habit(self, client, auth_headers_user2, test_habit):
        """Test user cannot update another user's habit."""
        response = client.put(f"/api/habits/{test_habit.id}", headers=auth_headers_user2, json={
            "title": "Hacked Title"
        })
        assert response.status_code == status.HTTP_404_NOT_FOUND


class TestDeleteHabit:
    """Test habit deletion endpoint."""
    
    def test_delete_habit(self, client, auth_headers, test_habit):
        """Test soft deleting a habit."""
        response = client.delete(f"/api/habits/{test_habit.id}", headers=auth_headers)
        assert response.status_code == status.HTTP_204_NO_CONTENT
        
        # Verify habit is deactivated (soft delete)
        get_response = client.get(f"/api/habits/{test_habit.id}", headers=auth_headers)
        # Should still exist but be inactive
        assert get_response.status_code == status.HTTP_200_OK
        assert get_response.json()["is_active"] == False
    
    def test_delete_habit_not_found(self, client, auth_headers):
        """Test deleting non-existent habit."""
        response = client.delete("/api/habits/99999", headers=auth_headers)
        assert response.status_code == status.HTTP_404_NOT_FOUND


class TestHabitCompletion:
    """Test habit completion endpoint."""
    
    def test_complete_habit(self, client, auth_headers, test_habit):
        """Test marking habit as completed."""
        response = client.post(f"/api/habits/{test_habit.id}/complete", headers=auth_headers)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["message"] == "Habit marked as completed"
        assert data["habit_id"] == test_habit.id
        assert "current_streak" in data
    
    def test_complete_habit_twice_same_day(self, client, auth_headers, test_habit):
        """Test completing habit twice on same day."""
        # First completion
        client.post(f"/api/habits/{test_habit.id}/complete", headers=auth_headers)
        
        # Second completion (should update, not fail)
        response = client.post(f"/api/habits/{test_habit.id}/complete", headers=auth_headers)
        assert response.status_code == status.HTTP_200_OK
    
    def test_complete_habit_not_found(self, client, auth_headers):
        """Test completing non-existent habit."""
        response = client.post("/api/habits/99999/complete", headers=auth_headers)
        assert response.status_code == status.HTTP_404_NOT_FOUND


class TestHabitStats:
    """Test habit statistics endpoint."""
    
    def test_get_habit_stats(self, client, auth_headers, test_habit_with_logs):
        """Test getting habit statistics."""
        response = client.get(
            f"/api/habits/{test_habit_with_logs.id}/stats",
            headers=auth_headers
        )
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "total_completions" in data
        assert "completion_rate" in data
        assert "current_streak" in data
        assert "longest_streak" in data
    
    def test_get_stats_not_found(self, client, auth_headers):
        """Test getting stats for non-existent habit."""
        response = client.get("/api/habits/99999/stats", headers=auth_headers)
        assert response.status_code == status.HTTP_404_NOT_FOUND

