import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8">Student Attendance System</h1>
        <div className="space-y-4">
          <button
            onClick={() => navigate('/teacher-login')}
            className="block w-full px-6 py-3 bg-blue-500 text-white rounded-lg"
          >
            Teacher Login
          </button>
          <button
            onClick={() => navigate('/admin-login')}
            className="block w-full px-6 py-3 bg-purple-500 text-white rounded-lg"
          >
            Admin Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage; 