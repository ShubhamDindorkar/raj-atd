import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
            Student Attendance System
          </h1>
          <p className="text-gray-600 text-lg md:text-xl">
            Welcome! Please select your role to continue
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {/* Teacher Card */}
          <button
            onClick={() => navigate('/teacher-login')}
            className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-90 group-hover:opacity-100 transition-opacity" />
            <div className="relative p-6 flex flex-col items-center">
              <div className="p-3 bg-white/20 rounded-full mb-4">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Teacher Portal</h2>
              <p className="text-white/90 text-sm">Access your class attendance system</p>
            </div>
          </button>

          {/* Admin Card */}
          <button
            onClick={() => navigate('/admin-login')}
            className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-600 opacity-90 group-hover:opacity-100 transition-opacity" />
            <div className="relative p-6 flex flex-col items-center">
              <div className="p-3 bg-white/20 rounded-full mb-4">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Admin Portal</h2>
              <p className="text-white/90 text-sm">Manage system and user settings</p>
            </div>
          </button>
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Student Attendance System. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;