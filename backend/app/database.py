"""
Database Configuration
======================
[TEAM] All members should understand this file - it's the foundation for all database operations.

This module sets up the PostgreSQL connection using SQLAlchemy ORM.
All models will inherit from the Base class defined here.
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import settings

engine = create_engine(settings.DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()