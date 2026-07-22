from typing import Optional

from pydantic import BaseModel


class ReminderResponse(BaseModel):
    """
    Reminder returned by NekoAI.

    Used by:
    - Dashboard
    - Desktop Pet
    - Reminder Notifications
    """

    reminder: bool

    urgency: str

    title: str

    message: str

    minutes_left: Optional[int] = None