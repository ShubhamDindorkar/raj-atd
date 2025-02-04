import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import universityLogo from '../assets/img/DESPU_logo1.jpg';

const exportStudentList = (students, type) => {
  const now = new Date();
  const dateStr = now.toLocaleDateString();
  const timeStr = now.toLocaleTimeString();

  // Create PDF document
  const doc = new jsPDF();

  // Create table headers - without status for present/absent lists
  const headers = type === 'Complete'
    ? [['Sr. No.', 'Roll No.', 'Name', 'Status']]
    : [['Sr. No.', 'Roll No.', 'Name']];

  // Create table data
  const data = students.map((student, index) => {
    const baseData = [
      (index + 1).toString(),
      student.rollNo.replace(/[^\d]/g, ''),
      student.name
    ];
    return type === 'Complete'
      ? [...baseData, student.status === 'present' ? 'P' : 'A']
      : baseData;
  });

  // Add logo and header on first page before table
  // Add logo
  const logoWidth = 25; // mm
  const logoHeight = (logoWidth * 2150) / 2488; // maintain aspect ratio
  doc.addImage(universityLogo, 'JPEG', 15, 10, logoWidth, logoHeight);

  // Add header text
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('DESPU UNIVERSITY', doc.internal.pageSize.width/2, 20, { align: 'center' });
  doc.setFontSize(16);
  doc.text('SCHOOL OF ENGINEERING AND TECHNOLOGY', doc.internal.pageSize.width/2, 30, { align: 'center' });
  doc.setFontSize(14);
  doc.text(`${type.toUpperCase()} STUDENTS LIST`, doc.internal.pageSize.width/2, 40, { align: 'center' });
  doc.setFontSize(12);
  const teacherData = JSON.parse(sessionStorage.getItem('teacherData') || '{}');
  doc.text(`Subject: ${teacherData.name}`, doc.internal.pageSize.width/2, 50, { align: 'center' });
  doc.text(`Date: ${dateStr}    Time: ${timeStr}`, doc.internal.pageSize.width/2, 60, { align: 'center' });

  // Add table with optimized settings for more entries per page
  doc.autoTable({
    head: headers,
    body: data,
    startY: 65, // Start after header on first page
    theme: 'grid',
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 9
    },
    styles: {
      fontSize: 9,
      cellPadding: 3,
      halign: 'center',
      overflow: 'linebreak',
      lineWidth: 0.1
    },
    margin: { top: 10, right: 10, bottom: 10, left: 10 },
    columnStyles: type === 'Complete'
      ? {
          0: { cellWidth: 15 },
          1: { cellWidth: 25 },
          2: { cellWidth: 'auto' },
          3: { cellWidth: 15 }
        }
      : {
          0: { cellWidth: 15 },
          1: { cellWidth: 25 },
          2: { cellWidth: 'auto' }
        },
    didDrawPage: function(data) {
      // Reset top margin for all pages after first page
      if (data.pageNumber > 1) {
        // Start from the very top on subsequent pages
        data.settings.startY = 10;
      }
    }
  });

  // Save the PDF
  doc.save(`${type.toLowerCase()}_students_${dateStr.replace(/\//g, '-')}.pdf`);
};

// Add styles for hover effects
const hoverStyles = `
  .student-card {
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .student-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  }
  .student-card.edit-mode {
    cursor: pointer;
  }
  .student-card.edit-mode:hover {
    transform: translateY(-2px) scale(1.01);
    box-shadow: 0 6px 8px rgba(0,0,0,0.15);
  }
`;

const Results = ({ attendanceData, onBack }) => {
  // Add styles to document
  React.useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = hoverStyles;
    document.head.appendChild(styleSheet);
    return () => styleSheet.remove();
  }, []);
  const [isEditMode, setIsEditMode] = useState(false);
  const [students, setStudents] = useState(attendanceData);

  const getStats = () => {
    const presentCount = students.filter(student => student.status === 'present').length;
    const totalCount = students.length;
    const absentCount = totalCount - presentCount;
    return {
      presentCount,
      absentCount,
      totalCount,
      presentPercentage: Math.round((presentCount / totalCount) * 100)
    };
  };

  const handleStatusToggle = (student) => {
    if (!isEditMode) return;

    const newStatus = student.status === 'present' ? 'absent' : 'present';
    setStudents(prevStudents => {
      return prevStudents.map(s => {
        if (s.id === student.id && s.rollNo === student.rollNo) {
          return { ...s, status: newStatus };
        }
        return s;
      });
    });
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-8 md:p-12">
      {/* Header with Back Button and Edit Mode Toggle */}
      <div className="max-w-7xl mx-auto relative mb-12">
        <div className="flex justify-between items-center">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="Go back"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back</span>
          </button>

          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
              isEditMode
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isEditMode ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              )}
            </svg>
            {isEditMode ? 'Save Changes' : 'Edit Mode'}
          </button>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text text-center mt-4">
          Attendance Results
        </h1>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-500"
        >
          <h3 className="text-lg font-medium text-gray-500">Total Students</h3>
          <p className="text-4xl font-bold text-gray-900 mt-2">{stats.totalCount}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-green-500"
        >
          <h3 className="text-lg font-medium text-gray-500">Present</h3>
          <p className="text-4xl font-bold text-gray-900 mt-2">{stats.presentCount}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-red-500"
        >
          <h3 className="text-lg font-medium text-gray-500">Absent</h3>
          <p className="text-4xl font-bold text-gray-900 mt-2">{stats.absentCount}</p>
        </motion.div>
      </div>




      {/* Progress Circle */}
      <div className="flex justify-center mb-16">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative w-64 h-64 md:w-80 md:h-80 bg-white rounded-full shadow-xl p-4"
        >
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#f3f4f6"
              strokeWidth="8"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="8"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: stats.presentPercentage / 100 }}
              transition={{ duration: 2, ease: "easeOut" }}
              transform="rotate(-90 50 50)"
              strokeDasharray="283"
              strokeDashoffset="0"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3B82F6">
                  <animate attributeName="stopColor" values="#3B82F6; #8B5CF6; #3B82F6" dur="4s" repeatCount="indefinite" />
                </stop>
                <stop offset="100%" stopColor="#8B5CF6">
                  <animate attributeName="stopColor" values="#8B5CF6; #3B82F6; #8B5CF6" dur="4s" repeatCount="indefinite" />
                </stop>
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text"
              >
                {stats.presentPercentage}%
              </motion.span>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-xl md:text-2xl text-gray-600 mt-2"
              >
                Attendance Rate
              </motion.p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Student Lists */}
      <div className="max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {/* Present Students */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-green-600">Present Students</h2>
                <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  {stats.presentCount} Students
                </span>
              </div>
              <div className="overflow-y-auto max-h-[400px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pr-4 space-y-3">
                {students
                  .filter(student => student.status === 'present')
                  .map((student, index) => (
                    <motion.div
                      key={student.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleStatusToggle(student)}
                      className={`p-4 rounded-xl bg-green-50 border border-green-100 flex items-center justify-between group student-card ${
                        isEditMode ? 'edit-mode' : ''
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center text-green-700 font-medium">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800 group-hover:text-green-700 transition-colors">
                            {student.name}
                          </h3>
                          <p className="text-sm text-gray-500">Roll No: {student.rollNo.replace(/[^\d]/g, '')}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-green-500"></span>
                        <span className="text-green-700 font-medium">Present</span>
                        {isEditMode && (
                          <div className="ml-2 p-1 rounded-full bg-gray-100">
                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m-8 4H4m0 0l4 4m-4-4l4-4" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
              </div>
              <div className="mt-6">
                <button
                  onClick={() => exportStudentList(
                    students.filter(student => student.status === 'absent'),
                    'Absent'
                  )}
                  className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl shadow-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Export Present List
                </button>
              </div>
            </motion.div>

            {/* Absent Students */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-red-600">Absent Students</h2>
                <span className="px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                  {stats.absentCount} Students
                </span>
              </div>
              <div className="overflow-y-auto max-h-[400px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pr-4 space-y-3">
                {students
                  .filter(student => student.status === 'absent')
                  .map((student, index) => (
                    <motion.div
                      key={student.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleStatusToggle(student)}
                      className={`p-4 rounded-xl bg-red-50 border border-red-100 flex items-center justify-between group student-card ${
                        isEditMode ? 'edit-mode' : ''
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-red-200 flex items-center justify-center text-red-700 font-medium">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800 group-hover:text-red-700 transition-colors">
                            {student.name}
                          </h3>
                          <p className="text-sm text-gray-500">Roll No: {student.rollNo.replace(/[^\d]/g, '')}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-red-500"></span>
                        <span className="text-red-700 font-medium">Absent</span>
                        {isEditMode && (
                          <div className="ml-2 p-1 rounded-full bg-gray-100">
                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m-8 4H4m0 0l4 4m-4-4l4-4" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
              </div>
              <div className="mt-6">
                <button
                  onClick={() => exportStudentList(
                    attendanceData.filter(student => student.status === 'absent'),
                    'Absent'
                  )}
                  className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl shadow-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Export Absent List
                </button>
              </div>
            </motion.div>
          </motion.div>

          {/* Generate Complete Attendance List Button */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 text-center"
          >
            <button
              onClick={() => exportStudentList(students, 'Complete')}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl shadow-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 text-xl font-bold group"
            >
              <svg className="w-6 h-6 transform group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Generate Complete Attendance List
            </button>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Results;