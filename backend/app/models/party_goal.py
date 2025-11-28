"""
Party Goal Model
================
[HASEEB] This is your model to implement.

Defines the PartyGoal table for shared goals within a party.
Party goals are collaborative challenges for all members.
"""

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Boolean, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

# TODO: Import Base from your database module


class GoalStatus(enum.Enum):
    """
    Enum for party goal status.
    
    TODO: Define status values
    WHY: Track the lifecycle of party goals
    APPROACH: Add values like ACTIVE, COMPLETED, FAILED, CANCELLED
    """
    pass


class PartyGoal:
    """
    Party goal model for shared challenges.
    
    Party goals are collective targets that all party members
    work towards together.
    
    TODO: Make this class inherit from Base
    """
    
    # TODO: Define the table name
    # APPROACH: Set __tablename__ = "party_goals"
    
    # TODO: Add primary key column (id)
    
    # TODO: Add party_id foreign key column
    # WHY: Links the goal to its party
    # APPROACH: Integer with ForeignKey("parties.id")
    
    # TODO: Add created_by_id foreign key column
    # WHY: Track who created the goal
    # APPROACH: Integer with ForeignKey("users.id")
    
    # TODO: Add title column
    # WHY: Name of the party goal
    # APPROACH: String column
    
    # TODO: Add description column
    # WHY: Detailed explanation of the goal
    # APPROACH: Text column, nullable=True
    
    # TODO: Add target_value column
    # WHY: The numerical target to reach
    # APPROACH: Integer (e.g., 100 total completions)
    
    # TODO: Add current_value column
    # WHY: Track progress towards the goal
    # APPROACH: Integer with default=0
    
    # TODO: Add status column using Enum
    # WHY: Track if goal is active, completed, etc.
    # APPROACH: Use GoalStatus enum
    
    # TODO: Add start_date and end_date columns
    # WHY: Goals have time limits
    # APPROACH: DateTime columns
    
    # TODO: Add reward_points column
    # WHY: Points awarded when goal is achieved
    # APPROACH: Integer column
    
    # TODO: Add habit_category column
    # WHY: Goals might be for specific habit types
    # APPROACH: String or Enum, nullable=True
    
    # TODO: Add created_at column
    
    # ==================== RELATIONSHIPS ====================
    
    # TODO: Add relationship to party
    # party = relationship("Party", back_populates="goals")
    
    # TODO: Add relationship to creator
    # created_by = relationship("User")
    
    pass

