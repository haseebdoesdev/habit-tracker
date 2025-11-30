"""
Parties Router
==============
[HASEEB] This is your router to implement.

Defines party/guild API endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query, Body
from sqlalchemy.orm import Session
from typing import Optional, List
from pydantic import BaseModel

from app.database import get_db
from app.controllers import party_controller
from app.middleware.auth import get_current_active_user
from app.models.user import User
from app.models.party_member import PartyMember, PartyRole


router = APIRouter(
    prefix="/parties",
    tags=["Parties/Guilds"]
)


class PartyCreateRequest(BaseModel):
    name: str
    description: Optional[str] = None
    is_public: bool = False
    max_members: int = 50
    avatar_url: Optional[str] = None


class PartyUpdateRequest(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    is_public: Optional[bool] = None
    max_members: Optional[int] = None
    avatar_url: Optional[str] = None


class JoinPartyRequest(BaseModel):
    invite_code: str


class TransferLeadershipRequest(BaseModel):
    new_leader_id: int


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_party(
    party_data: PartyCreateRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Create a new party.
    """
    return await party_controller.create_party(party_data, current_user, db)


@router.get("/")
async def get_parties(
    public_only: bool = Query(False, description="Only show public parties"),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get parties (user's parties and optionally public ones).
    """
    return await party_controller.get_parties(current_user, db, public_only)


@router.get("/leaderboard")
async def get_leaderboard(
    limit: int = Query(10, ge=1, le=100, description="Number of parties to return"),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get global party leaderboard.
    """
    return await party_controller.get_party_leaderboard(current_user, db, limit)


@router.get("/{party_id}")
async def get_party(
    party_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get specific party details.
    """
    return await party_controller.get_party_by_id(party_id, current_user, db)


@router.put("/{party_id}")
async def update_party(
    party_id: int,
    party_data: PartyUpdateRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Update party details.
    """
    return await party_controller.update_party(party_id, party_data, current_user, db)


@router.delete("/{party_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_party(
    party_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Delete or archive a party.
    """
    await party_controller.delete_party(party_id, current_user, db)
    return None


@router.post("/join")
async def join_party(
    join_data: JoinPartyRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Join a party using invite code.
    """
    return await party_controller.join_party(join_data.invite_code, current_user, db)


@router.post("/{party_id}/leave")
async def leave_party(
    party_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Leave a party.
    """
    return await party_controller.leave_party(party_id, current_user, db)


@router.get("/{party_id}/members")
async def get_party_members(
    party_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get list of party members.
    """
    # Verify user is a member
    membership = db.query(PartyMember).filter(
        PartyMember.party_id == party_id,
        PartyMember.user_id == current_user.id,
        PartyMember.is_active == True
    ).first()
    
    if not membership:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not a member of this party"
        )
    
    # Get all members
    members = db.query(PartyMember).filter(
        PartyMember.party_id == party_id,
        PartyMember.is_active == True
    ).all()
    
    result = []
    for member in members:
        user = db.query(User).filter(User.id == member.user_id).first()
        if user:
            result.append({
                "id": member.id,
                "user_id": member.user_id,
                "username": user.username,
                "avatar_url": user.avatar_url,
                "role": member.role.value if member.role else None,
                "contribution_points": member.contribution_points,
                "joined_at": member.joined_at
            })
    
    return result


@router.post("/{party_id}/transfer-leadership")
async def transfer_leadership(
    party_id: int,
    transfer_data: TransferLeadershipRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Transfer party leadership to another member.
    """
    return await party_controller.transfer_leadership(
        party_id, transfer_data.new_leader_id, current_user, db
    )
