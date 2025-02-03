import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Results from './Results';
import studentData from '../studentData.json';

const StudentCard = ({ student, onSwipe, style }) => {
  const [dragDirection, setDragDirection] = useState(null);

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={(e, { offset }) => {
        const swipe = offset.x;
        if (Math.abs(swipe) > 100) {
          onSwipe(swipe > 0 ? 'present' : 'absent');
        }
      }}
      style={{
        ...style,
        willChange: 'transform'
      }}
      onDrag={(e, { offset }) => {
        const direction = offset.x > 0 ? 'right' : offset.x < 0 ? 'left' : null;
        if (direction !== dragDirection) {
          setDragDirection(direction);
        }
      }}
      className="absolute w-full h-[80vh] sm:h-[90vh]"
    >
      <div
        className={`w-full h-full bg-gray-50 shadow-xl transform flex
          ${dragDirection === 'right' ? 'bg-green-50 border-l-4 border-green-500' :
          dragDirection === 'left' ? 'bg-red-50 border-r-4 border-red-500' : ''}`}
        style={{
          transition: 'background-color 0.2s, border 0.2s',
          willChange: 'background-color, border'
        }}
      >
        {/* Center - Student Info */}
        <div className="flex-grow flex flex-col items-center justify-center p-4">
          <div className="text-center w-full">
            <h2 className="text-4xl sm:text-[8vw] md:text-[6vw] font-bold leading-tight text-blue-600 break-words max-w-[90%] mx-auto">
              {student.name}
            </h2>
            <p className="text-3xl sm:text-5xl md:text-6xl text-gray-700 mt-4 sm:mt-8 font-semibold">
              {student.rollNo.replace(/[^\d]/g, '')}
            </p>
          </div>
        </div>

        {/* Status Indicators */}
        {dragDirection && (
          <div
            className={`absolute ${dragDirection === 'left' ? 'left-4 sm:left-8' : 'right-4 sm:right-8'} top-1/2 -translate-y-1/2
              text-4xl sm:text-[80px] font-bold ${dragDirection === 'left' ? 'text-red-500' : 'text-green-500'}`}
          >
            {dragDirection === 'left' ? '✗' : '✓'}
          </div>
        )}

        {/* Swipe Instructions */}
        <div className="absolute bottom-8 sm:bottom-12 left-0 right-0 flex justify-between px-6 sm:px-24">
          <button
            onClick={() => onSwipe('absent')}
            className={`text-xl sm:text-2xl md:text-3xl font-bold text-red-500 transition-opacity duration-200 hover:text-red-600
              ${dragDirection === 'left' ? 'opacity-100' : 'opacity-30'}`}
          >
            ← ABSENT
          </button>
          <button
            onClick={() => onSwipe('present')}
            className={`text-xl sm:text-2xl md:text-3xl font-bold text-green-500 transition-opacity duration-200 hover:text-green-600
              ${dragDirection === 'right' ? 'opacity-100' : 'opacity-30'}`}
          >
            PRESENT →
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const AttendanceScreen = () => {
  const location = useLocation();
  const [students, setStudents] = useState([]);

  useEffect(() => {
    // Get the selected class and roll range from the location state
    const selectedClass = location.state?.selectedClass || 'classA';
    const rollRange = location.state?.rollRange;

    // Get students from the selected class within the roll range and add status field
    let classStudents = studentData[selectedClass];

    // Filter students based on range if provided
    if (rollRange && rollRange.start && rollRange.end) {
      if (location.state?.batch === 'custom') {
        // For custom range - filter by actual roll numbers
        classStudents = classStudents.filter(student => {
          const rollNo = parseInt(student.rollNo.replace(/[^\d]/g, ''));
          return rollNo >= rollRange.start && rollNo <= rollRange.end;
        });
      } else {
        // For full class - filter by serial numbers (original logic)
        classStudents = classStudents.filter(student => {
          const serialNo = parseInt(student.serialNo);
          return serialNo >= rollRange.start && serialNo <= rollRange.end;
        });
      }
    }

    // Map students with status
    classStudents = classStudents.map(student => ({
      ...student,
      status: null
    }));

    setStudents(classStudents);
  }, [location.state?.selectedClass, location.state?.rollRange]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [history, setHistory] = useState([]);

  const handleSwipe = (status) => {
    setStudents((prevStudents) => {
      const newStudents = [...prevStudents];
      newStudents[currentIndex] = { ...newStudents[currentIndex], status };
      // Save to history
      setHistory(prev => [...prev, {
        students: [...prevStudents],
        currentIndex
      }]);
      return newStudents;
    });

    if (currentIndex < students.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleUndo = () => {
    if (history.length > 0) {
      const lastState = history[history.length - 1];
      setStudents(lastState.students);
      setCurrentIndex(lastState.currentIndex);
      setHistory(prev => prev.slice(0, -1));
    }
  };

  const getProgress = () => {
    return ((currentIndex) / students.length) * 100;
  };

  if (isCompleted) {
    return <Results
      attendanceData={students}
      onBack={() => {
        setIsCompleted(false);
        setCurrentIndex(0);
        setStudents(students.map(student => ({ ...student, status: null })));
      }}
    />;
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-50 to-gray-100 overflow-hidden">
      {/* Progress Bar */}
      <div className="w-full h-6 sm:h-10 bg-gray-200 relative">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 relative"
          initial={{ width: 0 }}
          animate={{ width: `${getProgress()}%` }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute inset-0 flex items-center justify-end pr-4 sm:pr-8">
            <span className="text-2xl sm:text-4xl font-bold text-white">
              {Math.round(getProgress())}%
            </span>
          </div>
        </motion.div>
      </div>

      {/* Undo Button */}
      <div className="fixed top-24 sm:top-28 right-4 sm:right-8 z-[100]">
        <motion.button
          onClick={handleUndo}
          disabled={history.length === 0}
          className={`pointer-events-auto p-4 sm:p-6 rounded-xl shadow-lg transform transition-all duration-300 flex items-center gap-2 sm:gap-3
            ${history.length === 0
              ? 'bg-gray-400 cursor-not-allowed opacity-50'
              : 'bg-gradient-to-br from-blue-500 to-purple-600 hover:shadow-xl hover:scale-105 hover:from-blue-600 hover:to-purple-700'}
            text-white`}
          whileHover={{ scale: history.length === 0 ? 1 : 1.05 }}
          whileTap={{ scale: history.length === 0 ? 1 : 0.95 }}
        >
          <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/>
          </svg>
          <span className="text-lg sm:text-xl font-bold">UNDO</span>
        </motion.button>
      </div>

      {/* Cards Container */}
      <div className="flex-1 relative">
        <AnimatePresence>
          {students.slice(currentIndex, currentIndex + 3).map((student, index) => (
            <StudentCard
              key={student.id}
              student={student}
              onSwipe={handleSwipe}
              style={{
                zIndex: 3 - index,
                scale: index === 0 ? 1 : 1 - index * 0.05,
                y: index * 20,
              }}
            />
          ))}
        </AnimatePresence>
      </div>

    </div>
  );
};

export default AttendanceScreen;
