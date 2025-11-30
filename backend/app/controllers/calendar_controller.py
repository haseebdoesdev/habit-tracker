"""
Calendar Controller
===================
[OMAMAH] This is your controller to implement.

Handles Google Calendar integration for habit reminders.
"""

from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import Optional, Dict, Any
from datetime import datetime, time, timedelta
import secrets

from app.models.habit import Habit
from app.models.user import User
from app.utils.calendar_helper import (
    CalendarHelper,
    CalendarHelperError,
    TokenExpiredError,
    CalendarAPIError,
    daily_recurrence,
    weekly_recurrence
)


# In-memory storage for OAuth states (in production, use Redis or database)
oauth_states: Dict[str, Dict[str, Any]] = {}

# In-memory storage for user calendar credentials (in production, store encrypted in database)
user_calendar_credentials: Dict[int, Dict[str, Any]] = {}

# Initialize calendar helper
calendar_helper = CalendarHelper()


async def get_oauth_url(current_user, db: Session) -> dict:
    """
    Get Google OAuth URL for calendar authorization.
    """
    # Generate state for CSRF protection
    state = secrets.token_urlsafe(32)
    
    # Store state with user info
    oauth_states[state] = {
        "user_id": current_user.id,
        "created_at": datetime.utcnow()
    }
    
    # Clean up old states (older than 10 minutes)
    cutoff = datetime.utcnow() - timedelta(minutes=10)
    expired_states = [s for s, data in oauth_states.items() if data["created_at"] < cutoff]
    for s in expired_states:
        del oauth_states[s]
    
    # Generate authorization URL
    authorization_url = calendar_helper.get_authorization_url(state)
    
    return {
        "authorization_url": authorization_url,
        "state": state
    }


async def handle_oauth_callback(code: str, state: str, db: Session) -> dict:
    """
    Handle OAuth callback from Google.
    """
    # Verify state parameter
    state_data = oauth_states.get(state)
    if not state_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired state parameter"
        )
    
    # Clean up used state
    del oauth_states[state]
    
    user_id = state_data["user_id"]
    
    try:
        # Exchange code for tokens
        token_data = calendar_helper.exchange_code_for_tokens(code)
        
        # Store credentials for user
        user_calendar_credentials[user_id] = token_data
        
        return {
            "success": True,
            "message": "Google Calendar connected successfully"
        }
        
    except CalendarHelperError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to connect calendar: {str(e)}"
        )


async def sync_habits_to_calendar(current_user, db: Session) -> dict:
    """
    Sync user's habits to Google Calendar.
    """
    credentials = user_calendar_credentials.get(current_user.id)
    
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google Calendar not connected. Please authorize first."
        )
    
    # Get user's active habits with reminders
    habits = db.query(Habit).filter(
        Habit.user_id == current_user.id,
        Habit.is_active == True
    ).all()
    
    synced = []
    errors = []
    
    for habit in habits:
        if habit.reminder_time:
            try:
                # Parse reminder time
                hour, minute = map(int, habit.reminder_time.split(':'))
                start_time = datetime.utcnow().replace(hour=hour, minute=minute, second=0, microsecond=0)
                
                # Determine recurrence based on frequency
                recurrence = daily_recurrence()
                if habit.frequency:
                    freq_value = habit.frequency.value if hasattr(habit.frequency, 'value') else str(habit.frequency)
                    if freq_value == "WEEKLY" and habit.target_days:
                        days = habit.target_days.split(',')
                        recurrence = weekly_recurrence(days)
                
                # Create calendar event
                event = await calendar_helper.create_event(
                    credentials=credentials,
                    title=f"🎯 {habit.title}",
                    description=habit.description or f"Time to complete: {habit.title}",
                    start_time=start_time,
                    recurrence=recurrence,
                    reminder_minutes=15,
                    timezone=current_user.timezone or "UTC"
                )
                
                synced.append({
                    "habit_id": habit.id,
                    "habit_title": habit.title,
                    "event_id": event.get("id"),
                    "status": "synced"
                })
                
            except Exception as e:
                errors.append({
                    "habit_id": habit.id,
                    "habit_title": habit.title,
                    "error": str(e)
                })
    
    return {
        "message": f"Synced {len(synced)} habits to Google Calendar",
        "synced_count": len(synced),
        "error_count": len(errors),
        "synced": synced,
        "errors": errors
    }


async def create_habit_event(habit_id: int, current_user, db: Session,
                              event_time: str,
                              recurrence: Optional[str] = "daily",
                              custom_days: Optional[list] = None) -> dict:
    """
    Create calendar event for a habit.
    """
    credentials = user_calendar_credentials.get(current_user.id)
    
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google Calendar not connected"
        )
    
    # Verify user owns the habit
    habit = db.query(Habit).filter(
        Habit.id == habit_id,
        Habit.user_id == current_user.id
    ).first()
    
    if not habit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Habit not found"
        )
    
    try:
        # Parse event time (HH:MM format)
        hour, minute = map(int, event_time.split(':'))
        start_time = datetime.utcnow().replace(hour=hour, minute=minute, second=0, microsecond=0)
        
        # Determine recurrence
        if recurrence == "daily":
            rrule = daily_recurrence()
        elif recurrence == "weekly" and custom_days:
            rrule = weekly_recurrence(custom_days)
        else:
            rrule = daily_recurrence()
        
        # Create event
        event = await calendar_helper.create_event(
            credentials=credentials,
            title=f"🎯 {habit.title}",
            description=habit.description or f"Time to complete: {habit.title}",
            start_time=start_time,
            recurrence=rrule,
            reminder_minutes=15,
            timezone=current_user.timezone or "UTC"
        )
        
        # Update habit's reminder time
        habit.reminder_time = event_time
        db.commit()
        
        return {
            "success": True,
            "message": "Calendar event created",
            "event": event
        }
        
    except CalendarAPIError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create calendar event: {str(e)}"
        )


async def update_habit_event(habit_id: int, current_user, db: Session,
                              event_time: Optional[str] = None,
                              event_id: Optional[str] = None) -> dict:
    """
    Update calendar event for a habit.
    """
    credentials = user_calendar_credentials.get(current_user.id)
    
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google Calendar not connected"
        )
    
    # Verify ownership
    habit = db.query(Habit).filter(
        Habit.id == habit_id,
        Habit.user_id == current_user.id
    ).first()
    
    if not habit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Habit not found"
        )
    
    # Update reminder time if provided
    if event_time:
        habit.reminder_time = event_time
        db.commit()
    
    return {
        "success": True,
        "message": "Calendar event update requested",
        "habit_id": habit_id,
        "new_reminder_time": event_time
    }


async def delete_habit_event(habit_id: int, current_user, db: Session,
                              event_id: Optional[str] = None) -> dict:
    """
    Delete calendar event for a habit.
    """
    credentials = user_calendar_credentials.get(current_user.id)
    
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google Calendar not connected"
        )
    
    # Verify ownership
    habit = db.query(Habit).filter(
        Habit.id == habit_id,
        Habit.user_id == current_user.id
    ).first()
    
    if not habit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Habit not found"
        )
    
    # Clear reminder time
    habit.reminder_time = None
    db.commit()
    
    # If event_id provided, delete the calendar event
    if event_id:
        try:
            await calendar_helper.delete_event(credentials, event_id)
        except Exception:
            pass  # Ignore errors when deleting event
    
    return {
        "success": True,
        "message": "Calendar event deleted",
        "habit_id": habit_id
    }


async def get_calendar_status(current_user, db: Session) -> dict:
    """
    Check Google Calendar connection status.
    """
    credentials = user_calendar_credentials.get(current_user.id)
    
    if not credentials:
        return {
            "connected": False,
            "status": "disconnected",
            "message": "Google Calendar not connected"
        }
    
    # Verify tokens are still valid
    try:
        is_valid = calendar_helper.verify_connection(credentials)
        
        if is_valid:
            return {
                "connected": True,
                "status": "connected",
                "message": "Google Calendar connected and working"
            }
        else:
            return {
                "connected": False,
                "status": "expired",
                "message": "Calendar connection expired. Please reconnect."
            }
    except Exception as e:
        return {
            "connected": False,
            "status": "error",
            "message": f"Error checking connection: {str(e)}"
        }


async def disconnect_calendar(current_user, db: Session) -> dict:
    """
    Disconnect Google Calendar integration.
    """
    credentials = user_calendar_credentials.get(current_user.id)
    
    if credentials:
        # Revoke access tokens
        try:
            calendar_helper.revoke_access(credentials)
        except Exception:
            pass  # Continue even if revoke fails
        
        # Delete stored credentials
        del user_calendar_credentials[current_user.id]
    
    # Clear reminder times from user's habits
    habits = db.query(Habit).filter(
        Habit.user_id == current_user.id,
        Habit.reminder_time.isnot(None)
    ).all()
    
    for habit in habits:
        habit.reminder_time = None
    
    db.commit()
    
    return {
        "success": True,
        "message": "Google Calendar disconnected successfully"
    }
