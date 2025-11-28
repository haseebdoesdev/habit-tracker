"""
Achievement Model
=================
[HASEEB] This is your model to implement.

Defines the Achievement table for badges and achievements users can earn.
Achievements motivate users by recognizing milestones.
"""

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime

# TODO: Import Base from your database module


class Achievement:
    """
    Achievement/Badge model.
    
    Represents achievements that users can earn through various activities.
    Examples: "7 Day Streak", "Party Leader", "100 Habits Completed"
    
    TODO: Make this class inherit from Base
    """
    
    # TODO: Define the table name
    # APPROACH: Set __tablename__ = "achievements"
    
    # TODO: Add primary key column (id)
    
    # TODO: Add user_id foreign key column
    # WHY: Links achievement to the user who earned it
    # APPROACH: Integer with ForeignKey("users.id")
    
    # TODO: Add achievement_type column
    # WHY: Identifies what kind of achievement this is
    # APPROACH: String column (e.g., "streak_7", "habits_100", "party_leader")
    
    # TODO: Add title column
    # WHY: Display name for the achievement
    # APPROACH: String column
    
    # TODO: Add description column
    # WHY: Explains how the achievement was earned
    # APPROACH: Text column
    
    # TODO: Add icon column
    # WHY: Visual representation of the achievement
    # APPROACH: String column for icon name or URL
    
    # TODO: Add points column
    # WHY: Gamification - achievements can have point values
    # APPROACH: Integer column with default value
    
    # TODO: Add rarity column
    # WHY: Some achievements are rarer than others
    # APPROACH: String or Enum (COMMON, RARE, EPIC, LEGENDARY)
    
    # TODO: Add earned_at column
    # WHY: When the user earned this achievement
    # APPROACH: DateTime column
    
    # TODO: Add is_displayed column
    # WHY: Users might choose which achievements to showcase
    # APPROACH: Boolean with default=True
    
    # ==================== RELATIONSHIPS ====================
    
    # TODO: Add relationship to user
    # user = relationship("User", back_populates="achievements")
    
    pass

