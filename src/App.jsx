import React from 'react';
import Header from './components/Header';
import ClassSelection from './components/ClassSelection';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center justify-center">
          <ClassSelection />
        </div>
      </main>
    </div>
  );
}

export default App;