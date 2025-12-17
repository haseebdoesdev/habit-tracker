"""
AI Controller
=============
[NOUMAN] Implementation.

Handles Google Gemini AI integration for habit suggestions and insights.
"""

from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import Optional, List, Dict, Tuple
from datetime import date, timedelta, datetime

from app.models.habit import Habit
from app.models.log import Log
from app.utils.gemini_helper import GeminiHelper

# Initialize helper
gemini = GeminiHelper()

# ---------------------------------------------------------------------------
# In-memory caches to reduce Gemini usage per user / period.
# NOTE:
# - Process-local only; replace with Redis/DB if you need shared or persistent
#   caching across workers.
# - Keys are scoped by user_id to avoid any cross-user data mixing.
# ---------------------------------------------------------------------------

HabitSuggestionsKey = Tuple[int, str]
WeeklySummaryKey = Tuple[int, str]  # (user_id, week_start_iso)
MotivationKey = Tuple[int, str]     # (user_id, date_iso)

habit_suggestions_cache: Dict[HabitSuggestionsKey, Dict] = {}
weekly_summary_cache: Dict[WeeklySummaryKey, Dict] = {}
motivation_cache: Dict[MotivationKey, Dict] = {}

SUGGESTIONS_TTL = timedelta(hours=6)
WEEKLY_SUMMARY_TTL = timedelta(days=1)
MOTIVATION_TTL = timedelta(hours=6)


def _is_fresh(entry: Dict, ttl: timedelta) -> bool:
    """Return True if cache entry is still within its TTL."""
    ts: datetime = entry.get("generated_at")
    if not ts:
        return False
    return datetime.utcnow() - ts < ttl

async def get_habit_suggestions(current_user, db: Session, category: Optional[str] = None):
    """
    Get AI-powered habit suggestions based on user's current habits.
    """
    # 1. Gather Context
    existing_habits = db.query(Habit).filter(Habit.user_id == current_user.id).all()
    habit_names = [h.title for h in existing_habits]
    
    # 2. Build Prompt
    prompt_context = f"The user currently has these habits: {', '.join(habit_names)}."
    if category:
        prompt_context += f" They are specifically looking for suggestions in the '{category}' category."
    else:
        prompt_context += " Suggest habits that complement these."
        
    prompt = f"""
    {prompt_context}
    Please suggest 5 distinct, actionable habits. 
    Format the response as a simple list of objects with 'title', 'description', and 'category'.
    """
    
    # 3. Check cache (per user + category)
    cache_key: HabitSuggestionsKey = (current_user.id, (category or "").strip().lower())
    cached = habit_suggestions_cache.get(cache_key)
    if cached and _is_fresh(cached, SUGGESTIONS_TTL):
        return cached["data"]
    
    # 4. Call AI and cache
    try:
        suggestions = await gemini.get_habit_suggestions(existing_habits=habit_names, category=category)
        habit_suggestions_cache[cache_key] = {
            "data": suggestions,
            "generated_at": datetime.utcnow(),
        }
        return suggestions
    except Exception as e:
        # Fallback if AI fails
        print(f"AI Error: {e}")
        return [
            {"title": "Drink Water", "description": "Drink 8 glasses of water daily", "category": "Health"},
            {"title": "Read 10 Pages", "description": "Read a book for 15 minutes", "category": "Learning"},
            {"title": "Walk 5000 Steps", "description": "Take a brisk walk", "category": "Fitness"}
        ]

async def get_weekly_summary(current_user, db: Session):
    """
    Get AI-generated weekly summary and insights.
    """
    # 1. Get last 7 days logs
    today = date.today()
    week_ago = today - timedelta(days=7)
    
    logs = db.query(Log).filter(
        Log.user_id == current_user.id,
        Log.log_date >= week_ago
    ).all()
    
    total_completions = len([l for l in logs if l.completed])
    
    # 2. Build Prompt
    stats = {
        "total_completions_last_7_days": total_completions,
        "date_range": f"{week_ago} to {today}"
    }
    
    # 3. Check cache (per user + week_start)
    cache_key: WeeklySummaryKey = (current_user.id, week_ago.isoformat())
    cached = weekly_summary_cache.get(cache_key)
    if cached and _is_fresh(cached, WEEKLY_SUMMARY_TTL):
        return cached["data"]

    # 4. Call AI and cache
    try:
        summary = await gemini.generate_weekly_summary(stats=stats, habits=[])
        weekly_summary_cache[cache_key] = {
            "data": summary,
            "generated_at": datetime.utcnow(),
        }
        return summary
    except Exception as e:
        return {
            "summary": "You've been active this week! Keep tracking to get more detailed AI insights.",
            "insights": ["Tracking consistently is key."],
            "recommendations": ["Try to log your habits at the same time every day."]
        }

async def get_motivation_message(current_user, db: Session):
    """
    Get personalized motivational message.
    """
    # 1. Check streak status
    active_streaks = db.query(Habit).filter(
        Habit.user_id == current_user.id, 
        Habit.current_streak > 3
    ).count()
    
    context = {
        "username": current_user.username,
        "active_streaks_count": active_streaks,
        "time_of_day": "day"  # Could calculate based on server time
    }
    
    # 2. Check cache (per user + calendar day)
    today_iso = date.today().isoformat()
    cache_key: MotivationKey = (current_user.id, today_iso)
    cached = motivation_cache.get(cache_key)
    if cached and _is_fresh(cached, MOTIVATION_TTL):
        return cached["data"]
    
    # 3. Call AI and cache
    try:
        message = await gemini.get_motivation_message(context)
        result = {"message": message, "mood": "encouraging"}
        motivation_cache[cache_key] = {
            "data": result,
            "generated_at": datetime.utcnow(),
        }
        return result
    except Exception:
        return {"message": "You can do this! One step at a time.", "mood": "supportive"}

async def analyze_habit_patterns(current_user, db: Session):
    """
    Analyze user's habit patterns with AI.
    """
    # Simply fetching logs for now to pass to AI
    logs = db.query(Log).filter(Log.user_id == current_user.id).limit(50).all()
    log_data = [{"date": str(l.log_date), "completed": l.completed} for l in logs]
    
    try:
        analysis = await gemini.analyze_patterns(logs=log_data)
        return analysis
    except Exception:
        return {"patterns": ["Not enough data to analyze patterns yet."]}

async def get_habit_improvement_tips(habit_id: int, current_user, db: Session):
    """
    Get AI tips for improving a specific habit.
    """
    habit = db.query(Habit).filter(
        Habit.id == habit_id,
        Habit.user_id == current_user.id
    ).first()
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")
        
    context = f"Habit: {habit.title}. Current Streak: {habit.current_streak}."
    
    try:
        # Using chat or specific method
        tips = await gemini.generate_text(f"Give me 3 short tips to improve consistency for this habit: {context}")
        # Quick parse if it returns raw string
        return {"habit_id": habit_id, "tips": [tips]}
    except Exception:
        return {"habit_id": habit_id, "tips": ["Start small.", "Trigger this habit after an existing one.", "Reward yourself."]}

async def chat_with_ai(message: str, current_user, db: Session):
    """
    Free-form chat with AI about habits.
    """
    context = {"user_id": current_user.id} # In reality, fetch recent stats
    try:
        response = await gemini.chat(message, context)
        return {"response": response}
    except Exception:
        return {"response": "I'm having trouble connecting to my brain right now. Please try again later."}