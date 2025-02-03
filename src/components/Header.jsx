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
      <div className="max-w-[2000px] mx-auto px-8">
        <div className="flex items-center justify-between h-24">
          <div className="flex items-center space-x-8">
            <button
              onClick={() => navigate('/class-selection')}
              className="text-4xl font-bold hover:scale-105 transition-transform flex items-center gap-4"
            >
              <img
                src={despuLogo}
                alt="DESPU Logo"
                className="w-16 h-16 rounded-full object-contain bg-white p-1"
                style={{ imageRendering: 'crisp-edges' }}
              />
              Student Attendance
            </button>
          </div>

          <div className="flex items-center space-x-6">
            <DarkModeToggle />
            {!isHome && (
              <button
                onClick={() => navigate(-1)}
                className="bg-white/20 hover:bg-white/30 text-2xl font-semibold px-8 py-4 rounded-xl
                         transition-all duration-300 hover:scale-105 flex items-center gap-3
                         dark:bg-white/10 dark:hover:bg-white/20"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
            )}
            
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-xl text-white/90">Welcome,</p>
                <p className="text-2xl font-bold">{teacherData.name}</p>
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