"""
Log Schemas
===========
[OMAMAH] These are your schemas to implement.

Pydantic schemas for habit log/completion validation.
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime, date


class LogBase(BaseModel):
    """
    Base schema with common log fields.
    
    TODO: Define common log fields
    WHY: Shared between create and response
    """
    
    # TODO: Add notes field (optional)
    # WHY: Users can add context to their completion
    
    # TODO: Add mood/rating field (optional)
    # WHY: Track how user felt about the habit
    # APPROACH: Integer 1-5 or similar scale
    
    # TODO: Add duration_minutes field (optional)
    # WHY: Some habits track time spent
    
    pass


class LogCreate(LogBase):
    """
    Schema for logging a habit completion.
    
    TODO: Define fields for creating a log entry
    WHY: Validate completion data
    """
    
    # TODO: Add habit_id field
    # WHY: Identify which habit is being logged
    
    # TODO: Add log_date field (optional)
    # WHY: Allow logging for past dates
    # APPROACH: Default to today if not provided
    
    # TODO: Add completed field
    # WHY: Whether the habit was done or skipped
    # APPROACH: Boolean, default True
    
    pass


class LogUpdate(BaseModel):
    """
    Schema for updating a log entry.
    
    TODO: Define updatable fields
    WHY: Allow corrections to log entries
    """
    
    # TODO: Add optional completed field
    # WHY: Fix mistakes in logging
    
    # TODO: Add optional notes field
    # WHY: Update completion notes
    
    # TODO: Add optional mood field
    
    # TODO: Add optional duration_minutes field
    
    pass


class LogResponse(LogBase):
    """
    Schema for log data in responses.
    
    TODO: Define response fields
    WHY: Control what log data is returned
    """
    
    # TODO: Add id field
    
    # TODO: Add habit_id field
    
    # TODO: Add user_id field
    
    # TODO: Add log_date field
    
    # TODO: Add completed field
    
    # TODO: Add completion_time field (optional)
    # WHY: When exactly the habit was completed
    
    # TODO: Add created_at field
    
    class Config:
        from_attributes = True


class DailyLogSummary(BaseModel):
    """
    Schema for daily log summary.
    
    TODO: Define summary fields
    WHY: Overview of all habits for a day
    """
    
    # TODO: Add date field
    
    # TODO: Add total_habits field
    # WHY: How many habits were tracked
    
    # TODO: Add completed_habits field
    # WHY: How many were completed
    
    # TODO: Add completion_percentage field
    
    # TODO: Add logs list
    # WHY: Individual log entries for the day
    
    pass


class WeeklyLogSummary(BaseModel):
    """
    Schema for weekly log summary.
    
    TODO: Define weekly summary fields
    WHY: Week-over-week progress tracking
    """
    
    # TODO: Add week_start and week_end fields
    
    # TODO: Add daily_summaries list
    # WHY: Breakdown by day
    
    # TODO: Add weekly_completion_rate field
    
    # TODO: Add best_day field
    # WHY: Which day had highest completion
    
    pass

