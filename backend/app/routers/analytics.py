"""
Analytics Router
================
[HASEEB] This is your router to implement.

Defines analytics and statistics API endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from datetime import date, timedelta

from app.database import get_db
from app.controllers import analytics_controller
from app.middleware.auth import get_current_active_user
from app.models.user import User


router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)


@router.get("/overview")
async def get_overview(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get overview statistics for dashboard.
    Returns total habits, completion rates, and streak info.
    """
    return await analytics_controller.get_overview_stats(current_user, db)


@router.get("/streaks")
async def get_streaks(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get streak information for all habits.
    Returns habits with active streaks and overall streak stats.
    """
    return await analytics_controller.get_streak_data(current_user, db)


@router.get("/heatmap")
async def get_heatmap(
    start_date: date = Query(..., description="Start date for heatmap"),
    end_date: date = Query(..., description="End date for heatmap"),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get data for completion heatmap calendar.
    Returns completion counts per date for visualization.
    """
    # Validate date range
    if start_date > end_date:
        raise HTTPException(
            status_code=400,
            detail="start_date must be before end_date"
        )
    
    # Limit range to prevent excessive queries (max 1 year)
    max_days = 365
    if (end_date - start_date).days > max_days:
        raise HTTPException(
            status_code=400,
            detail=f"Date range cannot exceed {max_days} days"
        )
    
    heatmap_data = await analytics_controller.get_completion_heatmap(
        current_user, db, start_date, end_date
    )
    
    # Convert date keys to ISO format strings for JSON serialization
    return {
        "start_date": start_date.isoformat(),
        "end_date": end_date.isoformat(),
        "data": {d.isoformat(): count for d, count in heatmap_data.items()}
    }


@router.get("/progress")
async def get_progress_chart(
    period: str = Query("week", description="Period: week, month, or year"),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get data for progress charts.
    Returns completion data grouped by the specified period.
    """
    if period not in ["week", "month", "year"]:
        raise HTTPException(
            status_code=400,
            detail="Period must be 'week', 'month', or 'year'"
        )
    
    chart_data = await analytics_controller.get_progress_chart_data(
        current_user, db, period
    )
    
    # Convert date keys to ISO format strings for JSON serialization
    return {
        "period": period,
        "data": {d.isoformat(): count for d, count in chart_data.items()}
    }


@router.get("/categories")
async def get_category_breakdown(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get statistics by habit category.
    Returns completion stats grouped by category.
    """
    category_data = await analytics_controller.get_category_breakdown(current_user, db)
    
    # Convert enum keys to strings for JSON serialization
    return {
        (cat.value if hasattr(cat, 'value') else str(cat)): stats 
        for cat, stats in category_data.items()
    }


@router.get("/trends")
async def get_trends(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get trend analysis data.
    Compares current vs previous periods for insights.
    """
    trends_data = await analytics_controller.get_trends(current_user, db)
    
    # Calculate comparison metrics
    current_week_completions = sum(1 for log in trends_data["current_week_logs"] if log.completed)
    previous_week_completions = sum(1 for log in trends_data["previous_week_logs"] if log.completed)
    
    current_month_completions = sum(1 for log in trends_data["current_month_logs"] if log.completed)
    previous_month_completions = sum(1 for log in trends_data["previous_month_logs"] if log.completed)
    
    # Calculate percentage changes (avoid division by zero)
    def calc_change(current, previous):
        if previous == 0:
            return 100.0 if current > 0 else 0.0
        return ((current - previous) / previous) * 100
    
    return {
        "weekly": {
            "current": current_week_completions,
            "previous": previous_week_completions,
            "change_percent": round(calc_change(current_week_completions, previous_week_completions), 1)
        },
        "monthly": {
            "current": current_month_completions,
            "previous": previous_month_completions,
            "change_percent": round(calc_change(current_month_completions, previous_month_completions), 1)
        }
    }


@router.get("/achievements")
async def get_achievements_progress(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get achievement progress.
    Returns earned achievements and progress toward unearned ones.
    """
    return await analytics_controller.get_achievements_progress(current_user, db)
