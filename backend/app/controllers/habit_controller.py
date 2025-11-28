"""
Habit Controller
================
[NOUMAN] This is your controller to implement.

Handles CRUD operations for personal habits.
"""

from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import List, Optional

# TODO: Import your Habit model
# WHY: Need to create and query habit records

# TODO: Import habit schemas
# WHY: Type hints and validation

# TODO: Import streak calculator utility
# WHY: Update streaks when habits are logged


async def create_habit(habit_data, current_user, db: Session):
    """
    Create a new habit for the current user.
    
    TODO: Extract user ID from current_user
    WHY: Habit must be linked to its owner
    APPROACH: Get the id field from current_user
    SECURITY: Always use authenticated user ID, never from request body
    
    TODO: If party_id is provided, verify user is a party member
    WHY: Can't add habit to a party you're not in
    APPROACH: Query party_members table
    SECURITY: Prevent unauthorized party habit creation
    
    TODO: Create new Habit model instance
    WHY: Prepare the habit for database storage
    APPROACH: Use validated data from habit_data schema
    
    TODO: Add habit to database session and commit
    WHY: Persist the habit to PostgreSQL
    APPROACH: db.add(), db.commit(), db.refresh()
    
    TODO: Return the created habit
    WHY: Frontend needs the habit with generated ID
    APPROACH: Return the habit object (Pydantic will serialize it)
    """
    return {"message": "Create habit - to be implemented"}


async def get_user_habits(current_user, db: Session, 
                          category: Optional[str] = None,
                          is_active: Optional[bool] = True):
    """
    Get all habits for the current user.
    
    TODO: Build query for user's habits
    WHY: Only return habits belonging to this user
    APPROACH: Filter by user_id = current_user.id
    
    TODO: Apply optional filters (category, is_active)
    WHY: Let users filter their habit list
    APPROACH: Add .filter() for each provided filter
    
    TODO: Include today's completion status
    WHY: Dashboard shows if habit is done today
    APPROACH: Join with logs table or compute separately
    
    TODO: Order habits appropriately
    WHY: Consistent display order
    APPROACH: Order by created_at or custom order field
    
    TODO: Return list of habits
    WHY: Frontend displays habit list
    """
    return {"message": "Get habits - to be implemented"}


async def get_habit_by_id(habit_id: int, current_user, db: Session):
    """
    Get a specific habit by ID.
    
    TODO: Query habit by ID
    WHY: Fetch the specific habit requested
    APPROACH: db.query(Habit).filter(Habit.id == habit_id)
    
    TODO: Verify habit exists
    WHY: Return 404 if habit not found
    APPROACH: Check if query returned None
    
    TODO: Verify user owns this habit
    WHY: Users can only view their own habits
    APPROACH: Check habit.user_id == current_user.id
    SECURITY: Prevent unauthorized access to other users' habits
    
    TODO: Return the habit
    WHY: Frontend displays habit details
    """
    return {"message": "Get habit - to be implemented"}


async def update_habit(habit_id: int, habit_data, current_user, db: Session):
    """
    Update an existing habit.
    
    TODO: Get the existing habit
    WHY: Need to modify existing record
    APPROACH: Use get_habit_by_id to fetch and verify ownership
    
    TODO: Update only provided fields
    WHY: Partial updates - only change what was sent
    APPROACH: Loop through provided fields and update
    
    TODO: Commit changes to database
    WHY: Persist the updates
    APPROACH: db.commit(), db.refresh()
    
    TODO: Return updated habit
    WHY: Frontend needs updated data
    """
    return {"message": "Update habit - to be implemented"}


async def delete_habit(habit_id: int, current_user, db: Session):
    """
    Delete a habit (soft delete recommended).
    
    TODO: Get the existing habit
    WHY: Verify it exists and user owns it
    APPROACH: Use get_habit_by_id
    
    TODO: Decide: soft delete or hard delete?
    WHY: Soft delete preserves historical data
    APPROACH: Set is_active = False for soft delete
    
    TODO: If hard delete, also delete associated logs
    WHY: Maintain referential integrity
    APPROACH: Delete logs first, then habit
    
    TODO: Commit the deletion
    WHY: Persist the change
    
    TODO: Return success response
    WHY: Confirm deletion
    """
    return {"message": "Delete habit - to be implemented"}


async def get_habit_stats(habit_id: int, current_user, db: Session):
    """
    Get statistics for a specific habit.
    
    TODO: Verify habit exists and user owns it
    WHY: Security check
    
    TODO: Calculate total completions
    WHY: Count of times habit was done
    APPROACH: Count logs where completed = True
    
    TODO: Calculate completion rate
    WHY: Percentage of days completed
    APPROACH: Completed days / Total days since creation
    
    TODO: Get current and longest streak
    WHY: Streak information for motivation
    APPROACH: Use streak calculator utility
    
    TODO: Get last completion date
    WHY: Show when habit was last done
    APPROACH: Query most recent completed log
    
    TODO: Return stats object
    WHY: Frontend displays statistics
    """
    return {"message": "Get habit stats - to be implemented"}

