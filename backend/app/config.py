"""
Application Configuration
=========================
[TEAM] All members should understand this file - it loads environment variables.

This module handles loading configuration from environment variables.
Using pydantic-settings ensures type safety and validation.
"""

from pydantic_settings import BaseSettings
from pydantic import field_validator
from typing import List, Union


class Settings(BaseSettings):
    DATABASE_URL: str

    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    GEMINI_API_KEY: str

    GOOGLE_CLIENT_ID: str
    GOOGLE_CLIENT_SECRET: str
    GOOGLE_REDIRECT_URI: str

    DEBUG: bool = False
    CORS_ORIGINS: Union[List[str], str] = []
    
    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, v):
        """Parse CORS_ORIGINS from comma-separated string or JSON array."""
        if isinstance(v, list):
            return v
        if isinstance(v, str):
            # Handle empty string
            if not v or v.strip() == "":
                return []
            # Handle JSON-like format (remove brackets and quotes)
            v = v.strip()
            if v.startswith("[") and v.endswith("]"):
                v = v[1:-1]  # Remove brackets
            # Split by comma and clean up each origin
            origins = [origin.strip().strip('"').strip("'") for origin in v.split(",")]
            return [o for o in origins if o]  # Filter out empty strings
        return []
    
    # Google Calendar OAuth scopes
    GOOGLE_SCOPES: List[str] = [
        "https://www.googleapis.com/auth/calendar",
        "https://www.googleapis.com/auth/calendar.events"
    ]

    @property
    def GOOGLE_CLIENT_CONFIG(self) -> dict:
        """Generate Google OAuth client config from environment variables."""
        return {
            "web": {
                "client_id": self.GOOGLE_CLIENT_ID,
                "client_secret": self.GOOGLE_CLIENT_SECRET,
                "redirect_uris": [self.GOOGLE_REDIRECT_URI],
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token"
            }
        }

    model_config = {
        "extra": "ignore",  # Ignore extra fields from .env that aren't defined
        "env_file": ".env",
        "env_file_encoding": "utf-8"
    }


settings = Settings()