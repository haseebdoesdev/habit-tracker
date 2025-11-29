"""
Application Configuration
=========================
[TEAM] All members should understand this file - it loads environment variables.

This module handles loading configuration from environment variables.
Using pydantic-settings ensures type safety and validation.
"""

from pydantic_settings import BaseSettings
from typing import List, Optional
from functools import cached_property


class Settings(BaseSettings):
    DATABASE_URL: str

    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    GEMINI_API_KEY: str

    GOOGLE_CLIENT_ID: str
    GOOGLE_CLIENT_SECRET: str
    GOOGLE_REDIRECT_URI: str = "http://localhost:8000/api/calendar/callback"

    DEBUG: bool = False
    CORS_ORIGINS: List[str] = []

    # Google Calendar OAuth Scopes
    # Read/write access to calendar events
    GOOGLE_SCOPES: List[str] = [
        "https://www.googleapis.com/auth/calendar",
        "https://www.googleapis.com/auth/calendar.events"
    ]

    @cached_property
    def GOOGLE_CLIENT_CONFIG(self) -> dict:
        """
        Build Google OAuth client configuration from environment variables.
        This format is required by google_auth_oauthlib.flow.Flow
        """
        return {
            "web": {
                "client_id": self.GOOGLE_CLIENT_ID,
                "client_secret": self.GOOGLE_CLIENT_SECRET,
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
                "redirect_uris": [self.GOOGLE_REDIRECT_URI],
            }
        }

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()