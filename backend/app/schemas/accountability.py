"""
Accountability Schemas
======================
[HASEEB] These are your schemas to implement.

Pydantic schemas for accountability partnership validation.
"""

from pydantic import BaseModel, Field, field_validator
from typing import Optional, List, Literal, TYPE_CHECKING, Any
from datetime import datetime

if TYPE_CHECKING:
    from app.schemas.habit import HabitResponse

class PartnershipRequest(BaseModel):
    """
    Schema for requesting an accountability partnership.
    
    """
    
    partner_id: int
    message: Optional[str] = None


class PartnershipResponse(BaseModel):
    """
    Schema for partnership data in responses.
    """
    
    id: int 
    requester_id: int 
    partner_id: int
    status: str  # Will be converted from enum
    message: Optional[str] = None  # Nullable in model
    can_view_all_habits: bool
    can_comment: bool
    created_at: datetime
    accepted_at: Optional[datetime] = None
    
    @field_validator("status", mode="before")
    @classmethod
    def convert_status_enum(cls, v: Any) -> str:
        """Convert PartnershipStatus enum to string value."""
        if hasattr(v, "value"):
            return v.value
        return str(v)
    
    class Config:
        from_attributes = True


class PartnershipWithUser(PartnershipResponse):
    """
    Schema for partnership with user details.
    
    """
    
    partner_username: str
    partner_avatar_url: Optional[str] = None  # Nullable in User model
    partner_email: str


class PartnershipUpdate(BaseModel):
    """
    Schema for updating partnership settings.
    
    """
    
    can_view_all_habits: bool
    can_comment: bool
    pass


class PartnershipAction(BaseModel):
    """
    Schema for accepting/declining partnership.
"""    
    action: Literal["accept", "decline"]
    pass


class PartnerComment(BaseModel):
    """
    Schema for partner comments on habits.
    """
    habit_id: int
    log_id: Optional[int]
    content: str

class PartnerCommentResponse(PartnerComment):
    """
    Schema for comment in responses.
    
    """
    id:int
    author_id: int
    author_username: str
    created_at: datetime
    class Config:
        from_attributes = True


class PartnerHabitView(BaseModel):
    """
    Schema for viewing partner's habits.
    
    """
    
    partner_id: int
    partner_username: str
    habits: List[dict]  # Serialized habit data
    overall_completion_rate: float
    current_streaks: List[int]


