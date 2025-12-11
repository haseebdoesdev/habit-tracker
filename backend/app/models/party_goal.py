"""
Party Goal Model
================
[HASEEB] This is your model to implement.

Defines the PartyGoal table for shared goals within a party.
Party goals are collaborative challenges for all members.
"""

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Boolean, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.database import Base


class GoalStatus(enum.Enum):
    """
    Enum for party goal status.
    """
    ACTIVE = "ACTIVE"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    CANCELLED = "CANCELLED"


class PartyGoal(Base):
    """
    Party goal model for shared challenges.
    
    Party goals are collective targets that all party members
    work towards together.
    """
    __tablename__ = "party_goals"
    id = Column(Integer, primary_key=True, index=True)
    party_id = Column(Integer, ForeignKey("parties.id"))
    created_by_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String)
    description = Column(Text, nullable=True)
    target_value = Column(Integer, default=0)
    current_value = Column(Integer, default=0)
    status = Column(Enum(GoalStatus, name="goal_status_type"), default=GoalStatus.ACTIVE)
    start_date = Column(DateTime, default=datetime.utcnow)
    end_date = Column(DateTime, nullable=True)  # Deadline for the goal
    reward_points = Column(Integer, default=0)
    habit_category = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    party = relationship("Party", back_populates="goals")
    created_by = relationship("User", back_populates="created_party_goals")
    

