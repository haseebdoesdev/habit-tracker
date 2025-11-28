"""
Party Schemas
=============
[NOUMAN] These are your schemas to implement.

Pydantic schemas for party/guild validation.
"""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class PartyBase(BaseModel):
    """
    Base schema with common party fields.
    
    TODO: Define common party fields
    WHY: Shared between create and response
    """
    
    # TODO: Add name field with validation
    # WHY: Every party needs a name
    # APPROACH: String with min/max length
    
    # TODO: Add description field (optional)
    # WHY: Explain party purpose
    
    # TODO: Add is_public field
    # WHY: Control visibility
    # APPROACH: Boolean, default False
    
    # TODO: Add max_members field (optional)
    # WHY: Limit party size
    
    pass


class PartyCreate(PartyBase):
    """
    Schema for creating a new party.
    
    TODO: Define party creation fields
    WHY: Validate party data before creation
    """
    
    # TODO: Add avatar_url field (optional)
    # WHY: Party image
    
    pass


class PartyUpdate(BaseModel):
    """
    Schema for updating party details.
    
    TODO: Define updatable fields (all optional)
    WHY: Allow partial updates
    SECURITY: Only party leaders should be able to update
    """
    
    # TODO: Add all updatable fields as Optional
    
    pass


class PartyResponse(PartyBase):
    """
    Schema for party data in responses.
    
    TODO: Define response fields
    WHY: Control what party data is returned
    """
    
    # TODO: Add id field
    
    # TODO: Add creator_id field
    
    # TODO: Add invite_code field
    # SECURITY: Only show to members
    
    # TODO: Add avatar_url field
    
    # TODO: Add total_points field
    
    # TODO: Add member_count field
    # WHY: How many members currently
    
    # TODO: Add is_active field
    
    # TODO: Add created_at field
    
    class Config:
        from_attributes = True


class PartyMemberResponse(BaseModel):
    """
    Schema for party member data.
    
    TODO: Define member response fields
    WHY: Show member information in party views
    """
    
    # TODO: Add id field
    
    # TODO: Add user_id field
    
    # TODO: Add username field
    # WHY: Display member name
    
    # TODO: Add avatar_url field
    
    # TODO: Add role field
    # WHY: Member's role in party
    
    # TODO: Add contribution_points field
    
    # TODO: Add joined_at field
    
    class Config:
        from_attributes = True


class PartyWithMembers(PartyResponse):
    """
    Schema for party with member list.
    
    TODO: Extend PartyResponse with members
    WHY: Party detail view needs member list
    """
    
    # TODO: Add members list
    # WHY: List of party members
    # APPROACH: List of PartyMemberResponse
    
    pass


class PartyJoinRequest(BaseModel):
    """
    Schema for joining a party.
    
    TODO: Define join request fields
    WHY: Validate join requests
    """
    
    # TODO: Add invite_code field
    # WHY: Required to join private parties
    
    pass


class PartyLeaderboardEntry(BaseModel):
    """
    Schema for party leaderboard entry.
    
    TODO: Define leaderboard fields
    WHY: Display party rankings
    """
    
    # TODO: Add rank field
    
    # TODO: Add party_id field
    
    # TODO: Add party_name field
    
    # TODO: Add total_points field
    
    # TODO: Add member_count field
    
    # TODO: Add avatar_url field
    
    pass

