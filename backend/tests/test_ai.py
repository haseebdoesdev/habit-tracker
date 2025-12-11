"""
AI Tests
========
Tests for AI/Gemini integration endpoints.
Note: These tests may be limited due to external API dependencies.
"""

import pytest
from fastapi import status


class TestSuggestions:
    """Test AI suggestions endpoint."""
    
    def test_get_suggestions(self, client, auth_headers, test_habit):
        """Test getting AI habit suggestions."""
        response = client.get("/api/ai/suggestions", headers=auth_headers)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        # Should return a list of suggestions (may be fallback if AI unavailable)
        assert isinstance(data, list)
        if len(data) > 0:
            assert "title" in data[0]
            assert "description" in data[0]
    
    def test_get_suggestions_with_category(self, client, auth_headers):
        """Test getting suggestions filtered by category."""
        response = client.get(
            "/api/ai/suggestions?category=fitness",
            headers=auth_headers
        )
        assert response.status_code == status.HTTP_200_OK


class TestWeeklySummary:
    """Test AI weekly summary endpoint."""
    
    def test_get_weekly_summary(self, client, auth_headers, test_habit_with_logs):
        """Test getting AI weekly summary."""
        response = client.get("/api/ai/weekly-summary", headers=auth_headers)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        # Should have summary fields (may be fallback)
        assert "summary" in data or "insights" in data or "recommendations" in data


class TestMotivation:
    """Test motivation message endpoint."""
    
    def test_get_motivation(self, client, auth_headers):
        """Test getting motivational message."""
        response = client.get("/api/ai/motivation", headers=auth_headers)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "message" in data


class TestPatterns:
    """Test pattern analysis endpoint."""
    
    def test_get_patterns(self, client, auth_headers, test_habit_with_logs):
        """Test getting habit pattern analysis."""
        response = client.get("/api/ai/patterns", headers=auth_headers)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "patterns" in data


class TestHabitTips:
    """Test habit tips endpoint."""
    
    def test_get_habit_tips(self, client, auth_headers, test_habit):
        """Test getting tips for a specific habit."""
        response = client.get(
            f"/api/ai/tips/{test_habit.id}",
            headers=auth_headers
        )
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "habit_id" in data
        assert "tips" in data
    
    def test_get_tips_not_found(self, client, auth_headers):
        """Test tips for non-existent habit."""
        response = client.get("/api/ai/tips/99999", headers=auth_headers)
        assert response.status_code == status.HTTP_404_NOT_FOUND
    
    def test_get_tips_other_users_habit(self, client, auth_headers_user2, test_habit):
        """Test cannot get tips for another user's habit."""
        response = client.get(
            f"/api/ai/tips/{test_habit.id}",
            headers=auth_headers_user2
        )
        assert response.status_code == status.HTTP_404_NOT_FOUND


class TestChat:
    """Test AI chat endpoint."""
    
    def test_chat_with_ai(self, client, auth_headers):
        """Test chatting with AI."""
        response = client.post(
            "/api/ai/chat",
            headers=auth_headers,
            json={"message": "How can I stay motivated?"}
        )
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "response" in data
    
    def test_chat_empty_message(self, client, auth_headers):
        """Test chat with empty message."""
        response = client.post(
            "/api/ai/chat",
            headers=auth_headers,
            json={"message": ""}
        )
        # Pydantic validation fails for empty string (min_length=1)
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

