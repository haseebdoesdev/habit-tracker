"""
User Model
==========
[HASEEB] This is your model to implement.

Defines the User table for storing user account information.
Users can track habits, join parties, and have accountability partners.
"""

from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum, Text
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.models.accountability import AccountabilityPartnership
from app.database import Base

class UserType(enum.Enum):
    """
    Enum for different user types in the system.
    
    """
    REGULAR = "REGULAR"
    PREMIUM = "PREMIUM"
    ADMIN = "ADMIN"


class User(Base):
    """
    User account model.
    
    Represents a user in the habit tracking system.
    Users can have personal habits, join parties, and partner with others.
    """
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    username = Column(String, unique=True, nullable=False)
    user_type = Column(Enum(UserType, name="user_type_type"), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    avatar_url = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    timezone = Column(String, nullable=True)
    habits = relationship("Habit", back_populates="user")
    achievements = relationship("Achievement", back_populates="user")
    party_memberships = relationship("PartyMember", back_populates="user")
    updated_at = Column(DateTime, default=datetime.utcnow)
    accountability_partnerships_as_requester = relationship(
        "AccountabilityPartnership",
        foreign_keys=[AccountabilityPartnership.requester_id],
        back_populates="requester"
    )
    accountability_partnerships_as_partner = relationship(
        "AccountabilityPartnership",
        foreign_keys=[AccountabilityPartnership.partner_id],
        back_populates="partner"
    )
    logs = relationship("Log", back_populates="user")
    # Relationship for parties created by this user
    created_parties = relationship("Party", back_populates="creator", foreign_keys="Party.creator_id")
    # Relationship for party goals created by this user
    created_party_goals = relationship("PartyGoal", back_populates="created_by")
    # Relationship for comments authored by this user
    comments = relationship("Comment", back_populates="author")