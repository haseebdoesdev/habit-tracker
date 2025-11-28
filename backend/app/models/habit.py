"""
Habit Model
===========
[NOUMAN] This is your model to implement.

Defines the Habit table for storing user habits.
Habits can be personal or associated with a party/guild.
"""

from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Enum, Text
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

# TODO: Import Base from your database module
# WHY: All models must inherit from Base for SQLAlchemy to recognize them


class HabitFrequency(enum.Enum):
    """
    Enum for how often a habit should be performed.
    
    TODO: Define frequency values
    WHY: Users need to specify how often they want to do habits
    APPROACH: Add values like DAILY, WEEKLY, MONTHLY, CUSTOM
    """
    pass


class HabitCategory(enum.Enum):
    """
    Enum for habit categories.
    
    TODO: Define category values
    WHY: Helps organize and filter habits
    APPROACH: Add values like HEALTH, FITNESS, LEARNING, PRODUCTIVITY, etc.
    """
    pass


class Habit:
    """
    Habit model for tracking user habits.
    
    Each habit belongs to a user and optionally to a party.
    Tracks completion streaks and supports AI suggestions.
    
    TODO: Make this class inherit from Base
    """
    
    # TODO: Define the table name
    # APPROACH: Set __tablename__ = "habits"
    
    # TODO: Add primary key column (id)
    # WHY: Unique identifier for each habit
    
    # TODO: Add user_id foreign key column
    # WHY: Links each habit to its owner
    # APPROACH: Integer column with ForeignKey("users.id")
    # SECURITY: Always verify user owns habit before allowing modifications
    
    # TODO: Add party_id foreign key column (optional/nullable)
    # WHY: Habits can optionally be part of a party challenge
    # APPROACH: Integer column with ForeignKey("parties.id"), nullable=True
    
    # TODO: Add title column
    # WHY: The name of the habit displayed to the user
    # APPROACH: String column with max length
    
    # TODO: Add description column
    # WHY: Detailed explanation of the habit
    # APPROACH: Text column for longer content, nullable=True
    
    # TODO: Add frequency column using Enum
    # WHY: How often the habit should be done
    # APPROACH: Use your HabitFrequency enum
    
    # TODO: Add category column using Enum
    # WHY: Organize habits by type
    # APPROACH: Use your HabitCategory enum
    
    # TODO: Add target_days column (for custom frequency)
    # WHY: If frequency is CUSTOM, specify which days
    # APPROACH: String to store comma-separated days or JSON
    
    # TODO: Add reminder_time column
    # WHY: When to remind user about this habit
    # APPROACH: Time or String column, nullable=True
    
    # TODO: Add is_active column
    # WHY: Allow pausing habits without deletion
    # APPROACH: Boolean with default=True
    
    # TODO: Add current_streak column
    # WHY: Track consecutive completions
    # APPROACH: Integer with default=0
    
    # TODO: Add longest_streak column
    # WHY: Track personal best streak
    # APPROACH: Integer with default=0
    
    # TODO: Add created_at and updated_at columns
    # WHY: Track when habits were created and modified
    
    # TODO: Add color/icon columns for UI customization
    # WHY: Let users personalize their habit display
    # APPROACH: String columns for hex color and icon name
    
    # ==================== RELATIONSHIPS ====================
    
    # TODO: Add relationship to user (many habits belong to one user)
    # user = relationship("User", back_populates="habits")
    
    # TODO: Add relationship to logs (one habit has many log entries)
    # logs = relationship("Log", back_populates="habit")
    
    # TODO: Add relationship to party (optional)
    # party = relationship("Party", back_populates="habits")
    
    pass

