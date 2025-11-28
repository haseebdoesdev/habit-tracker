"""
Authentication Controller
=========================
[HASEEB] This is your controller to implement.

Handles user registration, login, and token management.
This is one of the most critical files for security.
"""

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

# TODO: Import your User model
# WHY: Need to create and query user records

# TODO: Import your user schemas (UserCreate, UserLogin, Token)
# WHY: Type hints and validation

# TODO: Import security utilities (password hashing, JWT creation)
# WHY: Secure password storage and token generation


async def register_user(user_data, db: Session):
    """
    Register a new user account.
    
    TODO: Check if email already exists in database
    WHY: Prevent duplicate accounts with same email
    APPROACH: Query database for existing user with this email
    SECURITY: Use case-insensitive email comparison
    
    TODO: Check if username is already taken
    WHY: Usernames should be unique
    APPROACH: Query database for existing username
    
    TODO: Hash the user's password before storing
    WHY: NEVER store plain text passwords
    APPROACH: Use bcrypt from your security utilities
    SECURITY: Always hash passwords - this is critical
    
    TODO: Create new user record in database
    WHY: Persist the user account
    APPROACH: Create User model instance with hashed password
    
    TODO: Commit the transaction to save the user
    WHY: Actually store the data in PostgreSQL
    APPROACH: Use db.commit() and db.refresh()
    
    TODO: Return success response (but NOT the password hash)
    WHY: Confirm registration was successful
    SECURITY: Never return password hash in response
    """
    return {"message": "Register user - to be implemented"}


async def login_user(login_data, db: Session):
    """
    Authenticate user and return JWT token.
    
    TODO: Find user by email in database
    WHY: Need to verify they have an account
    APPROACH: Query users table by email
    SECURITY: Don't reveal if email exists in error messages
    
    TODO: Verify the provided password against stored hash
    WHY: Confirm user knows the correct password
    APPROACH: Use bcrypt's verify function from security utilities
    SECURITY: Use constant-time comparison to prevent timing attacks
    
    TODO: Check if user account is active
    WHY: Disabled accounts should not be able to log in
    APPROACH: Check is_active field on user
    
    TODO: Generate JWT access token
    WHY: Token used for authenticating subsequent requests
    APPROACH: Use your JWT creation utility with user ID in payload
    SECURITY: Set appropriate expiration time
    
    TODO: Return token response
    WHY: Frontend stores this token for authentication
    APPROACH: Return Token schema with access_token and token_type
    """
    return {"message": "Login user - to be implemented"}


async def get_current_user(token: str, db: Session):
    """
    Validate JWT token and return current user.
    
    TODO: Decode the JWT token
    WHY: Extract user information from token
    APPROACH: Use your JWT decode utility
    SECURITY: Handle expired and invalid tokens properly
    
    TODO: Extract user ID from token payload
    WHY: Identify which user the token belongs to
    APPROACH: Get the subject or user_id from decoded token
    
    TODO: Fetch user from database
    WHY: Get current user data
    APPROACH: Query by user ID from token
    
    TODO: Verify user still exists and is active
    WHY: User might have been deleted or deactivated
    APPROACH: Check if user exists and is_active is True
    
    TODO: Return the user object
    WHY: Other endpoints need access to current user
    APPROACH: Return the User model instance
    """
    return {"message": "Get current user - to be implemented"}


async def refresh_token(current_user, db: Session):
    """
    Issue a new JWT token for authenticated user.
    
    TODO: Generate a new JWT token for the user
    WHY: Tokens expire, users need to refresh them
    APPROACH: Create new token with current user's ID
    
    TODO: Return new token response
    WHY: Frontend replaces old token with new one
    """
    return {"message": "Refresh token - to be implemented"}


async def update_password(current_user, password_data, db: Session):
    """
    Update user's password.
    
    TODO: Verify current password is correct
    WHY: Confirm user knows their existing password
    SECURITY: Always require current password for password change
    
    TODO: Validate new password meets requirements
    WHY: Enforce password strength
    APPROACH: Check length, complexity as needed
    
    TODO: Hash the new password
    WHY: Never store plain text
    APPROACH: Use bcrypt hashing
    
    TODO: Update user's password in database
    WHY: Persist the change
    APPROACH: Update user.hashed_password and commit
    
    TODO: Return success response
    WHY: Confirm password was changed
    """
    return {"message": "Update password - to be implemented"}

