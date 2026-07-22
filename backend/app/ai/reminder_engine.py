from datetime import datetime, timedelta

from sqlalchemy.orm import Session

from app.models.task import Task


def get_next_reminder(db: Session):
    """
    Returns the most important reminder for Neko.

    Priority:
    1. Overdue tasks
    2. Due within 30 minutes
    3. Due within 2 hours
    4. Nothing urgent
    """

    now = datetime.utcnow()

    tasks = (
        db.query(Task)
        .filter(Task.status == "Pending")
        .order_by(Task.due_date.asc())
        .all()
    )

    if not tasks:
        return {
            "reminder": False,
            "urgency": "none",
            "title": "",
            "message": "",
            "minutes_left": None,
        }

    # -----------------------------
    # Check tasks
    # -----------------------------

    for task in tasks:

        if task.due_date is None:
            continue

        time_left = task.due_date - now

        minutes = int(time_left.total_seconds() / 60)

        # -----------------------------
        # Overdue
        # -----------------------------

        if minutes < 0:

            return {
                "reminder": True,
                "urgency": "overdue",
                "title": task.title,
                "message": f"'{task.title}' is overdue. Let's finish it together! 🐱",
                "minutes_left": minutes,
            }

        # -----------------------------
        # Within 30 minutes
        # -----------------------------

        if minutes <= 30:

            return {
                "reminder": True,
                "urgency": "high",
                "title": task.title,
                "message": f"'{task.title}' is due in {minutes} minute(s).",
                "minutes_left": minutes,
            }

        # -----------------------------
        # Within 2 hours
        # -----------------------------

        if minutes <= 120:

            return {
                "reminder": True,
                "urgency": "medium",
                "title": task.title,
                "message": f"Upcoming task: '{task.title}'",
                "minutes_left": minutes,
            }

    # -----------------------------
    # Nothing urgent
    # -----------------------------

    return {
        "reminder": False,
        "urgency": "none",
        "title": "",
        "message": "",
        "minutes_left": None,
    }