"""
Party Utilities
===============
[OMAMAH] This is your utility module to implement.

Helper functions for party/guild features.
"""

from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import func
import secrets
import string

from app.models.party import Party
from app.models.party_member import PartyMember, PartyRole
from app.models.party_goal import PartyGoal, GoalStatus


# Character set for invite codes - no ambiguous characters (0/O, 1/I/L)
INVITE_CODE_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'


def generate_invite_code(length: int = 8) -> str:
    """
    Generate a unique invite code for a party.
    Uses cryptographically secure random selection.
    """
    return ''.join(secrets.choice(INVITE_CODE_CHARS) for _ in range(length))


def is_invite_code_unique(code: str, db: Session) -> bool:
    """
    Check if an invite code is unique in the database.
    """
    existing = db.query(Party).filter(Party.invite_code == code).first()
    return existing is None


def generate_unique_invite_code(db: Session, max_attempts: int = 10) -> str:
    """
    Generate a guaranteed unique invite code.
    Raises ValueError if unable to generate unique code after max attempts.
    """
    for _ in range(max_attempts):
        code = generate_invite_code()
        if is_invite_code_unique(code, db):
            return code
    
    # Try longer code as fallback
    code = generate_invite_code(length=12)
    if is_invite_code_unique(code, db):
        return code
    
    raise ValueError("Unable to generate unique invite code after maximum attempts")


def get_member_role(user_id: int, party_id: int, db: Session) -> Optional[str]:
    """
    Get a user's role in a party.
    Returns None if user is not a member.
    """
    membership = db.query(PartyMember).filter(
        PartyMember.user_id == user_id,
        PartyMember.party_id == party_id,
        PartyMember.is_active == True
    ).first()
    
    if membership and membership.role:
        return membership.role.value
    return None


def is_party_member(user_id: int, party_id: int, db: Session) -> bool:
    """
    Check if a user is an active member of a party.
    """
    membership = db.query(PartyMember).filter(
        PartyMember.user_id == user_id,
        PartyMember.party_id == party_id,
        PartyMember.is_active == True
    ).first()
    return membership is not None


def is_party_leader(user_id: int, party_id: int, db: Session) -> bool:
    """
    Check if a user is the leader of a party.
    """
    role = get_member_role(user_id, party_id, db)
    return role == PartyRole.LEADER.value


def is_party_officer_or_leader(user_id: int, party_id: int, db: Session) -> bool:
    """
    Check if a user is an officer or leader of a party.
    """
    role = get_member_role(user_id, party_id, db)
    return role in [PartyRole.LEADER.value, PartyRole.OFFICER.value]


def can_create_party_goal(user_id: int, party_id: int, db: Session) -> bool:
    """
    Check if a user can create goals in a party.
    Only leaders and officers can create goals.
    """
    return is_party_officer_or_leader(user_id, party_id, db)


def can_manage_members(user_id: int, party_id: int, db: Session) -> bool:
    """
    Check if a user can manage party members (kick, promote, etc.).
    Only leaders can manage members.
    """
    return is_party_leader(user_id, party_id, db)


def get_party_member_count(party_id: int, db: Session) -> int:
    """
    Get the count of active members in a party.
    """
    return db.query(PartyMember).filter(
        PartyMember.party_id == party_id,
        PartyMember.is_active == True
    ).count()


def calculate_party_points(party_id: int, db: Session) -> int:
    """
    Calculate total points for a party.
    Combines member contribution points and completed goal rewards.
    """
    # Sum of member contribution points
    member_points = db.query(func.coalesce(func.sum(PartyMember.contribution_points), 0)).filter(
        PartyMember.party_id == party_id,
        PartyMember.is_active == True
    ).scalar() or 0
    
    # Sum of completed goal reward points
    goal_points = db.query(func.coalesce(func.sum(PartyGoal.reward_points), 0)).filter(
        PartyGoal.party_id == party_id,
        PartyGoal.status == GoalStatus.COMPLETED
    ).scalar() or 0
    
    return int(member_points) + int(goal_points)


def update_party_points(party_id: int, db: Session) -> int:
    """
    Update and return party's total points.
    """
    party = db.query(Party).filter(Party.id == party_id).first()
    if not party:
        return 0
    
    total_points = calculate_party_points(party_id, db)
    party.total_points = total_points
    db.commit()
    
    return total_points


def get_party_leaderboard(db: Session, limit: int = 10) -> List[dict]:
    """
    Get top parties by points.
    """
    parties = db.query(Party).filter(
        Party.is_active == True
    ).order_by(Party.total_points.desc()).limit(limit).all()
    
    leaderboard = []
    for rank, party in enumerate(parties, 1):
        member_count = get_party_member_count(party.id, db)
        leaderboard.append({
            "rank": rank,
            "party_id": party.id,
            "party_name": party.name,
            "total_points": party.total_points,
            "member_count": member_count,
            "avatar_url": party.avatar_url
        })
    
    return leaderboard


def add_contribution_points(user_id: int, party_id: int, points: int, db: Session) -> int:
    """
    Add contribution points to a party member.
    Returns the member's new total contribution points.
    """
    membership = db.query(PartyMember).filter(
        PartyMember.user_id == user_id,
        PartyMember.party_id == party_id,
        PartyMember.is_active == True
    ).first()
    
    if not membership:
        return 0
    
    membership.contribution_points += points
    
    # Also update party total points
    update_party_points(party_id, db)
    
    db.commit()
    
    return membership.contribution_points


def get_party_by_invite_code(invite_code: str, db: Session) -> Optional[Party]:
    """
    Get a party by its invite code.
    """
    return db.query(Party).filter(
        Party.invite_code == invite_code,
        Party.is_active == True
    ).first()


def can_join_party(party: Party, db: Session) -> tuple[bool, str]:
    """
    Check if a party can accept new members.
    Returns (can_join, reason).
    """
    if not party.is_active:
        return False, "Party is no longer active"
    
    member_count = get_party_member_count(party.id, db)
    if party.max_members and member_count >= party.max_members:
        return False, "Party is full"
    
    return True, "OK"


def get_user_parties(user_id: int, db: Session) -> List[Party]:
    """
    Get all parties a user is an active member of.
    """
    party_ids = db.query(PartyMember.party_id).filter(
        PartyMember.user_id == user_id,
        PartyMember.is_active == True
    ).subquery()
    
    return db.query(Party).filter(
        Party.id.in_(party_ids),
        Party.is_active == True
    ).all()
