import pickle

model_path = r"C:\Users\solan\OneDrive\Desktop\NekoAI\NekoAI-AI-Companion\ml_model\models\random_forest.pkl"

with open(model_path, "rb") as f:
    random_forest_model = pickle.load(f)

print("Random Forest model loaded successfully!")
