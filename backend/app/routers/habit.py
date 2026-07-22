from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.schemas.habit_schema import HabitResponse
from app.ai.habit_engine import calculate_habits

router = APIRouter(
    prefix="/habit",
    tags=["Habit Engine"],
)


@router.get(
    "/",
    response_model=HabitResponse,
    summary="Get user's habit statistics",
)
def habits(
    db: Session = Depends(get_db),
):
    """
    Returns the user's habit statistics including:

    - Current streak
    - Best streak
    - Completion rate
    - Total completed tasks
    - Pending tasks

    Used by the dashboard and desktop pet to
    monitor the user's productivity.
    """

    return calculate_habits(db)