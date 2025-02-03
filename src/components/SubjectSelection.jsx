import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const SubjectSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { className, studentCount } = location.state || {};
  
  // Get teacher's allowed subjects
  const teacherData = JSON.parse(sessionStorage.getItem('teacherData') || '{}');
  const allowedSubjects = teacherData.subjects || [];

  const subjects = [
    { id: 'dt', name: 'Design Thinking', icon: '🎨' },
    { id: 'mp', name: 'Manufacturing Practices', icon: '🏭' },
    { id: 'yoga', name: 'Yoga & Meditation', icon: '🧘' },
    { id: 'oop', name: 'Object Oriented Programming', icon: '💻' },
    { id: 'bee', name: 'Basic Electrical Engineering', icon: '⚡' },
    { id: 'iks', name: 'Indian Knowledge System', icon: '📚' },
    { id: 'eb', name: 'Engineering Biology', icon: '🧬' },
    { id: 'ps', name: 'Probability & Statistics', icon: '📊' }
  ].filter(subject => allowedSubjects.includes(subject.id));

  const [showRangeModal, setShowRangeModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [rollRange, setRollRange] = useState({ start: '', end: '' });

  const handleSubjectSelect = (subject) => {
    setSelectedSubject(subject);
    setShowRangeModal(true);
  };

  const handleBatchSelect = (batch) => {
    setSelectedBatch(batch);
    if (batch === 'full') {
      // For full class, navigate directly with full range
      navigate('/attendance', {
        state: {
          className,
          studentCount,
          subject: selectedSubject.name,
          rollRange: { start: 1, end: studentCount },
          batch: 'full'
        }
      });
      setShowRangeModal(false);
    }
  };

  const handleRangeSubmit = () => {
    if (!rollRange.start || !rollRange.end) {
      alert('Please enter both start and end roll numbers');
      return;
    }
    navigate('/attendance', {
      state: {
        className,
        studentCount,
        subject: selectedSubject.name,
        rollRange,
        batch: selectedBatch
      }
    });
    setShowRangeModal(false);
  };

  if (subjects.length === 0) {
    return (
      <div className="p-12 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">No Subjects Assigned</h1>
        <p className="text-xl text-gray-600">Please contact the administrator to assign subjects.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
          Select Subject for {className}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          {studentCount} Students
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {subjects.map((subject) => (
          <motion.div
            key={subject.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <button
              onClick={() => handleSubjectSelect(subject)}
              className="w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow"
            >
              <div className="text-4xl mb-4">{subject.icon}</div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                {subject.name}
              </h2>
            </button>
          </motion.div>
        ))}
      </div>

      {/* Batch Selection Modal */}
      {showRangeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
              {selectedSubject.name}
            </h2>
            <div className="space-y-4">
              <button
                onClick={() => handleBatchSelect('full')}
                className="w-full bg-blue-500 text-white rounded-xl py-4 text-xl font-semibold hover:bg-blue-600 transition-colors"
              >
                Full Class
              </button>
              <button
                onClick={() => {
                  setSelectedBatch('custom');
                  setRollRange({ start: '', end: '' });
                }}
                className="w-full bg-purple-500 text-white rounded-xl py-4 text-xl font-semibold hover:bg-purple-600 transition-colors"
              >
                Roll Number Range
              </button>
            </div>

            {selectedBatch && selectedBatch !== 'full' && (
              <div className="mt-6 space-y-4">
                <div className="space-y-2">
                  <label className="block text-gray-700 dark:text-gray-200 font-semibold">
                    Start Roll Number
                  </label>
                  <input
                    type="number"
                    value={rollRange.start}
                    onChange={(e) => setRollRange(prev => ({ ...prev, start: parseInt(e.target.value) }))}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter start roll number"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-gray-700 dark:text-gray-200 font-semibold">
                    End Roll Number
                  </label>
                  <input
                    type="number"
                    value={rollRange.end}
                    onChange={(e) => setRollRange(prev => ({ ...prev, end: parseInt(e.target.value) }))}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter end roll number"
                  />
                </div>
                <button
                  onClick={handleRangeSubmit}
                  className="w-full bg-green-500 text-white rounded-xl py-4 text-xl font-semibold hover:bg-green-600 transition-colors mt-4"
                >
                  Continue
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectSelection; 