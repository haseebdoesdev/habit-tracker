"""
SQLAlchemy Models Package
=========================
This package contains all database models for the Habit Tracker.

Import all models here so Alembic can detect them for migrations.
"""

# Import all models for Alembic migration detection
# Note: Import order matters due to foreign key dependencies

from app.models.accountability import AccountabilityPartnership
from app.models.user import User
from app.models.habit import Habit
from app.models.log import Log
from app.models.achievement import Achievement
from app.models.party import Party
from app.models.party_member import PartyMember
from app.models.party_goal import PartyGoal
from app.models.comment import Comment
