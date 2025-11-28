"""
Parties Router
==============
[HASEEB] This is your router to implement.

Defines party/guild API endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional

# TODO: Import dependencies
# TODO: Import party controller
# TODO: Import party schemas
# TODO: Import auth middleware


router = APIRouter(
    prefix="/parties",
    tags=["Parties/Guilds"]
)


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_party():
    """
    Create a new party.
    
    TODO: Add function signature with PartyCreate schema
    WHY: Accept party data
    
    TODO: Add auth dependency
    WHY: Creator becomes party leader
    
    TODO: Call party controller's create_party function
    WHY: Create party and add creator as leader
    
    TODO: Return created party
    WHY: Navigate to new party
    """
    return {"message": "Create party endpoint - to be implemented"}


@router.get("/")
async def get_parties():
    """
    Get parties (user's parties and optionally public ones).
    
    TODO: Add function signature with filters
    WHY: Filter public/my parties
    APPROACH: Add Query param for public_only
    
    TODO: Add auth dependency
    WHY: Get user's parties
    
    TODO: Call party controller's get_parties function
    WHY: Fetch party list
    
    TODO: Return party list
    WHY: Party browser/list
    """
    return {"message": "Get parties endpoint - to be implemented"}


@router.get("/leaderboard")
async def get_leaderboard():
    """
    Get global party leaderboard.
    
    TODO: Add function signature with limit param
    WHY: Control number of results
    APPROACH: Add Query param for limit (default 10)
    
    TODO: Call party controller's get_party_leaderboard function
    WHY: Get ranked parties
    
    TODO: Return leaderboard
    WHY: Competition display
    """
    return {"message": "Get leaderboard endpoint - to be implemented"}


@router.get("/{party_id}")
async def get_party(party_id: int):
    """
    Get specific party details.
    
    TODO: Add function signature
    WHY: Accept party ID
    
    TODO: Add auth dependency
    WHY: Check member access
    
    TODO: Call party controller's get_party_by_id function
    WHY: Fetch party with access check
    
    TODO: Return party details
    WHY: Party dashboard
    """
    return {"message": "Get party endpoint - to be implemented"}


@router.put("/{party_id}")
async def update_party(party_id: int):
    """
    Update party details.
    
    TODO: Add function signature with PartyUpdate schema
    WHY: Accept update data
    
    TODO: Add auth dependency
    WHY: Verify leader role
    SECURITY: Only leaders can update
    
    TODO: Call party controller's update_party function
    WHY: Apply updates
    
    TODO: Return updated party
    WHY: Confirm changes
    """
    return {"message": "Update party endpoint - to be implemented"}


@router.delete("/{party_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_party(party_id: int):
    """
    Delete or archive a party.
    
    TODO: Add function signature with auth
    WHY: Verify leader role
    SECURITY: Only leaders can delete
    
    TODO: Call party controller's delete_party function
    WHY: Remove or archive party
    
    TODO: Return no content
    WHY: Standard delete response
    """
    return None


@router.post("/join")
async def join_party():
    """
    Join a party using invite code.
    
    TODO: Add function signature with join request schema
    WHY: Accept invite code
    APPROACH: Create schema with invite_code field
    
    TODO: Add auth dependency
    WHY: Know who's joining
    
    TODO: Call party controller's join_party function
    WHY: Add user to party
    
    TODO: Return party details
    WHY: Navigate to joined party
    """
    return {"message": "Join party endpoint - to be implemented"}


@router.post("/{party_id}/leave")
async def leave_party(party_id: int):
    """
    Leave a party.
    
    TODO: Add function signature with auth
    WHY: Know who's leaving
    
    TODO: Call party controller's leave_party function
    WHY: Remove membership
    
    TODO: Return success
    WHY: Confirm left party
    """
    return {"message": "Leave party endpoint - to be implemented"}


@router.get("/{party_id}/members")
async def get_party_members(party_id: int):
    """
    Get list of party members.
    
    TODO: Add function signature with auth
    WHY: Verify member access
    
    TODO: Query party members
    WHY: Get member list
    
    TODO: Return member list
    WHY: Party members display
    """
    return {"message": "Get members endpoint - to be implemented"}


@router.post("/{party_id}/transfer-leadership")
async def transfer_leadership(party_id: int):
    """
    Transfer party leadership to another member.
    
    TODO: Add function signature with new leader ID
    WHY: Identify new leader
    
    TODO: Add auth dependency
    WHY: Verify current leader
    SECURITY: Only leader can transfer
    
    TODO: Call party controller's transfer_leadership function
    WHY: Update roles
    
    TODO: Return success
    WHY: Confirm transfer
    """
    return {"message": "Transfer leadership endpoint - to be implemented"}

