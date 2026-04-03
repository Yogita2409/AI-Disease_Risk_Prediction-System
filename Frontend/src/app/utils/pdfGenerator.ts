import { jsPDF } from 'jspdf';
import { PredictionInput, PredictionResult } from './mlModel';

export const generatePredictionReport = (
  input: PredictionInput,
  result: PredictionResult,
  userName: string
) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.setTextColor(59, 130, 246); // Blue color
  doc.text('Disease Risk Prediction Report', 20, 20);
  
  // Line
  doc.setDrawColor(200, 200, 200);
  doc.line(20, 25, 190, 25);
  
  // Patient Info
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Patient Name: ${userName}`, 20, 35);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 42);
  
  // Input Parameters Section
  doc.setFontSize(14);
  doc.setTextColor(59, 130, 246);
  doc.text('Input Parameters:', 20, 55);
  
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text(`Age: ${input.age} years`, 25, 63);
  doc.text(`Gender: ${input.gender}`, 25, 70);
  doc.text(`Blood Pressure: ${input.bloodPressure} mmHg`, 25, 77);
  doc.text(`Glucose Level: ${input.glucoseLevel} mg/dL`, 25, 84);
  doc.text(`Cholesterol: ${input.cholesterol} mg/dL`, 25, 91);
  if (input.symptoms) {
    doc.text(`Symptoms: ${input.symptoms}`, 25, 98);
  }
  
  // Prediction Results Section
  doc.setFontSize(14);
  doc.setTextColor(59, 130, 246);
  doc.text('Prediction Results:', 20, 112);
  
  doc.setFontSize(11);
  // Risk level with color coding
  if (result.risk === 'High Risk') {
    doc.setTextColor(220, 38, 38); // Red
  } else if (result.risk === 'Moderate Risk') {
    doc.setTextColor(245, 158, 11); // Orange
  } else {
    doc.setTextColor(34, 197, 94); // Green
  }
  doc.setFontSize(13);
  doc.text(`Risk Level: ${result.risk}`, 25, 120);
  
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text(`Probability Score: ${result.probability}%`, 25, 128);
  
  // Model Breakdown
  doc.setFontSize(14);
  doc.setTextColor(59, 130, 246);
  doc.text('Ensemble Model Breakdown:', 20, 142);
  
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text(`Logistic Regression: ${result.modelBreakdown.logisticRegression}%`, 25, 150);
  doc.text(`Random Forest: ${result.modelBreakdown.randomForest}%`, 25, 157);
  doc.text(`Support Vector Machine: ${result.modelBreakdown.svm}%`, 25, 164);
  
  // Recommendation Section
  doc.setFontSize(14);
  doc.setTextColor(59, 130, 246);
  doc.text('Health Recommendation:', 20, 178);
  
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  const splitText = doc.splitTextToSize(result.recommendation, 170);
  doc.text(splitText, 25, 186);
  
  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('This report is generated using AI-based ensemble learning models.', 20, 270);
  doc.text('Please consult with a qualified healthcare professional for medical advice.', 20, 275);
  doc.text('© 2026 AI Disease Prediction System', 20, 280);
  
  // Save the PDF
  doc.save(`Disease_Risk_Report_${new Date().toISOString().split('T')[0]}.pdf`);
};