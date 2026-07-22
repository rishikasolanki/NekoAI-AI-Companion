from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.schemas.reminder_schema import ReminderResponse
from app.ai.reminder_engine import get_next_reminder

router = APIRouter(
    prefix="/reminder",
    tags=["Reminder Engine"],
)


@router.get(
    "/",
    response_model=ReminderResponse,
    summary="Get the next reminder",
)
def reminder(
    db: Session = Depends(get_db),
):
    """
    Returns the most important reminder for Neko.

    Priority:
    - Overdue tasks
    - Tasks due within 30 minutes
    - Upcoming tasks
    """

    return get_next_reminder(db)