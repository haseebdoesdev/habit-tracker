"""
Log Tests
=========
Tests for habit completion logging endpoints.
"""

import pytest
from fastapi import status
from datetime import date, timedelta


class TestCreateLog:
    """Test log creation endpoint."""
    
    def test_create_log_success(self, client, auth_headers, test_habit):
        """Test successful log creation."""
        response = client.post("/api/logs/", headers=auth_headers, json={
            "habit_id": test_habit.id,
            "completed": True,
            "notes": "Felt great today!"
        })
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["habit_id"] == test_habit.id
        assert data["completed"] == True
        assert data["notes"] == "Felt great today!"
    
    def test_create_log_with_mood(self, client, auth_headers, test_habit):
        """Test log creation with mood."""
        response = client.post("/api/logs/", headers=auth_headers, json={
            "habit_id": test_habit.id,
            "completed": True,
            "mood": 5
        })
        assert response.status_code == status.HTTP_201_CREATED
        assert response.json()["mood"] == 5
    
    def test_create_log_with_duration(self, client, auth_headers, test_habit):
        """Test log creation with duration."""
        response = client.post("/api/logs/", headers=auth_headers, json={
            "habit_id": test_habit.id,
            "completed": True,
            "duration_minutes": 30
        })
        assert response.status_code == status.HTTP_201_CREATED
        assert response.json()["duration_minutes"] == 30
    
    def test_create_log_custom_date(self, client, auth_headers, test_habit):
        """Test log creation with custom date."""
        yesterday = (date.today() - timedelta(days=1)).isoformat()
        response = client.post("/api/logs/", headers=auth_headers, json={
            "habit_id": test_habit.id,
            "completed": True,
            "log_date": yesterday
        })
        assert response.status_code == status.HTTP_201_CREATED
        assert response.json()["log_date"] == yesterday
    
    def test_create_log_duplicate_date(self, client, auth_headers, test_habit):
        """Test creating duplicate log for same date fails."""
        # First log
        client.post("/api/logs/", headers=auth_headers, json={
            "habit_id": test_habit.id,
            "completed": True
        })
        
        # Duplicate log
        response = client.post("/api/logs/", headers=auth_headers, json={
            "habit_id": test_habit.id,
            "completed": True
        })
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "already exists" in response.json()["detail"]
    
    def test_create_log_invalid_habit(self, client, auth_headers):
        """Test log creation with invalid habit ID."""
        response = client.post("/api/logs/", headers=auth_headers, json={
            "habit_id": 99999,
            "completed": True
        })
        assert response.status_code == status.HTTP_404_NOT_FOUND
    
    def test_create_log_invalid_mood(self, client, auth_headers, test_habit):
        """Test log creation with invalid mood value."""
        response = client.post("/api/logs/", headers=auth_headers, json={
            "habit_id": test_habit.id,
            "completed": True,
            "mood": 10  # Should be 1-5
        })
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


class TestGetLogs:
    """Test log retrieval endpoints."""
    
    def test_get_habit_logs(self, client, auth_headers, test_habit_with_logs):
        """Test getting logs for a habit."""
        response = client.get(
            f"/api/logs/habit/{test_habit_with_logs.id}",
            headers=auth_headers
        )
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data) >= 1
    
    def test_get_habit_logs_date_range(self, client, auth_headers, test_habit_with_logs):
        """Test getting logs with date range filter."""
        today = date.today().isoformat()
        week_ago = (date.today() - timedelta(days=7)).isoformat()
        
        response = client.get(
            f"/api/logs/habit/{test_habit_with_logs.id}",
            params={"start_date": week_ago, "end_date": today},
            headers=auth_headers
        )
        assert response.status_code == status.HTTP_200_OK
    
    def test_get_single_log(self, client, auth_headers, test_habit, db):
        """Test getting a single log."""
        from app.models.log import Log
        
        # Create a log first
        log = Log(
            habit_id=test_habit.id,
            user_id=test_habit.user_id,
            log_date=date.today(),
            completed=True
        )
        db.add(log)
        db.commit()
        db.refresh(log)
        
        response = client.get(f"/api/logs/{log.id}", headers=auth_headers)
        assert response.status_code == status.HTTP_200_OK
        assert response.json()["id"] == log.id


class TestUpdateLog:
    """Test log update endpoint."""
    
    def test_update_log_completed(self, client, auth_headers, test_habit, db):
        """Test updating log completion status."""
        from app.models.log import Log
        
        log = Log(
            habit_id=test_habit.id,
            user_id=test_habit.user_id,
            log_date=date.today(),
            completed=False
        )
        db.add(log)
        db.commit()
        db.refresh(log)
        
        response = client.put(f"/api/logs/{log.id}", headers=auth_headers, json={
            "completed": True
        })
        assert response.status_code == status.HTTP_200_OK
        assert response.json()["completed"] == True
    
    def test_update_log_notes(self, client, auth_headers, test_habit, db):
        """Test updating log notes."""
        from app.models.log import Log
        
        log = Log(
            habit_id=test_habit.id,
            user_id=test_habit.user_id,
            log_date=date.today(),
            completed=True
        )
        db.add(log)
        db.commit()
        db.refresh(log)
        
        response = client.put(f"/api/logs/{log.id}", headers=auth_headers, json={
            "notes": "Updated notes"
        })
        assert response.status_code == status.HTTP_200_OK
        assert response.json()["notes"] == "Updated notes"


class TestDeleteLog:
    """Test log deletion endpoint."""
    
    def test_delete_log(self, client, auth_headers, test_habit, db):
        """Test deleting a log."""
        from app.models.log import Log
        
        log = Log(
            habit_id=test_habit.id,
            user_id=test_habit.user_id,
            log_date=date.today(),
            completed=True
        )
        db.add(log)
        db.commit()
        db.refresh(log)
        
        response = client.delete(f"/api/logs/{log.id}", headers=auth_headers)
        assert response.status_code == status.HTTP_204_NO_CONTENT
        
        # Verify deletion
        get_response = client.get(f"/api/logs/{log.id}", headers=auth_headers)
        assert get_response.status_code == status.HTTP_404_NOT_FOUND


class TestDailySummary:
    """Test daily summary endpoint."""
    
    def test_get_daily_summary(self, client, auth_headers, test_habit_with_logs):
        """Test getting daily summary."""
        today = date.today().isoformat()
        response = client.get(f"/api/logs/daily/{today}", headers=auth_headers)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "total_habits" in data
        assert "completed_habits" in data
        assert "completion_percentage" in data
        assert "logs" in data


class TestWeeklySummary:
    """Test weekly summary endpoint."""
    
    def test_get_weekly_summary(self, client, auth_headers, test_habit_with_logs):
        """Test getting weekly summary."""
        response = client.get("/api/logs/weekly", headers=auth_headers)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "week_start" in data
        assert "week_end" in data
        assert "daily_summaries" in data
        assert "weekly_completion_rate" in data
    
    def test_get_weekly_summary_custom_start(self, client, auth_headers, test_habit_with_logs):
        """Test weekly summary with custom start date."""
        week_start = (date.today() - timedelta(days=14)).isoformat()
        response = client.get(
            "/api/logs/weekly",
            params={"week_start": week_start},
            headers=auth_headers
        )
        assert response.status_code == status.HTTP_200_OK

