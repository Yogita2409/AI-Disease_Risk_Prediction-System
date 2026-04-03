import os
from model import EnsembleDiseasePredictor

# Create directory for models
os.makedirs('trained_models', exist_ok=True)

# Train and save model
print("Training ensemble model...")
predictor = EnsembleDiseasePredictor()
predictor.train()
predictor.save_model('trained_models/ensemble_model.pkl')
print("Model saved successfully!")
