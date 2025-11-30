"""
Habit Schemas
=============
[NOUMAN] These are your schemas to implement.

Pydantic schemas for habit-related request and response validation.
"""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime, date


class HabitBase(BaseModel):
    """
    Base schema with common habit fields.
    """
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    frequency: str = Field(default="DAILY")  # DAILY, WEEKLY, MONTHLY, CUSTOM
    category: Optional[str] = Field(default="OTHER")  # HEALTH, FITNESS, LEARNING, etc.


class HabitCreate(HabitBase):
    """
    Schema for creating a new habit.
    """
    party_id: Optional[int] = None
    target_days: Optional[str] = None  # Comma-separated days for CUSTOM frequency
    reminder_time: Optional[str] = None  # HH:MM format
    color: Optional[str] = Field(None, pattern=r'^#[0-9A-Fa-f]{6}$')  # Hex color
    icon: Optional[str] = None


class HabitUpdate(BaseModel):
    """
    Schema for updating a habit.
    """
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    frequency: Optional[str] = None
    category: Optional[str] = None
    target_days: Optional[str] = None
    reminder_time: Optional[str] = None
    color: Optional[str] = Field(None, pattern=r'^#[0-9A-Fa-f]{6}$')
    icon: Optional[str] = None
    is_active: Optional[bool] = None


class HabitResponse(HabitBase):
    """
    Schema for habit data in responses.
    """
    id: int
    user_id: int
    party_id: Optional[int] = None
    target_days: Optional[str] = None
    reminder_time: Optional[str] = None
    color: Optional[str] = None
    icon: Optional[str] = None
    current_streak: int = 0
    longest_streak: int = 0
    is_active: bool = True
    created_at: datetime
    updated_at: Optional[datetime] = None
    completed_today: Optional[bool] = None  # Computed field

    class Config:
        from_attributes = True


class LogResponseBrief(BaseModel):
    """Brief log response for embedding in HabitWithLogs."""
    id: int
    log_date: date
    completed: bool
    notes: Optional[str] = None
    mood: Optional[int] = None

    class Config:
        from_attributes = True


class HabitWithLogs(HabitResponse):
    """
    Schema for habit with its recent logs.
    """
    recent_logs: List[LogResponseBrief] = []


class HabitStats(BaseModel):
    """
    Schema for habit statistics.
    """
    habit_id: int
    total_completions: int = 0
    completion_rate: float = 0.0  # Percentage (0-100)
    current_streak: int = 0
    longest_streak: int = 0
    last_completed: Optional[date] = None
    total_days_tracked: int = 0
