"""
Streak Calculator Utility
=========================
[NOUMAN] Implementation.

Calculates habit completion streaks.
"""

from datetime import date, timedelta
from typing import List, Tuple, Dict
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.models.log import Log
from app.models.habit import Habit

def calculate_current_streak(habit_id: int, db: Session) -> int:
    """
    Calculate the current streak for a habit.
    Checks consecutive days starting from today or yesterday.
    """
    # 1. Get all completed logs for this habit, sorted by date (newest first)
    logs = db.query(Log).filter(
        Log.habit_id == habit_id, 
        Log.completed == True
    ).order_by(desc(Log.log_date)).all()
    
    if not logs:
        return 0
    
    today = date.today()
    start_check = logs[0].log_date
    
    # 2. Determine if streak is active
    # Streak is active if last completion was Today OR Yesterday
    if start_check == today:
        current_streak = 1
        last_date = today
    elif start_check == today - timedelta(days=1):
        current_streak = 1
        last_date = start_check
    else:
        # Last completion was 2+ days ago, streak is broken
        return 0
        
    # 3. Iterate backwards to count consecutive days
    # We skip the first log since we already counted it above
    for i in range(1, len(logs)):
        expected_date = last_date - timedelta(days=1)
        if logs[i].log_date == expected_date:
            current_streak += 1
            last_date = expected_date
        elif logs[i].log_date == last_date:
            # Handle case where multiple logs might exist for same day
            continue
        else:
            break
            
    return current_streak

def calculate_longest_streak(habit_id: int, db: Session) -> int:
    """
    Calculate the longest streak ever for a habit.
    """
    # 1. Get all completed logs sorted by date (oldest first)
    logs = db.query(Log).filter(
        Log.habit_id == habit_id, 
        Log.completed == True
    ).order_by(Log.log_date).all()
    
    if not logs:
        return 0
        
    max_streak = 0
    current_run = 0
    prev_date = None
    
    for log in logs:
        if prev_date is None:
            current_run = 1
        elif log.log_date == prev_date + timedelta(days=1):
            # Consecutive day
            current_run += 1
        elif log.log_date == prev_date:
            # Same day, ignore
            pass
        else:
            # Gap found, reset run
            current_run = 1
            
        max_streak = max(max_streak, current_run)
        prev_date = log.log_date
        
    return max_streak

def update_habit_streaks(habit_id: int, db: Session) -> Tuple[int, int]:
    """
    Update streak fields on a habit record.
    """
    current = calculate_current_streak(habit_id, db)
    longest = calculate_longest_streak(habit_id, db)
    
    habit = db.query(Habit).filter(Habit.id == habit_id).first()
    if habit:
        habit.current_streak = current
        # Only update longest if current is higher, or if we recalculated and found a historical high
        habit.longest_streak = max(longest, habit.longest_streak)
        db.commit()
        db.refresh(habit)
        
    return current, longest

def get_streak_at_risk_habits(user_id: int, db: Session) -> List[Habit]:
    """
    Get habits that have an active streak but haven't been completed today.
    """
    today = date.today()
    
    # Get all active habits with a streak > 0
    habits = db.query(Habit).filter(
        Habit.user_id == user_id,
        Habit.is_active == True,
        Habit.current_streak > 0
    ).all()
    
    at_risk = []
    for habit in habits:
        # Check if completed today
        completed_today = db.query(Log).filter(
            Log.habit_id == habit.id,
            Log.log_date == today,
            Log.completed == True
        ).first()
        
        if not completed_today:
            at_risk.append(habit)
            
    return at_risk

def calculate_completion_rate(habit_id: int, db: Session, days: int = 30) -> float:
    """
    Calculate completion rate over last N days.
    """
    today = date.today()
    start_date = today - timedelta(days=days - 1) # Inclusive of today
    
    logs_count = db.query(Log).filter(
        Log.habit_id == habit_id,
        Log.log_date >= start_date,
        Log.completed == True
    ).count()
    
    # Basic calculation: completions / days * 100
    # Note: This assumes the habit existed for all those days.
    return (logs_count / days) * 100

def get_weekly_completion_data(habit_id: int, db: Session) -> List[Dict]:
    """
    Get completion status for the last 7 days.
    """
    today = date.today()
    result = []
    
    for i in range(6, -1, -1): # 6 days ago to 0 days ago (today)
        check_date = today - timedelta(days=i)
        
        log = db.query(Log).filter(
            Log.habit_id == habit_id,
            Log.log_date == check_date,
            Log.completed == True
        ).first()
        
        result.append({
            "date": check_date,
            "day_name": check_date.strftime("%a"), # Mon, Tue
            "completed": log is not None
        })
        
    return result