"""
Pydantic Schemas Package
========================
This package contains all Pydantic schemas for request/response validation.

Schemas define the shape of data coming into and going out of the API.
"""

from app.schemas.user import UserCreate, UserResponse, UserLogin, UserUpdate
from app.schemas.habit import HabitCreate, HabitResponse, HabitUpdate
from app.schemas.log import LogCreate, LogResponse, LogUpdate
from app.schemas.achievement import AchievementResponse
from app.schemas.party import PartyCreate, PartyResponse, PartyUpdate
from app.schemas.party_goal import PartyGoalCreate, PartyGoalResponse, PartyGoalUpdate
from app.schemas.accountability import (
    PartnershipRequest, 
    PartnershipResponse, 
    PartnershipWithUser,
    PartnershipUpdate,
    PartnershipAction
)

__all__ = [
    # User schemas
    "UserCreate",
    "UserResponse",
    "UserLogin",
    "UserUpdate",
    # Habit schemas
    "HabitCreate",
    "HabitResponse",
    "HabitUpdate",
    # Log schemas
    "LogCreate",
    "LogResponse",
    "LogUpdate",
    # Achievement schemas
    "AchievementResponse",
    # Party schemas
    "PartyCreate",
    "PartyResponse",
    "PartyUpdate",
    # Party goal schemas
    "PartyGoalCreate",
    "PartyGoalResponse",
    "PartyGoalUpdate",
    # Accountability schemas
    "PartnershipRequest",
    "PartnershipResponse",
    "PartnershipWithUser",
    "PartnershipUpdate",
    "PartnershipAction",
]

