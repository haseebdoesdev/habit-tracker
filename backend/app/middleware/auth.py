"""
Authentication Middleware
=========================
[HASEEB] This is your middleware to implement.

JWT verification and user authentication middleware.
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

# TODO: Import get_db dependency
# WHY: Need database session to look up user

# TODO: Import User model
# WHY: Return user object from token

# TODO: Import JWT utilities (decode function)
# WHY: Verify and decode JWT tokens

# TODO: Import settings for JWT configuration
# WHY: Need secret key and algorithm


# TODO: Create HTTPBearer instance for token extraction
# WHY: Extracts Bearer token from Authorization header
# APPROACH: security = HTTPBearer()
security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(lambda: None)  # TODO: Replace with Depends(get_db)
):
    """
    Dependency that validates JWT token and returns current user.
    
    This is used as a dependency in protected routes.
    
    TODO: Extract the token from credentials
    WHY: Get the JWT string from the authorization header
    APPROACH: token = credentials.credentials
    
    TODO: Set up credentials exception
    WHY: Standard response for auth failures
    APPROACH: Create HTTPException with 401 status
    SECURITY: Use generic message, don't reveal specific failure reason
    
    TODO: Decode and validate the JWT token
    WHY: Verify token is valid and not expired
    APPROACH: Use your JWT decode utility
    SECURITY: Handle invalid and expired tokens
    
    TODO: Extract user identifier from token payload
    WHY: Know which user this token belongs to
    APPROACH: Get 'sub' (subject) from decoded payload
    
    TODO: Query user from database
    WHY: Return full user object, verify user exists
    APPROACH: Query by user ID from token
    
    TODO: Verify user is active
    WHY: Deactivated users shouldn't access protected resources
    APPROACH: Check user.is_active
    
    TODO: Return the user object
    WHY: Route handlers can use current user
    """
    return {"message": "Get current user - to be implemented"}


async def get_current_active_user(
    current_user = Depends(get_current_user)
):
    """
    Dependency that ensures user is active.
    
    TODO: Check if user is active
    WHY: Additional check for active status
    APPROACH: Raise exception if not active
    
    TODO: Return user if active
    WHY: User is valid and active
    """
    return current_user


async def get_optional_user(
    credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer(auto_error=False)),
    db: Session = Depends(lambda: None)  # TODO: Replace with Depends(get_db)
):
    """
    Dependency that returns user if authenticated, None otherwise.
    
    Useful for endpoints that work for both authenticated and anonymous users.
    
    TODO: Check if credentials were provided
    WHY: Token is optional for these routes
    APPROACH: Return None if no credentials
    
    TODO: If credentials provided, validate and return user
    WHY: Same logic as get_current_user
    APPROACH: Try to validate, return user or None on failure
    """
    return None


# TODO: Create role-based access control decorators/dependencies
# WHY: Some endpoints need specific user roles
# APPROACH: Create dependencies that check user.user_type

def require_role(allowed_roles: list):
    """
    Dependency factory for role-based access control.
    
    Usage: @router.get("/admin", dependencies=[Depends(require_role(["admin"]))])
    
    TODO: Return a dependency function
    WHY: Create role checker for specific roles
    APPROACH: Inner function that checks current_user.user_type
    SECURITY: Raise 403 Forbidden if user lacks required role
    """
    async def role_checker(current_user = Depends(get_current_active_user)):
        # TODO: Check if user's role is in allowed_roles
        # WHY: Verify permission
        # APPROACH: Compare user.user_type with allowed_roles
        pass
    return role_checker

