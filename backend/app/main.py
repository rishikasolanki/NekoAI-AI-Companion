from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.database import Base, SessionLocal, engine

# Import models so SQLAlchemy registers every table
import app.models

from app.routers.ai_chat import router as brain_router
from app.routers.analytics import router as analytics_router
from app.routers.auth import router as auth_router
from app.routers.chat import router as chat_router
from app.routers.decision import router as decision_router
from app.routers.emotion import router as emotion_router
from app.routers.habit import router as habit_router
from app.routers.memory import router as memory_router
from app.routers.reminder import router as reminder_router
from app.routers.task import router as task_router
from app.routers.websocket import router as websocket_router

from app.services.decision_database import get_task_statistics


app = FastAPI(
    title="NekoAI Backend",
    version="1.0.0",
    description="Backend API for the NekoAI desktop companion.",
)


# Create missing SQLite tables during development.
# This does not update columns in existing tables.
Base.metadata.create_all(bind=engine)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth_router)
app.include_router(task_router)
app.include_router(emotion_router)
app.include_router(reminder_router)
app.include_router(habit_router)
app.include_router(brain_router)
app.include_router(websocket_router)
app.include_router(memory_router)
app.include_router(chat_router)
app.include_router(decision_router)
app.include_router(analytics_router)


@app.get(
    "/",
    tags=["System"],
    summary="Check backend status",
)
def home():
    return {
        "message": "NekoAI Backend Running",
        "status": "healthy",
        "version": "1.0.0",
    }


@app.get(
    "/test/tasks",
    tags=["Development"],
    summary="Test task statistics",
)
def test_tasks():
    db = SessionLocal()

    try:
        return get_task_statistics(db)

    finally:
        db.close()