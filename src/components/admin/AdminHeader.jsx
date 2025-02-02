import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminHeader = () => {
  const navigate = useNavigate();
  const adminData = JSON.parse(sessionStorage.getItem('adminData') || '{}');

  const handleLogout = () => {
    sessionStorage.removeItem('adminData');
    navigate('/', { replace: true });
  };

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
          Admin Dashboard
        </h1>
        <div className="flex items-center gap-6">
          <span className="text-gray-600">Welcome, {adminData.name}</span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader; 