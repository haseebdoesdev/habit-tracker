"""
Party Goal Tests
================
Tests for party goal CRUD operations.
"""

import pytest
from fastapi import status


class TestCreateGoal:
    """Test party goal creation endpoint."""
    
    def test_create_goal_success(self, client, auth_headers, test_party):
        """Test successful goal creation."""
        response = client.post("/api/party-goals/", headers=auth_headers, json={
            "party_id": test_party.id,
            "title": "Complete 50 workouts",
            "description": "Team fitness challenge",
            "target_value": 50,
            "reward_points": 100
        })
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["goal"]["title"] == "Complete 50 workouts"
        assert data["goal"]["target_value"] == 50
    
    def test_create_goal_not_member(self, client, auth_headers_user2, test_party):
        """Test non-member cannot create goal."""
        response = client.post("/api/party-goals/", headers=auth_headers_user2, json={
            "party_id": test_party.id,
            "title": "Test Goal",
            "target_value": 10
        })
        assert response.status_code == status.HTTP_403_FORBIDDEN


class TestGetGoals:
    """Test party goal retrieval endpoints."""
    
    def test_get_party_goals(self, client, auth_headers, test_party, test_party_goal):
        """Test getting goals for a party."""
        response = client.get(
            f"/api/party-goals/party/{test_party.id}",
            headers=auth_headers
        )
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data) >= 1
        assert any(g["title"] == "Complete 100 workouts" for g in data)
    
    def test_get_goals_filter_status(self, client, auth_headers, test_party, test_party_goal):
        """Test filtering goals by status."""
        response = client.get(
            f"/api/party-goals/party/{test_party.id}?status_filter=ACTIVE",
            headers=auth_headers
        )
        assert response.status_code == status.HTTP_200_OK
    
    def test_get_single_goal(self, client, auth_headers, test_party_goal):
        """Test getting a single goal."""
        response = client.get(
            f"/api/party-goals/{test_party_goal.id}",
            headers=auth_headers
        )
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["title"] == "Complete 100 workouts"
        assert "progress_percentage" in data
    
    def test_get_goals_not_member(self, client, auth_headers_user2, test_party):
        """Test non-member cannot view party goals."""
        response = client.get(
            f"/api/party-goals/party/{test_party.id}",
            headers=auth_headers_user2
        )
        assert response.status_code == status.HTTP_403_FORBIDDEN


class TestUpdateGoal:
    """Test party goal update endpoint."""
    
    def test_update_goal_title(self, client, auth_headers, test_party_goal):
        """Test updating goal title."""
        response = client.put(
            f"/api/party-goals/{test_party_goal.id}",
            headers=auth_headers,
            json={"title": "Updated Goal Title"}
        )
        assert response.status_code == status.HTTP_200_OK
        assert response.json()["goal"]["title"] == "Updated Goal Title"
    
    def test_update_goal_target(self, client, auth_headers, test_party_goal):
        """Test updating goal target."""
        response = client.put(
            f"/api/party-goals/{test_party_goal.id}",
            headers=auth_headers,
            json={"target_value": 200}
        )
        assert response.status_code == status.HTTP_200_OK
        assert response.json()["goal"]["target_value"] == 200
    
    def test_update_goal_status(self, client, auth_headers, test_party_goal):
        """Test updating goal status."""
        response = client.put(
            f"/api/party-goals/{test_party_goal.id}",
            headers=auth_headers,
            json={"status": "COMPLETED"}
        )
        assert response.status_code == status.HTTP_200_OK


class TestDeleteGoal:
    """Test party goal deletion endpoint."""
    
    def test_delete_goal(self, client, auth_headers, test_party_goal):
        """Test deleting a goal (soft delete to CANCELLED)."""
        response = client.delete(
            f"/api/party-goals/{test_party_goal.id}",
            headers=auth_headers
        )
        assert response.status_code == status.HTTP_204_NO_CONTENT


class TestContribute:
    """Test goal contribution endpoint."""
    
    def test_contribute_to_goal(self, client, auth_headers, test_party_goal):
        """Test contributing to a goal."""
        initial_value = test_party_goal.current_value
        
        response = client.post(
            f"/api/party-goals/{test_party_goal.id}/contribute",
            headers=auth_headers,
            json={"increment": 5}
        )
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["current_value"] == initial_value + 5
        assert "progress_percentage" in data
    
    def test_contribute_completes_goal(self, client, auth_headers, test_party, db):
        """Test that contributing enough completes the goal."""
        from app.models.party_goal import PartyGoal, GoalStatus
        
        # Create a goal close to completion
        goal = PartyGoal(
            party_id=test_party.id,
            created_by_id=1,
            title="Almost Done",
            target_value=10,
            current_value=9,
            status=GoalStatus.ACTIVE,
            reward_points=100
        )
        db.add(goal)
        db.commit()
        db.refresh(goal)
        
        response = client.post(
            f"/api/party-goals/{goal.id}/contribute",
            headers=auth_headers,
            json={"increment": 1}
        )
        assert response.status_code == status.HTTP_200_OK
        assert response.json()["is_completed"] == True
        assert response.json()["status"] == "COMPLETED"
    
    def test_contribute_not_member(self, client, auth_headers_user2, test_party_goal):
        """Test non-member cannot contribute."""
        response = client.post(
            f"/api/party-goals/{test_party_goal.id}/contribute",
            headers=auth_headers_user2,
            json={"increment": 1}
        )
        assert response.status_code == status.HTTP_403_FORBIDDEN


class TestContributors:
    """Test goal contributors endpoint."""
    
    def test_get_contributors(self, client, auth_headers, test_party_goal):
        """Test getting goal contributors."""
        # First make a contribution
        client.post(
            f"/api/party-goals/{test_party_goal.id}/contribute",
            headers=auth_headers,
            json={"increment": 5}
        )
        
        response = client.get(
            f"/api/party-goals/{test_party_goal.id}/contributors",
            headers=auth_headers
        )
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert isinstance(data, list)

