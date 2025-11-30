"""
Log Schemas
===========
[OMAMAH] These are your schemas to implement.

Pydantic schemas for habit log/completion validation.
"""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime, date


class LogBase(BaseModel):
    """
    Base schema with common log fields.
    """
    notes: Optional[str] = None
    mood: Optional[int] = Field(None, ge=1, le=5)  # 1-5 scale
    duration_minutes: Optional[int] = Field(None, ge=0)


class LogCreate(LogBase):
    """
    Schema for logging a habit completion.
    """
    habit_id: int
    log_date: Optional[date] = None  # Defaults to today if not provided
    completed: bool = True


class LogUpdate(BaseModel):
    """
    Schema for updating a log entry.
    """
    completed: Optional[bool] = None
    notes: Optional[str] = None
    mood: Optional[int] = Field(None, ge=1, le=5)
    duration_minutes: Optional[int] = Field(None, ge=0)


class LogResponse(LogBase):
    """
    Schema for log data in responses.
    """
    id: int
    habit_id: int
    user_id: int
    log_date: date
    completed: bool
    completion_time: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True


class LogWithHabitInfo(LogResponse):
    """
    Schema for log with habit details.
    """
    habit_title: str
    habit_category: Optional[str] = None
    habit_color: Optional[str] = None
    habit_icon: Optional[str] = None


class DailyLogSummary(BaseModel):
    """
    Schema for daily log summary.
    """
    date: date
    total_habits: int = 0
    completed_habits: int = 0
    completion_percentage: float = 0.0
    logs: List[LogResponse] = []


class WeeklyLogSummary(BaseModel):
    """
    Schema for weekly log summary.
    """
    week_start: date
    week_end: date
    daily_summaries: List[DailyLogSummary] = []
    weekly_completion_rate: float = 0.0
    total_completions: int = 0
    total_habits_tracked: int = 0
    best_day: Optional[date] = None
    best_day_completion_rate: float = 0.0


class MonthlyLogSummary(BaseModel):
    """
    Schema for monthly log summary.
    """
    month: int
    year: int
    total_completions: int = 0
    total_possible: int = 0
    completion_rate: float = 0.0
    weekly_summaries: List[WeeklyLogSummary] = []
    streak_info: Optional[dict] = None
