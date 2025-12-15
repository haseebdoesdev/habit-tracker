"""
Comment Model
=============
[OMAMAH] This is your model to implement.

Defines the Comment table for accountability interactions.
Users can comment on their partners' habits or logs.
"""

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database import Base

class Comment(Base):
    """
    Comment model for habit discussions.
    
    Allows users (accountability partners) to leave messages on 
    specific habits or daily logs.
    """
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    
    # The author of the comment
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # The habit being commented on (Required)
    habit_id = Column(Integer, ForeignKey("habits.id"), nullable=False)
    
    # The specific log entry being commented on (Optional)
    # If null, it's a general comment on the habit
    log_id = Column(Integer, ForeignKey("logs.id"), nullable=True)
    
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # == RELATIONSHIPS ==
    user = relationship("User", back_populates="comments")
    habit = relationship("Habit", back_populates="comments")
    log = relationship("Log", back_populates="comments")

    def __repr__(self):
        return f"<Comment id={self.id} user_id={self.user_id} habit_id={self.habit_id}>"