import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const ClassCard = ({ name, isSelected, onClick, studentCount = 60 }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`cursor-pointer p-12 rounded-3xl transition-all duration-300 relative overflow-hidden group
      ${isSelected
        ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-2xl scale-105'
        : 'bg-white hover:shadow-xl'
      } border border-gray-100/50 backdrop-blur-sm`}
  >
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
    <div className={`absolute inset-0 ${isSelected ? 'bg-[url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M1.22676 0C1.91374 0 2.45351 0.539773 2.45351 1.22676C2.45351 1.91374 1.91374 2.45351 1.22676 2.45351C0.539773 2.45351 0 1.91374 0 1.22676C0 0.539773 0.539773 0 1.22676 0Z\' fill=\'rgba(255,255,255,0.1)\'%3E%3C/path%3E%3C/svg%3E")] opacity-50' : ''}`} />
    <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-8">
        <div className={`p-6 rounded-2xl ${isSelected ? 'bg-white/20' : 'bg-blue-50'}`}>
          <svg
            className={`w-16 h-16 ${isSelected ? 'text-white' : 'text-blue-500'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </div>
        <div>
          <h3 className={`font-bold text-6xl mb-4 ${isSelected ? 'text-white' : 'text-gray-800'}`}>
            {name}
          </h3>
          <p className={`text-2xl ${isSelected ? 'text-white/90' : 'text-gray-500'}`}>
            {studentCount} Students
          </p>
        </div>
      </div>
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-white/20 p-6 rounded-2xl"
        >
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
      )}
    </div>
  </motion.div>
);

const ClassSelection = () => {
  const [selectedClass, setSelectedClass] = useState('');
  const navigate = useNavigate();

  const handleClassSelect = (className) => {
    setSelectedClass(className);
  };

  const handleStartAttendance = () => {
    if (selectedClass) {
      // Find the selected class object
      const classObj = classes.find(c => c.name === selectedClass);
      // Navigate to attendance screen with the data key for the selected class
      navigate('/attendance', { state: { selectedClass: classObj.dataKey } });
    }
  };

  // Map display names to data keys
  const classMapping = {
    'Class A': 'classA',
    'Class B': 'classB',
    'Class C': 'classC'
  };

  const classes = [
    { name: 'Class A', dataKey: 'classA', students: 60 },
    { name: 'Class B', dataKey: 'classB', students: 60 },
    { name: 'Class C', dataKey: 'classC', students: 60 }
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-6rem)] p-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[1800px]"
      >
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <div className="absolute -inset-x-40 -inset-y-16 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 blur-3xl rounded-full" />
            <h1 className="relative text-8xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 animate-gradient-x">
              Welcome to Attendance System
            </h1>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-x-20 -inset-y-8 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-blue-500/5 blur-2xl rounded-full" />
            <p className="relative text-3xl text-gray-600 font-medium">
              Select your class to start taking attendance
            </p>
          </motion.div>
        </div>

        <div className="grid gap-8 mb-16">
          <AnimatePresence>
            {classes.map((classInfo) => (
              <ClassCard
                key={classInfo.name}
                name={classInfo.name}
                studentCount={classInfo.students}
                isSelected={selectedClass === classInfo.name}
                onClick={() => handleClassSelect(classInfo.name)}
              />
            ))}
          </AnimatePresence>
        </div>

        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <button
            className="w-full max-w-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white
                     text-4xl font-bold px-12 py-8 rounded-2xl
                     transform transition-all duration-300
                     hover:from-blue-700 hover:to-purple-700 hover:shadow-2xl hover:scale-105
                     focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-50
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            disabled={!selectedClass}
            onClick={handleStartAttendance}
          >
            {selectedClass ? `Start Attendance for ${selectedClass}` : 'Please Select a Class'}
          </button>

          <AnimatePresence>
            {selectedClass && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-8 text-2xl text-gray-500"
              >
                Click the button above to proceed with attendance for {selectedClass}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ClassSelection;