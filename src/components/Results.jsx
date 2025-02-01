import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const exportStudentList = (students, type, subject) => {
  const now = new Date();
  const dateStr = now.toLocaleDateString();
  const timeStr = now.toLocaleTimeString();

  const header = `${type} Students List - ${subject} - Generated on ${dateStr} at ${timeStr}\n\n`;
  const content = students
    .map(student => `${student.name} (Roll No: ${student.rollNo.replace(/[^\d]/g, '')})`)
    .join('\n');

  const fullContent = header + content;
  const blob = new Blob([fullContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${type.toLowerCase()}_students_${subject}_${dateStr.replace(/\//g, '-')}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const TabButton = ({ subject, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-8 py-4 text-2xl font-bold rounded-t-xl transition-all duration-300
      ${isActive 
        ? 'bg-white text-blue-600 shadow-lg transform -translate-y-2' 
        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
  >
    {subject}
  </button>
);

const Results = ({ attendanceData, onBack }) => {
  const [activeSubject, setActiveSubject] = useState('Mathematics');
  const subjects = ['Mathematics', 'Science', 'English', 'History'];

  const getSubjectStats = (subject) => {
    const subjectStudents = attendanceData.filter(student => true); // Replace with actual subject filter
    const presentCount = subjectStudents.filter(student => student.status === 'present').length;
    const totalCount = subjectStudents.length;
    return {
      presentCount,
      totalCount,
      presentPercentage: Math.round((presentCount / totalCount) * 100)
    };
  };

  const stats = getSubjectStats(activeSubject);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-12">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
          Attendance Results
        </h1>
      </div>

      {/* Subject Tabs */}
      <div className="flex justify-center gap-4 mb-8">
        {subjects.map((subject) => (
          <TabButton
            key={subject}
            subject={subject}
            isActive={activeSubject === subject}
            onClick={() => setActiveSubject(subject)}
          />
        ))}
      </div>

      {/* Progress Circle */}
      <div className="flex justify-center mb-24">
        <div className="relative w-96 h-96">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="10"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="10"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: stats.presentPercentage / 100 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              transform="rotate(-90 50 50)"
              strokeDasharray="283"
              strokeDashoffset="0"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <span className="text-6xl font-bold text-gray-800">{stats.presentPercentage}%</span>
              <p className="text-2xl text-gray-600 mt-4">Present</p>
            </div>
          </div>
        </div>
      </div>

      {/* Student Lists */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSubject}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="grid grid-cols-2 gap-8 max-w-[1800px] mx-auto"
        >
          {/* Present Students */}
          <div>
            <h2 className="text-3xl font-bold text-green-600 mb-4 text-center">Present Students</h2>
            <div className="overflow-y-auto max-h-[600px] pr-4 space-y-2">
              {attendanceData
                .filter(student => student.status === 'present')
                .map((student) => (
                  <motion.div
                    key={student.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl shadow-lg flex items-center justify-between bg-green-50 border-l-4 border-green-500"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold text-gray-700">
                        {student.name}
                      </span>
                      <span className="text-xl text-gray-600">
                        {student.rollNo.replace(/[^\d]/g, '')}
                      </span>
                    </div>
                    <div className="text-2xl text-green-500">✓</div>
                  </motion.div>
                ))}
            </div>
            <div className="mt-4 text-center">
              <button
                onClick={() => exportStudentList(
                  attendanceData.filter(student => student.status === 'present'),
                  'Present',
                  activeSubject
                )}
                className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-lg hover:from-green-600 hover:to-green-700 transition-all duration-200"
              >
                Export Present List
              </button>
            </div>
          </div>

          {/* Absent Students */}
          <div>
            <h2 className="text-3xl font-bold text-red-600 mb-4 text-center">Absent Students</h2>
            <div className="overflow-y-auto max-h-[600px] pr-4 space-y-2">
              {attendanceData
                .filter(student => student.status === 'absent')
                .map((student) => (
                  <motion.div
                    key={student.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl shadow-lg flex items-center justify-between bg-red-50 border-l-4 border-red-500"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold text-gray-700">
                        {student.name}
                      </span>
                      <span className="text-xl text-gray-600">
                        {student.rollNo.replace(/[^\d]/g, '')}
                      </span>
                    </div>
                    <div className="text-2xl text-red-500">✗</div>
                  </motion.div>
                ))}
            </div>
            <div className="mt-4 text-center">
              <button
                onClick={() => exportStudentList(
                  attendanceData.filter(student => student.status === 'absent'),
                  'Absent',
                  activeSubject
                )}
                className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg shadow-lg hover:from-red-600 hover:to-red-700 transition-all duration-200"
              >
                Export Absent List
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Results;