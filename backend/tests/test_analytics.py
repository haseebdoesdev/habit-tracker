"""
Analytics Tests
===============
Tests for analytics and statistics endpoints.
"""

import pytest
from fastapi import status
from datetime import date, timedelta


class TestOverview:
    """Test analytics overview endpoint."""
    
    def test_get_overview(self, client, auth_headers, test_habit_with_logs):
        """Test getting analytics overview."""
        response = client.get("/api/analytics/overview", headers=auth_headers)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "total_habits" in data
        assert "total_active_habits" in data
        assert "today_completion_rate" in data
        assert "total_completions" in data
    
    def test_get_overview_empty(self, client, auth_headers):
        """Test overview with no habits."""
        response = client.get("/api/analytics/overview", headers=auth_headers)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["total_habits"] == 0


class TestStreaks:
    """Test streak analytics endpoint."""
    
    def test_get_streaks(self, client, auth_headers, test_habit_with_logs):
        """Test getting streak data."""
        response = client.get("/api/analytics/streaks", headers=auth_headers)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "habits_with_streaks" in data
        assert "overall_streak_stats" in data
    
    def test_get_streaks_empty(self, client, auth_headers):
        """Test streaks with no habits."""
        response = client.get("/api/analytics/streaks", headers=auth_headers)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["overall_streak_stats"]["total_streaks"] == 0


class TestHeatmap:
    """Test heatmap endpoint."""
    
    def test_get_heatmap(self, client, auth_headers, test_habit_with_logs):
        """Test getting heatmap data."""
        today = date.today().isoformat()
        month_ago = (date.today() - timedelta(days=30)).isoformat()
        
        response = client.get(
            "/api/analytics/heatmap",
            params={"start_date": month_ago, "end_date": today},
            headers=auth_headers
        )
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "start_date" in data
        assert "end_date" in data
        assert "data" in data
    
    def test_get_heatmap_invalid_range(self, client, auth_headers):
        """Test heatmap with invalid date range."""
        today = date.today().isoformat()
        future = (date.today() + timedelta(days=30)).isoformat()
        
        response = client.get(
            "/api/analytics/heatmap",
            params={"start_date": future, "end_date": today},
            headers=auth_headers
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST
    
    def test_get_heatmap_too_long_range(self, client, auth_headers):
        """Test heatmap with range exceeding 365 days."""
        today = date.today().isoformat()
        long_ago = (date.today() - timedelta(days=400)).isoformat()
        
        response = client.get(
            "/api/analytics/heatmap",
            params={"start_date": long_ago, "end_date": today},
            headers=auth_headers
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST


class TestProgressChart:
    """Test progress chart endpoint."""
    
    def test_get_progress_week(self, client, auth_headers, test_habit_with_logs):
        """Test getting weekly progress."""
        response = client.get(
            "/api/analytics/progress?period=week",
            headers=auth_headers
        )
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["period"] == "week"
        assert "data" in data
    
    def test_get_progress_month(self, client, auth_headers, test_habit_with_logs):
        """Test getting monthly progress."""
        response = client.get(
            "/api/analytics/progress?period=month",
            headers=auth_headers
        )
        assert response.status_code == status.HTTP_200_OK
        assert response.json()["period"] == "month"
    
    def test_get_progress_year(self, client, auth_headers, test_habit_with_logs):
        """Test getting yearly progress."""
        response = client.get(
            "/api/analytics/progress?period=year",
            headers=auth_headers
        )
        assert response.status_code == status.HTTP_200_OK
        assert response.json()["period"] == "year"
    
    def test_get_progress_invalid_period(self, client, auth_headers):
        """Test progress with invalid period."""
        response = client.get(
            "/api/analytics/progress?period=invalid",
            headers=auth_headers
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST


class TestCategories:
    """Test category breakdown endpoint."""
    
    def test_get_categories(self, client, auth_headers, test_habit_with_logs):
        """Test getting category breakdown."""
        response = client.get("/api/analytics/categories", headers=auth_headers)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert isinstance(data, dict)


class TestTrends:
    """Test trends endpoint."""
    
    def test_get_trends(self, client, auth_headers, test_habit_with_logs):
        """Test getting trends data."""
        response = client.get("/api/analytics/trends", headers=auth_headers)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "weekly" in data
        assert "monthly" in data
        assert "current" in data["weekly"]
        assert "previous" in data["weekly"]
        assert "change_percent" in data["weekly"]


class TestAchievements:
    """Test achievements progress endpoint."""
    
    def test_get_achievements_progress(self, client, auth_headers):
        """Test getting achievements progress."""
        response = client.get("/api/analytics/achievements", headers=auth_headers)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "total_achievements" in data
        assert "earned_count" in data
        assert "achievements" in data

