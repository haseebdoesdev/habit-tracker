"""
Party Member Model
==================
[OMAMAH] This is your model to implement.

Defines the PartyMember table - the junction/association table
between Users and Parties with additional membership data.
"""

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

# TODO: Import Base from your database module


class PartyRole(enum.Enum):
    """
    Enum for member roles within a party.
    
    TODO: Define role values
    WHY: Different roles have different permissions
    APPROACH: Add values like LEADER, OFFICER, MEMBER
    """
    pass


class PartyMember:
    """
    Party membership association model.
    
    This is a junction table that links Users to Parties,
    with additional information about their membership.
    
    TODO: Make this class inherit from Base
    """
    
    # TODO: Define the table name
    # APPROACH: Set __tablename__ = "party_members"
    
    # TODO: Add primary key column (id)
    
    # TODO: Add user_id foreign key column
    # WHY: Links to the user who is a member
    # APPROACH: Integer with ForeignKey("users.id")
    
    # TODO: Add party_id foreign key column
    # WHY: Links to the party they belong to
    # APPROACH: Integer with ForeignKey("parties.id")
    
    # TODO: Add role column using Enum
    # WHY: Different members have different permissions
    # APPROACH: Use PartyRole enum
    
    # TODO: Add joined_at column
    # WHY: Track when the user joined the party
    # APPROACH: DateTime with default to current time
    
    # TODO: Add contribution_points column
    # WHY: Track individual contribution to party
    # APPROACH: Integer with default=0
    
    # TODO: Add is_active column
    # WHY: Track if member is currently active
    # APPROACH: Boolean with default=True
    
    # TODO: Add last_active_at column
    # WHY: Track engagement levels
    # APPROACH: DateTime column
    
    # ==================== RELATIONSHIPS ====================
    
    # TODO: Add relationship to user
    # user = relationship("User", back_populates="party_memberships")
    
    # TODO: Add relationship to party
    # party = relationship("Party", back_populates="members")
    
    # ==================== CONSTRAINTS ====================
    
    # TODO: Add unique constraint on user_id + party_id
    # WHY: A user can only be a member of a party once
    # APPROACH: Use __table_args__ with UniqueConstraint
    
    pass

