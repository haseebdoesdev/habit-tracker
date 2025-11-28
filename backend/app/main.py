"""
FastAPI Application Entry Point
===============================
[HASEEB] Primary owner, but all team members should understand this file.

This is the main entry point for the Habit Tracker API.
It initializes the FastAPI app and registers all routers.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# TODO: Import your settings from config
# WHY: Need configuration values like CORS origins


# TODO: Import all routers from the routers package
# WHY: Each router handles a group of related endpoints
# APPROACH: Import each router module (auth, habits, logs, etc.)


# TODO: Create the FastAPI application instance
# WHY: This is the core object that handles all HTTP requests
# APPROACH: Instantiate FastAPI with title, description, and version
app = FastAPI(
    title="Habit Tracker API",
    description="AI-powered habit tracking with party/guild features",
    version="1.0.0"
)


# TODO: Configure CORS middleware
# WHY: Allows your React frontend to make requests to this API
# APPROACH: Add CORSMiddleware with allowed origins from settings
# SECURITY: In production, only allow your specific frontend domain
"""
app.add_middleware(
    CORSMiddleware,
    # TODO: Set allow_origins from your settings
    # TODO: Configure allow_credentials, allow_methods, allow_headers
)
"""


# TODO: Include all routers with appropriate prefixes
# WHY: Organizes your API endpoints under logical URL paths
# APPROACH: Use app.include_router() for each router with prefix and tags
# 
# Example structure:
# - /api/auth -> authentication endpoints [HASEEB]
# - /api/habits -> habit CRUD endpoints [NOUMAN]
# - /api/logs -> habit logging endpoints [OMAMAH]
# - /api/analytics -> statistics endpoints [HASEEB]
# - /api/ai -> AI suggestion endpoints [NOUMAN]
# - /api/calendar -> Google Calendar endpoints [OMAMAH]
# - /api/parties -> party/guild endpoints [HASEEB]
# - /api/party-goals -> party goals endpoints [NOUMAN]
# - /api/accountability -> partner endpoints [OMAMAH]


@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "message": "Habit Tracker API is running",
        "docs": "/docs",
        "version": "1.0.0"
    }


@app.get("/health")
async def health_check():
    """
    Health check endpoint for monitoring.
    
    TODO: Add database connectivity check
    WHY: Helps detect if the API is healthy and can reach the database
    APPROACH: Try a simple database query and return status accordingly
    """
    return {"status": "healthy"}


# TODO: Add startup event handler
# WHY: Run initialization code when the server starts
# APPROACH: Use @app.on_event("startup") decorator
# Example uses: Create database tables, verify external API connections


# TODO: Add shutdown event handler  
# WHY: Clean up resources when the server stops
# APPROACH: Use @app.on_event("shutdown") decorator
# Example uses: Close database connections, flush caches

