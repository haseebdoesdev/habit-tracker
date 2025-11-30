"""
Authentication Controller
=========================
[HASEEB] This is your controller to implement.

Handles user registration, login, and token management.
This is one of the most critical files for security.
"""

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.user import User, UserType
from app.schemas.user import UserCreate, UserLogin, Token, UserResponse
from app.utils.security import (
    hash_password,
    verify_password,
    create_access_token,
    decode_access_token
)


async def register_user(user_data: UserCreate, db: Session):
    """
    Register a new user account.
    """
    # Check if passwords match
    if user_data.password != user_data.password_confirm:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Passwords do not match"
        )
    
    # Check if email already exists (case-insensitive)
    existing_email = db.query(User).filter(
        User.email.ilike(user_data.email)
    ).first()
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Check if username is already taken
    existing_username = db.query(User).filter(
        User.username == user_data.username
    ).first()
    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )
    
    # Hash the password
    hashed_pw = hash_password(user_data.password)
    
    # Create new user record
    new_user = User(
        email=user_data.email.lower(),
        username=user_data.username,
        hashed_password=hashed_pw,
        user_type=UserType.REGULAR,
        is_active=True
    )
    
    # Save to database
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Return success response (without password hash)
    return {
        "message": "User registered successfully",
        "user": {
            "id": new_user.id,
            "email": new_user.email,
            "username": new_user.username,
            "user_type": new_user.user_type.value,
            "is_active": new_user.is_active,
            "created_at": new_user.created_at
        }
    }


async def login_user(login_data: UserLogin, db: Session):
    """
    Authenticate user and return JWT token.
    """
    # Find user by email (case-insensitive)
    user = db.query(User).filter(
        User.email.ilike(login_data.email)
    ).first()
    
    # Generic error message to not reveal if email exists
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid email or password",
        headers={"WWW-Authenticate": "Bearer"}
    )
    
    if not user:
        raise credentials_exception
    
    # Verify password
    if not verify_password(login_data.password, user.hashed_password):
        raise credentials_exception
    
    # Check if account is active
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is disabled"
        )
    
    # Generate JWT access token
    access_token = create_access_token(data={"sub": str(user.id)})
    
    return Token(access_token=access_token, token_type="Bearer")


async def get_current_user(token: str, db: Session):
    """
    Validate JWT token and return current user.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"}
    )
    
    # Decode the JWT token
    payload = decode_access_token(token)
    if not payload:
        raise credentials_exception
    
    # Extract user ID from token payload
    user_id_str = payload.get("sub")
    if user_id_str is None:
        raise credentials_exception
    
    try:
        user_id = int(user_id_str)
    except ValueError:
        raise credentials_exception
    
    # Fetch user from database
    user = db.query(User).filter(User.id == user_id).first()
    
    # Verify user exists and is active
    if user is None:
        raise credentials_exception
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is disabled"
        )
    
    return user


async def refresh_token(current_user: User, db: Session):
    """
    Issue a new JWT token for authenticated user.
    """
    # Generate a new JWT token for the user
    access_token = create_access_token(data={"sub": str(current_user.id)})
    
    return Token(access_token=access_token, token_type="Bearer")


async def update_password(current_user: User, password_data, db: Session):
    """
    Update user's password.
    
    Expects password_data to have:
    - current_password: str
    - new_password: str
    - new_password_confirm: str
    """
    # Verify current password is correct
    if not verify_password(password_data.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )
    
    # Validate new passwords match
    if password_data.new_password != password_data.new_password_confirm:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New passwords do not match"
        )
    
    # Validate new password meets requirements (minimum 8 characters)
    if len(password_data.new_password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 8 characters long"
        )
    
    # Hash the new password
    new_hashed_password = hash_password(password_data.new_password)
    
    # Update user's password in database
    current_user.hashed_password = new_hashed_password
    db.commit()
    db.refresh(current_user)
    
    return {"message": "Password updated successfully"}
