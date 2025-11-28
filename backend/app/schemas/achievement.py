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
    """
    title: str
    description: str
    icon: str
    points: int
    pass


class AchievementResponse(AchievementBase):
    """
    Schema for achievement data in responses.
    
 """
    id : int
    user_id: int
    achievement_type: str
    rarity: str
    earned_at: datetime
    is_displayed: bool
    class Config:
        from_attributes = True


class AchievementProgress(BaseModel):
    """
    Schema for tracking progress towards an achievement.
"""
    achievement_type:str
    title: str 
    description:str
    current_progress: int 
    target_value: int
    percentage_complete: int
    is_earned: bool
    pass


class UserAchievementSummary(BaseModel):
    """
    Schema for user's achievement summary.
    
    """
    total_points: int
    total_achievements: int
    earned_achievements:List[AchievementResponse]
    in_progress_achievements:List[AchievementProgress]
    recent_achievements:List[AchievementResponse]
    pass

