"""
Comment Model
=============
[HASEEB] Implementation.

Defines the Comment table for partner comments on habits and logs.
Comments allow accountability partners to provide feedback and encouragement.
"""

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database import Base


class Comment(Base):
    """
    Comment model for partner comments on habits and logs.
    
    Allows accountability partners to leave comments on each other's habits
    and specific log entries to provide feedback and encouragement.
    """
    
    __tablename__ = "comments"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Foreign keys
    habit_id = Column(Integer, ForeignKey("habits.id", ondelete="CASCADE"), nullable=False, index=True)
    log_id = Column(Integer, ForeignKey("logs.id", ondelete="CASCADE"), nullable=True, index=True)
    author_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    
    # Content
    content = Column(Text, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    habit = relationship("Habit", back_populates="comments")
    log = relationship("Log", back_populates="comments")
    author = relationship("User", back_populates="comments")
    
    def __repr__(self):
        """String representation for debugging."""
        return f"<Comment id={self.id} habit_id={self.habit_id} author_id={self.author_id}>"










