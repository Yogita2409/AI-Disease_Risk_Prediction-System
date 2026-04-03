
from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pickle
from model import EnsembleDiseasePredictor

app = Flask(__name__)
CORS(app)

# Load trained model
try:
    with open('trained_models/ensemble_model.pkl', 'rb') as f:
        model = pickle.load(f)
except:
    # Train new model if not exists
    model = EnsembleDiseasePredictor()
    model.train()
    model.save_model('trained_models/ensemble_model.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        
        # Extract features
        features = np.array([[
            data['age'],
            1 if data['gender'] == 'Male' else 0,  # Gender encoding
            data['bloodPressure'],
            data['glucoseLevel'],
            data['cholesterol']
        ]])
        
        # Get predictions from ensemble
        result = model.predict(features)
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)