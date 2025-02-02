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
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Select Subject for {className}
        </h1>
        <p className="text-xl text-gray-600">
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
              className="w-full bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow"
            >
              <div className="text-4xl mb-4">{subject.icon}</div>
              <h2 className="text-2xl font-bold text-gray-800">
                {subject.name}
              </h2>
            </button>
          </motion.div>
        ))}
      </div>

      {/* Batch Selection Modal */}
      {showRangeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4"
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Select Batch for {selectedSubject.name}
            </h3>
              <div className="grid grid-cols-2 gap-4 mb-8">
              <button
                onClick={() => handleBatchSelect('full')}
                className="p-4 bg-blue-100 rounded-xl text-blue-600 font-semibold hover:bg-blue-200 transition-colors"
              >
                Full Class
              </button>
              <button
                onClick={() => {
                  setSelectedBatch('custom');
                  setRollRange({ start: '', end: '' });
                }}
                className={`p-4 rounded-xl font-semibold transition-colors ${
                  selectedBatch === 'custom'
                    ? 'bg-purple-500 text-white'
                    : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                }`}
              >
                Roll Number Range
              </button>
            </div>

            {selectedBatch && selectedBatch !== 'full' && (
              <>
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-700 mb-4">Adjust Roll Number Range</h4>
                  <div className="flex gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Start</label>
                      <input
                        type="number"
                        value={rollRange.start}
                        onChange={(e) => setRollRange(prev => ({ ...prev, start: parseInt(e.target.value) }))}
                        min="1"
                        max={rollRange.end}
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">End</label>
                      <input
                        type="number"
                        value={rollRange.end}
                        onChange={(e) => setRollRange(prev => ({ ...prev, end: parseInt(e.target.value) }))}
                        min={rollRange.start}
                        max={studentCount}
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setShowRangeModal(false)}
                    className="px-6 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRangeSubmit}
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Continue
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SubjectSelection; 