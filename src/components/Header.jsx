import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DarkModeToggle from './common/DarkModeToggle';
import LogoutButton from './common/LogoutButton';
import despuLogo from '../assets/img/DESPU_logo1.jpg';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/class-selection';
  
  const teacherData = JSON.parse(sessionStorage.getItem('teacherData') || '{}');

  return (
    <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 text-white shadow-lg dark:from-blue-900 dark:via-purple-900 dark:to-blue-900">
      <div className="max-w-[2000px] mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between h-20 sm:h-24">
          <div className="flex items-center space-x-4 sm:space-x-8">
            <button
              onClick={() => navigate('/class-selection')}
              className="text-2xl sm:text-4xl font-bold hover:scale-105 transition-transform flex items-center gap-2 sm:gap-4"
            >
              <img
                src={despuLogo}
                alt="DESPU Logo"
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-contain bg-white p-1"
                style={{ imageRendering: 'crisp-edges' }}
              />
              <span className="hidden sm:inline">Student Attendance</span>
            </button>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-6">
            <DarkModeToggle />
            {!isHome && (
              <button
                onClick={() => navigate(-1)}
                className="bg-white/20 hover:bg-white/30 text-lg sm:text-2xl font-semibold px-4 sm:px-8 py-2 sm:py-4 rounded-xl
                         transition-all duration-300 hover:scale-105 flex items-center gap-2 sm:gap-3
                         dark:bg-white/10 dark:hover:bg-white/20"
              >
                <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="hidden sm:inline">Back</span>
              </button>
            )}
            
            <div className="flex items-center gap-2 sm:gap-6">
              <div className="text-right hidden sm:block">
                <p className="text-lg sm:text-xl text-white/90">Welcome,</p>
                <p className="text-xl sm:text-2xl font-bold">{teacherData.name}</p>
              </div>
              <LogoutButton />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;