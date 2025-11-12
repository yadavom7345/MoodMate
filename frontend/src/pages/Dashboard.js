import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="hover:opacity-80 transition-opacity">
                <h1 className="text-2xl font-normal text-black">MoodMate</h1>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{user?.name || user?.email}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-light text-gray-900 mb-2">Dashboard</h2>
          <p className="text-gray-500">Welcome back! Here's an overview of your mood journey.</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Coming Soon</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Journal entry creation, AI sentiment analysis, and mood trend visualization features will be available here soon.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
