"""
Log Model (Habit Completion Log)
================================
[OMAMAH] This is your model to implement.

Defines the Log table for recording daily habit completions.
Each log entry represents a single completion of a habit.
"""

from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, Date, UniqueConstraint, Float
from sqlalchemy.orm import relationship
from datetime import datetime, date

from app.database import Base


class Log(Base):
    """
    Habit completion log model.
    
    Records each time a user completes (or misses) a habit.
    Used for streak calculation and analytics.
    """
    
    __tablename__ = "logs"
    
    id = Column(Integer, primary_key=True, index=True)
    habit_id = Column(Integer, ForeignKey("habits.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    log_date = Column(Date, nullable=False, default=date.today)
    completed = Column(Boolean, default=False)
    completion_time = Column(DateTime, nullable=True)
    
    notes = Column(Text, nullable=True)
    mood = Column(Integer, nullable=True)  # 1-5 scale
    duration_minutes = Column(Integer, nullable=True)
    
    # AI-analyzed mood fields
    mood_label = Column(String, nullable=True)  # e.g., "Happy", "Stressed", "Motivated"
    mood_intensity = Column(Float, nullable=True)  # 0.0-1.0
    mood_analyzed_at = Column(DateTime, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    habit = relationship("Habit", back_populates="logs")
    user = relationship("User", back_populates="logs")
    comments = relationship("Comment", back_populates="log", cascade="all, delete-orphan")
    
    # Constraints - prevent duplicate logs for same habit on same day
    __table_args__ = (
        UniqueConstraint('habit_id', 'log_date', name='uq_habit_log_date'),
    )
