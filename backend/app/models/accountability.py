"""
Accountability Partnership Model
================================
[NOUMAN] This is your model to implement.

Defines the AccountabilityPartnership table for partner relationships.
Users can partner up to hold each other accountable for their habits.
"""

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Boolean, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

# TODO: Import Base from your database module


class PartnershipStatus(enum.Enum):
    """
    Enum for accountability partnership status.
    
    TODO: Define status values
    WHY: Partnerships go through a request/accept flow
    APPROACH: Add values like PENDING, ACTIVE, DECLINED, ENDED
    """
    pass


class AccountabilityPartnership:
    """
    Accountability partnership model.
    
    Represents a relationship where two users hold each other
    accountable for their habits. Partners can view each other's
    progress and leave comments.
    
    TODO: Make this class inherit from Base
    """
    
    # TODO: Define the table name
    # APPROACH: Set __tablename__ = "accountability_partnerships"
    
    # TODO: Add primary key column (id)
    
    # TODO: Add requester_id foreign key column
    # WHY: The user who initiated the partnership
    # APPROACH: Integer with ForeignKey("users.id")
    
    # TODO: Add partner_id foreign key column
    # WHY: The user who was invited to partner
    # APPROACH: Integer with ForeignKey("users.id")
    
    # TODO: Add status column using Enum
    # WHY: Track if partnership is pending, active, etc.
    # APPROACH: Use PartnershipStatus enum
    
    # TODO: Add message column
    # WHY: Personal message when requesting partnership
    # APPROACH: Text column, nullable=True
    
    # TODO: Add can_view_all_habits column
    # WHY: Privacy control - partner sees all or selected habits
    # APPROACH: Boolean with default=True
    
    # TODO: Add can_comment column
    # WHY: Permission to leave comments on partner's habits
    # APPROACH: Boolean with default=True
    
    # TODO: Add created_at column
    # WHY: When the request was made
    
    # TODO: Add accepted_at column
    # WHY: When the partnership became active
    # APPROACH: DateTime, nullable=True
    
    # TODO: Add ended_at column
    # WHY: When the partnership ended (if applicable)
    # APPROACH: DateTime, nullable=True
    
    # ==================== RELATIONSHIPS ====================
    
    # TODO: Add relationship to requester (User)
    # requester = relationship("User", foreign_keys=[requester_id])
    
    # TODO: Add relationship to partner (User)
    # partner = relationship("User", foreign_keys=[partner_id])
    
    # ==================== CONSTRAINTS ====================
    
    # TODO: Add constraint to prevent self-partnerships
    # WHY: A user can't be their own accountability partner
    # APPROACH: Use CheckConstraint to ensure requester_id != partner_id
    
    # TODO: Add unique constraint on requester_id + partner_id
    # WHY: Prevent duplicate partnership requests
    
    pass

