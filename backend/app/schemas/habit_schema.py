from typing import Optional

from pydantic import BaseModel


class HabitResponse(BaseModel):
    """
    Habit statistics returned to the dashboard,
    planner and desktop pet.
    """

    # Current consecutive completion streak
    current_streak: int

    # Best streak achieved
    best_streak: int

    # Completion percentage
    completion_rate: float

    # Number of completed tasks
    total_completed: int

    # Number of pending tasks
    pending_tasks: int

    # Productivity level (future dashboard)
    productivity_level: Optional[str] = None

    # Whether today's habit goal is completed
    today_completed: Optional[bool] = None

    # Current XP earned (future gamification)
    xp: Optional[int] = None