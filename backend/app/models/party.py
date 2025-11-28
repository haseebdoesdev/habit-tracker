"""
Party/Guild Model
=================
[NOUMAN] This is your model to implement.

Defines the Party table for group/guild features (Habitica-style).
Parties allow users to track habits together and compete.
"""

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime

# TODO: Import Base from your database module


class Party:
    """
    Party/Guild model for group habit tracking.
    
    Parties are groups where users can:
    - Share habits and goals
    - Compete on leaderboards
    - Chat and support each other
    
    TODO: Make this class inherit from Base
    """
    
    # TODO: Define the table name
    # APPROACH: Set __tablename__ = "parties"
    
    # TODO: Add primary key column (id)
    
    # TODO: Add name column
    # WHY: The display name of the party
    # APPROACH: String column with max length
    
    # TODO: Add description column
    # WHY: Explain the party's purpose and goals
    # APPROACH: Text column, nullable=True
    
    # TODO: Add creator_id foreign key column
    # WHY: Track who created the party
    # APPROACH: Integer with ForeignKey("users.id")
    
    # TODO: Add invite_code column
    # WHY: Unique code for inviting new members
    # APPROACH: String column that is unique
    # SECURITY: Generate random codes, not sequential
    
    # TODO: Add is_public column
    # WHY: Public parties can be browsed and joined freely
    # APPROACH: Boolean with default=False
    
    # TODO: Add max_members column
    # WHY: Limit party size for manageability
    # APPROACH: Integer column with reasonable default
    
    # TODO: Add avatar_url column
    # WHY: Visual identity for the party
    # APPROACH: String column, nullable=True
    
    # TODO: Add total_points column
    # WHY: Aggregate score for party leaderboards
    # APPROACH: Integer with default=0
    
    # TODO: Add created_at and updated_at columns
    
    # TODO: Add is_active column
    # WHY: Allow archiving parties without deletion
    # APPROACH: Boolean with default=True
    
    # ==================== RELATIONSHIPS ====================
    
    # TODO: Add relationship to creator (User)
    # creator = relationship("User", foreign_keys=[creator_id])
    
    # TODO: Add relationship to members (through PartyMember)
    # members = relationship("PartyMember", back_populates="party")
    
    # TODO: Add relationship to party goals
    # goals = relationship("PartyGoal", back_populates="party")
    
    # TODO: Add relationship to party habits
    # habits = relationship("Habit", back_populates="party")
    
    pass

