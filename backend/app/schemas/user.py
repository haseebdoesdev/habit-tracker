"""
User Schemas
============
[HASEEB] These are your schemas to implement.

Pydantic schemas for user-related request and response validation.
These ensure data coming into the API is valid and properly formatted.
"""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


class UserBase(BaseModel):
    """
    Base schema with common user fields.
    
    TODO: Define common user fields shared across schemas
    WHY: Avoid repeating field definitions in every schema
    APPROACH: Add fields like email, username that are used in multiple schemas
    """
    
    # TODO: Add email field with EmailStr type
    # WHY: Pydantic validates email format automatically
    # APPROACH: Use EmailStr type from pydantic
    
    # TODO: Add username field
    # WHY: Display name for the user
    # APPROACH: String with min/max length validation
    
    pass


class UserCreate(UserBase):
    """
    Schema for user registration requests.
    
    TODO: Define fields required for user registration
    WHY: Validate registration data before processing
    SECURITY: Password requirements should be enforced here
    """
    
    # TODO: Add password field with validation
    # WHY: Users must provide a password to register
    # APPROACH: Use Field() with min_length for security
    # SECURITY: Enforce minimum password length (e.g., 8 characters)
    
    # TODO: Add password confirmation field
    # WHY: Prevent typos in password during registration
    # APPROACH: Add confirm_password field
    
    pass


class UserLogin(BaseModel):
    """
    Schema for login requests.
    
    TODO: Define fields required for login
    WHY: Validate login credentials format before authentication
    """
    
    # TODO: Add email field
    # WHY: Users log in with email
    
    # TODO: Add password field
    # WHY: Users must provide password to authenticate
    # SECURITY: Don't validate password length here - just check it's provided
    
    pass


class UserResponse(UserBase):
    """
    Schema for user data in responses.
    
    TODO: Define fields returned when fetching user data
    WHY: Control what user information is exposed in API responses
    SECURITY: Never include password hash in responses
    """
    
    # TODO: Add id field
    # WHY: Frontend needs user ID for subsequent requests
    
    # TODO: Add user_type field
    # WHY: Frontend may show different UI based on user type
    
    # TODO: Add is_active field
    # WHY: Indicate if account is active
    
    # TODO: Add created_at field
    # WHY: Show when account was created
    
    # TODO: Add optional profile fields (avatar_url, bio, etc.)
    
    class Config:
        # TODO: Enable ORM mode for SQLAlchemy compatibility
        # WHY: Allows Pydantic to read data from ORM objects
        # APPROACH: Set from_attributes = True (Pydantic v2)
        from_attributes = True


class UserUpdate(BaseModel):
    """
    Schema for updating user profile.
    
    TODO: Define fields that can be updated
    WHY: Allow users to modify their profile
    APPROACH: All fields should be Optional
    """
    
    # TODO: Add optional username field
    # WHY: Users might want to change their display name
    
    # TODO: Add optional avatar_url field
    
    # TODO: Add optional bio field
    
    # TODO: Add optional timezone field
    
    pass


class Token(BaseModel):
    """
    Schema for JWT token response.
    
    TODO: Define token response structure
    WHY: Standard format for returning authentication tokens
    """
    
    # TODO: Add access_token field
    # WHY: The JWT token string
    
    # TODO: Add token_type field
    # WHY: Standard OAuth2 format (usually "bearer")
    
    pass


class TokenData(BaseModel):
    """
    Schema for data encoded in JWT token.
    
    TODO: Define what data is stored in the token
    WHY: Standard structure for token payload
    SECURITY: Only include non-sensitive identification data
    """
    
    # TODO: Add user_id or email field
    # WHY: Identify the user from the token
    # SECURITY: Don't include sensitive data in tokens
    
    pass

