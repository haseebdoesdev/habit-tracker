"""
Party/Guild Model
=================
[NOUMAN] This is your model to implement.

Defines the Party table for group/guild features (Habitica-style).
Parties allow users to track habits together and compete.
"""

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database import Base


class Party(Base):
    """
    Party/Guild model for group habit tracking.
    
    Parties are groups where users can:
    - Share habits and goals
    - Compete on leaderboards
    - Chat and support each other
    """
    
    __tablename__ = "parties"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    
    creator_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    invite_code = Column(String(20), unique=True, nullable=False)
    
    is_public = Column(Boolean, default=False)
    max_members = Column(Integer, default=50)
    
    avatar_url = Column(String(500), nullable=True)
    total_points = Column(Integer, default=0)
    
    is_active = Column(Boolean, default=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    creator = relationship("User", foreign_keys=[creator_id])
    members = relationship("PartyMember", back_populates="party", cascade="all, delete-orphan")
    goals = relationship("PartyGoal", back_populates="party", cascade="all, delete-orphan")
    habits = relationship("Habit", back_populates="party")
