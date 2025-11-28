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
    
    """
    email: EmailStr
    username: str = Field(min_lenght=3, max_length=20)


class UserCreate(UserBase):
    """
    Schema for user registration requests.
    """
    
    password : str = Field(min_length=8)
    password_confirm : str = Field(min_length=8)


class UserLogin(BaseModel):
    """
    Schema for login requests.
    """
    
    email: EmailStr
    password: str= Field(min_length=8)


class UserResponse(UserBase):
    """
    Schema for user data in responses.
    
    """
    id:int
    user_type: str 
    is_active: bool
    created_at: datetime
    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    """
    Schema for updating user profile.
    
    """
    username: Optional[str] = Field(min_length=3, max_length=20)
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    timezone: Optional[str] = None


class Token(BaseModel):
    """
    Schema for JWT token response.
    
    """
    access_token: str
    token_type: str = "Bearer"


class TokenData(BaseModel):
    """
    Schema for data encoded in JWT token.
    
    """
    
    user_id: int

