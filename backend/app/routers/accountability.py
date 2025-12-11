"""
Accountability Router
=====================
[OMAMAH] This is your router to implement.

Defines accountability partnership API endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.controllers import accountability_controller
from app.middleware.auth import get_current_active_user
from app.models.user import User

# Import schemas
from app.schemas.accountability import (
    PartnershipRequest,
    PartnershipResponse,
    PartnershipWithUser,
    PartnershipUpdate,
    PartnershipAction,
    PartnerComment,
    PartnerCommentResponse,
    PartnerHabitView
)

router = APIRouter(
    prefix="/accountability",
    tags=["Accountability Partners"]
)


@router.post("/request", status_code=status.HTTP_201_CREATED, response_model=PartnershipResponse)
async def request_partnership(
    request_data: PartnershipRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Send an accountability partnership request.
    """
    return await accountability_controller.request_partnership(
        request_data.partner_id,
        request_data.message,
        current_user,
        db
    )


@router.get("/partners", response_model=List[PartnershipWithUser])
async def get_partnerships(
    status: Optional[str] = Query(None, description="Filter by status (PENDING, ACTIVE, etc.)"),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get user's accountability partnerships.
    """
    return await accountability_controller.get_partnerships(
        current_user,
        db,
        status
    )


@router.post("/{partnership_id}/respond", response_model=PartnershipResponse)
async def respond_to_request(
    partnership_id: int,
    action_data: PartnershipAction,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Accept or decline a partnership request.
    """
    accept = action_data.action == "accept"
    return await accountability_controller.respond_to_request(
        partnership_id,
        accept,
        current_user,
        db
    )


@router.put("/{partnership_id}", response_model=PartnershipResponse)
async def update_partnership(
    partnership_id: int,
    settings: PartnershipUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Update partnership settings.
    """
    return await accountability_controller.update_partnership(
        partnership_id,
        settings,
        current_user,
        db
    )


@router.delete("/{partnership_id}", status_code=status.HTTP_204_NO_CONTENT)
async def end_partnership(
    partnership_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    End an accountability partnership.
    """
    await accountability_controller.end_partnership(
        partnership_id,
        current_user,
        db
    )
    return None


@router.get("/partner/{partner_id}/habits", response_model=PartnerHabitView)
async def get_partner_habits(
    partner_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    View partner's habits.
    """
    return await accountability_controller.get_partner_habits(
        partner_id,
        current_user,
        db
    )


@router.post("/comment", response_model=PartnerCommentResponse)
async def add_comment(
    comment_data: PartnerComment,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Add a comment on partner's habit.
    """
    return await accountability_controller.add_partner_comment(
        comment_data.habit_id,
        comment_data.log_id,
        comment_data.content,
        current_user,
        db
    )


@router.get("/comments/{habit_id}", response_model=List[PartnerCommentResponse])
async def get_comments(
    habit_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get comments on a habit.
    """
    return await accountability_controller.get_habit_comments(
        habit_id,
        current_user,
        db
    )


@router.get("/search", response_model=List[dict])
async def search_users(
    query: str = Query(..., min_length=3, description="Search by username or email"),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Search for users to partner with.
    """
    return await accountability_controller.search_users(
        query,
        current_user,
        db
    )