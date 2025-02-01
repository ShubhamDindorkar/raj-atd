import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LogoutButton from './common/LogoutButton';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/class-selection';
  
  const teacherData = JSON.parse(sessionStorage.getItem('teacherData') || '{}');

  return (
    <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 text-white shadow-lg">
      <div className="max-w-[2000px] mx-auto px-8">
        <div className="flex items-center justify-between h-24">
          <div className="flex items-center space-x-8">
            <button
              onClick={() => navigate('/class-selection')}
              className="text-4xl font-bold hover:scale-105 transition-transform flex items-center gap-4"
            >
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Student Attendance
            </button>
          </div>

          <div className="flex items-center space-x-8">
            {!isHome && (
              <button
                onClick={() => navigate(-1)}
                className="bg-white/20 hover:bg-white/30 text-2xl font-semibold px-8 py-4 rounded-xl
                         transition-all duration-300 hover:scale-105 flex items-center gap-3"
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