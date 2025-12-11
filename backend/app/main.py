"""
FastAPI Application Entry Point
===============================
[HASEEB] Primary owner, but all team members should understand this file.

This is the main entry point for the Habit Tracker API.
It initializes the FastAPI app and registers all routers.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from app.config import settings
from app.database import engine, Base

# Import all routers
from app.routers import auth, habits, logs, analytics, parties, party_goals, calendar, ai, accountability


# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager for startup and shutdown events.
    """
    # Startup
    logger.info("Starting Habit Tracker API...")
    
    # Create database tables if they don't exist
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables verified/created successfully")
    except Exception as e:
        logger.error(f"Database initialization error: {e}")
    
    logger.info("Habit Tracker API started successfully!")
    
    yield
    
    # Shutdown
    logger.info("Shutting down Habit Tracker API...")
    logger.info("Cleanup completed. Goodbye!")


# Create the FastAPI application instance
app = FastAPI(
    title="Habit Tracker API",
    description="""
    🎯 AI-powered habit tracking with party/guild features.
    
    ## Features
    - **User Authentication** - JWT-based secure authentication
    - **Habit Management** - Create, track, and analyze habits
    - **Completion Logging** - Daily habit logging with streaks
    - **Analytics** - Statistics, heatmaps, and trends
    - **Parties/Guilds** - Group habit tracking with leaderboards
    - **Party Goals** - Collaborative challenges
    - **AI Suggestions** - Gemini-powered habit recommendations
    - **Calendar Integration** - Google Calendar sync
    - **Accountability Partners** - Partner up for motivation
    
    ## Team
    - **HASEEB** - Auth, Analytics, Parties
    - **NOUMAN** - Habits, Party Goals, AI
    - **OMAMAH** - Logs, Calendar, Accountability
    """,
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)


# Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS if settings.CORS_ORIGINS else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Include all routers with /api prefix
app.include_router(auth.router, prefix="/api")
app.include_router(habits.router, prefix="/api")
app.include_router(logs.router, prefix="/api")
app.include_router(analytics.router, prefix="/api")
app.include_router(parties.router, prefix="/api")
app.include_router(party_goals.router, prefix="/api")
app.include_router(calendar.router, prefix="/api")
app.include_router(ai.router, prefix="/api")
app.include_router(accountability.router, prefix="/api")


@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "message": "🎯 Habit Tracker API is running",
        "version": "1.0.0",
        "docs": "/docs",
        "redoc": "/redoc",
        "health": "/health"
    }


@app.get("/health")
async def health_check():
    """
    Health check endpoint for monitoring.
    Verifies API and database connectivity.
    """
    from app.database import SessionLocal
    
    health_status = {
        "status": "healthy",
        "api": "ok",
        "database": "unknown"
    }
    
    # Check database connectivity
    try:
        from sqlalchemy import text
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        db.close()
        health_status["database"] = "ok"
    except Exception as e:
        health_status["database"] = "error"
        health_status["status"] = "degraded"
        logger.error(f"Database health check failed: {e}")
    
    return health_status


@app.get("/api")
async def api_info():
    """API version and available endpoints."""
    return {
        "version": "1.0.0",
        "endpoints": {
            "auth": "/api/auth",
            "habits": "/api/habits",
            "logs": "/api/logs",
            "analytics": "/api/analytics",
            "parties": "/api/parties",
            "party_goals": "/api/party-goals",
            "calendar": "/api/calendar",
            "ai": "/api/ai",
            "accountability": "/api/accountability"
        }
    }
