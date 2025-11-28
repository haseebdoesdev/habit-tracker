"""
Authentication Router
=====================
[HASEEB] This is your router to implement.

Defines authentication-related API endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

# TODO: Import database dependency (get_db)
# WHY: Need database session for each request

# TODO: Import auth controller functions
# WHY: Business logic for auth operations

# TODO: Import schemas (UserCreate, UserLogin, Token, UserResponse)
# WHY: Request/response validation

# TODO: Import auth middleware for protected routes
# WHY: Get current user for authenticated endpoints


# TODO: Create the router instance
# WHY: Group all auth endpoints together
# APPROACH: APIRouter with prefix and tags
router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/register")
async def register():
    """
    Register a new user account.
    
    TODO: Add proper function signature with dependencies
    WHY: Need schema validation and database session
    APPROACH: def register(user_data: UserCreate, db: Session = Depends(get_db))
    
    TODO: Call auth controller's register function
    WHY: Delegate to business logic
    APPROACH: await auth_controller.register_user(user_data, db)
    
    TODO: Return success response with appropriate status code
    WHY: 201 Created for successful registration
    APPROACH: Return created user (without password)
    """
    return {"message": "Register endpoint - to be implemented"}


@router.post("/login")
async def login():
    """
    Authenticate user and return JWT token.
    
    TODO: Add function signature
    WHY: Accept login credentials
    APPROACH: def login(login_data: UserLogin, db: Session = Depends(get_db))
    
    TODO: Call auth controller's login function
    WHY: Validate credentials and generate token
    
    TODO: Return token response
    WHY: Frontend stores token for auth
    APPROACH: Return Token schema with access_token
    """
    return {"message": "Login endpoint - to be implemented"}


@router.get("/me")
async def get_current_user_profile():
    """
    Get current authenticated user's profile.
    
    TODO: Add function signature with auth dependency
    WHY: Need authenticated user
    APPROACH: def get_me(current_user = Depends(get_current_active_user))
    
    TODO: Return user data
    WHY: Frontend displays user profile
    APPROACH: Return UserResponse schema
    """
    return {"message": "Get profile endpoint - to be implemented"}


@router.post("/refresh")
async def refresh_token():
    """
    Refresh JWT token for authenticated user.
    
    TODO: Add function signature with auth dependency
    WHY: Need authenticated user to refresh
    
    TODO: Call auth controller's refresh function
    WHY: Generate new token
    
    TODO: Return new token
    WHY: Frontend updates stored token
    """
    return {"message": "Refresh token endpoint - to be implemented"}


@router.put("/password")
async def update_password():
    """
    Update current user's password.
    
    TODO: Add function signature with password update schema
    WHY: Need current and new passwords
    
    TODO: Add auth dependency
    WHY: Must be authenticated
    SECURITY: Require current password verification
    
    TODO: Call auth controller's update_password function
    WHY: Validate and update password
    
    TODO: Return success response
    WHY: Confirm password changed
    """
    return {"message": "Update password endpoint - to be implemented"}


@router.put("/profile")
async def update_profile():
    """
    Update current user's profile information.
    
    TODO: Add function signature with UserUpdate schema
    WHY: Accept profile update data
    
    TODO: Add auth dependency
    WHY: Must be authenticated
    
    TODO: Update user profile in database
    WHY: Persist changes
    
    TODO: Return updated user profile
    WHY: Confirm changes
    """
    return {"message": "Update profile endpoint - to be implemented"}

