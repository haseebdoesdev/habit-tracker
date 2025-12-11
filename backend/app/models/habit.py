"""
[NOUMAN]
Defines the Habit table for storing user habits.
Habits can be personal or associated with a party/guild.
"""

from sqlalchemy import (
    Column, Integer, String, Boolean, DateTime,
    ForeignKey, Enum, Text
)
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from app.database import Base

# == ENUMS ==
class HabitFrequency(enum.Enum):
    """Enum for how often a habit should be performed."""
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"
    CUSTOM = "custom"


class HabitCategory(enum.Enum):
    """Enum for habit categories."""
    HEALTH = "health"  
    FITNESS = "fitness"
    LEARNING = "learning"
    PRODUCTIVITY = "productivity"
    SOCIAL = "social"
    FINANCIAL = "financial"
    CREATIVE = "creative"
    OTHER = "other"


# == MODEL ==
class Habit(Base):
    """Habit model for tracking user habits."""
    
    __tablename__ = "habits"
    
    # Primary key
    id = Column(Integer, primary_key=True, index=True)
    # Foreign keys
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True) 
    party_id = Column(Integer, ForeignKey("parties.id"), nullable=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)  
    frequency = Column(Enum(HabitFrequency), nullable=False, default=HabitFrequency.DAILY)
    category = Column(Enum(HabitCategory), nullable=False) 
    # For custom frequency, store days in JSON or CSV
    target_days = Column(Text, nullable=True)
    reminder_time = Column(String, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)  
    current_streak = Column(Integer, default=0, nullable=False)  
    longest_streak = Column(Integer, default=0, nullable=False)   
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)  
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    color = Column(String(10), nullable=True)  # hex color
    icon = Column(String(50), nullable=True)

    # == RELATIONSHIPS ==
    # Connect habit → user
    user = relationship("User", back_populates="habits")
    # Connect habit → logs
    logs = relationship("Log", back_populates="habit", cascade="all, delete-orphan")
    # Connect habit → party
    party = relationship("Party", back_populates="habits")
    
    def __repr__(self):
        """String representation for debugging."""
        return f"<Habit id={self.id} title='{self.title}' user_id={self.user_id}>"
    
    def increment_streak(self):
        """Increment current streak and update longest streak if needed."""
        self.current_streak += 1
        if self.current_streak > self.longest_streak:
            self.longest_streak = self.current_streak
    
    def reset_streak(self):
        """Reset current streak to zero."""
        self.current_streak = 0
