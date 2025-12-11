"""
Party Tests
===========
Tests for party/guild CRUD operations.
"""

import pytest
from fastapi import status


class TestCreateParty:
    """Test party creation endpoint."""
    
    def test_create_party_success(self, client, auth_headers):
        """Test successful party creation."""
        response = client.post("/api/parties/", headers=auth_headers, json={
            "name": "My New Party",
            "description": "A party for testing",
            "is_public": False,
            "max_members": 25
        })
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["party"]["name"] == "My New Party"
        assert "invite_code" in data["party"]
    
    def test_create_party_public(self, client, auth_headers):
        """Test creating a public party."""
        response = client.post("/api/parties/", headers=auth_headers, json={
            "name": "Public Party",
            "is_public": True
        })
        assert response.status_code == status.HTTP_201_CREATED
        assert response.json()["party"]["is_public"] == True
    
    def test_create_party_unauthorized(self, client):
        """Test party creation without auth fails."""
        response = client.post("/api/parties/", json={
            "name": "Test Party"
        })
        assert response.status_code == status.HTTP_403_FORBIDDEN


class TestGetParties:
    """Test party retrieval endpoints."""
    
    def test_get_user_parties(self, client, auth_headers, test_party):
        """Test getting user's parties."""
        response = client.get("/api/parties/", headers=auth_headers)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data) >= 1
        assert any(p["name"] == "Test Party" for p in data)
    
    def test_get_public_parties(self, client, auth_headers, db):
        """Test getting public parties."""
        from app.models.party import Party
        
        # Create a public party
        public_party = Party(
            name="Public Test",
            creator_id=1,
            invite_code="PUBTEST1",
            is_public=True,
            is_active=True
        )
        db.add(public_party)
        db.commit()
        
        response = client.get("/api/parties/?public_only=true", headers=auth_headers)
        assert response.status_code == status.HTTP_200_OK
    
    def test_get_single_party(self, client, auth_headers, test_party):
        """Test getting a single party."""
        response = client.get(f"/api/parties/{test_party.id}", headers=auth_headers)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["name"] == "Test Party"
        assert "invite_code" in data  # Member should see invite code
        assert "members" in data
    
    def test_get_party_not_found(self, client, auth_headers):
        """Test getting non-existent party."""
        response = client.get("/api/parties/99999", headers=auth_headers)
        assert response.status_code == status.HTTP_404_NOT_FOUND
    
    def test_get_private_party_not_member(self, client, auth_headers_user2, test_party):
        """Test non-member cannot access private party."""
        response = client.get(f"/api/parties/{test_party.id}", headers=auth_headers_user2)
        assert response.status_code == status.HTTP_403_FORBIDDEN


class TestUpdateParty:
    """Test party update endpoint."""
    
    def test_update_party_name(self, client, auth_headers, test_party):
        """Test updating party name as leader."""
        response = client.put(f"/api/parties/{test_party.id}", headers=auth_headers, json={
            "name": "Updated Party Name"
        })
        assert response.status_code == status.HTTP_200_OK
        assert response.json()["party"]["name"] == "Updated Party Name"
    
    def test_update_party_not_leader(self, client, auth_headers_user2, test_party, db):
        """Test non-leader cannot update party."""
        from app.models.party_member import PartyMember, PartyRole
        from app.models.user import User
        
        # Get user2 and add as regular member
        user2 = db.query(User).filter(User.email == "test2@example.com").first()
        if user2:
            membership = PartyMember(
                user_id=user2.id,
                party_id=test_party.id,
                role=PartyRole.MEMBER,
                is_active=True
            )
            db.add(membership)
            db.commit()
        
        response = client.put(f"/api/parties/{test_party.id}", headers=auth_headers_user2, json={
            "name": "Hacked Name"
        })
        assert response.status_code == status.HTTP_403_FORBIDDEN


class TestDeleteParty:
    """Test party deletion endpoint."""
    
    def test_delete_party(self, client, auth_headers, test_party):
        """Test deleting a party as leader."""
        response = client.delete(f"/api/parties/{test_party.id}", headers=auth_headers)
        assert response.status_code == status.HTTP_204_NO_CONTENT
    
    def test_delete_party_not_leader(self, client, auth_headers_user2, test_party):
        """Test non-leader cannot delete party."""
        response = client.delete(f"/api/parties/{test_party.id}", headers=auth_headers_user2)
        # User2 is not a member, so should be forbidden
        assert response.status_code in [status.HTTP_403_FORBIDDEN, status.HTTP_404_NOT_FOUND]


class TestJoinParty:
    """Test party join endpoint."""
    
    def test_join_party_success(self, client, auth_headers_user2, test_party):
        """Test joining a party with invite code."""
        response = client.post("/api/parties/join", headers=auth_headers_user2, json={
            "invite_code": "TESTCODE"
        })
        assert response.status_code == status.HTTP_200_OK
        assert "party_id" in response.json()
    
    def test_join_party_invalid_code(self, client, auth_headers_user2):
        """Test joining with invalid code fails."""
        response = client.post("/api/parties/join", headers=auth_headers_user2, json={
            "invite_code": "INVALID"
        })
        assert response.status_code == status.HTTP_404_NOT_FOUND
    
    def test_join_party_already_member(self, client, auth_headers, test_party):
        """Test joining a party user is already member of."""
        response = client.post("/api/parties/join", headers=auth_headers, json={
            "invite_code": "TESTCODE"
        })
        assert response.status_code == status.HTTP_400_BAD_REQUEST


class TestLeaveParty:
    """Test party leave endpoint."""
    
    def test_leave_party_as_member(self, client, auth_headers_user2, test_party, db):
        """Test leaving a party as regular member."""
        from app.models.party_member import PartyMember, PartyRole
        from app.models.user import User
        
        # First add user2 as member
        user2 = db.query(User).filter(User.email == "test2@example.com").first()
        if user2:
            membership = PartyMember(
                user_id=user2.id,
                party_id=test_party.id,
                role=PartyRole.MEMBER,
                is_active=True
            )
            db.add(membership)
            db.commit()
        
        response = client.post(f"/api/parties/{test_party.id}/leave", headers=auth_headers_user2)
        assert response.status_code == status.HTTP_200_OK
    
    def test_leave_party_as_leader_with_members(self, client, auth_headers, test_party, test_user2, db):
        """Test leader cannot leave without transferring leadership."""
        from app.models.party_member import PartyMember, PartyRole
        
        # Add another member
        membership = PartyMember(
            user_id=test_user2.id,
            party_id=test_party.id,
            role=PartyRole.MEMBER,
            is_active=True
        )
        db.add(membership)
        db.commit()
        
        response = client.post(f"/api/parties/{test_party.id}/leave", headers=auth_headers)
        assert response.status_code == status.HTTP_400_BAD_REQUEST


class TestPartyMembers:
    """Test party members endpoint."""
    
    def test_get_party_members(self, client, auth_headers, test_party):
        """Test getting party member list."""
        response = client.get(f"/api/parties/{test_party.id}/members", headers=auth_headers)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data) >= 1
        assert any(m["role"] == "LEADER" for m in data)
    
    def test_get_members_not_member(self, client, auth_headers_user2, test_party):
        """Test non-member cannot get member list."""
        response = client.get(f"/api/parties/{test_party.id}/members", headers=auth_headers_user2)
        assert response.status_code == status.HTTP_403_FORBIDDEN


class TestLeaderboard:
    """Test party leaderboard endpoint."""
    
    def test_get_leaderboard(self, client, auth_headers, test_party):
        """Test getting party leaderboard."""
        response = client.get("/api/parties/leaderboard", headers=auth_headers)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert isinstance(data, list)
        if len(data) > 0:
            assert "rank" in data[0]
            assert "party_name" in data[0]
            assert "total_points" in data[0]


class TestTransferLeadership:
    """Test leadership transfer endpoint."""
    
    def test_transfer_leadership(self, client, auth_headers, test_party, test_user2, db):
        """Test transferring party leadership."""
        from app.models.party_member import PartyMember, PartyRole
        
        # Add user2 as member first
        membership = PartyMember(
            user_id=test_user2.id,
            party_id=test_party.id,
            role=PartyRole.MEMBER,
            is_active=True
        )
        db.add(membership)
        db.commit()
        
        response = client.post(
            f"/api/parties/{test_party.id}/transfer-leadership",
            headers=auth_headers,
            json={"new_leader_id": test_user2.id}
        )
        assert response.status_code == status.HTTP_200_OK
        assert response.json()["new_leader_id"] == test_user2.id

