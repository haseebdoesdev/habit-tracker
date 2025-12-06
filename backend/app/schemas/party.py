"""
Party Schemas
=============
[NOUMAN] Implementation.

Pydantic schemas for party/guild validation.
"""

from pydantic import BaseModel, Field, HttpUrl
from typing import Optional, List
from datetime import datetime

# 1. Base Schema (Common fields)
class PartyBase(BaseModel):
    """Base schema with common party fields."""
    name: str = Field(..., min_length=1, max_length=100, description="Name of the party")
    description: Optional[str] = None
    is_public: bool = False
    max_members: int = Field(default=50, gt=0, le=100, description="Max members allowed (1-100)")

# 2. Create Schema (Input)
class PartyCreate(PartyBase):
    """Schema for creating a new party."""
    avatar_url: Optional[str] = None

# 3. Update Schema (Input - Partial updates allowed)
class PartyUpdate(BaseModel):
    """Schema for updating party details."""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = None
    is_public: Optional[bool] = None
    max_members: Optional[int] = Field(None, gt=0, le=100)
    avatar_url: Optional[str] = None

# 4. Response Schema (Output)
class PartyResponse(PartyBase):
    """Schema for party data in responses."""
    id: int
    creator_id: int
    invite_code: str
    avatar_url: Optional[str] = None
    total_points: int = 0
    member_count: int = 0
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# 5. Member Response Schema
class PartyMemberResponse(BaseModel):
    """Schema for party member data."""
    id: int
    user_id: int
    username: str
    avatar_url: Optional[str] = None
    role: str # LEADER, OFFICER, MEMBER
    contribution_points: int
    joined_at: datetime

    class Config:
        from_attributes = True

# 6. Detailed Party View
class PartyWithMembers(PartyResponse):
    """Schema for party with member list."""
    members: List[PartyMemberResponse] = []

# 7. Join Request
class PartyJoinRequest(BaseModel):
    """Schema for joining a party."""
    invite_code: str

# 8. Leaderboard Entry
class PartyLeaderboardEntry(BaseModel):
    """Schema for party leaderboard entry."""
    rank: int
    party_id: int
    party_name: str
    total_points: int
    member_count: int
    avatar_url: Optional[str] = None