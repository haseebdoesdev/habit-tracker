"""
Security Utilities
==================
[NOUMAN] This is your utility module to implement.

Password hashing and JWT token management.
This is critical for application security.
"""

from datetime import datetime, timedelta
from typing import Optional
import secrets

from passlib.context import CryptContext
from jose import JWTError, jwt

from app.config import settings


# Password hashing context using bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT configuration from settings
SECRET_KEY = settings.JWT_SECRET_KEY
ALGORITHM = settings.JWT_ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES = settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES
REFRESH_TOKEN_EXPIRE_DAYS = 7


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plain password against a hashed password.
    Uses constant-time comparison to prevent timing attacks.
    """
    return pwd_context.verify(plain_password, hashed_password)


def hash_password(password: str) -> str:
    """
    Hash a password using bcrypt.
    """
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a JWT access token.
    """
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire, "type": "access"})
    
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def decode_access_token(token: str) -> dict:
    """
    Decode and validate a JWT access token.
    Returns empty dict if token is invalid or expired.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return {}


def create_refresh_token(data: dict) -> str:
    """
    Create a refresh token with longer expiration.
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire, "type": "refresh"})
    
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def decode_refresh_token(token: str) -> dict:
    """
    Decode and validate a refresh token.
    Returns empty dict if token is invalid or expired.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("type") != "refresh":
            return {}
        return payload
    except JWTError:
        return {}


def generate_random_string(length: int = 32) -> str:
    """
    Generate a cryptographically secure random string.
    """
    return secrets.token_urlsafe(length)


def generate_verification_code(length: int = 6) -> str:
    """
    Generate a numeric verification code.
    """
    return ''.join(secrets.choice('0123456789') for _ in range(length))


def is_token_expired(token: str) -> bool:
    """
    Check if a token is expired without raising an exception.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        exp = payload.get("exp")
        if exp is None:
            return True
        return datetime.utcnow() > datetime.fromtimestamp(exp)
    except JWTError:
        return True


def get_token_expiry(token: str) -> Optional[datetime]:
    """
    Get the expiration datetime of a token.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM], options={"verify_exp": False})
        exp = payload.get("exp")
        if exp:
            return datetime.fromtimestamp(exp)
        return None
    except JWTError:
        return None
