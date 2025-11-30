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

from app.database import Base


class HabitFrequency(enum.Enum):
    """
    Enum for how often a habit should be performed.
    """
    DAILY = "DAILY"
    WEEKLY = "WEEKLY"
    MONTHLY = "MONTHLY"
    CUSTOM = "CUSTOM"


class HabitCategory(enum.Enum):
    """
    Enum for habit categories.
    """
    HEALTH = "HEALTH"
    FITNESS = "FITNESS"
    LEARNING = "LEARNING"
    PRODUCTIVITY = "PRODUCTIVITY"
    MINDFULNESS = "MINDFULNESS"
    FINANCE = "FINANCE"
    SOCIAL = "SOCIAL"
    CREATIVITY = "CREATIVITY"
    OTHER = "OTHER"


class Habit(Base):
    """
    Habit model for tracking user habits.
    
    Each habit belongs to a user and optionally to a party.
    Tracks completion streaks and supports AI suggestions.
    """
    
    __tablename__ = "habits"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    party_id = Column(Integer, ForeignKey("parties.id"), nullable=True)
    
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    
    frequency = Column(Enum(HabitFrequency, name="habit_frequency_type"), default=HabitFrequency.DAILY)
    category = Column(Enum(HabitCategory, name="habit_category_type"), default=HabitCategory.OTHER)
    
    target_days = Column(String(100), nullable=True)  # Comma-separated days for CUSTOM frequency
    reminder_time = Column(String(10), nullable=True)  # HH:MM format
    
    is_active = Column(Boolean, default=True)
    current_streak = Column(Integer, default=0)
    longest_streak = Column(Integer, default=0)
    
    color = Column(String(7), nullable=True)  # Hex color like #FF5733
    icon = Column(String(50), nullable=True)  # Icon name
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="habits")
    logs = relationship("Log", back_populates="habit", cascade="all, delete-orphan")
    party = relationship("Party", back_populates="habits")
