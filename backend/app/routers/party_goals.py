"""
Party Goals Router
==================
[NOUMAN] This is your router to implement.

Defines party goal API endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime

from app.database import get_db
from app.middleware.auth import get_current_active_user
from app.models.user import User
from app.models.party import Party
from app.models.party_member import PartyMember, PartyRole
from app.models.party_goal import PartyGoal, GoalStatus
from app.utils.party_utils import is_party_member, can_create_party_goal


router = APIRouter(
    prefix="/party-goals",
    tags=["Party Goals"]
)


class PartyGoalCreateRequest(BaseModel):
    party_id: int
    title: str
    description: Optional[str] = None
    target_value: int
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    reward_points: int = 0
    habit_category: Optional[str] = None


class PartyGoalUpdateRequest(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    target_value: Optional[int] = None
    end_date: Optional[datetime] = None
    status: Optional[str] = None


class ContributionRequest(BaseModel):
    increment: int = 1


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_goal(
    goal_data: PartyGoalCreateRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Create a new goal for a party.
    """
    # Verify user can create goals in this party
    if not can_create_party_goal(current_user.id, goal_data.party_id, db):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to create goals in this party"
        )
    
    new_goal = PartyGoal(
        party_id=goal_data.party_id,
        created_by_id=current_user.id,
        title=goal_data.title,
        description=goal_data.description,
        target_value=goal_data.target_value,
        current_value=0,
        status=GoalStatus.ACTIVE,
        start_date=goal_data.start_date or datetime.utcnow(),
        reward_points=goal_data.reward_points,
        habit_category=goal_data.habit_category
    )
    
    db.add(new_goal)
    db.commit()
    db.refresh(new_goal)
    
    return {
        "message": "Goal created successfully",
        "goal": {
            "id": new_goal.id,
            "party_id": new_goal.party_id,
            "title": new_goal.title,
            "description": new_goal.description,
            "target_value": new_goal.target_value,
            "current_value": new_goal.current_value,
            "status": new_goal.status.value,
            "reward_points": new_goal.reward_points,
            "created_at": new_goal.created_at
        }
    }


@router.get("/party/{party_id}")
async def get_party_goals(
    party_id: int,
    status_filter: Optional[str] = Query(None, description="Filter by status (ACTIVE, COMPLETED, etc.)"),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get goals for a specific party.
    """
    # Verify user is a member
    if not is_party_member(current_user.id, party_id, db):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not a member of this party"
        )
    
    query = db.query(PartyGoal).filter(PartyGoal.party_id == party_id)
    
    if status_filter:
        try:
            goal_status = GoalStatus(status_filter)
            query = query.filter(PartyGoal.status == goal_status)
        except ValueError:
            pass  # Ignore invalid status filter
    
    goals = query.order_by(PartyGoal.created_at.desc()).all()
    
    result = []
    for goal in goals:
        progress_percentage = (goal.current_value / goal.target_value * 100) if goal.target_value > 0 else 0
        result.append({
            "id": goal.id,
            "party_id": goal.party_id,
            "created_by_id": goal.created_by_id,
            "title": goal.title,
            "description": goal.description,
            "target_value": goal.target_value,
            "current_value": goal.current_value,
            "status": goal.status.value,
            "start_date": goal.start_date,
            "reward_points": goal.reward_points,
            "habit_category": goal.habit_category,
            "progress_percentage": progress_percentage,
            "created_at": goal.created_at
        })
    
    return result


@router.get("/{goal_id}")
async def get_goal(
    goal_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get specific goal details.
    """
    goal = db.query(PartyGoal).filter(PartyGoal.id == goal_id).first()
    
    if not goal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Goal not found"
        )
    
    # Verify user is a member of the party
    if not is_party_member(current_user.id, goal.party_id, db):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not a member of this party"
        )
    
    progress_percentage = (goal.current_value / goal.target_value * 100) if goal.target_value > 0 else 0
    
    return {
        "id": goal.id,
        "party_id": goal.party_id,
        "created_by_id": goal.created_by_id,
        "title": goal.title,
        "description": goal.description,
        "target_value": goal.target_value,
        "current_value": goal.current_value,
        "status": goal.status.value,
        "start_date": goal.start_date,
        "reward_points": goal.reward_points,
        "habit_category": goal.habit_category,
        "progress_percentage": progress_percentage,
        "created_at": goal.created_at
    }


@router.put("/{goal_id}")
async def update_goal(
    goal_id: int,
    goal_data: PartyGoalUpdateRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Update a party goal.
    """
    goal = db.query(PartyGoal).filter(PartyGoal.id == goal_id).first()
    
    if not goal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Goal not found"
        )
    
    # Only creator or party leader can update
    if goal.created_by_id != current_user.id:
        membership = db.query(PartyMember).filter(
            PartyMember.party_id == goal.party_id,
            PartyMember.user_id == current_user.id,
            PartyMember.is_active == True
        ).first()
        
        if not membership or membership.role != PartyRole.LEADER:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only the goal creator or party leader can update this goal"
            )
    
    # Update fields
    if goal_data.title is not None:
        goal.title = goal_data.title
    if goal_data.description is not None:
        goal.description = goal_data.description
    if goal_data.target_value is not None:
        goal.target_value = goal_data.target_value
    if goal_data.end_date is not None:
        goal.end_date = goal_data.end_date
    if goal_data.status is not None:
        try:
            goal.status = GoalStatus(goal_data.status)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid status value"
            )
    
    db.commit()
    db.refresh(goal)
    
    return {
        "message": "Goal updated successfully",
        "goal": {
            "id": goal.id,
            "title": goal.title,
            "status": goal.status.value,
            "target_value": goal.target_value,
            "current_value": goal.current_value
        }
    }


@router.delete("/{goal_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_goal(
    goal_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Delete or cancel a party goal.
    """
    goal = db.query(PartyGoal).filter(PartyGoal.id == goal_id).first()
    
    if not goal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Goal not found"
        )
    
    # Only creator or party leader can delete
    if goal.created_by_id != current_user.id:
        membership = db.query(PartyMember).filter(
            PartyMember.party_id == goal.party_id,
            PartyMember.user_id == current_user.id,
            PartyMember.is_active == True
        ).first()
        
        if not membership or membership.role != PartyRole.LEADER:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only the goal creator or party leader can delete this goal"
            )
    
    # Soft delete by setting status to CANCELLED
    goal.status = GoalStatus.CANCELLED
    db.commit()
    
    return None


@router.post("/{goal_id}/contribute")
async def contribute_to_goal(
    goal_id: int,
    contribution: ContributionRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Add contribution to a party goal.
    """
    goal = db.query(PartyGoal).filter(PartyGoal.id == goal_id).first()
    
    if not goal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Goal not found"
        )
    
    # Verify user is a member
    if not is_party_member(current_user.id, goal.party_id, db):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not a member of this party"
        )
    
    # Check goal is active
    if goal.status != GoalStatus.ACTIVE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot contribute to a non-active goal"
        )
    
    # Add contribution
    goal.current_value += contribution.increment
    
    # Check if goal is now completed
    if goal.current_value >= goal.target_value:
        goal.status = GoalStatus.COMPLETED
        # Add reward points to party
        party = db.query(Party).filter(Party.id == goal.party_id).first()
        if party:
            party.total_points += goal.reward_points
    
    # Add contribution points to member
    membership = db.query(PartyMember).filter(
        PartyMember.party_id == goal.party_id,
        PartyMember.user_id == current_user.id,
        PartyMember.is_active == True
    ).first()
    if membership:
        membership.contribution_points += contribution.increment
    
    db.commit()
    db.refresh(goal)
    
    progress_percentage = (goal.current_value / goal.target_value * 100) if goal.target_value > 0 else 0
    
    return {
        "message": "Contribution added successfully",
        "goal_id": goal.id,
        "current_value": goal.current_value,
        "target_value": goal.target_value,
        "progress_percentage": progress_percentage,
        "status": goal.status.value,
        "is_completed": goal.status == GoalStatus.COMPLETED
    }


@router.get("/{goal_id}/contributors")
async def get_contributors(
    goal_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get list of contributors for a goal.
    Note: This is a simplified version - full implementation would track individual contributions.
    """
    goal = db.query(PartyGoal).filter(PartyGoal.id == goal_id).first()
    
    if not goal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Goal not found"
        )
    
    # Verify user is a member
    if not is_party_member(current_user.id, goal.party_id, db):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not a member of this party"
        )
    
    # Get party members with contribution points
    members = db.query(PartyMember).filter(
        PartyMember.party_id == goal.party_id,
        PartyMember.is_active == True,
        PartyMember.contribution_points > 0
    ).order_by(PartyMember.contribution_points.desc()).all()
    
    total_contributions = sum(m.contribution_points for m in members)
    
    contributors = []
    for member in members:
        user = db.query(User).filter(User.id == member.user_id).first()
        if user:
            contribution_percentage = (member.contribution_points / total_contributions * 100) if total_contributions > 0 else 0
            contributors.append({
                "user_id": member.user_id,
                "username": user.username,
                "avatar_url": user.avatar_url,
                "contribution_points": member.contribution_points,
                "contribution_percentage": contribution_percentage
            })
    
    return contributors
