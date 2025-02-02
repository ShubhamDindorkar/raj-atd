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

const Results = ({ attendanceData, onBack }) => {
  const getStats = () => {
    const presentCount = attendanceData.filter(student => student.status === 'present').length;
    const totalCount = attendanceData.length;
    return {
      presentCount,
      totalCount,
      presentPercentage: Math.round((presentCount / totalCount) * 100)
    };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-12">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
          Attendance Results
        </h1>
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
                    <div className="text-2xl text-green-500">P</div>
                  </motion.div>
                ))}
            </div>
            <div className="mt-4 text-center">
              <button
                onClick={() => exportStudentList(
                  attendanceData.filter(student => student.status === 'present'),
                  'Present'
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
                    <div className="text-2xl text-red-500">A</div>
                  </motion.div>
                ))}
            </div>
            <div className="mt-4 text-center">
              <button
                onClick={() => exportStudentList(
                  attendanceData.filter(student => student.status === 'absent'),
                  'Absent'
                )}
                className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg shadow-lg hover:from-red-600 hover:to-red-700 transition-all duration-200"
              >
                Export Absent List
              </button>
            </div>
          </div>
        </motion.div>

        {/* Generate Complete Attendance List Button */}
        <div className="col-span-2 mt-8 text-center">
          <button
            onClick={() => exportStudentList(attendanceData, 'Complete')}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 text-xl font-bold"
          >
            Generate Complete Attendance List
          </button>
        </div>
      </AnimatePresence>
    </div>
  );
};

export default Results;