"""
Party/Guild Model
=================
[NOUMAN] This is your model to implement.

Defines the Party table for group/guild features (Habitica-style).
Parties allow users to track habits together and compete.
"""

from sqlalchemy import (Column, Integer, String, DateTime, ForeignKey, Text, Boolean, CheckConstraint)
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Party(Base):
    __tablename__ = "parties"
    

    id = Column(Integer, primary_key=True, index=True)
    creator_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True) 
    name = Column(String(100), nullable=False, index=True)  
    description = Column(Text, nullable=True)
    invite_code = Column(String(10), unique=True, nullable=False, index=True)  
    is_public = Column(Boolean, default=False, nullable=False)
    max_members = Column(Integer, default=50, nullable=False)
    avatar_url = Column(String(200), nullable=True)
    total_points = Column(Integer, default=0, nullable=False)

    # == Timestamps ==
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    __table_args__ = (
        CheckConstraint("max_members > 0", name="check_max_members_positive"),
    )

    # == RELATIONSHIPS ==
    # Creator (User → Party) — Many parties can be created by one user
    creator = relationship("User", back_populates="created_parties", foreign_keys="Party.creator_id")
    # Party members (PartyMember bridge table)
    members = relationship("PartyMember", back_populates="party",
                           cascade="all, delete-orphan")
    goals = relationship("PartyGoal", back_populates="party",
                         cascade="all, delete-orphan")
    # Party habits (habits belong to users, not parties)
    habits = relationship("Habit", back_populates="party") 
    def __repr__(self):
        return f"<Party id={self.id} name='{self.name}' creator_id={self.creator_id}>"

