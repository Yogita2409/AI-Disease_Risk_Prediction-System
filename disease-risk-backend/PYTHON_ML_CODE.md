# Python Machine Learning Code - Complete Implementation

This file contains all the Python code needed for the ML backend.

## 📁 File Structure

```
ml-model/
├── app.py                      # Flask API server
├── model.py                    # ML model implementation
├── train_model.py             # Model training script
├── requirements.txt           # Python dependencies
├── trained_models/            # Directory for saved models
│   └── ensemble_model.pkl     # Trained model file
└── README.md                  # ML setup instructions
```

## 1. requirements.txt

```txt
flask==2.3.0
flask-cors==4.0.0
numpy==1.24.0
pandas==2.0.0
scikit-learn==1.3.0
joblib==1.3.0
```

## 2. model.py

```python
"""
Ensemble Disease Risk Prediction Model
Uses Logistic Regression, Random Forest, and SVM
Combined through Voting Classifier
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, VotingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
import joblib
import os

class EnsembleDiseasePredictor:
    """
    Ensemble learning model for disease risk prediction
    Combines three powerful ML algorithms:
    1. Logistic Regression
    2. Random Forest
    3. Support Vector Machine (SVM)
    """
    
    def __init__(self):
        self.scaler = StandardScaler()
        self.ensemble_model = None
        self.feature_names = ['age', 'gender', 'blood_pressure', 'glucose', 'cholesterol']
        
    def generate_training_data(self, n_samples=10000):
        """
        Generate synthetic training data for disease risk prediction
        
        Args:
            n_samples: Number of training samples to generate
            
        Returns:
            X: Feature DataFrame
            y: Labels (0: Low/Moderate Risk, 1: High Risk)
        """
        np.random.seed(42)
        
        # Generate realistic health parameters
        age = np.random.normal(50, 15, n_samples).clip(18, 90)
        gender = np.random.randint(0, 2, n_samples)  # 0: Female, 1: Male
        
        # Blood pressure (normal: 90-120, high: >140)
        bp = np.random.normal(120, 20, n_samples).clip(80, 200)
        
        # Glucose level (normal: 70-100, diabetes: >140)
        glucose = np.random.normal(100, 30, n_samples).clip(70, 300)
        
        # Cholesterol (normal: <200, high: >240)
        cholesterol = np.random.normal(200, 40, n_samples).clip(150, 350)
        
        # Calculate risk score based on medical guidelines
        risk_score = (
            (age > 50) * 0.3 +           # Age factor
            (bp > 140) * 0.25 +          # Hypertension
            (glucose > 140) * 0.25 +     # Diabetes risk
            (cholesterol > 240) * 0.2    # High cholesterol
        )
        
        # Add interaction effects
        risk_score += (age > 60) * (bp > 140) * 0.1  # Age + BP interaction
        risk_score += (glucose > 140) * (cholesterol > 240) * 0.1  # Diabetes + Cholesterol
        
        # Add some randomness for realistic variation
        risk_score += np.random.normal(0, 0.1, n_samples)
        risk_score = np.clip(risk_score, 0, 1)
        
        # Convert to binary classification
        # High Risk: score > 0.6, Low/Moderate Risk: score <= 0.6
        labels = (risk_score > 0.6).astype(int)
        
        # Create feature DataFrame
        X = pd.DataFrame({
            'age': age,
            'gender': gender,
            'blood_pressure': bp,
            'glucose': glucose,
            'cholesterol': cholesterol
        })
        
        return X, labels
    
    def train(self, X=None, y=None):
        """
        Train the ensemble model
        
        Args:
            X: Training features (optional, generates synthetic data if None)
            y: Training labels (optional)
        """
        # Generate training data if not provided
        if X is None or y is None:
            print("Generating synthetic training data...")
            X, y = self.generate_training_data(n_samples=10000)
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        
        print(f"Training set size: {len(X_train)}")
        print(f"Testing set size: {len(X_test)}")
        print(f"High Risk samples: {sum(y_train)} ({sum(y_train)/len(y_train)*100:.1f}%)")
        
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        # Create individual models
        print("\nTraining individual models...")
        
        # 1. Logistic Regression
        lr = LogisticRegression(
            random_state=42,
            max_iter=1000,
            C=1.0,
            solver='lbfgs'
        )
        
        # 2. Random Forest
        rf = RandomForestClassifier(
            n_estimators=100,
            max_depth=10,
            min_samples_split=5,
            min_samples_leaf=2,
            random_state=42,
            n_jobs=-1
        )
        
        # 3. Support Vector Machine
        svm = SVC(
            kernel='rbf',
            C=1.0,
            gamma='scale',
            probability=True,
            random_state=42
        )
        
        # Create ensemble with soft voting
        self.ensemble_model = VotingClassifier(
            estimators=[
                ('lr', lr),
                ('rf', rf),
                ('svm', svm)
            ],
            voting='soft',  # Use probability averaging
            n_jobs=-1
        )
        
        # Train ensemble
        print("Training ensemble model...")
        self.ensemble_model.fit(X_train_scaled, y_train)
        
        # Evaluate models
        print("\n" + "="*60)
        print("MODEL EVALUATION")
        print("="*60)
        
        # Training accuracy
        train_pred = self.ensemble_model.predict(X_train_scaled)
        train_acc = accuracy_score(y_train, train_pred)
        
        # Testing accuracy
        test_pred = self.ensemble_model.predict(X_test_scaled)
        test_acc = accuracy_score(y_test, test_pred)
        
        print(f"\nEnsemble Model:")
        print(f"  Training Accuracy: {train_acc:.4f} ({train_acc*100:.2f}%)")
        print(f"  Testing Accuracy:  {test_acc:.4f} ({test_acc*100:.2f}%)")
        
        # Individual model performance
        print(f"\nIndividual Models (Test Set):")
        for name, model in self.ensemble_model.named_estimators_.items():
            pred = model.predict(X_test_scaled)
            acc = accuracy_score(y_test, pred)
            print(f"  {name.upper():3s}: {acc:.4f} ({acc*100:.2f}%)")
        
        # Classification report
        print("\nClassification Report:")
        print(classification_report(y_test, test_pred, 
                                   target_names=['Low/Moderate Risk', 'High Risk']))
        
        # Cross-validation
        cv_scores = cross_val_score(self.ensemble_model, X_train_scaled, y_train, 
                                    cv=5, scoring='accuracy')
        print(f"\n5-Fold Cross-Validation:")
        print(f"  Mean Accuracy: {cv_scores.mean():.4f} (+/- {cv_scores.std()*2:.4f})")
        
        print("\n" + "="*60)
        print("TRAINING COMPLETE!")
        print("="*60)
    
    def predict(self, features):
        """
        Make prediction with model breakdown
        
        Args:
            features: 2D array or DataFrame with shape (n_samples, 5)
                     Columns: [age, gender, blood_pressure, glucose, cholesterol]
        
        Returns:
            dict: Prediction results including risk level, probability, and model breakdown
        """
        # Convert to DataFrame if necessary
        if isinstance(features, np.ndarray):
            features = pd.DataFrame(features, columns=self.feature_names)
        
        # Scale features
        features_scaled = self.scaler.transform(features)
        
        # Get ensemble prediction probabilities
        ensemble_prob = self.ensemble_model.predict_proba(features_scaled)[0]
        
        # Get individual model predictions
        lr_prob = self.ensemble_model.named_estimators_['lr'].predict_proba(features_scaled)[0]
        rf_prob = self.ensemble_model.named_estimators_['rf'].predict_proba(features_scaled)[0]
        svm_prob = self.ensemble_model.named_estimators_['svm'].predict_proba(features_scaled)[0]
        
        # Calculate high risk probability
        high_risk_prob = ensemble_prob[1] * 100
        
        # Determine risk level and recommendation
        if high_risk_prob >= 60:
            risk = "High Risk"
            recommendation = (
                "Immediate medical consultation recommended. Your health parameters "
                "indicate elevated risk factors. Please consult with a healthcare "
                "professional for comprehensive evaluation and personalized treatment plan."
            )
        elif high_risk_prob >= 35:
            risk = "Moderate Risk"
            recommendation = (
                "Regular health monitoring advised. Consider lifestyle modifications "
                "including balanced diet, regular exercise, and stress management. "
                "Schedule a check-up with your doctor within the next month."
            )
        else:
            risk = "Low Risk"
            recommendation = (
                "Maintain healthy lifestyle habits. Continue regular exercise, "
                "balanced nutrition, and annual health check-ups. Your current "
                "health parameters are within normal ranges."
            )
        
        return {
            'risk': risk,
            'probability': round(high_risk_prob, 1),
            'recommendation': recommendation,
            'modelBreakdown': {
                'logisticRegression': round(lr_prob[1] * 100, 1),
                'randomForest': round(rf_prob[1] * 100, 1),
                'svm': round(svm_prob[1] * 100, 1)
            }
        }
    
    def save_model(self, filepath='trained_models/ensemble_model.pkl'):
        """Save trained model to disk"""
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        joblib.dump({
            'ensemble': self.ensemble_model,
            'scaler': self.scaler
        }, filepath)
        print(f"\nModel saved to: {filepath}")
    
    def load_model(self, filepath='trained_models/ensemble_model.pkl'):
        """Load trained model from disk"""
        data = joblib.load(filepath)
        self.ensemble_model = data['ensemble']
        self.scaler = data['scaler']
        print(f"Model loaded from: {filepath}")

# Example usage
if __name__ == "__main__":
    # Create and train model
    predictor = EnsembleDiseasePredictor()
    predictor.train()
    
    # Test prediction
    test_case = np.array([[55, 1, 145, 150, 250]])  # age, gender, bp, glucose, cholesterol
    result = predictor.predict(test_case)
    
    print("\n" + "="*60)
    print("TEST PREDICTION")
    print("="*60)
    print(f"Risk: {result['risk']}")
    print(f"Probability: {result['probability']}%")
    print(f"\nModel Breakdown:")
    print(f"  Logistic Regression: {result['modelBreakdown']['logisticRegression']}%")
    print(f"  Random Forest: {result['modelBreakdown']['randomForest']}%")
    print(f"  SVM: {result['modelBreakdown']['svm']}%")
    print(f"\nRecommendation: {result['recommendation']}")
```

## 3. app.py

```python
"""
Flask API Server for Disease Risk Prediction
Provides REST API endpoint for the ML model
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import os
from model import EnsembleDiseasePredictor

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Load or train model
model = EnsembleDiseasePredictor()
model_path = 'trained_models/ensemble_model.pkl'

if os.path.exists(model_path):
    print("Loading existing model...")
    model.load_model(model_path)
    print("Model loaded successfully!")
else:
    print("No existing model found. Training new model...")
    model.train()
    model.save_model(model_path)
    print("New model trained and saved!")

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'Disease Prediction API is running',
        'version': '1.0.0'
    })

@app.route('/predict', methods=['POST'])
def predict():
    """
    Predict disease risk based on health parameters
    
    Request Body (JSON):
    {
        "age": 55,
        "gender": "Male",
        "bloodPressure": 145,
        "glucoseLevel": 150,
        "cholesterol": 250,
        "symptoms": "Optional symptoms description"
    }
    
    Response (JSON):
    {
        "risk": "High Risk",
        "probability": 75.5,
        "recommendation": "...",
        "modelBreakdown": {
            "logisticRegression": 73.2,
            "randomForest": 78.5,
            "svm": 74.8
        }
    }
    """
    try:
        # Parse request data
        data = request.json
        
        # Validate required fields
        required_fields = ['age', 'gender', 'bloodPressure', 'glucoseLevel', 'cholesterol']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'error': f'Missing required field: {field}'
                }), 400
        
        # Extract and prepare features
        gender_encoded = 1 if data['gender'].lower() == 'male' else 0
        
        features = np.array([[
            float(data['age']),
            gender_encoded,
            float(data['bloodPressure']),
            float(data['glucoseLevel']),
            float(data['cholesterol'])
        ]])
        
        # Validate ranges
        if not (18 <= features[0][0] <= 120):
            return jsonify({'error': 'Age must be between 18 and 120'}), 400
        if not (60 <= features[0][2] <= 250):
            return jsonify({'error': 'Blood pressure must be between 60 and 250'}), 400
        if not (50 <= features[0][3] <= 400):
            return jsonify({'error': 'Glucose level must be between 50 and 400'}), 400
        if not (100 <= features[0][4] <= 400):
            return jsonify({'error': 'Cholesterol must be between 100 and 400'}), 400
        
        # Make prediction
        result = model.predict(features)
        
        # Log prediction (in production, you'd save to database)
        print(f"Prediction made: {result['risk']} ({result['probability']}%)")
        
        return jsonify(result)
    
    except ValueError as e:
        return jsonify({
            'error': f'Invalid input value: {str(e)}'
        }), 400
    
    except Exception as e:
        print(f"Error during prediction: {str(e)}")
        return jsonify({
            'error': 'Internal server error during prediction'
        }), 500

@app.route('/model-info', methods=['GET'])
def model_info():
    """Get information about the ML model"""
    return jsonify({
        'name': 'Ensemble Disease Risk Predictor',
        'algorithms': [
            'Logistic Regression',
            'Random Forest',
            'Support Vector Machine (SVM)'
        ],
        'voting': 'soft',
        'features': [
            'age',
            'gender',
            'blood_pressure',
            'glucose_level',
            'cholesterol'
        ],
        'output': {
            'risk_levels': ['Low Risk', 'Moderate Risk', 'High Risk'],
            'probability_range': [0, 100]
        }
    })

@app.errorhandler(404)
def not_found(e):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(e):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    # Run Flask server
    # In production, use a production WSGI server like Gunicorn
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=False  # Set to False in production
    )
```

## 4. train_model.py

```python
"""
Standalone script to train and save the ML model
Run this before starting the API server for the first time
"""

import os
from model import EnsembleDiseasePredictor

def main():
    print("="*60)
    print("DISEASE RISK PREDICTION MODEL TRAINING")
    print("="*60)
    
    # Create directory for models
    os.makedirs('trained_models', exist_ok=True)
    
    # Initialize predictor
    predictor = EnsembleDiseasePredictor()
    
    # Train model
    predictor.train()
    
    # Save model
    model_path = 'trained_models/ensemble_model.pkl'
    predictor.save_model(model_path)
    
    # Test the saved model
    print("\n" + "="*60)
    print("TESTING SAVED MODEL")
    print("="*60)
    
    # Load the saved model
    test_predictor = EnsembleDiseasePredictor()
    test_predictor.load_model(model_path)
    
    # Run test predictions
    test_cases = [
        {
            'name': 'High Risk Case',
            'features': [[65, 1, 160, 180, 280]],  # Older age, high BP, glucose, cholesterol
        },
        {
            'name': 'Moderate Risk Case',
            'features': [[45, 0, 130, 110, 210]],  # Middle age, slightly elevated values
        },
        {
            'name': 'Low Risk Case',
            'features': [[30, 1, 110, 90, 180]],  # Young age, normal values
        }
    ]
    
    for case in test_cases:
        result = test_predictor.predict(case['features'])
        print(f"\n{case['name']}:")
        print(f"  Input: Age={case['features'][0][0]}, Gender={'M' if case['features'][0][1] else 'F'}, "
              f"BP={case['features'][0][2]}, Glucose={case['features'][0][3]}, Cholesterol={case['features'][0][4]}")
        print(f"  Risk: {result['risk']}")
        print(f"  Probability: {result['probability']}%")
    
    print("\n" + "="*60)
    print("MODEL TRAINING COMPLETE!")
    print(f"Model saved to: {model_path}")
    print("="*60)

if __name__ == "__main__":
    main()
```

## 5. Dockerfile (for deployment)

```dockerfile
FROM python:3.9-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application files
COPY . .

# Train the model during build
RUN python train_model.py

# Expose port
EXPOSE 5000

# Run the application
CMD ["python", "app.py"]
```

## 6. .gitignore

```
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
env/
venv/
ENV/
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
*.egg-info/
.installed.cfg
*.egg

# Models
trained_models/*.pkl

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db
```

## 📝 Setup Instructions

### 1. Create Virtual Environment

```bash
cd ml-model
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (macOS/Linux)
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Train the Model

```bash
python train_model.py
```

### 4. Start the API Server

```bash
python app.py
```

The API will be available at `http://localhost:5000`

### 5. Test the API

```bash
# Health check
curl http://localhost:5000/health

# Make a prediction
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "age": 55,
    "gender": "Male",
    "bloodPressure": 145,
    "glucoseLevel": 150,
    "cholesterol": 250
  }'
```

## 🚀 Deployment Options

### Option 1: Heroku
```bash
heroku create your-app-name
git push heroku main
```

### Option 2: Render
1. Connect GitHub repository
2. Select "Web Service"
3. Build command: `pip install -r requirements.txt && python train_model.py`
4. Start command: `python app.py`

### Option 3: Railway
1. Connect GitHub repository
2. Railway will auto-detect Python
3. Add start command: `python app.py`

### Option 4: Docker
```bash
docker build -t disease-prediction-api .
docker run -p 5000:5000 disease-prediction-api
```

## 📊 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/predict` | POST | Make prediction |
| `/model-info` | GET | Model information |

## ✅ Testing

Create `test_api.py`:

```python
import requests
import json

API_URL = "http://localhost:5000"

# Test health endpoint
response = requests.get(f"{API_URL}/health")
print("Health Check:", response.json())

# Test prediction
test_data = {
    "age": 55,
    "gender": "Male",
    "bloodPressure": 145,
    "glucoseLevel": 150,
    "cholesterol": 250
}

response = requests.post(f"{API_URL}/predict", json=test_data)
print("\nPrediction Result:")
print(json.dumps(response.json(), indent=2))
```

Run: `python test_api.py`

---

**Ready to use in your production application!** 🎉
