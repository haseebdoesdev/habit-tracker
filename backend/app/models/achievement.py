"""
Achievement Model
=================
[HASEEB] This is your model to implement.

Defines the Achievement table for badges and achievements users can earn.
Achievements motivate users by recognizing milestones.
"""

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Boolean, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from app.database import Base


class RarityType(enum.Enum):
    """Enum for achievement rarity levels."""
    COMMON = "COMMON"
    RARE = "RARE"
    EPIC = "EPIC"
    LEGENDARY = "LEGENDARY"


class Achievement(Base):
    """
    Achievement/Badge model.
    
    Represents achievements that users can earn through various activities.
    Examples: "7 Day Streak", "Party Leader", "100 Habits Completed"
    """
    
    __tablename__ = "achievements"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    achievement_type = Column(String)
    title = Column(String, index=True)
    description = Column(Text)
    icon = Column(String)
    points = Column(Integer, default=0)
    rarity = Column(Enum(RarityType, name="rarity_type"))
    earned_at = Column(DateTime, default=datetime.utcnow)
    is_displayed = Column(Boolean, default=True)
    user = relationship("User", back_populates="achievements")

