"""
Accountability Tests
====================
Tests for accountability partnership endpoints.
"""

import pytest
from fastapi import status


class TestRequestPartnership:
    """Test partnership request endpoint."""
    
    def test_request_partnership_success(self, client, auth_headers, test_user2):
        """Test successful partnership request."""
        response = client.post("/api/accountability/request", headers=auth_headers, json={
            "partner_id": test_user2.id,
            "message": "Let's be accountability partners!"
        })
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["partner_id"] == test_user2.id
        assert data["status"] == "pending"
    
    def test_request_partnership_self(self, client, auth_headers, test_user):
        """Test cannot request partnership with self."""
        response = client.post("/api/accountability/request", headers=auth_headers, json={
            "partner_id": test_user.id
        })
        assert response.status_code == status.HTTP_400_BAD_REQUEST
    
    def test_request_partnership_nonexistent_user(self, client, auth_headers):
        """Test cannot request partnership with non-existent user."""
        response = client.post("/api/accountability/request", headers=auth_headers, json={
            "partner_id": 99999
        })
        assert response.status_code == status.HTTP_404_NOT_FOUND
    
    def test_request_duplicate_partnership(self, client, auth_headers, test_partnership, test_user2):
        """Test cannot create duplicate partnership."""
        response = client.post("/api/accountability/request", headers=auth_headers, json={
            "partner_id": test_user2.id
        })
        assert response.status_code == status.HTTP_400_BAD_REQUEST


class TestGetPartnerships:
    """Test partnership retrieval endpoint."""
    
    def test_get_partnerships(self, client, auth_headers, test_partnership):
        """Test getting user's partnerships."""
        response = client.get("/api/accountability/partners", headers=auth_headers)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data) >= 1
        assert "partner_username" in data[0]
    
    def test_get_partnerships_filter_status(self, client, auth_headers, test_partnership):
        """Test filtering partnerships by status."""
        response = client.get(
            "/api/accountability/partners?status=active",
            headers=auth_headers
        )
        assert response.status_code == status.HTTP_200_OK


class TestRespondToRequest:
    """Test partnership response endpoint."""
    
    def test_accept_partnership(self, client, auth_headers_user2, test_user, db):
        """Test accepting a partnership request."""
        from app.models.accountability import AccountabilityPartnership, PartnershipStatus
        from app.models.user import User
        
        # Get user2
        user2 = db.query(User).filter(User.email == "test2@example.com").first()
        
        # Create a pending partnership
        partnership = AccountabilityPartnership(
            requester_id=test_user.id,
            partner_id=user2.id,
            status=PartnershipStatus.PENDING
        )
        db.add(partnership)
        db.commit()
        db.refresh(partnership)
        
        response = client.post(
            f"/api/accountability/{partnership.id}/respond",
            headers=auth_headers_user2,
            json={"action": "accept"}
        )
        assert response.status_code == status.HTTP_200_OK
        assert response.json()["status"] == "active"
    
    def test_decline_partnership(self, client, auth_headers_user2, test_user, db):
        """Test declining a partnership request."""
        from app.models.accountability import AccountabilityPartnership, PartnershipStatus
        from app.models.user import User
        
        user2 = db.query(User).filter(User.email == "test2@example.com").first()
        
        partnership = AccountabilityPartnership(
            requester_id=test_user.id,
            partner_id=user2.id,
            status=PartnershipStatus.PENDING
        )
        db.add(partnership)
        db.commit()
        db.refresh(partnership)
        
        response = client.post(
            f"/api/accountability/{partnership.id}/respond",
            headers=auth_headers_user2,
            json={"action": "decline"}
        )
        assert response.status_code == status.HTTP_200_OK
        assert response.json()["status"] == "declined"
    
    def test_respond_not_recipient(self, client, auth_headers, test_user2, db):
        """Test requester cannot respond to own request."""
        from app.models.accountability import AccountabilityPartnership, PartnershipStatus
        
        partnership = AccountabilityPartnership(
            requester_id=1,  # test_user
            partner_id=test_user2.id,
            status=PartnershipStatus.PENDING
        )
        db.add(partnership)
        db.commit()
        db.refresh(partnership)
        
        # Try to respond as requester (should fail)
        response = client.post(
            f"/api/accountability/{partnership.id}/respond",
            headers=auth_headers,  # test_user (requester)
            json={"action": "accept"}
        )
        assert response.status_code == status.HTTP_403_FORBIDDEN


class TestUpdatePartnership:
    """Test partnership update endpoint."""
    
    def test_update_partnership_permissions(self, client, auth_headers, test_partnership):
        """Test updating partnership permissions."""
        response = client.put(
            f"/api/accountability/{test_partnership.id}",
            headers=auth_headers,
            json={
                "can_view_all_habits": False,
                "can_comment": True
            }
        )
        assert response.status_code == status.HTTP_200_OK


class TestEndPartnership:
    """Test partnership ending endpoint."""
    
    def test_end_partnership(self, client, auth_headers, test_partnership):
        """Test ending a partnership."""
        response = client.delete(
            f"/api/accountability/{test_partnership.id}",
            headers=auth_headers
        )
        assert response.status_code == status.HTTP_204_NO_CONTENT


class TestPartnerHabits:
    """Test viewing partner's habits."""
    
    def test_get_partner_habits(self, client, auth_headers, test_partnership, test_user2, db):
        """Test viewing partner's habits with active partnership."""
        from app.models.habit import Habit, HabitFrequency, HabitCategory
        
        # Create a habit for partner
        habit = Habit(
            user_id=test_user2.id,
            title="Partner Habit",
            frequency=HabitFrequency.DAILY,
            category=HabitCategory.HEALTH,
            is_active=True
        )
        db.add(habit)
        db.commit()
        
        response = client.get(
            f"/api/accountability/partner/{test_user2.id}/habits",
            headers=auth_headers
        )
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "habits" in data
        assert "partner_username" in data
    
    def test_get_partner_habits_no_partnership(self, client, auth_headers, test_user2):
        """Test cannot view habits without partnership."""
        # Note: test_partnership fixture must NOT be used for this test
        response = client.get(
            f"/api/accountability/partner/{test_user2.id}/habits",
            headers=auth_headers
        )
        assert response.status_code == status.HTTP_403_FORBIDDEN


class TestSearchUsers:
    """Test user search endpoint."""
    
    def test_search_users(self, client, auth_headers, test_user2):
        """Test searching for users."""
        response = client.get(
            "/api/accountability/search?query=testuser2",
            headers=auth_headers
        )
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert isinstance(data, list)
        if len(data) > 0:
            assert "username" in data[0]
    
    def test_search_users_short_query(self, client, auth_headers):
        """Test search with too short query."""
        response = client.get(
            "/api/accountability/search?query=ab",
            headers=auth_headers
        )
        # Should return validation error or empty results
        assert response.status_code in [status.HTTP_200_OK, status.HTTP_422_UNPROCESSABLE_ENTITY]

