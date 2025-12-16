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
import logging

from app.database import get_db
from app.schemas.log import LogCreate, LogUpdate, LogResponse, DailyLogSummary, WeeklyLogSummary, MoodAnalysisResponse, MoodInsightsResponse
from app.middleware.auth import get_current_active_user
from app.models.user import User
from app.models.habit import Habit
from app.models.log import Log
from app.utils.streak_calculator import update_habit_streaks
from app.utils.gemini_helper import GeminiHelper


router = APIRouter(
    prefix="/logs",
    tags=["Habit Logs"]
)

# Initialize Gemini helper
gemini = GeminiHelper()


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
    db.commit()
    db.refresh(new_log)
    
    # Update streak using proper calculation (after commit so log is saved)
    if log_data.completed:
        update_habit_streaks(log_data.habit_id, db)
    
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
        
        # Serialize logs properly
        serialized_logs = [
            {
                "id": log.id,
                "habit_id": log.habit_id,
                "user_id": log.user_id,
                "log_date": log.log_date,
                "completed": log.completed,
                "completion_time": log.completion_time,
                "notes": log.notes,
                "mood": log.mood,
                "duration_minutes": log.duration_minutes,
                "created_at": log.created_at
            }
            for log in logs
        ]
        
        daily_summaries.append({
            "date": day,
            "total_habits": total_habits,
            "completed_habits": completed,
            "completion_percentage": rate,
            "logs": serialized_logs
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


@router.post("/{log_id}/analyze-mood", response_model=MoodAnalysisResponse)
async def analyze_log_mood(
    log_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Analyze mood from a log entry's notes using AI.
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
    
    if not log.notes or len(log.notes.strip()) < 10:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Log entry needs at least 10 characters of notes for mood analysis"
        )
    
    # Get habit title for context
    habit = db.query(Habit).filter(Habit.id == log.habit_id).first()
    habit_title = habit.title if habit else "Habit"
    
    # Analyze mood using Gemini
    analysis = await gemini.analyze_mood_from_notes(
        notes=log.notes,
        log_date=str(log.log_date),
        habit_title=habit_title
    )
    
    # Update log with analysis results
    log.mood_label = analysis["mood_label"]
    log.mood_intensity = analysis["mood_intensity"]
    log.mood_analyzed_at = datetime.utcnow()
    
    db.commit()
    db.refresh(log)
    
    return MoodAnalysisResponse(
        mood_label=analysis["mood_label"],
        mood_intensity=analysis["mood_intensity"],
        sentiment=analysis["sentiment"],
        keywords=analysis["keywords"]
    )


@router.get("/mood-insights", response_model=MoodInsightsResponse)
async def get_mood_insights(
    start_date: Optional[date] = Query(None, description="Start date (defaults to 30 days ago)"),
    end_date: Optional[date] = Query(None, description="End date (defaults to today)"),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get mood trends and AI-generated insights.
    """
    if end_date is None:
        end_date = date.today()
    if start_date is None:
        start_date = end_date - timedelta(days=30)
    
    # Get logs with mood analysis
    logs = db.query(Log).filter(
        Log.user_id == current_user.id,
        Log.log_date >= start_date,
        Log.log_date <= end_date,
        Log.mood_label.isnot(None),
        Log.mood_intensity.isnot(None)
    ).order_by(Log.log_date.asc()).all()
    
    # Build mood trend data
    mood_trend = [
        {
            "date": str(log.log_date),
            "mood_intensity": log.mood_intensity,
            "mood_label": log.mood_label,
            "sentiment": "positive" if log.mood_intensity > 0.6 else "negative" if log.mood_intensity < 0.4 else "neutral"
        }
        for log in logs
    ]
    
    # Build mood distribution
    mood_distribution = {}
    for log in logs:
        label = log.mood_label
        mood_distribution[label] = mood_distribution.get(label, 0) + 1
    
    # Generate AI insights
    ai_insights = "Keep tracking your mood to see patterns over time."
    if len(logs) >= 5:
        # Prepare context for AI
        recent_moods = [{"date": str(log.log_date), "mood": log.mood_label, "intensity": log.mood_intensity} for log in logs[-10:]]
        context = {
            "total_entries": len(logs),
            "recent_moods": recent_moods,
            "mood_distribution": mood_distribution,
            "average_intensity": sum(log.mood_intensity for log in logs) / len(logs) if logs else 0.5
        }
        
        try:
            prompt = f"""
            Analyze this mood tracking data from a habit tracker:
            Total entries: {len(logs)}
            Mood distribution: {mood_distribution}
            Recent moods: {recent_moods[-5:]}
            Average intensity: {context['average_intensity']:.2f}
            
            Provide a brief, encouraging insight (2-3 sentences) about the user's mood patterns.
            Focus on positive observations and gentle suggestions if patterns are concerning.
            """
            ai_insights = await gemini.generate_text(prompt)
        except Exception as e:
            logger = logging.getLogger(__name__)
            logger.error(f"Failed to generate mood insights: {e}")
            ai_insights = "Keep tracking your mood to see patterns over time."
    
    return MoodInsightsResponse(
        mood_trend=mood_trend,
        mood_distribution=mood_distribution,
        ai_insights=ai_insights,
        period_start=start_date,
        period_end=end_date
    )
