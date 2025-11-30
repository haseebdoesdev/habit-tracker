"""
Analytics Controller
====================
[HASEEB] This is your controller to implement.

Handles statistics, streaks, and analytics data.
"""

from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import Optional
from datetime import date, datetime, timedelta

# TODO: Import models (User, Habit, Log)
from app.models.achievement import Achievement
# WHY: Need to query habit and log data
from app.models.user import User
from app.models.habit import Habit
from app.models.log import Log
# TODO: Import schemas for analytics responses


async def get_overview_stats(current_user, db: Session):
    """
    Get overview statistics for dashboard.
    """
    curr_user_habits = db.query(Habit).filter(Habit.user_id == current_user.id).all()
    total_habits = len(curr_user_habits)
    curr_user_active_habits = db.query(Habit).filter(Habit.user_id == current_user.id, Habit.is_active == True).all()
    total_active_habits = len(curr_user_active_habits)
    
    # Guard against division by zero
    if total_active_habits == 0:
        today_completion_rate = 0.0
        this_week_completion_rate = 0.0
    else:
        today_logs = db.query(Log).filter(
            Log.user_id == current_user.id,
            Log.log_date == date.today(),
            Log.completed == True
        ).count()
        today_completion_rate = today_logs / total_active_habits
        
        week_logs = db.query(Log).filter(
            Log.user_id == current_user.id,
            Log.log_date >= date.today() - timedelta(days=7),
            Log.completed == True
        ).count()
        this_week_completion_rate = week_logs / (total_active_habits * 7)
    
    total_completions = db.query(Log).filter(Log.user_id == current_user.id, Log.completed == True).count()
    current_active_streaks = db.query(Habit).filter(Habit.user_id == current_user.id, Habit.current_streak > 0).count()
    longest_active_streaks = db.query(Habit).filter(Habit.user_id == current_user.id, Habit.longest_streak > 0).count()
    return {
        "total_habits": total_habits,
        "total_active_habits": total_active_habits,
        "today_completion_rate": today_completion_rate,
        "this_week_completion_rate": this_week_completion_rate,
        "total_completions": total_completions,
        "current_active_streaks": current_active_streaks,
        "longest_active_streaks": longest_active_streaks
    }


async def get_streak_data(current_user, db: Session):
    """
    Get streak information for all habits.
    """
    habits_with_streaks = db.query(Habit).filter(
        Habit.user_id == current_user.id,
        Habit.current_streak > 0
    ).all()
    
    # Handle empty list to avoid division by zero and empty sequence errors
    if not habits_with_streaks:
        overall_streak_stats = {
            "total_streaks": 0,
            "average_streak": 0.0,
            "longest_streak": 0
        }
    else:
        overall_streak_stats = {
            "total_streaks": len(habits_with_streaks),
            "average_streak": sum(habit.current_streak for habit in habits_with_streaks) / len(habits_with_streaks),
            "longest_streak": max(habit.longest_streak for habit in habits_with_streaks)
        }
    return {
        "habits_with_streaks": habits_with_streaks,
        "overall_streak_stats": overall_streak_stats
    }


async def get_completion_heatmap(current_user, db: Session,
                                  start_date: date,
                                  end_date: date):
    """
    Get completion data for heatmap calendar.
    """
    logs = db.query(Log).filter(
        Log.user_id == current_user.id,
        Log.log_date >= start_date,
        Log.log_date <= end_date,
        Log.completed == True
    ).all()
    
    # Aggregate completions count per date
    heatmap_data = {}
    for log in logs:
        if log.log_date in heatmap_data:
            heatmap_data[log.log_date] += 1
        else:
            heatmap_data[log.log_date] = 1
    return heatmap_data



async def get_progress_chart_data(current_user, db: Session,
                                   period: str = "week"):
    """
    Get data for progress charts.
    """
    if period == "week":
        start_date = date.today() - timedelta(days=7)
        end_date = date.today()
    elif period == "month":
        start_date = date.today().replace(day=1)
        end_date = date.today()
    elif period == "year":
        start_date = date.today().replace(day=1, month=1)
        end_date = date.today()
    else:
        raise HTTPException(status_code=400, detail="Invalid period")
    
    logs = db.query(Log).filter(
        Log.user_id == current_user.id,
        Log.log_date >= start_date,
        Log.log_date <= end_date,
        Log.completed == True
    ).all()
    
    # Aggregate completions count per date
    chart_data = {}
    for log in logs:
        if log.log_date in chart_data:
            chart_data[log.log_date] += 1
        else:
            chart_data[log.log_date] = 1
    return chart_data


async def get_category_breakdown(current_user, db: Session):
    """
    Get habit statistics by category.
    """
    habits = db.query(Habit).filter(Habit.user_id == current_user.id).all()
    
    # Group habits by category first
    from collections import defaultdict
    categories = defaultdict(list)
    for habit in habits:
        categories[habit.category].append(habit)
    
    category_stats = {}
    for category, category_habits in categories.items():
        total_habits = len(category_habits)
        total_completions = sum(
            db.query(Log).filter(
                Log.habit_id == h.id,
                Log.completed == True
            ).count()
            for h in category_habits
        )
        # Avoid division by zero
        completion_rate = total_completions / total_habits if total_habits > 0 else 0.0
        
        category_stats[category] = {
            "total_habits": total_habits,
            "total_completions": total_completions,
            "completion_rate": completion_rate
        }
    return category_stats


async def get_trends(current_user, db: Session):
    """
    Analyze habit tracking trends.
    """
    current_week_logs = db.query(Log).filter(Log.user_id == current_user.id, Log.log_date >= date.today() - timedelta(days=7), Log.log_date <= date.today()).all()
    previous_week_logs = db.query(Log).filter(Log.user_id == current_user.id, Log.log_date >= date.today() - timedelta(days=14), Log.log_date < date.today() - timedelta(days=7)).all()
    current_month_logs = db.query(Log).filter(Log.user_id == current_user.id, Log.log_date >= date.today().replace(day=1), Log.log_date <= date.today()).all()
    previous_month_logs = db.query(Log).filter(Log.user_id == current_user.id, Log.log_date >= date.today().replace(day=1) - timedelta(days=30), Log.log_date < date.today().replace(day=1)).all()
    current_year_logs = db.query(Log).filter(Log.user_id == current_user.id, Log.log_date >= date.today().replace(day=1, month=1), Log.log_date <= date.today()).all()
    previous_year_logs = db.query(Log).filter(Log.user_id == current_user.id, Log.log_date >= date.today().replace(day=1, month=1) - timedelta(days=365), Log.log_date < date.today().replace(day=1, month=1)).all()
    return {
        "current_week_logs": current_week_logs,
        "previous_week_logs": previous_week_logs,
        "current_month_logs": current_month_logs,
        "previous_month_logs": previous_month_logs,
        "current_year_logs": current_year_logs,
        "previous_year_logs": previous_year_logs
    }

async def get_achievements_progress(current_user, db: Session):
    """
    Get progress towards achievements.
    """
    achievements = db.query(Achievement).filter(Achievement.user_id == current_user.id).all()
    
    # Use earned_at to determine if achievement is earned (not None means earned)
    earned_achievements = [a for a in achievements if a.earned_at is not None]
    
    achievement_progress = {}
    for achievement in achievements:
        achievement_progress[achievement.title] = {
            "description": achievement.description,
            "points": achievement.points,
            "rarity": achievement.rarity,
            "is_earned": achievement.earned_at is not None,
            "earned_at": achievement.earned_at
        }
    return {
        "total_achievements": len(achievements),
        "earned_count": len(earned_achievements),
        "achievements": achievement_progress
    }
