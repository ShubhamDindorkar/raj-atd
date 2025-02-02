import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { teachers } from '../../data/teacherData';
import { subjects } from '../../data/subjectData';

const TeacherManagement = () => {
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);

  const handleEditTeacher = (teacher) => {
    setSelectedTeacher(teacher);
    setEditData({ ...teacher });
    setIsEditing(true);
  };

  const handleSubjectToggle = (subjectId) => {
    const currentSubjects = [...editData.subjects];
    const index = currentSubjects.indexOf(subjectId);
    
    if (index === -1) {
      currentSubjects.push(subjectId);
    } else {
      currentSubjects.splice(index, 1);
    }
    
    setEditData({ ...editData, subjects: currentSubjects });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Manage Teachers</h2>
        <button
          onClick={() => setIsEditing('new')}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl
                   font-semibold text-lg hover:opacity-90 transition-opacity"
        >
          Add New Teacher
        </button>
      </div>

      {/* Teacher List */}
      <div className="grid gap-6">
        {teachers.map((teacher) => (
          <motion.div
            key={teacher.id}
            layout
            className="bg-white rounded-xl shadow-md p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">{teacher.name}</h3>
                <p className="text-gray-600">ID: {teacher.id}</p>
                <p className="text-gray-600">Username: {teacher.username}</p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleEditTeacher(teacher)}
                  className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  Edit
                </button>
              </div>
            </div>
            
            <div className="mt-4">
              <h4 className="text-lg font-semibold text-gray-700 mb-2">Assigned Subjects:</h4>
              <div className="flex flex-wrap gap-2">
                {teacher.subjects.map((subjectId) => {
                  const subject = subjects.find(s => s.id === subjectId);
                  return (
                    <span
                      key={subjectId}
                      className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium"
                    >
                      {subject?.name || subjectId}
                    </span>
                  );
                })}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                {isEditing === 'new' ? 'Add New Teacher' : 'Edit Teacher'}
              </h3>
              
              {/* Form fields here */}
              
              <div className="mt-8 flex justify-end space-x-4">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Save changes logic here
                    setIsEditing(false);
                  }}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg
                           hover:opacity-90 transition-opacity"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeacherManagement; 