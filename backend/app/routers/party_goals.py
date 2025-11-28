"""
Party Goals Router
==================
[NOUMAN] This is your router to implement.

Defines party goal API endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional

# TODO: Import dependencies
# TODO: Import party goal controller
# TODO: Import party goal schemas
# TODO: Import auth middleware


router = APIRouter(
    prefix="/party-goals",
    tags=["Party Goals"]
)


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_goal():
    """
    Create a new goal for a party.
    
    TODO: Add function signature with PartyGoalCreate schema
    WHY: Accept goal data including party_id
    
    TODO: Add auth dependency
    WHY: Verify party membership
    SECURITY: Only party members can create goals
    
    TODO: Call party goal controller's create_party_goal function
    WHY: Create the goal
    
    TODO: Return created goal
    WHY: Display new goal
    """
    return {"message": "Create goal endpoint - to be implemented"}


@router.get("/party/{party_id}")
async def get_party_goals(party_id: int):
    """
    Get goals for a specific party.
    
    TODO: Add function signature with status filter
    WHY: Filter by goal status
    APPROACH: Add Query param for status
    
    TODO: Add auth dependency
    WHY: Verify party membership
    
    TODO: Call party goal controller's get_party_goals function
    WHY: Fetch party's goals
    
    TODO: Return goal list
    WHY: Party goals display
    """
    return {"message": "Get party goals endpoint - to be implemented"}


@router.get("/{goal_id}")
async def get_goal(goal_id: int):
    """
    Get specific goal details.
    
    TODO: Add function signature with auth
    WHY: Verify access
    
    TODO: Call party goal controller's get_goal_by_id function
    WHY: Fetch goal with access check
    
    TODO: Return goal details
    WHY: Goal detail view
    """
    return {"message": "Get goal endpoint - to be implemented"}


@router.put("/{goal_id}")
async def update_goal(goal_id: int):
    """
    Update a party goal.
    
    TODO: Add function signature with PartyGoalUpdate schema
    WHY: Accept update data
    
    TODO: Add auth dependency
    WHY: Verify permission
    SECURITY: Only creator/leader can update
    
    TODO: Call party goal controller's update_party_goal function
    WHY: Apply updates
    
    TODO: Return updated goal
    WHY: Confirm changes
    """
    return {"message": "Update goal endpoint - to be implemented"}


@router.delete("/{goal_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_goal(goal_id: int):
    """
    Delete or cancel a party goal.
    
    TODO: Add function signature with auth
    WHY: Verify permission
    SECURITY: Only creator/leader can delete
    
    TODO: Call party goal controller's delete_party_goal function
    WHY: Cancel the goal
    
    TODO: Return no content
    WHY: Standard delete response
    """
    return None


@router.post("/{goal_id}/contribute")
async def contribute_to_goal(goal_id: int):
    """
    Add contribution to a party goal.
    
    TODO: Add function signature with contribution amount
    WHY: Accept contribution value
    APPROACH: Schema with increment field
    
    TODO: Add auth dependency
    WHY: Track who contributed
    
    TODO: Call party goal controller's contribute_to_goal function
    WHY: Update progress and track contribution
    
    TODO: Return updated goal
    WHY: Show new progress
    """
    return {"message": "Contribute endpoint - to be implemented"}


@router.get("/{goal_id}/contributors")
async def get_contributors(goal_id: int):
    """
    Get list of contributors for a goal.
    
    TODO: Add function signature with auth
    WHY: Verify party membership
    
    TODO: Call party goal controller's get_goal_contributors function
    WHY: Aggregate contributions
    
    TODO: Return contributor list
    WHY: Goal leaderboard
    """
    return {"message": "Get contributors endpoint - to be implemented"}

