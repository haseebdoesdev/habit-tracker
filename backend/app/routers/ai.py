"""
AI Router
=========
[NOUMAN] This is your router to implement.

Defines AI/Gemini integration API endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

# TODO: Import dependencies
# TODO: Import AI controller
# TODO: Import auth middleware


router = APIRouter(
    prefix="/ai",
    tags=["AI Features"]
)


@router.get("/suggestions")
async def get_suggestions():
    """
    Get AI-powered habit suggestions.
    
    TODO: Add function signature with optional category filter
    WHY: Filter suggestions by type
    APPROACH: Add Query param for category
    
    TODO: Add auth dependency
    WHY: Need user context for personalization
    
    TODO: Call AI controller's get_habit_suggestions function
    WHY: Generate personalized suggestions
    
    TODO: Return suggestions list
    WHY: Display to user
    """
    return {"message": "Get suggestions endpoint - to be implemented"}


@router.get("/weekly-summary")
async def get_weekly_ai_summary():
    """
    Get AI-generated weekly summary and insights.
    
    TODO: Add function signature with auth
    WHY: Need user's data
    
    TODO: Call AI controller's get_weekly_summary function
    WHY: Generate personalized weekly insights
    
    TODO: Return weekly summary
    WHY: Dashboard display
    """
    return {"message": "Get weekly summary endpoint - to be implemented"}


@router.get("/motivation")
async def get_motivation():
    """
    Get personalized motivational message.
    
    TODO: Add function signature with auth
    WHY: Need user context
    
    TODO: Call AI controller's get_motivation_message function
    WHY: Generate contextual motivation
    
    TODO: Return motivation message
    WHY: Boost user morale
    """
    return {"message": "Get motivation endpoint - to be implemented"}


@router.get("/patterns")
async def get_patterns():
    """
    Get AI analysis of habit patterns.
    
    TODO: Add function signature with auth
    WHY: Need user's habit history
    
    TODO: Call AI controller's analyze_habit_patterns function
    WHY: Identify patterns in behavior
    
    TODO: Return pattern analysis
    WHY: Insights for user
    """
    return {"message": "Get patterns endpoint - to be implemented"}


@router.get("/tips/{habit_id}")
async def get_habit_tips(habit_id: int):
    """
    Get AI tips for improving a specific habit.
    
    TODO: Add function signature
    WHY: Accept habit ID and auth
    
    TODO: Call AI controller's get_habit_improvement_tips function
    WHY: Generate habit-specific tips
    
    TODO: Return tips
    WHY: Help user improve
    """
    return {"message": "Get habit tips endpoint - to be implemented"}


@router.post("/chat")
async def chat_with_ai():
    """
    Free-form chat with AI about habits.
    
    TODO: Add function signature with message body
    WHY: Accept user's message
    APPROACH: Create schema or use raw string
    
    TODO: Add auth dependency
    WHY: Need user context
    
    TODO: Call AI controller's chat_with_ai function
    WHY: Get AI response
    
    TODO: Return AI response
    WHY: Display in chat UI
    """
    return {"message": "Chat endpoint - to be implemented"}

