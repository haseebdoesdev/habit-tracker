"""
Party Member Model
==================
[OMAMAH] This is your model to implement.

Defines the PartyMember table - the junction/association table
between Users and Parties with additional membership data.
"""

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum, Boolean, UniqueConstraint
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from app.database import Base


class PartyRole(enum.Enum):
    """
    Enum for member roles within a party.
    """
    LEADER = "LEADER"
    OFFICER = "OFFICER"
    MEMBER = "MEMBER"


class PartyMember(Base):
    """
    Party membership association model.
    
    This is a junction table that links Users to Parties,
    with additional information about their membership.
    """
    
    __tablename__ = "party_members"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    party_id = Column(Integer, ForeignKey("parties.id"), nullable=False)
    
    role = Column(Enum(PartyRole, name="party_role_type"), default=PartyRole.MEMBER)
    
    joined_at = Column(DateTime, default=datetime.utcnow)
    contribution_points = Column(Integer, default=0)
    
    is_active = Column(Boolean, default=True)
    last_active_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="party_memberships")
    party = relationship("Party", back_populates="members")
    
    # Constraints - user can only be a member of a party once
    __table_args__ = (
        UniqueConstraint('user_id', 'party_id', name='uq_user_party'),
    )
