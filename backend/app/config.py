from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent
MODEL_PATH = BASE_DIR / "ml_model" / "models" / "random_forest.pkl"
SCALER_PATH = BASE_DIR / "ml_model" / "models" / "scaler.pkl"
