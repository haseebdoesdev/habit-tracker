"""
Application Configuration
=========================
[TEAM] All members should understand this file - it loads environment variables.

This module handles loading configuration from environment variables.
Using pydantic-settings ensures type safety and validation.
"""

from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.
    
    TODO: Define all configuration fields needed by your application
    WHY: Centralizing config makes it easy to change settings without modifying code
    APPROACH: Each field should have a type annotation and optionally a default value
    SECURITY: Sensitive values like secrets should never have defaults
    """
    
    # TODO: Add database URL field
    # WHY: Need to connect to PostgreSQL database
    # APPROACH: Define a string field for the database connection URL
    
    # TODO: Add JWT configuration fields (secret key, algorithm, expiry)
    # WHY: JWT tokens need these settings for signing and verification
    # APPROACH: Define string fields for secret/algorithm, integer for expiry minutes
    # SECURITY: JWT secret must be strong and never committed to version control
    
    # TODO: Add Gemini API key field
    # WHY: Required for AI-powered habit suggestions
    # APPROACH: Define a string field for the API key
    # SECURITY: API keys should only come from environment, never hardcoded
    
    # TODO: Add Google Calendar OAuth fields
    # WHY: Needed for calendar sync functionality
    # APPROACH: Define fields for client ID, client secret, and redirect URI
    
    # TODO: Add application settings (debug mode, CORS origins)
    # WHY: Control app behavior in different environments
    # APPROACH: Boolean for debug, list of strings for allowed origins
    
    class Config:
        # TODO: Configure the .env file path
        # WHY: Tells pydantic-settings where to load environment variables from
        # APPROACH: Set env_file to point to your .env file location
        env_file = ".env"
        env_file_encoding = "utf-8"


# TODO: Create a settings instance to be imported by other modules
# WHY: Single source of truth for all configuration values
# APPROACH: Instantiate the Settings class
# Example usage in other files: from app.config import settings
