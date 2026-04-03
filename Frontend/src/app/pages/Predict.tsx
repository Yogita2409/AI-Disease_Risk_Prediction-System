import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { predictDisease, savePrediction, PredictionInput, PredictionResult } from '../utils/mlModel';
import { generatePredictionReport } from '../utils/pdfGenerator';
import { Activity, Download, Loader2, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';

export const Predict: React.FC = () => {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<PredictionInput>({
    age: 35,
    gender: 'Male',
    bloodPressure: 120,
    glucoseLevel: 100,
    cholesterol: 200,
    symptoms: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' || name === 'bloodPressure' || name === 'glucoseLevel' || name === 'cholesterol'
        ? parseFloat(value) || 0
        : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('Please login to use the prediction feature');
      navigate('/login');
      return;
    }

    setIsLoading(true);
    setShowResult(false);

    try {
      // Call ML model (simulated)
      const prediction = await predictDisease(formData);
      setResult(prediction);
      
      // Save to history
      savePrediction(user.id, formData, prediction);
      
      setShowResult(true);
    } catch (error) {
      console.error('Prediction error:', error);
      alert('Error making prediction. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadReport = () => {
    if (result && user) {
      generatePredictionReport(formData, result, user.name);
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} py-12`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Activity className={`h-16 w-16 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          </div>
          <h1 className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Disease Risk Prediction
          </h1>
          <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Enter your health parameters to get an AI-powered risk assessment
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className={`p-8 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <h2 className={`text-2xl font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Health Parameters
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Age */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Age (years)
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  min="1"
                  max="120"
                  required
                  className={`w-full px-4 py-3 rounded-lg border ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
              </div>

              {/* Gender */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 rounded-lg border ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Blood Pressure */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Blood Pressure (mmHg)
                </label>
                <input
                  type="number"
                  name="bloodPressure"
                  value={formData.bloodPressure}
                  onChange={handleInputChange}
                  min="60"
                  max="250"
                  required
                  className={`w-full px-4 py-3 rounded-lg border ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
                <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  Normal: 90-120 mmHg
                </p>
              </div>

              {/* Glucose Level */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Glucose Level (mg/dL)
                </label>
                <input
                  type="number"
                  name="glucoseLevel"
                  value={formData.glucoseLevel}
                  onChange={handleInputChange}
                  min="50"
                  max="400"
                  required
                  className={`w-full px-4 py-3 rounded-lg border ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
                <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  Normal: 70-100 mg/dL (fasting)
                </p>
              </div>

              {/* Cholesterol */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Cholesterol (mg/dL)
                </label>
                <input
                  type="number"
                  name="cholesterol"
                  value={formData.cholesterol}
                  onChange={handleInputChange}
                  min="100"
                  max="400"
                  required
                  className={`w-full px-4 py-3 rounded-lg border ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
                <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  Normal: Below 200 mg/dL
                </p>
              </div>

              {/* Symptoms */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Symptoms (Optional)
                </label>
                <textarea
                  name="symptoms"
                  value={formData.symptoms}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Describe any symptoms you're experiencing..."
                  className={`w-full px-4 py-3 rounded-lg border ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 rounded-lg font-semibold text-white transition-all ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                } flex items-center justify-center space-x-2`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <span>Predict Risk</span>
                )}
              </button>
            </form>
          </div>

          {/* Result Section */}
          <div className={`p-8 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            {!showResult ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <AlertCircle className={`h-16 w-16 mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  No Prediction Yet
                </h3>
                <p className={`${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  Fill out the form and click "Predict Risk" to see your results
                </p>
              </div>
            ) : result && (
              <div className="space-y-6">
                <h2 className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Prediction Results
                </h2>

                {/* Risk Level Card */}
                <div className={`p-6 rounded-lg ${
                  result.risk === 'High Risk'
                    ? 'bg-red-100 dark:bg-red-900/20 border-2 border-red-500'
                    : result.risk === 'Moderate Risk'
                    ? 'bg-orange-100 dark:bg-orange-900/20 border-2 border-orange-500'
                    : 'bg-green-100 dark:bg-green-900/20 border-2 border-green-500'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`text-lg font-semibold ${
                      result.risk === 'High Risk' ? 'text-red-700 dark:text-red-400' :
                      result.risk === 'Moderate Risk' ? 'text-orange-700 dark:text-orange-400' :
                      'text-green-700 dark:text-green-400'
                    }`}>
                      Risk Level
                    </h3>
                    {result.risk === 'High Risk' ? (
                      <TrendingUp className="h-6 w-6 text-red-600" />
                    ) : (
                      <TrendingDown className="h-6 w-6 text-green-600" />
                    )}
                  </div>
                  <div className={`text-3xl font-bold ${
                    result.risk === 'High Risk' ? 'text-red-700 dark:text-red-300' :
                    result.risk === 'Moderate Risk' ? 'text-orange-700 dark:text-orange-300' :
                    'text-green-700 dark:text-green-300'
                  }`}>
                    {result.risk}
                  </div>
                  <div className={`text-lg mt-1 ${
                    result.risk === 'High Risk' ? 'text-red-600 dark:text-red-400' :
                    result.risk === 'Moderate Risk' ? 'text-orange-600 dark:text-orange-400' :
                    'text-green-600 dark:text-green-400'
                  }`}>
                    Probability: {result.probability}%
                  </div>
                </div>

                {/* Model Breakdown */}
                <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Ensemble Model Breakdown
                  </h3>
                  <div className="space-y-3">
                    {[
                      { name: 'Logistic Regression', value: result.modelBreakdown.logisticRegression },
                      { name: 'Random Forest', value: result.modelBreakdown.randomForest },
                      { name: 'Support Vector Machine', value: result.modelBreakdown.svm },
                    ].map((model, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-1">
                          <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {model.name}
                          </span>
                          <span className={`text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {model.value}%
                          </span>
                        </div>
                        <div className={`w-full h-2 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`}>
                          <div
                            className="h-2 rounded-full bg-blue-600"
                            style={{ width: `${model.value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendation */}
                <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
                  <h3 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Health Recommendation
                  </h3>
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                    {result.recommendation}
                  </p>
                </div>

                {/* Download Button */}
                <button
                  onClick={handleDownloadReport}
                  className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all"
                >
                  <Download className="h-5 w-5" />
                  <span>Download PDF Report</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
