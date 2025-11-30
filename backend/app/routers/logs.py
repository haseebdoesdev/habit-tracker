"""
Logs Router
===========
[OMAMAH] This is your router to implement.

Defines habit log/completion API endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional, List
from datetime import date, datetime, timedelta

from app.database import get_db
from app.schemas.log import LogCreate, LogUpdate, LogResponse, DailyLogSummary, WeeklyLogSummary
from app.middleware.auth import get_current_active_user
from app.models.user import User
from app.models.habit import Habit
from app.models.log import Log


router = APIRouter(
    prefix="/logs",
    tags=["Habit Logs"]
)


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=LogResponse)
async def create_log(
    log_data: LogCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Log a habit completion.
    """
    # Verify habit exists and belongs to user
    habit = db.query(Habit).filter(
        Habit.id == log_data.habit_id,
        Habit.user_id == current_user.id
    ).first()
    
    if not habit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Habit not found"
        )
    
    log_date = log_data.log_date or date.today()
    
    # Check if log already exists for this date
    existing_log = db.query(Log).filter(
        Log.habit_id == log_data.habit_id,
        Log.log_date == log_date
    ).first()
    
    if existing_log:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Log already exists for this date. Use PUT to update."
        )
    
    # Create log
    new_log = Log(
        habit_id=log_data.habit_id,
        user_id=current_user.id,
        log_date=log_date,
        completed=log_data.completed,
        completion_time=datetime.utcnow() if log_data.completed else None,
        notes=log_data.notes,
        mood=log_data.mood,
        duration_minutes=log_data.duration_minutes
    )
    
    db.add(new_log)
    
    # Update streak if completed
    if log_data.completed:
        habit.current_streak += 1
        if habit.current_streak > habit.longest_streak:
            habit.longest_streak = habit.current_streak
    
    db.commit()
    db.refresh(new_log)
    
    return new_log


@router.get("/habit/{habit_id}", response_model=List[LogResponse])
async def get_habit_logs(
    habit_id: int,
    start_date: Optional[date] = Query(None, description="Start date filter"),
    end_date: Optional[date] = Query(None, description="End date filter"),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get logs for a specific habit.
    """
    # Verify habit ownership
    habit = db.query(Habit).filter(
        Habit.id == habit_id,
        Habit.user_id == current_user.id
    ).first()
    
    if not habit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Habit not found"
        )
    
    query = db.query(Log).filter(Log.habit_id == habit_id)
    
    if start_date:
        query = query.filter(Log.log_date >= start_date)
    if end_date:
        query = query.filter(Log.log_date <= end_date)
    
    logs = query.order_by(Log.log_date.desc()).all()
    
    return logs


@router.get("/{log_id}", response_model=LogResponse)
async def get_log(
    log_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get a specific log entry.
    """
    log = db.query(Log).filter(
        Log.id == log_id,
        Log.user_id == current_user.id
    ).first()
    
    if not log:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Log not found"
        )
    
    return log


@router.put("/{log_id}", response_model=LogResponse)
async def update_log(
    log_id: int,
    log_data: LogUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Update a log entry.
    """
    log = db.query(Log).filter(
        Log.id == log_id,
        Log.user_id == current_user.id
    ).first()
    
    if not log:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Log not found"
        )
    
    # Track if completion status changed
    was_completed = log.completed
    
    # Update fields
    if log_data.completed is not None:
        log.completed = log_data.completed
        if log_data.completed and not was_completed:
            log.completion_time = datetime.utcnow()
    
    if log_data.notes is not None:
        log.notes = log_data.notes
    
    if log_data.mood is not None:
        log.mood = log_data.mood
    
    if log_data.duration_minutes is not None:
        log.duration_minutes = log_data.duration_minutes
    
    db.commit()
    db.refresh(log)
    
    return log


@router.delete("/{log_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_log(
    log_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Delete a log entry.
    """
    log = db.query(Log).filter(
        Log.id == log_id,
        Log.user_id == current_user.id
    ).first()
    
    if not log:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Log not found"
        )
    
    db.delete(log)
    db.commit()
    
    return None


@router.get("/daily/{log_date}", response_model=DailyLogSummary)
async def get_daily_summary(
    log_date: date,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get summary of all habits for a specific date.
    """
    # Get user's active habits
    habits = db.query(Habit).filter(
        Habit.user_id == current_user.id,
        Habit.is_active == True
    ).all()
    
    total_habits = len(habits)
    
    # Get logs for this date
    logs = db.query(Log).filter(
        Log.user_id == current_user.id,
        Log.log_date == log_date
    ).all()
    
    completed_habits = sum(1 for log in logs if log.completed)
    completion_percentage = (completed_habits / total_habits * 100) if total_habits > 0 else 0.0
    
    return DailyLogSummary(
        date=log_date,
        total_habits=total_habits,
        completed_habits=completed_habits,
        completion_percentage=completion_percentage,
        logs=logs
    )


@router.get("/weekly")
async def get_weekly_summary(
    week_start: Optional[date] = Query(None, description="Start of week (defaults to current week)"),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get summary for current or specified week.
    """
    if week_start is None:
        # Default to start of current week (Monday)
        today = date.today()
        week_start = today - timedelta(days=today.weekday())
    
    week_end = week_start + timedelta(days=6)
    
    # Get user's active habits
    habits = db.query(Habit).filter(
        Habit.user_id == current_user.id,
        Habit.is_active == True
    ).all()
    
    total_habits = len(habits)
    
    # Build daily summaries
    daily_summaries = []
    total_completions = 0
    best_day = None
    best_day_rate = 0.0
    
    for i in range(7):
        day = week_start + timedelta(days=i)
        
        logs = db.query(Log).filter(
            Log.user_id == current_user.id,
            Log.log_date == day
        ).all()
        
        completed = sum(1 for log in logs if log.completed)
        total_completions += completed
        rate = (completed / total_habits * 100) if total_habits > 0 else 0.0
        
        if rate > best_day_rate:
            best_day_rate = rate
            best_day = day
        
        daily_summaries.append({
            "date": day,
            "total_habits": total_habits,
            "completed_habits": completed,
            "completion_percentage": rate,
            "logs": logs
        })
    
    total_possible = total_habits * 7
    weekly_rate = (total_completions / total_possible * 100) if total_possible > 0 else 0.0
    
    return {
        "week_start": week_start,
        "week_end": week_end,
        "daily_summaries": daily_summaries,
        "weekly_completion_rate": weekly_rate,
        "total_completions": total_completions,
        "total_habits_tracked": total_habits,
        "best_day": best_day,
        "best_day_completion_rate": best_day_rate
    }
