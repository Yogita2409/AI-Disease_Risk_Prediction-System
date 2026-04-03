import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Brain, Activity, Shield, TrendingUp, Users, Award, Target, Zap } from 'lucide-react';

export const About: React.FC = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} py-12`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Brain className={`h-20 w-20 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          </div>
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            About Our System
          </h1>
          <p className={`text-xl ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} max-w-3xl mx-auto`}>
            An advanced AI-powered platform leveraging ensemble learning for early disease risk prediction
          </p>
        </div>

        {/* Mission Section */}
        <div className={`p-8 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg mb-12`}>
          <h2 className={`text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Our Mission
          </h2>
          <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
            We aim to democratize healthcare by making advanced AI-based disease prediction accessible to everyone. 
            Our system combines cutting-edge machine learning algorithms to provide accurate, early risk assessments 
            that can help individuals take proactive steps towards better health outcomes.
          </p>
        </div>

        {/* Technology Stack */}
        <div className="mb-12">
          <h2 className={`text-3xl font-bold mb-8 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Technology Stack
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Frontend',
                icon: <Zap className="h-8 w-8" />,
                tech: 'React.js + Tailwind CSS',
                description: 'Modern, responsive user interface with seamless user experience',
              },
              {
                title: 'Backend',
                icon: <Activity className="h-8 w-8" />,
                tech: 'Node.js + Express',
                description: 'Robust REST API architecture with secure authentication',
              },
              {
                title: 'Database',
                icon: <Shield className="h-8 w-8" />,
                tech: 'MongoDB',
                description: 'Scalable NoSQL database for user data and prediction history',
              },
              {
                title: 'Machine Learning',
                icon: <Brain className="h-8 w-8" />,
                tech: 'Python + scikit-learn',
                description: 'Advanced ML models with Flask API integration',
              },
              {
                title: 'Authentication',
                icon: <Users className="h-8 w-8" />,
                tech: 'JWT + bcrypt',
                description: 'Secure user authentication with encrypted passwords',
              },
              {
                title: 'Visualization',
                icon: <TrendingUp className="h-8 w-8" />,
                tech: 'Recharts',
                description: 'Interactive charts and analytics dashboard',
              },
            ].map((item, index) => (
              <div
                key={index}
                className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg border ${
                  isDarkMode ? 'border-gray-700' : 'border-gray-200'
                }`}
              >
                <div className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'} mb-3`}>
                  {item.icon}
                </div>
                <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {item.title}
                </h3>
                <p className={`font-medium mb-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  {item.tech}
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ML Models Section */}
        <div className={`p-8 rounded-xl ${isDarkMode ? 'bg-gradient-to-br from-blue-900 to-purple-900' : 'bg-gradient-to-br from-blue-600 to-purple-600'} text-white shadow-lg mb-12`}>
          <h2 className="text-3xl font-bold mb-6">Ensemble Learning Models</h2>
          <p className="text-lg mb-6 text-blue-100">
            Our system uses three powerful machine learning algorithms combined through ensemble learning:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Logistic Regression',
                description: 'Statistical model for binary classification with probability estimation',
              },
              {
                name: 'Random Forest',
                description: 'Ensemble of decision trees for robust and accurate predictions',
              },
              {
                name: 'Support Vector Machine',
                description: 'Advanced algorithm for complex pattern recognition and classification',
              },
            ].map((model, index) => (
              <div key={index} className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
                <h3 className="text-xl font-semibold mb-2">{model.name}</h3>
                <p className="text-blue-100">{model.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
            <p className="text-blue-100">
              <strong>Voting Classifier:</strong> Combines predictions from all three models using soft voting 
              to produce more accurate and reliable risk assessments than any single model alone.
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mb-12">
          <h2 className={`text-3xl font-bold mb-8 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: <Target className="h-6 w-6" />,
                title: 'Accurate Predictions',
                description: '95%+ accuracy using ensemble learning techniques',
              },
              {
                icon: <Shield className="h-6 w-6" />,
                title: 'Secure & Private',
                description: 'Your health data is encrypted and protected',
              },
              {
                icon: <TrendingUp className="h-6 w-6" />,
                title: 'Track Progress',
                description: 'Monitor your health trends over time',
              },
              {
                icon: <Activity className="h-6 w-6" />,
                title: 'Real-time Analysis',
                description: 'Get instant risk assessments',
              },
              {
                icon: <Award className="h-6 w-6" />,
                title: 'Evidence-Based',
                description: 'Built on medical research and clinical data',
              },
              {
                icon: <Users className="h-6 w-6" />,
                title: 'User-Friendly',
                description: 'Simple interface for all age groups',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg flex items-start space-x-4`}
              >
                <div className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'} mt-1`}>
                  {feature.icon}
                </div>
                <div>
                  <h3 className={`text-lg font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {feature.title}
                  </h3>
                  <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-yellow-900/20 border-yellow-500' : 'bg-yellow-50 border-yellow-400'} border-2`}>
          <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-800'}`}>
            Important Disclaimer
          </h3>
          <p className={`${isDarkMode ? 'text-yellow-300' : 'text-yellow-700'}`}>
            This system is designed for educational and informational purposes. The predictions provided are 
            based on statistical models and should not replace professional medical advice, diagnosis, or treatment. 
            Always consult with qualified healthcare professionals for medical concerns.
          </p>
        </div>
      </div>
    </div>
  );
};
