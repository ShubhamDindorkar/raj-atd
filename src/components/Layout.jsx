import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

const Layout = () => {
  return (
    <div className="min-h-screen transition-colors duration-300
                    bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100
                    dark:from-blue-950 dark:via-purple-900 dark:to-gray-900
                    dark:bg-gradient-to-br">
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;