"""
AI Router
=========
[NOUMAN] Implementation.

Defines AI/Gemini integration API endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional, List, Dict
from pydantic import BaseModel, Field

from app.database import get_db
from app.controllers import ai_controller
from app.middleware.auth import get_current_active_user
from app.models.user import User


class ChatRequest(BaseModel):
    """Schema for AI chat request."""
    message: str = Field(..., min_length=1, description="Message to send to AI")


router = APIRouter(
    prefix="/ai",
    tags=["AI Features"]
)

@router.get("/suggestions")
async def get_suggestions(
    category: Optional[str] = Query(None, description="Filter suggestions by category"),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    return await ai_controller.get_habit_suggestions(current_user, db, category)

@router.get("/weekly-summary")
async def get_weekly_ai_summary(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    return await ai_controller.get_weekly_summary(current_user, db)

@router.get("/motivation")
async def get_motivation(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    return await ai_controller.get_motivation_message(current_user, db)

@router.get("/patterns")
async def get_patterns(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    return await ai_controller.analyze_habit_patterns(current_user, db)

@router.get("/tips/{habit_id}")
async def get_habit_tips(
    habit_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    return await ai_controller.get_habit_improvement_tips(habit_id, current_user, db)

@router.post("/chat")
async def chat_with_ai(
    chat_request: ChatRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Chat with AI about habits."""
    return await ai_controller.chat_with_ai(chat_request.message, current_user, db)