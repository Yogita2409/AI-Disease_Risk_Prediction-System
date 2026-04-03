import React, { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { getUserPredictions } from '../utils/mlModel';
import { generatePredictionReport } from '../utils/pdfGenerator';
import { Clock, Download, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

export const History: React.FC = () => {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const [predictions, setPredictions] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      const data = getUserPredictions(user.id);
      setPredictions(data.reverse()); // Most recent first
    }
  }, [user]);

  const handleDownloadReport = (prediction: any) => {
    if (user) {
      generatePredictionReport(prediction.input, prediction.result, user.name);
    }
  };

  if (predictions.length === 0) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} py-12`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className={`text-4xl font-bold mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Prediction History
          </h1>
          <div className={`p-12 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg text-center`}>
            <Clock className={`h-16 w-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
            <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              No Predictions Yet
            </h3>
            <p className={`${isDarkMode ? 'text-gray-500' : 'text-gray-500'} mb-6`}>
              You haven't made any predictions yet. Start by getting your first health risk assessment.
            </p>
            <a
              href="/predict"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all"
            >
              Make First Prediction
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} py-12`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-4xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Prediction History
          </h1>
          <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            View all your past health risk predictions
          </p>
        </div>

        {/* Predictions Grid */}
        <div className="space-y-6">
          {predictions.map((prediction, index) => (
            <div
              key={index}
              className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg border ${
                isDarkMode ? 'border-gray-700' : 'border-gray-200'
              }`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Basic Info */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {new Date(prediction.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  
                  <div className={`p-4 rounded-lg ${
                    prediction.result.risk === 'High Risk'
                      ? 'bg-red-100 dark:bg-red-900/20 border border-red-500'
                      : prediction.result.risk === 'Moderate Risk'
                      ? 'bg-orange-100 dark:bg-orange-900/20 border border-orange-500'
                      : 'bg-green-100 dark:bg-green-900/20 border border-green-500'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-sm font-medium ${
                        prediction.result.risk === 'High Risk'
                          ? 'text-red-700 dark:text-red-400'
                          : prediction.result.risk === 'Moderate Risk'
                          ? 'text-orange-700 dark:text-orange-400'
                          : 'text-green-700 dark:text-green-400'
                      }`}>
                        Risk Level
                      </span>
                      {prediction.result.risk === 'High Risk' ? (
                        <TrendingUp className="h-5 w-5 text-red-600" />
                      ) : (
                        <TrendingDown className="h-5 w-5 text-green-600" />
                      )}
                    </div>
                    <div className={`text-2xl font-bold ${
                      prediction.result.risk === 'High Risk'
                        ? 'text-red-700 dark:text-red-300'
                        : prediction.result.risk === 'Moderate Risk'
                        ? 'text-orange-700 dark:text-orange-300'
                        : 'text-green-700 dark:text-green-300'
                    }`}>
                      {prediction.result.risk}
                    </div>
                    <div className={`text-sm mt-1 ${
                      prediction.result.risk === 'High Risk'
                        ? 'text-red-600 dark:text-red-400'
                        : prediction.result.risk === 'Moderate Risk'
                        ? 'text-orange-600 dark:text-orange-400'
                        : 'text-green-600 dark:text-green-400'
                    }`}>
                      {prediction.result.probability}% Probability
                    </div>
                  </div>
                </div>

                {/* Middle: Input Parameters */}
                <div>
                  <h3 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Input Parameters
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Age:</span>
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {prediction.input.age} years
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Gender:</span>
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {prediction.input.gender}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Blood Pressure:</span>
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {prediction.input.bloodPressure} mmHg
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Glucose:</span>
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {prediction.input.glucoseLevel} mg/dL
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Cholesterol:</span>
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {prediction.input.cholesterol} mg/dL
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Model Breakdown & Actions */}
                <div>
                  <h3 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Model Breakdown
                  </h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>LR:</span>
                      <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {prediction.result.modelBreakdown.logisticRegression}%
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>RF:</span>
                      <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {prediction.result.modelBreakdown.randomForest}%
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>SVM:</span>
                      <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {prediction.result.modelBreakdown.svm}%
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDownloadReport(prediction)}
                    className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center space-x-2 transition-all"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download Report</span>
                  </button>
                </div>
              </div>

              {/* Recommendation */}
              <div className={`mt-4 pt-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-start space-x-2">
                  <AlertCircle className={`h-5 w-5 mt-0.5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  <div>
                    <h4 className={`text-sm font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Recommendation
                    </h4>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {prediction.result.recommendation}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
