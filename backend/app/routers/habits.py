"""
Habits Router
=============
[NOUMAN] This is your router to implement.

Defines habit-related API endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional, List
from datetime import date

from app.database import get_db
from app.schemas.habit import HabitCreate, HabitUpdate, HabitResponse, HabitStats
from app.middleware.auth import get_current_active_user
from app.models.user import User
from app.models.habit import Habit, HabitFrequency, HabitCategory
from app.models.log import Log
from app.utils.streak_calculator import update_habit_streaks


def parse_frequency(frequency_str: str) -> HabitFrequency:
    """Convert frequency string to HabitFrequency enum."""
    try:
        # Try lowercase first (matches enum values)
        return HabitFrequency(frequency_str.lower())
    except ValueError:
        # Try uppercase match against enum names
        try:
            return HabitFrequency[frequency_str.upper()]
        except KeyError:
            return HabitFrequency.DAILY  # Default


def parse_category(category_str: str) -> HabitCategory:
    """Convert category string to HabitCategory enum."""
    try:
        # Try lowercase first (matches enum values)
        return HabitCategory(category_str.lower())
    except ValueError:
        # Try uppercase match against enum names
        try:
            return HabitCategory[category_str.upper()]
        except KeyError:
            return HabitCategory.OTHER  # Default


router = APIRouter(
    prefix="/habits",
    tags=["Habits"]
)


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=HabitResponse)
async def create_habit(
    habit_data: HabitCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Create a new habit for the current user.
    """
    # Convert string values to enums
    frequency_enum = parse_frequency(habit_data.frequency)
    category_enum = parse_category(habit_data.category) if habit_data.category else HabitCategory.OTHER
    
    new_habit = Habit(
        user_id=current_user.id,
        party_id=habit_data.party_id,
        title=habit_data.title,
        description=habit_data.description,
        frequency=frequency_enum,
        category=category_enum,
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


@router.get("/", response_model=List[HabitResponse])
async def get_habits(
    category: Optional[str] = Query(None, description="Filter by category"),
    is_active: Optional[bool] = Query(None, description="Filter by active status"),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get all habits for the current user.
    """
    query = db.query(Habit).filter(Habit.user_id == current_user.id)
    
    if category:
        query = query.filter(Habit.category == category)
    
    if is_active is not None:
        query = query.filter(Habit.is_active == is_active)
    
    habits = query.all()
    
    # Add completed_today field
    today = date.today()
    result = []
    for habit in habits:
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
            "current_streak": habit.current_streak,
            "longest_streak": habit.longest_streak,
            "is_active": habit.is_active,
            "created_at": habit.created_at,
            "updated_at": habit.updated_at,
            "completed_today": db.query(Log).filter(
                Log.habit_id == habit.id,
                Log.log_date == today,
                Log.completed == True
            ).first() is not None
        }
        result.append(habit_dict)
    
    return result


@router.get("/{habit_id}", response_model=HabitResponse)
async def get_habit(
    habit_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get a specific habit by ID.
    """
    habit = db.query(Habit).filter(
        Habit.id == habit_id,
        Habit.user_id == current_user.id
    ).first()
    
    if not habit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Habit not found"
        )
    
    # Add completed_today
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


@router.put("/{habit_id}", response_model=HabitResponse)
async def update_habit(
    habit_id: int,
    habit_data: HabitUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Update an existing habit.
    """
    habit = db.query(Habit).filter(
        Habit.id == habit_id,
        Habit.user_id == current_user.id
    ).first()
    
    if not habit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Habit not found"
        )
    
    # Update fields with enum conversion for frequency and category
    update_data = habit_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        if value is not None:
            if field == "frequency":
                value = parse_frequency(value)
            elif field == "category":
                value = parse_category(value)
            setattr(habit, field, value)
    
    db.commit()
    db.refresh(habit)
    
    return habit


@router.delete("/{habit_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_habit(
    habit_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Delete a habit.
    """
    habit = db.query(Habit).filter(
        Habit.id == habit_id,
        Habit.user_id == current_user.id
    ).first()
    
    if not habit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Habit not found"
        )
    
    # Soft delete - mark as inactive
    habit.is_active = False
    db.commit()
    
    return None


@router.get("/{habit_id}/stats", response_model=HabitStats)
async def get_habit_stats(
    habit_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get statistics for a specific habit.
    """
    habit = db.query(Habit).filter(
        Habit.id == habit_id,
        Habit.user_id == current_user.id
    ).first()
    
    if not habit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Habit not found"
        )
    
    # Calculate stats
    total_completions = db.query(Log).filter(
        Log.habit_id == habit_id,
        Log.completed == True
    ).count()
    
    total_logs = db.query(Log).filter(Log.habit_id == habit_id).count()
    completion_rate = (total_completions / total_logs * 100) if total_logs > 0 else 0.0
    
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


@router.post("/{habit_id}/complete")
async def complete_habit(
    habit_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Quick endpoint to mark habit as completed for today.
    """
    habit = db.query(Habit).filter(
        Habit.id == habit_id,
        Habit.user_id == current_user.id
    ).first()
    
    if not habit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Habit not found"
        )
    
    today = date.today()
    
    # Check if already logged today
    existing_log = db.query(Log).filter(
        Log.habit_id == habit_id,
        Log.log_date == today
    ).first()
    
    if existing_log:
        existing_log.completed = True
        from datetime import datetime
        existing_log.completion_time = datetime.utcnow()
    else:
        from datetime import datetime
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
        "message": "Habit marked as completed",
        "habit_id": habit_id,
        "date": today,
        "current_streak": current_streak,
        "longest_streak": longest_streak
    }
