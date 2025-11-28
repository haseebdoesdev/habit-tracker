"""
Habits Router
=============
[NOUMAN] This is your router to implement.

Defines habit-related API endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional, List

# TODO: Import database dependency
# TODO: Import habit controller
# TODO: Import habit schemas
# TODO: Import auth middleware


router = APIRouter(
    prefix="/habits",
    tags=["Habits"]
)


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_habit():
    """
    Create a new habit for the current user.
    
    TODO: Add function signature
    WHY: Accept HabitCreate schema, db session, current user
    APPROACH: def create_habit(habit_data: HabitCreate, 
                               db: Session = Depends(get_db),
                               current_user = Depends(get_current_user))
    
    TODO: Call habit controller's create function
    WHY: Delegate to business logic
    
    TODO: Return created habit
    WHY: Frontend needs habit with generated ID
    """
    return {"message": "Create habit endpoint - to be implemented"}


@router.get("/")
async def get_habits():
    """
    Get all habits for the current user.
    
    TODO: Add function signature with filters
    WHY: Support filtering and pagination
    APPROACH: Add Query parameters for category, is_active
    
    TODO: Add auth dependency
    WHY: Only return current user's habits
    SECURITY: User can only see their own habits
    
    TODO: Call habit controller's get_user_habits function
    WHY: Fetch filtered habit list
    
    TODO: Return habit list
    WHY: Dashboard display
    """
    return {"message": "Get habits endpoint - to be implemented"}


@router.get("/{habit_id}")
async def get_habit(habit_id: int):
    """
    Get a specific habit by ID.
    
    TODO: Add function signature
    WHY: Accept habit ID and auth
    
    TODO: Call habit controller's get_habit_by_id function
    WHY: Fetch and verify ownership
    
    TODO: Handle not found
    WHY: Return 404 if habit doesn't exist
    
    TODO: Return habit
    WHY: Habit detail view
    """
    return {"message": "Get habit endpoint - to be implemented"}


@router.put("/{habit_id}")
async def update_habit(habit_id: int):
    """
    Update an existing habit.
    
    TODO: Add function signature with HabitUpdate schema
    WHY: Accept partial updates
    
    TODO: Add auth dependency
    WHY: Verify ownership
    SECURITY: Only owner can update
    
    TODO: Call habit controller's update function
    WHY: Apply updates
    
    TODO: Return updated habit
    WHY: Confirm changes
    """
    return {"message": "Update habit endpoint - to be implemented"}


@router.delete("/{habit_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_habit(habit_id: int):
    """
    Delete a habit.
    
    TODO: Add function signature
    WHY: Accept habit ID and auth
    SECURITY: Only owner can delete
    
    TODO: Call habit controller's delete function
    WHY: Remove or archive habit
    
    TODO: Return no content
    WHY: Standard delete response
    """
    return None


@router.get("/{habit_id}/stats")
async def get_habit_stats(habit_id: int):
    """
    Get statistics for a specific habit.
    
    TODO: Add function signature
    WHY: Accept habit ID and auth
    
    TODO: Call habit controller's get_habit_stats function
    WHY: Calculate habit statistics
    
    TODO: Return stats object
    WHY: Analytics display
    """
    return {"message": "Get stats endpoint - to be implemented"}


@router.post("/{habit_id}/complete")
async def complete_habit(habit_id: int):
    """
    Quick endpoint to mark habit as completed for today.
    
    TODO: Add function signature
    WHY: Simple completion action
    
    TODO: Create log entry for today
    WHY: Record completion
    APPROACH: Call log controller or create log directly
    
    TODO: Return updated habit with today's status
    WHY: Confirm completion
    """
    return {"message": "Complete habit endpoint - to be implemented"}

