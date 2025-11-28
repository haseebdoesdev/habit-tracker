"""
User Model
==========
[HASEEB] This is your model to implement.

Defines the User table for storing user account information.
Users can track habits, join parties, and have accountability partners.
"""

from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

# TODO: Import Base from your database module
# WHY: All models must inherit from Base for SQLAlchemy to recognize them
# APPROACH: Import Base from app.database


class UserType(enum.Enum):
    """
    Enum for different user types in the system.
    
    TODO: Define the user type values
    WHY: Different user types may have different permissions
    APPROACH: Add enum values like REGULAR, PREMIUM, etc.
    """
    pass


class User:
    """
    User account model.
    
    Represents a user in the habit tracking system.
    Users can have personal habits, join parties, and partner with others.
    
    TODO: Make this class inherit from Base
    WHY: SQLAlchemy needs models to inherit from declarative base
    APPROACH: Change class definition to User(Base)
    """
    
    # TODO: Define the table name
    # WHY: SQLAlchemy needs to know what table this model maps to
    # APPROACH: Set __tablename__ = "users"
    
    # TODO: Add primary key column (id)
    # WHY: Every table needs a unique identifier for each row
    # APPROACH: Integer column with primary_key=True and index=True
    
    # TODO: Add email column
    # WHY: Users log in with email and it's used for communication
    # APPROACH: String column that is unique and indexed
    # SECURITY: Email should be validated before storage
    
    # TODO: Add hashed_password column
    # WHY: Store the password securely (never store plain text!)
    # APPROACH: String column for the bcrypt hash
    # SECURITY: NEVER store plain text passwords
    
    # TODO: Add username/display_name column
    # WHY: Shown in UI and to other users in parties
    # APPROACH: String column with reasonable max length
    
    # TODO: Add user_type column using the Enum
    # WHY: Different user types may have different features
    # APPROACH: Use SQLAlchemy Enum type with your UserType enum
    
    # TODO: Add is_active column
    # WHY: Allow soft-disabling accounts without deletion
    # APPROACH: Boolean column with default=True
    
    # TODO: Add created_at and updated_at columns
    # WHY: Track when accounts were created and last modified
    # APPROACH: DateTime columns with default values
    
    # TODO: Add profile fields (avatar_url, bio, timezone)
    # WHY: Personalization and proper time handling
    # APPROACH: Optional String columns (nullable=True)
    
    # ==================== RELATIONSHIPS ====================
    # These will be uncommented after related models are created
    
    # TODO: Add relationship to habits (one user has many habits)
    # WHY: Users own their habits
    # APPROACH: Use relationship() with back_populates
    # habits = relationship("Habit", back_populates="user")
    
    # TODO: Add relationship to achievements
    # achievements = relationship("Achievement", back_populates="user")
    
    # TODO: Add relationship to party memberships
    # party_memberships = relationship("PartyMember", back_populates="user")
    
    # TODO: Add relationship to accountability partnerships (as requester)
    # TODO: Add relationship to accountability partnerships (as partner)
    
    pass

