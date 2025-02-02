import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const ClassSelection = () => {
  const navigate = useNavigate();
  const teacherData = JSON.parse(sessionStorage.getItem('teacherData') || '{}');

  const classes = [
    { id: '1A', name: 'CSE-1', students: 60 },
    { id: '1B', name: 'CSE-2', students: 60 },
    { id: '1C', name: 'CSE-3', students: 60 },
  ];

  const handleClassSelect = (classData) => {
    navigate('/subject', { 
      state: { 
        className: classData.name,
        studentCount: classData.students
      } 
    });
  };

  return (
    <div className="container mx-auto px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome, {teacherData.name}
        </h1>
        <p className="text-xl text-gray-600">
          Please select a class to take attendance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {classes.map((classData) => (
          <motion.div
            key={classData.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <button
              onClick={() => handleClassSelect(classData)}
              className="w-full bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow"
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                {classData.name}
              </h2>
              <p className="text-gray-600 text-lg">
                {classData.students} Students
              </p>
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ClassSelection;