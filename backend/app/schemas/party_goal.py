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
    
    TODO: Define common goal fields
    WHY: Shared between create and response
    """
    
    # TODO: Add title field
    # WHY: Name of the goal
    
    # TODO: Add description field (optional)
    # WHY: Explain the goal details
    
    # TODO: Add target_value field
    # WHY: What number to reach
    # APPROACH: Integer for countable goals
    
    # TODO: Add habit_category field (optional)
    # WHY: Goal might be for specific habit types
    
    pass


class PartyGoalCreate(PartyGoalBase):
    """
    Schema for creating a party goal.
    
    TODO: Define goal creation fields
    WHY: Validate goal data before creation
    """
    
    # TODO: Add party_id field
    # WHY: Which party this goal belongs to
    
    # TODO: Add start_date field
    # WHY: When the goal begins
    
    # TODO: Add end_date field
    # WHY: Deadline for the goal
    
    # TODO: Add reward_points field (optional)
    # WHY: Points awarded upon completion
    
    pass


class PartyGoalUpdate(BaseModel):
    """
    Schema for updating a party goal.
    
    TODO: Define updatable fields
    WHY: Allow modifications to goals
    SECURITY: Only party leaders should update
    """
    
    # TODO: Add optional title field
    
    # TODO: Add optional description field
    
    # TODO: Add optional target_value field
    
    # TODO: Add optional end_date field
    
    # TODO: Add optional status field
    # WHY: Mark as completed/cancelled
    
    pass


class PartyGoalResponse(PartyGoalBase):
    """
    Schema for party goal in responses.
    
    TODO: Define response fields
    WHY: Control what goal data is returned
    """
    
    # TODO: Add id field
    
    # TODO: Add party_id field
    
    # TODO: Add created_by_id field
    
    # TODO: Add current_value field
    # WHY: Progress towards goal
    
    # TODO: Add status field
    
    # TODO: Add start_date field
    
    # TODO: Add end_date field
    
    # TODO: Add reward_points field
    
    # TODO: Add progress_percentage field
    # WHY: Visual progress indicator
    # APPROACH: Computed from current/target
    
    # TODO: Add created_at field
    
    class Config:
        from_attributes = True


class PartyGoalProgress(BaseModel):
    """
    Schema for goal progress update.
    
    TODO: Define progress update fields
    WHY: Track contributions to goal
    """
    
    # TODO: Add goal_id field
    
    # TODO: Add increment field
    # WHY: How much to add to current value
    
    # TODO: Add user_id field
    # WHY: Who contributed
    
    pass


class PartyGoalContributor(BaseModel):
    """
    Schema for goal contributor.
    
    TODO: Define contributor fields
    WHY: Show who contributed to goals
    """
    
    # TODO: Add user_id field
    
    # TODO: Add username field
    
    # TODO: Add contribution_count field
    
    # TODO: Add contribution_percentage field
    
    pass


class PartyGoalWithContributors(PartyGoalResponse):
    """
    Schema for goal with contributor list.
    
    TODO: Extend response with contributors
    WHY: Show detailed goal view with contributors
    """
    
    # TODO: Add contributors list
    
    pass

