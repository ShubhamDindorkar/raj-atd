import React from 'react';
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

  const handleSubjectSelect = (subject) => {
    navigate('/attendance', {
      state: {
        className,
        studentCount,
        subject: subject.name
      }
    });
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
    </div>
  );
};

export default SubjectSelection; 