"""
Habit Schemas
=============
[NOUMAN] These are your schemas to implement.

Pydantic schemas for habit-related request and response validation.
"""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime, time


class HabitBase(BaseModel):
    """
    Base schema with common habit fields.
    
    TODO: Define common habit fields
    WHY: Shared fields between create and response schemas
    """
    
    # TODO: Add title field with validation
    # WHY: Every habit needs a name
    # APPROACH: String with min/max length
    
    # TODO: Add description field (optional)
    # WHY: Users can add details about the habit
    
    # TODO: Add frequency field
    # WHY: How often the habit should be performed
    # APPROACH: Use string or enum value
    
    # TODO: Add category field (optional)
    # WHY: Organize habits by type
    
    pass


class HabitCreate(HabitBase):
    """
    Schema for creating a new habit.
    
    TODO: Define fields for habit creation
    WHY: Validate habit data before storing
    """
    
    # TODO: Add party_id field (optional)
    # WHY: Habit can optionally be part of a party
    
    # TODO: Add target_days field (optional)
    # WHY: For custom frequency, specify which days
    # APPROACH: List of day names or numbers
    
    # TODO: Add reminder_time field (optional)
    # WHY: When to remind user about this habit
    
    # TODO: Add color field (optional)
    # WHY: UI customization
    
    # TODO: Add icon field (optional)
    # WHY: Visual representation
    
    pass


class HabitUpdate(BaseModel):
    """
    Schema for updating a habit.
    
    TODO: Define updatable fields (all optional)
    WHY: Allow partial updates to habits
    """
    
    # TODO: Add all updatable fields as Optional
    # WHY: Users should be able to update any subset of fields
    # APPROACH: Same fields as HabitBase but all Optional
    
    pass


class HabitResponse(HabitBase):
    """
    Schema for habit data in responses.
    
    TODO: Define response fields
    WHY: Control what habit data is returned
    """
    
    # TODO: Add id field
    # WHY: Frontend needs habit ID
    
    # TODO: Add user_id field
    # WHY: Know who owns the habit
    
    # TODO: Add party_id field (optional)
    # WHY: Show party association if any
    
    # TODO: Add current_streak field
    # WHY: Display streak information
    
    # TODO: Add longest_streak field
    # WHY: Show personal best
    
    # TODO: Add is_active field
    # WHY: Show if habit is active
    
    # TODO: Add created_at field
    
    # TODO: Add completed_today field
    # WHY: Frontend shows if habit is done for today
    # APPROACH: This might be computed, not stored
    
    class Config:
        from_attributes = True


class HabitWithLogs(HabitResponse):
    """
    Schema for habit with its recent logs.
    
    TODO: Extend HabitResponse with log data
    WHY: Useful for dashboard view with completion history
    """
    
    # TODO: Add recent_logs field
    # WHY: Show recent completion history
    # APPROACH: List of LogResponse schemas
    
    pass


class HabitStats(BaseModel):
    """
    Schema for habit statistics.
    
    TODO: Define statistics fields
    WHY: Analytics and progress tracking
    """
    
    # TODO: Add total_completions field
    
    # TODO: Add completion_rate field
    # WHY: Percentage of days completed
    
    # TODO: Add current_streak field
    
    # TODO: Add longest_streak field
    
    # TODO: Add last_completed field
    # WHY: When was the habit last done
    
    pass

