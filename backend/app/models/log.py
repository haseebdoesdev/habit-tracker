"""
Log Model (Habit Completion Log)
================================
[OMAMAH] This is your model to implement.

Defines the Log table for recording daily habit completions.
Each log entry represents a single completion of a habit.
"""

from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, Date
from sqlalchemy.orm import relationship
from datetime import datetime, date

# TODO: Import Base from your database module
# WHY: All models must inherit from Base


class Log:
    """
    Habit completion log model.
    
    Records each time a user completes (or misses) a habit.
    Used for streak calculation and analytics.
    
    TODO: Make this class inherit from Base
    """
    
    # TODO: Define the table name
    # APPROACH: Set __tablename__ = "logs"
    
    # TODO: Add primary key column (id)
    # WHY: Unique identifier for each log entry
    
    # TODO: Add habit_id foreign key column
    # WHY: Links each log to the habit it's tracking
    # APPROACH: Integer with ForeignKey("habits.id")
    
    # TODO: Add user_id foreign key column
    # WHY: Denormalized for faster queries - know who logged without joining
    # APPROACH: Integer with ForeignKey("users.id")
    
    # TODO: Add log_date column
    # WHY: The date this completion is for (may differ from created_at)
    # APPROACH: Date column (not DateTime - we track by day)
    
    # TODO: Add completed column
    # WHY: Whether the habit was done on this day
    # APPROACH: Boolean column with default=False
    
    # TODO: Add completion_time column
    # WHY: Track what time of day the habit was completed
    # APPROACH: DateTime column, nullable=True (only set if completed)
    
    # TODO: Add notes column
    # WHY: Users might want to add context to their completion
    # APPROACH: Text column, nullable=True
    
    # TODO: Add mood/rating column
    # WHY: Track how user felt about the habit that day
    # APPROACH: Integer 1-5 scale, nullable=True
    
    # TODO: Add duration_minutes column
    # WHY: Some habits may track how long they took
    # APPROACH: Integer column, nullable=True
    
    # TODO: Add created_at column
    # WHY: When the log entry was actually created
    # APPROACH: DateTime with default to current time
    
    # ==================== RELATIONSHIPS ====================
    
    # TODO: Add relationship to habit
    # habit = relationship("Habit", back_populates="logs")
    
    # TODO: Add relationship to user
    # user = relationship("User", back_populates="logs")
    
    # ==================== CONSTRAINTS ====================
    
    # TODO: Add unique constraint on habit_id + log_date
    # WHY: Prevent duplicate logs for the same habit on the same day
    # APPROACH: Use __table_args__ with UniqueConstraint
    
    pass

