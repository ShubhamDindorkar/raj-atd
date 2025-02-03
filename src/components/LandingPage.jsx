import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center 
                    bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100
                    dark:from-blue-950 dark:via-purple-900 dark:to-gray-900
                    transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-8 py-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          <h1 className="text-7xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 
                         text-transparent bg-clip-text mb-8">
            Student Attendance System
          </h1>
          
          <div className="flex justify-center gap-12 mt-16">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/teacher-login')}
              className="group relative p-[3px] rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600"
            >
              <div className="px-12 py-8 rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-6">
                  <svg className="w-24 h-24 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span className="text-4xl font-bold text-gray-800 dark:text-white">Teacher Login</span>
                </div>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/admin-login')}
              className="group relative p-[3px] rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600"
            >
              <div className="px-12 py-8 rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-6">
                  <svg className="w-24 h-24 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-4xl font-bold text-gray-800 dark:text-white">Admin Login</span>
                </div>
              </div>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;