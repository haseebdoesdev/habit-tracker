"""
Database Configuration
======================
[TEAM] All members should understand this file - it's the foundation for all database operations.

This module sets up the PostgreSQL connection using SQLAlchemy ORM.
All models will inherit from the Base class defined here.
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# TODO: Import your settings from config module
# WHY: Need the DATABASE_URL to connect to PostgreSQL
# APPROACH: Import the settings instance you created in config.py


# TODO: Create the SQLAlchemy engine
# WHY: The engine manages the actual database connection pool
# APPROACH: Use create_engine with your database URL
# Note: For PostgreSQL, the URL format is: postgresql://user:password@host:port/dbname


# TODO: Create a SessionLocal class using sessionmaker
# WHY: Sessions are how you interact with the database (queries, inserts, etc.)
# APPROACH: Use sessionmaker bound to your engine
# Settings to consider: autocommit=False, autoflush=False


# TODO: Create the Base class for all models
# WHY: All your SQLAlchemy models will inherit from this base class
# APPROACH: Use declarative_base() to create it
Base = declarative_base()


# TODO: Create a dependency function to get database sessions
# WHY: FastAPI needs this to inject database sessions into route handlers
# APPROACH: Create a generator function that yields a session and closes it after use
# Pattern: try/finally to ensure session is always closed
def get_db():
    """
    Dependency function that provides a database session.
    
    Usage in routes:
        @router.get("/items")
        def get_items(db: Session = Depends(get_db)):
            # use db here
    
    TODO: Implement this function
    WHY: Ensures each request gets its own database session
    APPROACH: Create session, yield it, then close in finally block
    """
    # TODO: Create a new session instance
    # TODO: Yield the session (this is where the route handler runs)
    # TODO: Close the session in a finally block
    pass

