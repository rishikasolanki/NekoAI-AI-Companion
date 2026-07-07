from fastapi import FastAPI

app = FastAPI(
    title="NekoAI Backend",
    description="AI Backend for NekoAI Virtual Pet",
    version="1.0.0"
)

@app.get("/")
def home():
    return {
        "message": "Welcome to NekoAI Backend",
        "status": "Running Successfully"
    }