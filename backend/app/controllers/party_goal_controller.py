"""
Party Goal Controller
=====================
[NOUMAN] This is your controller to implement.

Handles party goal management and progress tracking.
"""

from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import Optional, List
from datetime import date, datetime

from app.models.party_goal import PartyGoal, GoalStatus
from app.models.party import Party
from app.models.party_member import PartyMember, PartyRole
from app.models.user import User
from app.utils.party_utils import is_party_member, can_create_party_goal


async def create_party_goal(goal_data, current_user, db: Session):
    """
    Create a new goal for a party.
    """
    # Verify user is a member of the party
    if not is_party_member(current_user.id, goal_data.party_id, db):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not a member of this party"
        )
    
    # Check if user has permission to create goals
    if not can_create_party_goal(current_user.id, goal_data.party_id, db):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to create goals in this party"
        )
    
    # Create PartyGoal model instance
    new_goal = PartyGoal(
        party_id=goal_data.party_id,
        created_by_id=current_user.id,
        title=goal_data.title,
        description=getattr(goal_data, 'description', None),
        target_value=goal_data.target_value,
        current_value=0,
        status=GoalStatus.ACTIVE,
        start_date=getattr(goal_data, 'start_date', None) or datetime.utcnow(),
        reward_points=getattr(goal_data, 'reward_points', 0),
        habit_category=getattr(goal_data, 'habit_category', None)
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


async def get_party_goals(party_id: int, current_user, db: Session,
                           goal_status: Optional[str] = None) -> List[dict]:
    """
    Get goals for a party.
    """
    # Verify user is a party member
    if not is_party_member(current_user.id, party_id, db):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not a member of this party"
        )
    
    # Query goals for this party
    query = db.query(PartyGoal).filter(PartyGoal.party_id == party_id)
    
    # Apply status filter if provided
    if goal_status:
        try:
            status_enum = GoalStatus(goal_status)
            query = query.filter(PartyGoal.status == status_enum)
        except ValueError:
            pass  # Ignore invalid status
    
    # Order by status (active first) and created_at
    goals = query.order_by(PartyGoal.status, PartyGoal.created_at.desc()).all()
    
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


async def get_goal_by_id(goal_id: int, current_user, db: Session):
    """
    Get specific goal details.
    """
    goal = db.query(PartyGoal).filter(PartyGoal.id == goal_id).first()
    
    if not goal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Goal not found"
        )
    
    # Verify user is party member
    if not is_party_member(current_user.id, goal.party_id, db):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not a member of this party"
        )
    
    progress_percentage = (goal.current_value / goal.target_value * 100) if goal.target_value > 0 else 0
    
    # Get creator info
    creator = db.query(User).filter(User.id == goal.created_by_id).first()
    
    return {
        "id": goal.id,
        "party_id": goal.party_id,
        "created_by_id": goal.created_by_id,
        "created_by_username": creator.username if creator else None,
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


async def update_party_goal(goal_id: int, goal_data, current_user, db: Session):
    """
    Update a party goal.
    """
    goal = db.query(PartyGoal).filter(PartyGoal.id == goal_id).first()
    
    if not goal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Goal not found"
        )
    
    # Verify user is creator or leader
    is_creator = goal.created_by_id == current_user.id
    membership = db.query(PartyMember).filter(
        PartyMember.party_id == goal.party_id,
        PartyMember.user_id == current_user.id,
        PartyMember.is_active == True
    ).first()
    
    is_leader = membership and membership.role == PartyRole.LEADER
    
    if not is_creator and not is_leader:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the goal creator or party leader can update this goal"
        )
    
    # Update provided fields
    if hasattr(goal_data, 'title') and goal_data.title is not None:
        goal.title = goal_data.title
    if hasattr(goal_data, 'description') and goal_data.description is not None:
        goal.description = goal_data.description
    if hasattr(goal_data, 'target_value') and goal_data.target_value is not None:
        goal.target_value = goal_data.target_value
    if hasattr(goal_data, 'status') and goal_data.status is not None:
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


async def delete_party_goal(goal_id: int, current_user, db: Session):
    """
    Delete or cancel a party goal.
    """
    goal = db.query(PartyGoal).filter(PartyGoal.id == goal_id).first()
    
    if not goal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Goal not found"
        )
    
    # Verify user is creator or leader
    is_creator = goal.created_by_id == current_user.id
    membership = db.query(PartyMember).filter(
        PartyMember.party_id == goal.party_id,
        PartyMember.user_id == current_user.id,
        PartyMember.is_active == True
    ).first()
    
    is_leader = membership and membership.role == PartyRole.LEADER
    
    if not is_creator and not is_leader:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the goal creator or party leader can delete this goal"
        )
    
    # Soft delete - set status to CANCELLED
    goal.status = GoalStatus.CANCELLED
    db.commit()
    
    return {"message": "Goal cancelled successfully"}


async def contribute_to_goal(goal_id: int, contribution: int,
                              current_user, db: Session):
    """
    Add contribution to a party goal.
    """
    goal = db.query(PartyGoal).filter(PartyGoal.id == goal_id).first()
    
    if not goal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Goal not found"
        )
    
    # Verify user is party member
    if not is_party_member(current_user.id, goal.party_id, db):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not a member of this party"
        )
    
    # Verify goal is still active
    if goal.status != GoalStatus.ACTIVE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot contribute to a non-active goal"
        )
    
    # Add to current_value
    goal.current_value += contribution
    
    # Check if goal is now complete
    if goal.current_value >= goal.target_value:
        goal.status = GoalStatus.COMPLETED
        
        # Award points to party
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
        membership.contribution_points += contribution
    
    db.commit()
    db.refresh(goal)
    
    progress_percentage = (goal.current_value / goal.target_value * 100) if goal.target_value > 0 else 0
    
    return {
        "message": "Contribution added successfully",
        "goal_id": goal.id,
        "contribution": contribution,
        "current_value": goal.current_value,
        "target_value": goal.target_value,
        "progress_percentage": progress_percentage,
        "status": goal.status.value,
        "is_completed": goal.status == GoalStatus.COMPLETED
    }


async def get_goal_contributors(goal_id: int, current_user, db: Session) -> List[dict]:
    """
    Get list of contributors for a goal.
    """
    goal = db.query(PartyGoal).filter(PartyGoal.id == goal_id).first()
    
    if not goal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Goal not found"
        )
    
    # Verify user is party member
    if not is_party_member(current_user.id, goal.party_id, db):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not a member of this party"
        )
    
    # Get party members with contribution points (simplified version)
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


async def check_expired_goals(db: Session):
    """
    Check for and update expired goals.
    This might be called by a background task.
    """
    today = datetime.utcnow()
    
    # Query active goals past end_date (if end_date exists in model)
    expired_goals = db.query(PartyGoal).filter(
        PartyGoal.status == GoalStatus.ACTIVE
    ).all()
    
    updated_count = 0
    for goal in expired_goals:
        # Check if goal has end_date and is past it
        if hasattr(goal, 'end_date') and goal.end_date and goal.end_date < today:
            goal.status = GoalStatus.FAILED
            updated_count += 1
    
    if updated_count > 0:
        db.commit()
    
    return {"message": f"Checked goals, {updated_count} marked as failed"}
