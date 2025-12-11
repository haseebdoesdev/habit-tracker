"""
Habit Controller
================
[NOUMAN] This is your controller to implement.

Handles CRUD operations for personal habits.
"""

from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import List, Optional
from datetime import date

from app.models.habit import Habit, HabitFrequency, HabitCategory
from app.models.log import Log
from app.models.party_member import PartyMember
from app.schemas.habit import HabitCreate, HabitUpdate, HabitResponse, HabitStats
from app.utils.streak_calculator import update_habit_streaks


async def create_habit(habit_data: HabitCreate, current_user, db: Session):
    """
    Create a new habit for the current user.
    """
    # If party_id is provided, verify user is a party member
    if habit_data.party_id:
        membership = db.query(PartyMember).filter(
            PartyMember.party_id == habit_data.party_id,
            PartyMember.user_id == current_user.id,
            PartyMember.is_active == True
        ).first()
        
        if not membership:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You are not a member of this party"
            )
    
    # Create new Habit model instance
    new_habit = Habit(
        user_id=current_user.id,
        party_id=habit_data.party_id,
        title=habit_data.title,
        description=habit_data.description,
        frequency=habit_data.frequency if habit_data.frequency else HabitFrequency.DAILY.value,
        category=habit_data.category if habit_data.category else HabitCategory.OTHER.value,
        target_days=habit_data.target_days,
        reminder_time=habit_data.reminder_time,
        color=habit_data.color,
        icon=habit_data.icon,
        is_active=True,
        current_streak=0,
        longest_streak=0
    )
    
    db.add(new_habit)
    db.commit()
    db.refresh(new_habit)
    
    return new_habit


async def get_user_habits(current_user, db: Session, 
                          category: Optional[str] = None,
                          is_active: Optional[bool] = True) -> List[Habit]:
    """
    Get all habits for the current user.
    """
    query = db.query(Habit).filter(Habit.user_id == current_user.id)
    
    # Apply optional filters
    if category:
        query = query.filter(Habit.category == category)
    
    if is_active is not None:
        query = query.filter(Habit.is_active == is_active)
    
    # Order by created_at
    habits = query.order_by(Habit.created_at.desc()).all()
    
    # Add today's completion status for each habit
    today = date.today()
    result = []
    for habit in habits:
        completed_today = db.query(Log).filter(
            Log.habit_id == habit.id,
            Log.log_date == today,
            Log.completed == True
        ).first() is not None
        
        habit_dict = {
            "id": habit.id,
            "user_id": habit.user_id,
            "party_id": habit.party_id,
            "title": habit.title,
            "description": habit.description,
            "frequency": habit.frequency.value if habit.frequency else None,
            "category": habit.category.value if habit.category else None,
            "target_days": habit.target_days,
            "reminder_time": habit.reminder_time,
            "color": habit.color,
            "icon": habit.icon,
            "is_active": habit.is_active,
            "current_streak": habit.current_streak,
            "longest_streak": habit.longest_streak,
            "created_at": habit.created_at,
            "updated_at": habit.updated_at,
            "completed_today": completed_today
        }
        result.append(habit_dict)
    
    return result


async def get_habit_by_id(habit_id: int, current_user, db: Session):
    """
    Get a specific habit by ID.
    """
    habit = db.query(Habit).filter(Habit.id == habit_id).first()
    
    if not habit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Habit not found"
        )
    
    # Verify user owns this habit
    if habit.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this habit"
        )
    
    # Add completed_today status
    today = date.today()
    completed_today = db.query(Log).filter(
        Log.habit_id == habit.id,
        Log.log_date == today,
        Log.completed == True
    ).first() is not None
    
    return {
        **habit.__dict__,
        "frequency": habit.frequency.value if habit.frequency else None,
        "category": habit.category.value if habit.category else None,
        "completed_today": completed_today
    }


async def update_habit(habit_id: int, habit_data: HabitUpdate, current_user, db: Session):
    """
    Update an existing habit.
    """
    habit = db.query(Habit).filter(Habit.id == habit_id).first()
    
    if not habit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Habit not found"
        )
    
    if habit.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this habit"
        )
    
    # Update only provided fields
    update_data = habit_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        if value is not None:
            setattr(habit, field, value)
    
    db.commit()
    db.refresh(habit)
    
    return habit


async def delete_habit(habit_id: int, current_user, db: Session):
    """
    Delete a habit (soft delete).
    """
    habit = db.query(Habit).filter(Habit.id == habit_id).first()
    
    if not habit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Habit not found"
        )
    
    if habit.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this habit"
        )
    
    # Soft delete - set is_active = False
    habit.is_active = False
    db.commit()
    
    return {"message": "Habit deleted successfully"}


async def get_habit_stats(habit_id: int, current_user, db: Session) -> HabitStats:
    """
    Get statistics for a specific habit.
    """
    habit = db.query(Habit).filter(Habit.id == habit_id).first()
    
    if not habit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Habit not found"
        )
    
    if habit.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this habit"
        )
    
    # Calculate total completions
    total_completions = db.query(Log).filter(
        Log.habit_id == habit_id,
        Log.completed == True
    ).count()
    
    # Calculate total days tracked
    total_logs = db.query(Log).filter(Log.habit_id == habit_id).count()
    
    # Calculate completion rate
    completion_rate = (total_completions / total_logs * 100) if total_logs > 0 else 0.0
    
    # Get last completion date
    last_completed_log = db.query(Log).filter(
        Log.habit_id == habit_id,
        Log.completed == True
    ).order_by(Log.log_date.desc()).first()
    
    return HabitStats(
        habit_id=habit_id,
        total_completions=total_completions,
        completion_rate=completion_rate,
        current_streak=habit.current_streak,
        longest_streak=habit.longest_streak,
        last_completed=last_completed_log.log_date if last_completed_log else None,
        total_days_tracked=total_logs
    )


async def complete_habit_today(habit_id: int, current_user, db: Session):
    """
    Quick complete a habit for today.
    """
    habit = db.query(Habit).filter(Habit.id == habit_id).first()
    
    if not habit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Habit not found"
        )
    
    if habit.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to complete this habit"
        )
    
    today = date.today()
    from datetime import datetime
    
    # Check if already logged today
    existing_log = db.query(Log).filter(
        Log.habit_id == habit_id,
        Log.log_date == today
    ).first()
    
    if existing_log:
        existing_log.completed = True
        existing_log.completion_time = datetime.utcnow()
    else:
        new_log = Log(
            habit_id=habit_id,
            user_id=current_user.id,
            log_date=today,
            completed=True,
            completion_time=datetime.utcnow()
        )
        db.add(new_log)
    
    db.commit()
    
    # Update streak using proper calculation (after commit so log is saved)
    current_streak, longest_streak = update_habit_streaks(habit_id, db)
    
    return {
        "message": "Habit completed for today",
        "habit_id": habit_id,
        "date": today,
        "current_streak": current_streak,
        "longest_streak": longest_streak
    }
