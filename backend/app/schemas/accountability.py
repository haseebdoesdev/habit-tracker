"""
Accountability Schemas
======================
[HASEEB] These are your schemas to implement.

Pydantic schemas for accountability partnership validation.
"""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class PartnershipRequest(BaseModel):
    """
    Schema for requesting an accountability partnership.
    
    TODO: Define request fields
    WHY: Validate partnership requests
    """
    
    # TODO: Add partner_id field
    # WHY: Who to send the request to
    
    # TODO: Add message field (optional)
    # WHY: Personal message with the request
    
    pass


class PartnershipResponse(BaseModel):
    """
    Schema for partnership data in responses.
    
    TODO: Define response fields
    WHY: Control what partnership data is returned
    """
    
    # TODO: Add id field
    
    # TODO: Add requester_id field
    
    # TODO: Add partner_id field
    
    # TODO: Add status field
    # WHY: pending, active, declined, ended
    
    # TODO: Add message field
    
    # TODO: Add can_view_all_habits field
    
    # TODO: Add can_comment field
    
    # TODO: Add created_at field
    
    # TODO: Add accepted_at field (optional)
    
    class Config:
        from_attributes = True


class PartnershipWithUser(PartnershipResponse):
    """
    Schema for partnership with user details.
    
    TODO: Extend with user information
    WHY: Show partner details in UI
    """
    
    # TODO: Add partner_username field
    
    # TODO: Add partner_avatar_url field
    
    # TODO: Add partner_email field
    # SECURITY: Only show if permitted
    
    pass


class PartnershipUpdate(BaseModel):
    """
    Schema for updating partnership settings.
    
    TODO: Define updatable fields
    WHY: Allow changing partnership permissions
    """
    
    # TODO: Add optional can_view_all_habits field
    
    # TODO: Add optional can_comment field
    
    pass


class PartnershipAction(BaseModel):
    """
    Schema for accepting/declining partnership.
    
    TODO: Define action fields
    WHY: Handle partnership responses
    """
    
    # TODO: Add action field
    # WHY: accept or decline
    # APPROACH: String or enum
    
    pass


class PartnerComment(BaseModel):
    """
    Schema for partner comments on habits.
    
    TODO: Define comment fields
    WHY: Partners can comment on each other's habits
    """
    
    # TODO: Add habit_id field
    # WHY: Which habit to comment on
    
    # TODO: Add log_id field (optional)
    # WHY: Comment on specific log entry
    
    # TODO: Add content field
    # WHY: The comment text
    
    pass


class PartnerCommentResponse(PartnerComment):
    """
    Schema for comment in responses.
    
    TODO: Define response fields
    WHY: Return comment with metadata
    """
    
    # TODO: Add id field
    
    # TODO: Add author_id field
    
    # TODO: Add author_username field
    
    # TODO: Add created_at field
    
    class Config:
        from_attributes = True


class PartnerHabitView(BaseModel):
    """
    Schema for viewing partner's habits.
    
    TODO: Define partner habit view fields
    WHY: Show partner's progress
    SECURITY: Respect privacy settings
    """
    
    # TODO: Add partner_id field
    
    # TODO: Add partner_username field
    
    # TODO: Add habits list
    # WHY: Partner's visible habits
    
    # TODO: Add overall_completion_rate field
    
    # TODO: Add current_streaks field
    # WHY: Partner's active streaks
    
    pass

