import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, VotingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import pickle

class EnsembleDiseasePredictor:
    def __init__(self):
        self.scaler = StandardScaler()
        self.ensemble_model = None
        
    def generate_training_data(self, n_samples=10000):
        """Generate synthetic training data"""
        np.random.seed(42)
        
        # Generate features
        age = np.random.normal(50, 15, n_samples).clip(18, 90)
        gender = np.random.randint(0, 2, n_samples)
        bp = np.random.normal(120, 20, n_samples).clip(80, 200)
        glucose = np.random.normal(100, 30, n_samples).clip(70, 300)
        cholesterol = np.random.normal(200, 40, n_samples).clip(150, 350)
        
        # Create risk labels based on features
        risk_score = (
            (age > 50) * 0.3 +
            (bp > 140) * 0.25 +
            (glucose > 140) * 0.25 +
            (cholesterol > 240) * 0.2
        )
        
        # Add some randomness
        risk_score += np.random.normal(0, 0.1, n_samples)
        
        # Convert to binary classification (0: Low/Moderate, 1: High Risk)
        labels = (risk_score > 0.6).astype(int)
        
        X = pd.DataFrame({
            'age': age,
            'gender': gender,
            'blood_pressure': bp,
            'glucose': glucose,
            'cholesterol': cholesterol
        })
        
        return X, labels
    
    def train(self):
        """Train ensemble model"""
        # Generate training data
        X, y = self.generate_training_data()
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        # Create individual models
        lr = LogisticRegression(random_state=42, max_iter=1000)
        rf = RandomForestClassifier(n_estimators=100, random_state=42)
        svm = SVC(probability=True, random_state=42)
        
        # Create ensemble with soft voting
        self.ensemble_model = VotingClassifier(
            estimators=[
                ('lr', lr),
                ('rf', rf),
                ('svm', svm)
            ],
            voting='soft'
        )
        
        # Train ensemble
        self.ensemble_model.fit(X_train_scaled, y_train)
        
        # Evaluate
        train_score = self.ensemble_model.score(X_train_scaled, y_train)
        test_score = self.ensemble_model.score(X_test_scaled, y_test)
        
        print(f"Training Accuracy: {train_score:.4f}")
        print(f"Testing Accuracy: {test_score:.4f}")
    
    def predict(self, features):
        """Make prediction with individual model breakdowns"""
        # Scale features
        features_scaled = self.scaler.transform(features)
        
        # Get ensemble prediction
        ensemble_prob = self.ensemble_model.predict_proba(features_scaled)[0]
        
        # Get individual model predictions
        lr_prob = self.ensemble_model.named_estimators_['lr'].predict_proba(features_scaled)[0]
        rf_prob = self.ensemble_model.named_estimators_['rf'].predict_proba(features_scaled)[0]
        svm_prob = self.ensemble_model.named_estimators_['svm'].predict_proba(features_scaled)[0]
        
        # Calculate overall probability
        high_risk_prob = ensemble_prob[1] * 100
        
        # Determine risk level
        if high_risk_prob >= 60:
            risk = "High Risk"
            recommendation = "Immediate medical consultation recommended. Your health parameters indicate elevated risk factors."
        elif high_risk_prob >= 35:
            risk = "Moderate Risk"
            recommendation = "Regular health monitoring advised. Consider lifestyle modifications."
        else:
            risk = "Low Risk"
            recommendation = "Maintain healthy lifestyle habits. Continue regular health check-ups."
        
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
    
    def save_model(self, filepath):
        """Save model to disk"""
        with open(filepath, 'wb') as f:
            pickle.dump({
                'ensemble': self.ensemble_model,
                'scaler': self.scaler
            }, f)
    
    def load_model(self, filepath):
        """Load model from disk"""
        with open(filepath, 'rb') as f:
            data = pickle.load(f)
            self.ensemble_model = data['ensemble']
            self.scaler = data['scaler']
