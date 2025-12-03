"""
Log Controller
==============
[OMAMAH] This is your controller to implement.

Handles habit completion logging and history.
"""

from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import Optional, List
from datetime import date, datetime, timedelta

from app.models.log import Log
from app.models.habit import Habit
from app.schemas.log import LogCreate, LogUpdate, LogResponse, DailyLogSummary, WeeklyLogSummary


async def log_habit_completion(log_data: LogCreate, current_user, db: Session):
    """
    Log a habit completion for a specific date.
    """
    # Get the habit being logged
    habit = db.query(Habit).filter(Habit.id == log_data.habit_id).first()
    
    if not habit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Habit not found"
        )
    
    # Verify current_user owns this habit
    if habit.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to log this habit"
        )
    
    # Determine the log date
    log_date = log_data.log_date or date.today()
    
    # Check if log already exists for this habit + date
    existing_log = db.query(Log).filter(
        Log.habit_id == log_data.habit_id,
        Log.log_date == log_date
    ).first()
    
    if existing_log:
        # Update existing log
        existing_log.completed = log_data.completed
        existing_log.notes = log_data.notes
        existing_log.mood = log_data.mood
        existing_log.duration_minutes = log_data.duration_minutes
        if log_data.completed:
            existing_log.completion_time = datetime.utcnow()
        
        db.commit()
        db.refresh(existing_log)
        log_entry = existing_log
    else:
        # Create new log
        log_entry = Log(
            habit_id=log_data.habit_id,
            user_id=current_user.id,
            log_date=log_date,
            completed=log_data.completed,
            completion_time=datetime.utcnow() if log_data.completed else None,
            notes=log_data.notes,
            mood=log_data.mood,
            duration_minutes=log_data.duration_minutes
        )
        db.add(log_entry)
    
    # Update habit streaks if completed
    if log_data.completed:
        habit.current_streak += 1
        if habit.current_streak > habit.longest_streak:
            habit.longest_streak = habit.current_streak
    
    db.commit()
    db.refresh(log_entry)
    
    return log_entry


async def get_habit_logs(habit_id: int, current_user, db: Session,
                         start_date: Optional[date] = None,
                         end_date: Optional[date] = None) -> List[Log]:
    """
    Get log history for a specific habit.
    """
    # Verify user owns the habit
    habit = db.query(Habit).filter(Habit.id == habit_id).first()
    
    if not habit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Habit not found"
        )
    
    if habit.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this habit's logs"
        )
    
    # Build query
    query = db.query(Log).filter(Log.habit_id == habit_id)
    
    # Apply date range filters
    if start_date:
        query = query.filter(Log.log_date >= start_date)
    if end_date:
        query = query.filter(Log.log_date <= end_date)
    
    # Order by date descending
    logs = query.order_by(Log.log_date.desc()).all()
    
    return logs


async def get_log_by_id(log_id: int, current_user, db: Session):
    """
    Get a specific log entry.
    """
    log = db.query(Log).filter(Log.id == log_id).first()
    
    if not log:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Log not found"
        )
    
    # Verify user owns the habit this log belongs to
    if log.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this log"
        )
    
    return log


async def update_log(log_id: int, log_data: LogUpdate, current_user, db: Session):
    """
    Update an existing log entry.
    """
    log = db.query(Log).filter(Log.id == log_id).first()
    
    if not log:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Log not found"
        )
    
    # Verify user owns the associated habit
    if log.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this log"
        )
    
    # Track completion status change
    was_completed = log.completed
    
    # Update provided fields
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


async def delete_log(log_id: int, current_user, db: Session):
    """
    Delete a log entry.
    """
    log = db.query(Log).filter(Log.id == log_id).first()
    
    if not log:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Log not found"
        )
    
    # Verify user owns associated habit
    if log.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this log"
        )
    
    db.delete(log)
    db.commit()
    
    return {"message": "Log deleted successfully"}


async def get_daily_summary(log_date: date, current_user, db: Session) -> DailyLogSummary:
    """
    Get summary of all habits for a specific date.
    """
    # Get all user's active habits
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


async def get_weekly_summary(current_user, db: Session,
                             week_start: Optional[date] = None) -> dict:
    """
    Get summary for a week.
    """
    # Determine week boundaries
    if week_start is None:
        today = date.today()
        week_start = today - timedelta(days=today.weekday())  # Monday
    
    week_end = week_start + timedelta(days=6)  # Sunday
    
    # Get all user's active habits
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
            "completion_percentage": rate
        })
    
    # Calculate weekly stats
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


async def get_monthly_summary(current_user, db: Session,
                               month: int, year: int) -> dict:
    """
    Get summary for a month.
    """
    from calendar import monthrange
    
    # Get first and last day of month
    first_day = date(year, month, 1)
    last_day = date(year, month, monthrange(year, month)[1])
    
    # Get all user's active habits
    habits = db.query(Habit).filter(
        Habit.user_id == current_user.id,
        Habit.is_active == True
    ).all()
    
    total_habits = len(habits)
    
    # Get all logs for the month
    logs = db.query(Log).filter(
        Log.user_id == current_user.id,
        Log.log_date >= first_day,
        Log.log_date <= last_day
    ).all()
    
    total_completions = sum(1 for log in logs if log.completed)
    days_in_month = (last_day - first_day).days + 1
    total_possible = total_habits * days_in_month
    completion_rate = (total_completions / total_possible * 100) if total_possible > 0 else 0.0
    
    return {
        "month": month,
        "year": year,
        "total_completions": total_completions,
        "total_possible": total_possible,
        "completion_rate": completion_rate,
        "total_habits": total_habits,
        "days_in_month": days_in_month
    }
