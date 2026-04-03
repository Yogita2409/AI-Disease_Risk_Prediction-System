// Mock ML Ensemble Learning Model
// In production, this would call your Python Flask API

export interface PredictionInput {
  age: number;
  gender: string;
  bloodPressure: number;
  glucoseLevel: number;
  cholesterol: number;
  symptoms: string;
}

export interface PredictionResult {
  risk: 'High Risk' | 'Low Risk' | 'Moderate Risk';
  probability: number;
  recommendation: string;
  modelBreakdown: {
    logisticRegression: number;
    randomForest: number;
    svm: number;
  };
}

// Simulate ensemble learning with multiple models
export const predictDisease = async (input: PredictionInput): Promise<PredictionResult> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Calculate risk scores based on input (simplified algorithm)
  const ageScore = input.age > 50 ? 0.3 : input.age > 35 ? 0.15 : 0.05;
  const bpScore = input.bloodPressure > 140 ? 0.25 : input.bloodPressure > 120 ? 0.12 : 0.03;
  const glucoseScore = input.glucoseLevel > 140 ? 0.25 : input.glucoseLevel > 100 ? 0.1 : 0.02;
  const cholesterolScore = input.cholesterol > 240 ? 0.2 : input.cholesterol > 200 ? 0.1 : 0.03;

  // Simulate three different model predictions (Logistic Regression, Random Forest, SVM)
  const lr_score = Math.min(100, (ageScore + bpScore * 1.1 + glucoseScore * 1.05 + cholesterolScore) * 100 + Math.random() * 5);
  const rf_score = Math.min(100, (ageScore * 1.1 + bpScore + glucoseScore * 1.15 + cholesterolScore * 1.05) * 100 + Math.random() * 5);
  const svm_score = Math.min(100, (ageScore * 0.95 + bpScore * 1.05 + glucoseScore + cholesterolScore * 1.1) * 100 + Math.random() * 5);

  // Ensemble voting (average of three models)
  const ensembleProbability = (lr_score + rf_score + svm_score) / 3;

  let risk: 'High Risk' | 'Low Risk' | 'Moderate Risk';
  let recommendation: string;

  if (ensembleProbability >= 60) {
    risk = 'High Risk';
    recommendation = 'Immediate medical consultation recommended. Your health parameters indicate elevated risk factors. Please consult with a healthcare professional for comprehensive evaluation and personalized treatment plan.';
  } else if (ensembleProbability >= 35) {
    risk = 'Moderate Risk';
    recommendation = 'Regular health monitoring advised. Consider lifestyle modifications including balanced diet, regular exercise, and stress management. Schedule a check-up with your doctor within the next month.';
  } else {
    risk = 'Low Risk';
    recommendation = 'Maintain healthy lifestyle habits. Continue regular exercise, balanced nutrition, and annual health check-ups. Your current health parameters are within normal ranges.';
  }

  return {
    risk,
    probability: Math.round(ensembleProbability * 10) / 10,
    recommendation,
    modelBreakdown: {
      logisticRegression: Math.round(lr_score * 10) / 10,
      randomForest: Math.round(rf_score * 10) / 10,
      svm: Math.round(svm_score * 10) / 10,
    },
  };
};

// Store prediction history
export const savePrediction = (userId: string, input: PredictionInput, result: PredictionResult) => {
  const predictions = JSON.parse(localStorage.getItem('predictions') || '[]');
  predictions.push({
    id: Date.now().toString(),
    userId,
    input,
    result,
    date: new Date().toISOString(),
  });
  localStorage.setItem('predictions', JSON.stringify(predictions));
};

// Get user's prediction history
export const getUserPredictions = (userId: string) => {
  const predictions = JSON.parse(localStorage.getItem('predictions') || '[]');
  return predictions.filter((p: any) => p.userId === userId);
};

// Get statistics for dashboard
export const getDashboardStats = (userId: string) => {
  const predictions = getUserPredictions(userId);
  
  const highRisk = predictions.filter((p: any) => p.result.risk === 'High Risk').length;
  const moderateRisk = predictions.filter((p: any) => p.result.risk === 'Moderate Risk').length;
  const lowRisk = predictions.filter((p: any) => p.result.risk === 'Low Risk').length;
  
  return {
    total: predictions.length,
    highRisk,
    moderateRisk,
    lowRisk,
    predictions,
  };
};
