import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const SubjectSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { className, studentCount } = location.state || {};

  const subjects = [
    { id: 'dt', name: 'Design Thinking', icon: '🎨' },
    { id: 'mp', name: 'Manufacturing Practices', icon: '🏭' },
    { id: 'yoga', name: 'Yoga & Meditation', icon: '🧘' },
    { id: 'oop', name: 'Object Oriented Programming', icon: '💻' },
    { id: 'bee', name: 'Basic Electrical Engineering', icon: '⚡' },
    { id: 'iks', name: 'Indian Knowledge System', icon: '📚' },
    { id: 'eb', name: 'Engineering Biology', icon: '🧬' },
    { id: 'ps', name: 'Probability and Statistics', icon: '📊' }
  ];

  const handleSubjectSelect = (subject) => {
    navigate('/attendance', {
      state: {
        className,
        studentCount,
        subject: subject.name
      }
    });
  };

  return (
    <div className="p-12">
      <h1 className="text-6xl font-bold text-center mb-16 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
        Select Subject for {className}
      </h1>
      
      <div className="grid grid-cols-2 gap-12 max-w-[1800px] mx-auto">
        {subjects.map((subject) => (
          <motion.div
            key={subject.id}
            className="relative p-[3px] rounded-3xl bg-gradient-to-r from-blue-600 to-purple-600"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <button
              onClick={() => handleSubjectSelect(subject)}
              className="w-full h-full bg-white rounded-3xl p-12 relative group overflow-hidden"
            >
              <div className="flex items-center space-x-8">
                <div className="text-8xl">{subject.icon}</div>
                <div className="text-left flex-grow">
                  <h3 className="text-5xl font-bold text-gray-800 mb-4">
                    {subject.name}
                  </h3>
                  <div className="flex justify-end">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-2xl font-semibold">
                      {subject.id.toUpperCase()}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SubjectSelection; 