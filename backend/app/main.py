from fastapi import FastAPI

from app.model_loader import load_models
from app.schemas import StudentData
from app.predictor import predict_productivity

app = FastAPI(
    title="NekoAI Backend",
    description="AI Backend for NekoAI Virtual Pet",
    version="1.0.0"
)

@app.on_event("startup")
def startup_event():
    load_models()

@app.get("/")
def home():
    return {
        "message": "Welcome to NekoAI Backend",
        
    }

@app.post("/predict")
def predict(student: StudentData):
    prediction = predict_productivity(student.model_dump())
    return {"Predicted_Productivity": prediction}

def predict(student: StudentData):

    prediction = predict_productivity(

        student.model_dump()

    )

    return {

        "Predicted_Productivity": prediction

    }
