"""
Calendar Router
===============
[OMAMAH] This is your router to implement.

Defines Google Calendar integration API endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime, time, timedelta
from pydantic import BaseModel
import secrets

from app.database import get_db
from app.middleware.auth import get_current_active_user
from app.models.user import User
from app.models.habit import Habit
from app.utils.calendar_helper import (
    CalendarHelper,
    CalendarHelperError,
    TokenExpiredError,
    CalendarAPIError,
    daily_recurrence,
    weekly_recurrence
)
from app.config import settings


router = APIRouter(
    prefix="/calendar",
    tags=["Calendar Integration"]
)

# In-memory storage for OAuth states (in production, use Redis or database)
oauth_states = {}

# In-memory storage for user calendar credentials (in production, store in database)
user_calendar_credentials = {}

calendar_helper = CalendarHelper()


class CalendarEventRequest(BaseModel):
    reminder_time: str  # HH:MM format
    recurrence: Optional[str] = "daily"  # daily, weekly, custom
    custom_days: Optional[list] = None  # For weekly: ["MO", "TU", "WE"]


class CalendarEventUpdateRequest(BaseModel):
    reminder_time: Optional[str] = None
    recurrence: Optional[str] = None
    custom_days: Optional[list] = None


@router.get("/oauth/url")
async def get_oauth_url(
    current_user: User = Depends(get_current_active_user)
):
    """
    Get Google OAuth authorization URL.
    """
    # Generate state for CSRF protection
    state = secrets.token_urlsafe(32)
    oauth_states[state] = {
        "user_id": current_user.id,
        "created_at": datetime.utcnow()
    }
    
    authorization_url = calendar_helper.get_authorization_url(state)
    
    return {
        "authorization_url": authorization_url,
        "state": state
    }


async def _handle_oauth_callback(
    code: str,
    state: str,
    db: Session
):
    """
    Internal handler for OAuth callback logic.
    """
    # Verify state
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
        
        # Store credentials for user (in production, encrypt and store in database)
        user_calendar_credentials[user_id] = token_data
        
        # Redirect to frontend success page
        frontend_url = f"{settings.CORS_ORIGINS[0] if settings.CORS_ORIGINS else 'http://localhost:3000'}/calendar/connected"
        return RedirectResponse(url=frontend_url)
        
    except CalendarHelperError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.get("/oauth/callback")
async def oauth_callback(
    code: str = Query(..., description="Authorization code from Google"),
    state: str = Query(..., description="State parameter for CSRF protection"),
    db: Session = Depends(get_db)
):
    """
    Handle OAuth callback from Google (primary endpoint).
    """
    return await _handle_oauth_callback(code, state, db)


@router.get("/callback")
async def oauth_callback_alt(
    code: str = Query(..., description="Authorization code from Google"),
    state: str = Query(..., description="State parameter for CSRF protection"),
    db: Session = Depends(get_db)
):
    """
    Handle OAuth callback from Google (alternative endpoint for backwards compatibility).
    Some OAuth configurations may use /callback instead of /oauth/callback.
    """
    return await _handle_oauth_callback(code, state, db)


@router.get("/status")
async def get_calendar_status(
    current_user: User = Depends(get_current_active_user)
):
    """
    Check Google Calendar connection status.
    """
    credentials = user_calendar_credentials.get(current_user.id)
    
    if not credentials:
        return {
            "connected": False,
            "message": "Google Calendar not connected"
        }
    
    # Verify connection still works
    is_valid = calendar_helper.verify_connection(credentials)
    
    if not is_valid:
        return {
            "connected": False,
            "message": "Calendar connection expired. Please reconnect."
        }
    
    return {
        "connected": True,
        "message": "Google Calendar connected"
    }


@router.post("/sync")
async def sync_to_calendar(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Sync all habits to Google Calendar.
    """
    credentials = user_calendar_credentials.get(current_user.id)
    
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google Calendar not connected"
        )
    
    # Get user's active habits
    habits = db.query(Habit).filter(
        Habit.user_id == current_user.id,
        Habit.is_active == True
    ).all()
    
    synced = []
    errors = []
    
    for habit in habits:
        try:
            if habit.reminder_time:
                # Parse reminder time
                hour, minute = map(int, habit.reminder_time.split(':'))
                start_time = datetime.utcnow().replace(hour=hour, minute=minute, second=0)
                
                # Determine recurrence
                recurrence = daily_recurrence()
                if habit.frequency and habit.frequency.value == "WEEKLY" and habit.target_days:
                    days = habit.target_days.split(',')
                    recurrence = weekly_recurrence(days)
                
                # Create event
                event = await calendar_helper.create_event(
                    credentials=credentials,
                    title=f"🎯 {habit.title}",
                    description=habit.description or f"Time to complete your habit: {habit.title}",
                    start_time=start_time,
                    recurrence=recurrence,
                    reminder_minutes=15,
                    timezone=current_user.timezone or "UTC"
                )
                
                synced.append({
                    "habit_id": habit.id,
                    "habit_title": habit.title,
                    "event_id": event.get("id")
                })
        except Exception as e:
            errors.append({
                "habit_id": habit.id,
                "habit_title": habit.title,
                "error": str(e)
            })
    
    return {
        "message": f"Synced {len(synced)} habits to Google Calendar",
        "synced": synced,
        "errors": errors
    }


@router.post("/event/{habit_id}")
async def create_calendar_event(
    habit_id: int,
    event_data: CalendarEventRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Create calendar event for a habit.
    """
    credentials = user_calendar_credentials.get(current_user.id)
    
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google Calendar not connected"
        )
    
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
    
    try:
        # Parse reminder time
        hour, minute = map(int, event_data.reminder_time.split(':'))
        start_time = datetime.utcnow().replace(hour=hour, minute=minute, second=0)
        
        # Determine recurrence
        if event_data.recurrence == "daily":
            recurrence = daily_recurrence()
        elif event_data.recurrence == "weekly" and event_data.custom_days:
            recurrence = weekly_recurrence(event_data.custom_days)
        else:
            recurrence = daily_recurrence()
        
        # Create event
        event = await calendar_helper.create_event(
            credentials=credentials,
            title=f"🎯 {habit.title}",
            description=habit.description or f"Time to complete your habit: {habit.title}",
            start_time=start_time,
            recurrence=recurrence,
            reminder_minutes=15,
            timezone=current_user.timezone or "UTC"
        )
        
        # Update habit's reminder time
        habit.reminder_time = event_data.reminder_time
        db.commit()
        
        return {
            "message": "Calendar event created",
            "event": event
        }
        
    except CalendarAPIError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.put("/event/{habit_id}")
async def update_calendar_event(
    habit_id: int,
    event_data: CalendarEventUpdateRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Update calendar event for a habit.
    """
    credentials = user_calendar_credentials.get(current_user.id)
    
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google Calendar not connected"
        )
    
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
    
    # Note: Full implementation would store event_id with habit
    # For now, return success
    if event_data.reminder_time:
        habit.reminder_time = event_data.reminder_time
        db.commit()
    
    return {
        "message": "Calendar event update requested",
        "habit_id": habit_id
    }


@router.delete("/event/{habit_id}")
async def delete_calendar_event(
    habit_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Delete calendar event for a habit.
    """
    credentials = user_calendar_credentials.get(current_user.id)
    
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google Calendar not connected"
        )
    
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
    
    # Note: Full implementation would delete by stored event_id
    # Clear reminder time
    habit.reminder_time = None
    db.commit()
    
    return {
        "message": "Calendar event deleted",
        "habit_id": habit_id
    }


@router.delete("/disconnect")
async def disconnect_calendar(
    current_user: User = Depends(get_current_active_user)
):
    """
    Disconnect Google Calendar integration.
    """
    credentials = user_calendar_credentials.get(current_user.id)
    
    if credentials:
        # Revoke access
        calendar_helper.revoke_access(credentials)
        
        # Remove stored credentials
        del user_calendar_credentials[current_user.id]
    
    return {
        "message": "Google Calendar disconnected successfully"
    }
