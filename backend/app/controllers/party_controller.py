"""
Party Controller
================
[HASEEB] This is your controller to implement.

Handles party/guild CRUD and management.
"""

from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import Optional, List
import secrets

from app.models.party import Party
from app.models.party_member import PartyMember, PartyRole
from app.models.user import User
from app.schemas.party import PartyCreate, PartyResponse, PartyMemberResponse
from app.schemas.user import UserResponse


def generate_invite_code(length: int = 8) -> str:
    """Generate a random invite code."""
    return secrets.token_urlsafe(length)[:length].upper()


async def create_party(party_data, current_user, db: Session):
    """
    Create a new party.
    """
    # Generate unique invite code
    invite_code = generate_invite_code()
    
    # Ensure invite code is unique
    while db.query(Party).filter(Party.invite_code == invite_code).first():
        invite_code = generate_invite_code()
    
    # Create Party model instance
    new_party = Party(
        name=party_data.name,
        description=getattr(party_data, 'description', None),
        creator_id=current_user.id,
        invite_code=invite_code,
        is_public=getattr(party_data, 'is_public', False),
        max_members=getattr(party_data, 'max_members', 50),
        avatar_url=getattr(party_data, 'avatar_url', None),
        total_points=0,
        is_active=True
    )
    
    # Add party to database
    db.add(new_party)
    db.flush()  # Get the party ID without committing
    
    # Create PartyMember for creator as leader
    creator_membership = PartyMember(
        user_id=current_user.id,
        party_id=new_party.id,
        role=PartyRole.LEADER,
        contribution_points=0,
        is_active=True
    )
    db.add(creator_membership)
    
    # Commit and refresh
    db.commit()
    db.refresh(new_party)
    
    return {
        "message": "Party created successfully",
        "party": {
            "id": new_party.id,
            "name": new_party.name,
            "description": new_party.description,
            "invite_code": new_party.invite_code,
            "is_public": new_party.is_public,
            "max_members": new_party.max_members,
            "total_points": new_party.total_points,
            "creator_id": new_party.creator_id,
            "is_active": new_party.is_active,
            "created_at": new_party.created_at
        }
    }


async def get_parties(current_user, db: Session, public_only: bool = False):
    """
    Get list of parties.
    """
    if public_only:
        # Get public parties
        parties = db.query(Party).filter(
            Party.is_public == True,
            Party.is_active == True
        ).all()
    else:
        # Get parties user is a member of
        user_party_ids = db.query(PartyMember.party_id).filter(
            PartyMember.user_id == current_user.id,
            PartyMember.is_active == True
        ).subquery()
        
        parties = db.query(Party).filter(
            Party.id.in_(user_party_ids),
            Party.is_active == True
        ).all()
    
    # Build response with member counts
    result = []
    for party in parties:
        member_count = db.query(PartyMember).filter(
            PartyMember.party_id == party.id,
            PartyMember.is_active == True
        ).count()
        
        result.append({
            "id": party.id,
            "name": party.name,
            "description": party.description,
            "is_public": party.is_public,
            "max_members": party.max_members,
            "total_points": party.total_points,
            "member_count": member_count,
            "avatar_url": party.avatar_url,
            "created_at": party.created_at
        })
    
    return result


async def get_party_by_id(party_id: int, current_user, db: Session):
    """
    Get specific party details.
    """
    # Query party by ID
    party = db.query(Party).filter(Party.id == party_id).first()
    
    # Verify party exists
    if not party:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Party not found"
        )
    
    # Check if user is a member
    membership = db.query(PartyMember).filter(
        PartyMember.party_id == party_id,
        PartyMember.user_id == current_user.id,
        PartyMember.is_active == True
    ).first()
    
    is_member = membership is not None
    
    # Non-members can only see public party basic info
    if not is_member and not party.is_public:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have access to this party"
        )
    
    # Get member count
    member_count = db.query(PartyMember).filter(
        PartyMember.party_id == party_id,
        PartyMember.is_active == True
    ).count()
    
    response = {
        "id": party.id,
        "name": party.name,
        "description": party.description,
        "is_public": party.is_public,
        "max_members": party.max_members,
        "total_points": party.total_points,
        "member_count": member_count,
        "avatar_url": party.avatar_url,
        "creator_id": party.creator_id,
        "is_active": party.is_active,
        "created_at": party.created_at
    }
    
    # Include invite code and member list if user is a member
    if is_member:
        response["invite_code"] = party.invite_code
        response["user_role"] = membership.role.value if membership.role else None
        
        # Get member list
        members = db.query(PartyMember).filter(
            PartyMember.party_id == party_id,
            PartyMember.is_active == True
        ).all()
        
        member_list = []
        for member in members:
            user = db.query(User).filter(User.id == member.user_id).first()
            if user:
                member_list.append({
                    "id": member.id,
                    "user_id": member.user_id,
                    "username": user.username,
                    "avatar_url": user.avatar_url,
                    "role": member.role.value if member.role else None,
                    "contribution_points": member.contribution_points,
                    "joined_at": member.joined_at
                })
        
        response["members"] = member_list
    
    return response


async def update_party(party_id: int, party_data, current_user, db: Session):
    """
    Update party details.
    """
    # Get the party
    party = db.query(Party).filter(Party.id == party_id).first()
    
    if not party:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Party not found"
        )
    
    # Verify user is party leader
    membership = db.query(PartyMember).filter(
        PartyMember.party_id == party_id,
        PartyMember.user_id == current_user.id,
        PartyMember.is_active == True
    ).first()
    
    if not membership or membership.role != PartyRole.LEADER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only party leaders can update party details"
        )
    
    # Update provided fields
    if hasattr(party_data, 'name') and party_data.name is not None:
        party.name = party_data.name
    if hasattr(party_data, 'description') and party_data.description is not None:
        party.description = party_data.description
    if hasattr(party_data, 'is_public') and party_data.is_public is not None:
        party.is_public = party_data.is_public
    if hasattr(party_data, 'max_members') and party_data.max_members is not None:
        party.max_members = party_data.max_members
    if hasattr(party_data, 'avatar_url') and party_data.avatar_url is not None:
        party.avatar_url = party_data.avatar_url
    
    # Commit and return
    db.commit()
    db.refresh(party)
    
    return {
        "message": "Party updated successfully",
        "party": {
            "id": party.id,
            "name": party.name,
            "description": party.description,
            "invite_code": party.invite_code,
            "is_public": party.is_public,
            "max_members": party.max_members,
            "total_points": party.total_points,
            "avatar_url": party.avatar_url,
            "is_active": party.is_active
        }
    }


async def delete_party(party_id: int, current_user, db: Session):
    """
    Delete or archive a party.
    """
    # Get the party
    party = db.query(Party).filter(Party.id == party_id).first()
    
    if not party:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Party not found"
        )
    
    # Verify user is party leader
    membership = db.query(PartyMember).filter(
        PartyMember.party_id == party_id,
        PartyMember.user_id == current_user.id,
        PartyMember.is_active == True
    ).first()
    
    if not membership or membership.role != PartyRole.LEADER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only party leaders can delete the party"
        )
    
    # Soft delete (archive) - set is_active to False
    party.is_active = False
    
    # Deactivate all memberships
    db.query(PartyMember).filter(
        PartyMember.party_id == party_id
    ).update({"is_active": False})
    
    db.commit()
    
    return {"message": "Party deleted successfully"}


async def join_party(invite_code: str, current_user, db: Session):
    """
    Join a party using invite code.
    """
    # Find party by invite code
    party = db.query(Party).filter(
        Party.invite_code == invite_code,
        Party.is_active == True
    ).first()
    
    # Verify party exists
    if not party:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invalid invite code or party not found"
        )
    
    # Check if user is already a member
    existing_membership = db.query(PartyMember).filter(
        PartyMember.party_id == party.id,
        PartyMember.user_id == current_user.id
    ).first()
    
    if existing_membership:
        if existing_membership.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="You are already a member of this party"
            )
        else:
            # Reactivate membership
            existing_membership.is_active = True
            db.commit()
            db.refresh(existing_membership)
            return {
                "message": "Rejoined party successfully",
                "party_id": party.id,
                "party_name": party.name
            }
    
    # Check party isn't full
    member_count = db.query(PartyMember).filter(
        PartyMember.party_id == party.id,
        PartyMember.is_active == True
    ).count()
    
    if party.max_members and member_count >= party.max_members:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Party is full"
        )
    
    # Create PartyMember record
    new_membership = PartyMember(
        user_id=current_user.id,
        party_id=party.id,
        role=PartyRole.MEMBER,
        contribution_points=0,
        is_active=True
    )
    db.add(new_membership)
    db.commit()
    
    return {
        "message": "Joined party successfully",
        "party_id": party.id,
        "party_name": party.name
    }


async def leave_party(party_id: int, current_user, db: Session):
    """
    Leave a party.
    """
    # Find membership record
    membership = db.query(PartyMember).filter(
        PartyMember.party_id == party_id,
        PartyMember.user_id == current_user.id,
        PartyMember.is_active == True
    ).first()
    
    if not membership:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="You are not a member of this party"
        )
    
    # Check if user is the leader
    if membership.role == PartyRole.LEADER:
        # Count other active members
        other_members_count = db.query(PartyMember).filter(
            PartyMember.party_id == party_id,
            PartyMember.user_id != current_user.id,
            PartyMember.is_active == True
        ).count()
        
        if other_members_count == 0:
            # Last member - archive the party
            party = db.query(Party).filter(Party.id == party_id).first()
            if party:
                party.is_active = False
            membership.is_active = False
            db.commit()
            return {"message": "Left party and party has been archived (no remaining members)"}
        else:
            # Leader must transfer leadership first
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="You must transfer leadership before leaving the party"
            )
    
    # Deactivate membership
    membership.is_active = False
    db.commit()
    
    return {"message": "Left party successfully"}


async def get_party_leaderboard(current_user, db: Session, limit: int = 10):
    """
    Get global party leaderboard.
    """
    # Query parties ordered by total_points
    parties = db.query(Party).filter(
        Party.is_active == True
    ).order_by(Party.total_points.desc()).limit(limit).all()
    
    leaderboard = []
    for rank, party in enumerate(parties, 1):
        member_count = db.query(PartyMember).filter(
            PartyMember.party_id == party.id,
            PartyMember.is_active == True
        ).count()
        
        leaderboard.append({
            "rank": rank,
            "party_id": party.id,
            "party_name": party.name,
            "total_points": party.total_points,
            "member_count": member_count,
            "avatar_url": party.avatar_url
        })
    
    return leaderboard


async def transfer_leadership(party_id: int, new_leader_id: int,
                               current_user, db: Session):
    """
    Transfer party leadership to another member.
    """
    # Verify current user is leader
    current_membership = db.query(PartyMember).filter(
        PartyMember.party_id == party_id,
        PartyMember.user_id == current_user.id,
        PartyMember.is_active == True
    ).first()
    
    if not current_membership or current_membership.role != PartyRole.LEADER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the party leader can transfer leadership"
        )
    
    # Verify new leader is a party member
    new_leader_membership = db.query(PartyMember).filter(
        PartyMember.party_id == party_id,
        PartyMember.user_id == new_leader_id,
        PartyMember.is_active == True
    ).first()
    
    if not new_leader_membership:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User is not a member of this party"
        )
    
    if new_leader_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You are already the leader"
        )
    
    # Update roles - swap leader role
    current_membership.role = PartyRole.MEMBER
    new_leader_membership.role = PartyRole.LEADER
    
    db.commit()
    
    # Get new leader username for response
    new_leader_user = db.query(User).filter(User.id == new_leader_id).first()
    
    return {
        "message": "Leadership transferred successfully",
        "new_leader_id": new_leader_id,
        "new_leader_username": new_leader_user.username if new_leader_user else None
    }
