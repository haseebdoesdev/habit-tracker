"""
Achievement Schemas
===================
[HASEEB] These are your schemas to implement.

Pydantic schemas for achievement/badge validation.
"""

from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class AchievementBase(BaseModel):
    """
    Base schema with common achievement fields.
    
    TODO: Define common achievement fields
    WHY: Shared between different achievement schemas
    """
    
    # TODO: Add title field
    # WHY: Name of the achievement
    
    # TODO: Add description field
    # WHY: How the achievement is earned
    
    # TODO: Add icon field
    # WHY: Visual representation
    
    # TODO: Add points field
    # WHY: Point value for gamification
    
    pass


class AchievementResponse(AchievementBase):
    """
    Schema for achievement data in responses.
    
    TODO: Define response fields
    WHY: Control what achievement data is returned
    """
    
    # TODO: Add id field
    
    # TODO: Add user_id field
    
    # TODO: Add achievement_type field
    # WHY: Category/type of achievement
    
    # TODO: Add rarity field
    # WHY: How rare is this achievement
    
    # TODO: Add earned_at field
    # WHY: When the user earned it
    
    # TODO: Add is_displayed field
    # WHY: If user is showcasing this
    
    class Config:
        from_attributes = True


class AchievementProgress(BaseModel):
    """
    Schema for tracking progress towards an achievement.
    
    TODO: Define progress tracking fields
    WHY: Show users how close they are to earning achievements
    """
    
    # TODO: Add achievement_type field
    # WHY: Which achievement this tracks
    
    # TODO: Add title field
    # WHY: Achievement name for display
    
    # TODO: Add description field
    
    # TODO: Add current_progress field
    # WHY: How far along the user is
    
    # TODO: Add target_value field
    # WHY: What they need to reach
    
    # TODO: Add percentage_complete field
    
    # TODO: Add is_earned field
    # WHY: Whether already earned
    
    pass


class UserAchievementSummary(BaseModel):
    """
    Schema for user's achievement summary.
    
    TODO: Define summary fields
    WHY: Overview of user's achievement progress
    """
    
    # TODO: Add total_points field
    # WHY: Sum of all earned achievement points
    
    # TODO: Add total_achievements field
    # WHY: Count of earned achievements
    
    # TODO: Add earned_achievements list
    # WHY: List of earned achievements
    
    # TODO: Add in_progress list
    # WHY: Achievements being worked on
    
    # TODO: Add recent_achievements list
    # WHY: Latest earned achievements
    
    pass

