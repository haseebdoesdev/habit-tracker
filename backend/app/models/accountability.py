"""
Accountability Partnership Model
================================
[NOUMAN] This is your model to implement.
"""

from sqlalchemy import (Column, Integer, String, DateTime, ForeignKey,
 Text, Boolean, Enum, CheckConstraint, UniqueConstraint)
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.database import Base

class PartnershipStatus(enum.Enum):
    PENDING = "pending"
    ACTIVE = "active"
    DECLINED = "declined"
    ENDED = "ended"


class AccountabilityPartnership(Base):
    __tablename__ = "accountability_partnerships"
    id = Column(Integer, primary_key=True, index=True)
    requester_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    partner_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)    
    status = Column(Enum(PartnershipStatus), nullable=False, default=PartnershipStatus.PENDING)
    message = Column(Text, nullable=True)
    can_view_all_habits = Column(Boolean, default=True, nullable=False)
    can_comment = Column(Boolean, default=True, nullable=False)
    
    # ---- Timestamps ----
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False) 
    accepted_at = Column(DateTime, nullable=True)
    ended_at = Column(DateTime, nullable=True)

        # == RELATIONSHIPS ==
    requester = relationship(
        "User",
        foreign_keys="AccountabilityPartnership.requester_id",  
        back_populates="accountability_partnerships_as_requester"  
    )
    
    partner = relationship(
        "User",
        foreign_keys="AccountabilityPartnership.partner_id",  
        back_populates="accountability_partnerships_as_partner"  
    )

        # == CONSTRAINTS ==
    
    __table_args__ = (
        # Prevent user partnering with themselves
        CheckConstraint("requester_id != partner_id", name="ck_no_self_partnership"),
        
        # Ensure a user cannot request the same partner more than once
        UniqueConstraint("requester_id", "partner_id", name="uq_unique_partnership_pair"),
    )
    # == debugging helper method ==
    def __repr__(self):
        return (
            f"<AccountabilityPartnership id={self.id} "
            f"requester={self.requester_id} partner={self.partner_id} "
            f"status={self.status.value}>"
        )
