"""
Pytest Configuration and Fixtures
==================================
Shared fixtures for all tests including database setup and test client.
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from datetime import datetime

from app.main import app
from app.database import Base, get_db
from app.models.user import User, UserType
from app.models.habit import Habit, HabitFrequency, HabitCategory
from app.models.log import Log
from app.models.party import Party
from app.models.party_member import PartyMember, PartyRole
from app.models.party_goal import PartyGoal, GoalStatus
from app.models.accountability import AccountabilityPartnership, PartnershipStatus
from app.models.achievement import Achievement
from app.utils.security import hash_password, create_access_token


# Use SQLite in-memory database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    """Override database dependency for testing."""
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture(scope="function")
def db():
    """Create a fresh database for each test."""
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    yield db
    db.close()
    Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db):
    """Create a test client with database override."""
    app.dependency_overrides[get_db] = lambda: db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture
def test_user(db):
    """Create a test user."""
    user = User(
        email="test@example.com",
        username="testuser",
        hashed_password=hash_password("testpassword123"),
        user_type=UserType.REGULAR,
        is_active=True
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@pytest.fixture
def test_user2(db):
    """Create a second test user for partnership tests."""
    user = User(
        email="test2@example.com",
        username="testuser2",
        hashed_password=hash_password("testpassword123"),
        user_type=UserType.REGULAR,
        is_active=True
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@pytest.fixture
def auth_headers(test_user):
    """Create authentication headers for test user."""
    token = create_access_token(data={"sub": str(test_user.id)})
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def auth_headers_user2(test_user2):
    """Create authentication headers for second test user."""
    token = create_access_token(data={"sub": str(test_user2.id)})
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def test_habit(db, test_user):
    """Create a test habit."""
    habit = Habit(
        user_id=test_user.id,
        title="Morning Exercise",
        description="30 minutes workout",
        frequency=HabitFrequency.DAILY,
        category=HabitCategory.FITNESS,
        is_active=True,
        current_streak=0,
        longest_streak=0
    )
    db.add(habit)
    db.commit()
    db.refresh(habit)
    return habit


@pytest.fixture
def test_habit_with_logs(db, test_user):
    """Create a habit with some logs for analytics tests."""
    from datetime import date, timedelta
    
    habit = Habit(
        user_id=test_user.id,
        title="Daily Reading",
        description="Read for 30 minutes",
        frequency=HabitFrequency.DAILY,
        category=HabitCategory.LEARNING,
        is_active=True,
        current_streak=3,
        longest_streak=5
    )
    db.add(habit)
    db.commit()
    db.refresh(habit)
    
    # Add some logs
    today = date.today()
    for i in range(5):
        log = Log(
            habit_id=habit.id,
            user_id=test_user.id,
            log_date=today - timedelta(days=i),
            completed=i < 3,  # Last 3 days completed
            notes=f"Day {i} notes"
        )
        db.add(log)
    db.commit()
    
    return habit


@pytest.fixture
def test_party(db, test_user):
    """Create a test party with the test user as leader."""
    party = Party(
        name="Test Party",
        description="A test party for testing",
        creator_id=test_user.id,
        invite_code="TESTCODE",
        is_public=False,
        max_members=50,
        is_active=True
    )
    db.add(party)
    db.commit()
    db.refresh(party)
    
    # Add creator as leader
    membership = PartyMember(
        user_id=test_user.id,
        party_id=party.id,
        role=PartyRole.LEADER,
        is_active=True
    )
    db.add(membership)
    db.commit()
    
    return party


@pytest.fixture
def test_party_goal(db, test_party, test_user):
    """Create a test party goal."""
    goal = PartyGoal(
        party_id=test_party.id,
        created_by_id=test_user.id,
        title="Complete 100 workouts",
        description="Team goal for fitness",
        target_value=100,
        current_value=25,
        status=GoalStatus.ACTIVE,
        reward_points=500
    )
    db.add(goal)
    db.commit()
    db.refresh(goal)
    return goal


@pytest.fixture
def test_partnership(db, test_user, test_user2):
    """Create a test accountability partnership."""
    partnership = AccountabilityPartnership(
        requester_id=test_user.id,
        partner_id=test_user2.id,
        status=PartnershipStatus.ACTIVE,
        can_view_all_habits=True,
        can_comment=True
    )
    db.add(partnership)
    db.commit()
    db.refresh(partnership)
    return partnership

