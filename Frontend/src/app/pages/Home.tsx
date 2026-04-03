import React from 'react';
import { Link } from 'react-router';
import { useTheme } from '../context/ThemeContext';
import { Activity, Shield, TrendingUp, Users, Brain, CheckCircle } from 'lucide-react';

export const Home: React.FC = () => {
  const { isDarkMode } = useTheme();

  const features = [
    {
      icon: <Brain className="h-10 w-10" />,
      title: 'AI-Powered Analysis',
      description: 'Advanced ensemble learning combining Logistic Regression, Random Forest, and SVM for accurate predictions',
    },
    {
      icon: <Shield className="h-10 w-10" />,
      title: 'Early Detection',
      description: 'Identify potential health risks before they become serious problems',
    },
    {
      icon: <TrendingUp className="h-10 w-10" />,
      title: 'Track Your Health',
      description: 'Monitor your health trends over time with comprehensive analytics',
    },
    {
      icon: <Users className="h-10 w-10" />,
      title: 'Personalized Recommendations',
      description: 'Get tailored health advice based on your unique risk profile',
    },
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Hero Section */}
      <div className={`${isDarkMode ? 'bg-gradient-to-br from-blue-900 to-purple-900' : 'bg-gradient-to-br from-blue-600 to-purple-600'} text-white`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Activity className="h-16 w-16 md:h-20 md:w-20" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              AI-Based Early Disease Risk Prediction
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Leverage advanced machine learning to predict and prevent health risks before they escalate
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/predict"
                className="px-8 py-4 bg-white text-blue-600 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-all transform hover:scale-105"
              >
                Get Your Prediction
              </Link>
              <Link
                to="/about"
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Why Choose Our System?
          </h2>
          <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto`}>
            Our AI-powered platform uses state-of-the-art ensemble learning techniques to provide accurate health risk assessments
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`p-6 rounded-xl ${
                isDarkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:shadow-lg'
              } transition-all transform hover:scale-105 border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
            >
              <div className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'} mb-4`}>
                {feature.icon}
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {feature.title}
              </h3>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works Section */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} py-20`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              How It Works
            </h2>
            <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Simple 3-step process to get your health risk assessment
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Enter Your Data', description: 'Input your health parameters including age, blood pressure, glucose, and cholesterol levels' },
              { step: '2', title: 'AI Analysis', description: 'Our ensemble learning model analyzes your data using three powerful algorithms' },
              { step: '3', title: 'Get Results', description: 'Receive your risk assessment with personalized recommendations and downloadable report' },
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className={`w-16 h-16 rounded-full ${isDarkMode ? 'bg-blue-600' : 'bg-blue-600'} text-white flex items-center justify-center text-2xl font-bold mb-4`}>
                    {item.step}
                  </div>
                  <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {item.title}
                  </h3>
                  <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className={`${isDarkMode ? 'bg-gradient-to-r from-blue-900 to-purple-900' : 'bg-gradient-to-r from-blue-600 to-purple-600'} text-white py-16`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Check Your Health Risk?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Get started with our AI-powered disease prediction system today
          </p>
          <Link
            to="/signup"
            className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-all transform hover:scale-105"
          >
            Sign Up Now
          </Link>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { value: '95%', label: 'Prediction Accuracy' },
            { value: '10K+', label: 'Predictions Made' },
            { value: '3', label: 'ML Models Combined' },
          ].map((stat, index) => (
            <div key={index} className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'}`}>
              <div className={`text-4xl md:text-5xl font-bold mb-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                {stat.value}
              </div>
              <div className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
