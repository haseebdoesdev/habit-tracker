"""
Authentication Router
=====================
[HASEEB] This is your router to implement.

Defines authentication-related API endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field

from app.database import get_db
from app.controllers import auth_controller
from app.schemas.user import UserCreate, UserLogin, Token, UserResponse, UserUpdate
from app.middleware.auth import get_current_active_user
from app.models.user import User


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


class PasswordUpdate(BaseModel):
    """Schema for password update request."""
    current_password: str = Field(..., min_length=1, description="Current password")
    new_password: str = Field(..., min_length=8, description="New password (minimum 8 characters)")
    new_password_confirm: str = Field(..., min_length=8, description="Confirm new password")


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):
    """
    Register a new user account.
    """
    return await auth_controller.register_user(user_data, db)


@router.post("/login", response_model=Token)
async def login(
    login_data: UserLogin,
    db: Session = Depends(get_db)
):
    """
    Authenticate user and return JWT token.
    """
    return await auth_controller.login_user(login_data, db)


@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(
    current_user: User = Depends(get_current_active_user)
):
    """
    Get current authenticated user's profile.
    """
    return current_user


@router.post("/refresh", response_model=Token)
async def refresh_token(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Refresh JWT token for authenticated user.
    """
    return await auth_controller.refresh_token(current_user, db)


@router.put("/password")
async def update_password(
    password_data: PasswordUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Update current user's password.
    
    Requires the current password for verification and the new password twice for confirmation.
    """
    return await auth_controller.update_password(current_user, password_data, db)


@router.put("/profile", response_model=UserResponse)
async def update_profile(
    profile_data: UserUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Update current user's profile information.
    """
    # Update user profile fields
    if profile_data.username is not None:
        # Check if username is taken by another user
        from app.models.user import User as UserModel
        existing = db.query(UserModel).filter(
            UserModel.username == profile_data.username,
            UserModel.id != current_user.id
        ).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken"
            )
        current_user.username = profile_data.username
    
    if profile_data.avatar_url is not None:
        current_user.avatar_url = profile_data.avatar_url
    
    if profile_data.bio is not None:
        current_user.bio = profile_data.bio
    
    if profile_data.timezone is not None:
        current_user.timezone = profile_data.timezone
    
    db.commit()
    db.refresh(current_user)
    
    return current_user
