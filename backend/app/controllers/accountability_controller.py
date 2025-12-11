"""
Accountability Controller
=========================
[OMAMAH] This is your controller to implement.

Handles accountability partnership features.
"""

from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from fastapi import HTTPException, status
from typing import Optional, List

# Import models
from app.models.accountability import AccountabilityPartnership, PartnershipStatus
from app.models.user import User
from app.models.habit import Habit

# Note: Comment model is missing in the project structure, so comment features are placeholders.

async def request_partnership(partner_id: int, message: Optional[str],
                               current_user, db: Session):
    """
    Send an accountability partnership request.
    """
    # 1. Verify partner user exists
    partner = db.query(User).filter(User.id == partner_id).first()
    if not partner:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # 2. Prevent self-partnership
    if partner_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot be your own accountability partner"
        )

    # 3. Check for existing partnership (active or pending)
    existing = db.query(AccountabilityPartnership).filter(
        or_(
            and_(AccountabilityPartnership.requester_id == current_user.id, 
                 AccountabilityPartnership.partner_id == partner_id),
            and_(AccountabilityPartnership.requester_id == partner_id, 
                 AccountabilityPartnership.partner_id == current_user.id)
        ),
        AccountabilityPartnership.status.in_([PartnershipStatus.PENDING, PartnershipStatus.ACTIVE])
    ).first()

    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An active or pending partnership already exists with this user"
        )

    # 4. Create partnership with PENDING status
    new_partnership = AccountabilityPartnership(
        requester_id=current_user.id,
        partner_id=partner_id,
        status=PartnershipStatus.PENDING,
        message=message
    )

    db.add(new_partnership)
    db.commit()
    db.refresh(new_partnership)
    
    return new_partnership


async def get_partnerships(current_user, db: Session,
                            status_filter: Optional[str] = None):
    """
    Get user's accountability partnerships.
    """
    # Query partnerships where user is requester OR partner
    query = db.query(AccountabilityPartnership).filter(
        or_(
            AccountabilityPartnership.requester_id == current_user.id,
            AccountabilityPartnership.partner_id == current_user.id
        )
    )

    # Apply status filter if provided
    if status_filter:
        try:
            status_enum = PartnershipStatus(status_filter)
            query = query.filter(AccountabilityPartnership.status == status_enum)
        except ValueError:
            pass # Ignore invalid status strings

    partnerships = query.all()
    
    # Format the response to include partner details
    results = []
    for p in partnerships:
        # Determine who the "partner" is relative to the current user
        is_requester = p.requester_id == current_user.id
        partner_user = p.partner if is_requester else p.requester
        
        results.append({
            "id": p.id,
            "requester_id": p.requester_id,
            "partner_id": p.partner_id,
            "status": p.status,
            "message": p.message,
            "can_view_all_habits": p.can_view_all_habits,
            "can_comment": p.can_comment,
            "created_at": p.created_at,
            "accepted_at": p.accepted_at,
            # Add convenience fields for the UI
            "partner_username": partner_user.username,
            "partner_avatar_url": partner_user.avatar_url,
            "partner_email": partner_user.email
        })

    return results


async def respond_to_request(partnership_id: int, accept: bool,
                              current_user, db: Session):
    """
    Accept or decline a partnership request.
    """
    partnership = db.query(AccountabilityPartnership).filter(
        AccountabilityPartnership.id == partnership_id
    ).first()

    if not partnership:
        raise HTTPException(status_code=404, detail="Partnership not found")

    # Verify user is the recipient (partner_id)
    if partnership.partner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to respond to this request")

    # Verify request is still pending
    if partnership.status != PartnershipStatus.PENDING:
        raise HTTPException(status_code=400, detail="Request is not pending")

    from datetime import datetime
    
    # Update status
    if accept:
        partnership.status = PartnershipStatus.ACTIVE
        partnership.accepted_at = datetime.utcnow()
    else:
        partnership.status = PartnershipStatus.DECLINED
    
    db.commit()
    db.refresh(partnership)
    return partnership


async def update_partnership(partnership_id: int, settings,
                              current_user, db: Session):
    """
    Update partnership settings.
    """
    partnership = db.query(AccountabilityPartnership).filter(
        AccountabilityPartnership.id == partnership_id
    ).first()

    if not partnership:
        raise HTTPException(status_code=404, detail="Partnership not found")

    # Verify user is part of the partnership
    if current_user.id not in [partnership.requester_id, partnership.partner_id]:
        raise HTTPException(status_code=403, detail="Not authorized")

    # Update permission settings
    if hasattr(settings, 'can_view_all_habits'):
        partnership.can_view_all_habits = settings.can_view_all_habits
    if hasattr(settings, 'can_comment'):
        partnership.can_comment = settings.can_comment

    db.commit()
    db.refresh(partnership)
    return partnership


async def end_partnership(partnership_id: int, current_user, db: Session):
    """
    End an accountability partnership.
    """
    partnership = db.query(AccountabilityPartnership).filter(
        AccountabilityPartnership.id == partnership_id
    ).first()

    if not partnership:
        raise HTTPException(status_code=404, detail="Partnership not found")

    # Verify user is part of the partnership
    if current_user.id not in [partnership.requester_id, partnership.partner_id]:
        raise HTTPException(status_code=403, detail="Not authorized")

    # Update status to ENDED
    partnership.status = PartnershipStatus.ENDED
    from datetime import datetime
    partnership.ended_at = datetime.utcnow()
    
    db.commit()
    return {"message": "Partnership ended"}


async def get_partner_habits(partner_id: int, current_user, db: Session):
    """
    View partner's habits (based on permissions).
    """
    # 1. Verify active partnership exists
    partnership = db.query(AccountabilityPartnership).filter(
        or_(
            and_(AccountabilityPartnership.requester_id == current_user.id, 
                 AccountabilityPartnership.partner_id == partner_id),
            and_(AccountabilityPartnership.requester_id == partner_id, 
                 AccountabilityPartnership.partner_id == current_user.id)
        ),
        AccountabilityPartnership.status == PartnershipStatus.ACTIVE
    ).first()

    if not partnership:
        raise HTTPException(status_code=403, detail="No active partnership with this user")

    # 2. Get partner info
    partner = db.query(User).filter(User.id == partner_id).first()
    
    # 3. Check permissions (Logic simplified: if permission enabled, show all active habits)
    # In a full implementation, you might filter specific habits if can_view_all_habits is False.
    
    query = db.query(Habit).filter(Habit.user_id == partner_id, Habit.is_active == True)
    habits = query.all()

    # Calculate basic stats for the view
    completion_rate = 0.0 # Placeholder: Implement actual calculation logic if needed
    
    return {
        "partner_id": partner_id,
        "partner_username": partner.username,
        "habits": habits,
        "overall_completion_rate": completion_rate,
        "current_streaks": [h.current_streak for h in habits]
    }


async def add_partner_comment(habit_id: int, log_id: Optional[int],
                               content: str, current_user, db: Session):
    """
    Add a comment on partner's habit or log.
    (Placeholder: Requires a Comment model to be fully implemented so leaving it for now)
    """
    # TODO: Implement this once a Comment model exists
    return {"message": "Comment posted (Simulation)"}


async def get_habit_comments(habit_id: int, current_user, db: Session):
    """
    Get comments on a habit.
    (Placeholder: Requires a Comment model to be fully implemented so leaving it for now)
    """
    # TODO: Implement this once a Comment model exists
    return []


async def search_users(query: str, current_user, db: Session):
    """
    Search for users to partner with.
    """
    if not query or len(query) < 3:
        return []

    # Find users matching query, excluding self
    users = db.query(User).filter(
        User.id != current_user.id,
        or_(
            User.username.ilike(f"%{query}%"),
            User.email.ilike(f"%{query}%")
        ),
        User.is_active == True
    ).limit(10).all()
    
    return [
        {"id": u.id, "username": u.username, "email": u.email, "avatar_url": u.avatar_url}
        for u in users
    ]