import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-20">
          <h1 className="text-6xl md:text-7xl font-normal text-black mb-6 tracking-tight">
            MoodMate
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto font-light leading-relaxed">
            Track your emotions, understand your patterns, and nurture your mental well-being with AI-powered insights.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-24">
          <Link
            to="/signup"
            className="px-8 py-4 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-all duration-200 text-center"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="px-8 py-4 bg-white text-gray-900 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-all duration-200 text-center"
          >
            Sign In
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Journal Entries</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Express your thoughts and feelings through daily journaling
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">AI Analysis</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Get instant sentiment analysis to understand your emotional state
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Mood Trends</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Visualize patterns and insights with beautiful analytics
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
