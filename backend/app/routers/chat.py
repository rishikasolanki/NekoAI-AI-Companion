from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.ai.ai_service import generate_response
from app.ai.prompt_builder import build_prompt
from app.database.database import get_db
from app.models.chat_message import ChatMessage
from app.services.decision_database import (
    format_task_summary,
    get_task_statistics,
)
from app.services.memory_service import (
    auto_save_memory,
    format_memories,
    get_recent_memories,
)

router = APIRouter(
    prefix="/chat",
    tags=["AI Chat"],
)


class ChatRequest(BaseModel):
    message: str = Field(
        min_length=1,
        max_length=8000,
    )


def _recent_history(
    db: Session,
    limit: int = 20,
) -> list[dict[str, str]]:
    """
    Returns the latest conversation history
    in chronological order.
    """

    messages = (
        db.query(ChatMessage)
        .order_by(
            ChatMessage.created_at.desc(),
            ChatMessage.id.desc(),
        )
        .limit(limit)
        .all()
    )

    return [
        {
            "role": message.role,
            "content": message.content,
        }
        for message in reversed(messages)
    ]


@router.post("/")
def chat(
    request: ChatRequest,
    db: Session = Depends(get_db),
):
    """
    Main conversation endpoint.
    """

    message = request.message.strip()

    if not message:
        return {
            "success": False,
            "reply": "",
            "error": "Please enter a message.",
        }

    # Save user message if important
    auto_save_memory(db, message)

    # Load recent conversation
    history = _recent_history(db)

    # Save user message
    db.add(
        ChatMessage(
            role="user",
            content=message,
        )
    )
    db.commit()

    # Build Gemini prompt
    prompt = build_prompt(
        user_message=message,
        memories=format_memories(
            get_recent_memories(db)
        ),
        task_summary=format_task_summary(
            get_task_statistics(db)
        ),
        history=history,
    )

    # Generate AI response
    try:
        reply = generate_response(prompt)

    except Exception as error:

        print("Gemini Error:", error)

        reply = (
            "Sorry... I couldn't reach my AI brain right now 🐱 "
            "Please try again in a moment."
        )

    # Save AI reply
    db.add(
        ChatMessage(
            role="neko",
            content=reply,
        )
    )
    db.commit()

    # Save useful AI memories
    auto_save_memory(db, reply)

    return {
        "success": True,
        "reply": reply,
    }


@router.get("/history")
def chat_history(
    db: Session = Depends(get_db),
):
    """
    Returns recent conversation history.
    """

    return _recent_history(
        db,
        limit=100,
    )