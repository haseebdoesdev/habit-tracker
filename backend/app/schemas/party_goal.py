"""
Party Goal Schemas
==================
[OMAMAH] These are your schemas to implement.

Pydantic schemas for party goal validation.
"""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class PartyGoalBase(BaseModel):
    """
    Base schema with common party goal fields.
    """
    title: str = Field(..., min_length=1, max_length=200, description="Name of the goal")
    description: Optional[str] = Field(None, description="Explain the goal details")
    target_value: int = Field(..., gt=0, description="What number to reach (e.g. 100 completions)")
    habit_category: Optional[str] = Field(None, description="Goal might be for specific habit types")


class PartyGoalCreate(PartyGoalBase):
    """
    Schema for creating a party goal.
    """
    party_id: int = Field(..., description="Which party this goal belongs to")
    start_date: Optional[datetime] = Field(None, description="When the goal begins")
    end_date: Optional[datetime] = Field(None, description="Deadline for the goal")
    reward_points: Optional[int] = Field(0, ge=0, description="Points awarded upon completion")


class PartyGoalUpdate(BaseModel):
    """
    Schema for updating a party goal.
    """
    title: Optional[str] = None
    description: Optional[str] = None
    target_value: Optional[int] = Field(None, gt=0)
    end_date: Optional[datetime] = None
    status: Optional[str] = Field(None, description="Mark as completed/cancelled")


class PartyGoalResponse(PartyGoalBase):
    """
    Schema for party goal in responses.
    """
    id: int
    party_id: int
    created_by_id: int
    current_value: int = 0
    status: str
    start_date: datetime
    end_date: Optional[datetime] = None
    reward_points: int
    progress_percentage: float = 0.0
    created_at: datetime

    class Config:
        from_attributes = True


class PartyGoalProgress(BaseModel):
    """
    Schema for goal progress update.
    """
    goal_id: int
    increment: int = Field(1, ge=1, description="How much to add to current value")
    user_id: Optional[int] = Field(None, description="Who contributed")


class PartyGoalContributor(BaseModel):
    """
    Schema for goal contributor.
    """
    user_id: int
    username: str
    contribution_points: int
    contribution_percentage: float


class PartyGoalWithContributors(PartyGoalResponse):
    """
    Schema for goal with contributor list.
    """
    contributors: List[PartyGoalContributor] = []