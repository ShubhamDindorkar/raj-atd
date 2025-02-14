import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get, set, remove, push } from 'firebase/database';
import { app } from '../../firebase';
import { motion, AnimatePresence } from 'framer-motion';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('classA');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    rollNo: '',
    serialNo: '',
  });

  const classes = ['classA', 'classB', 'classC', 'classD'];

  useEffect(() => {
    fetchStudents();
  }, [selectedClass]);

  const fetchStudents = async () => {
    setIsLoading(true);
    setError('');
    try {
      const db = getDatabase(app);
      const studentsRef = ref(db, selectedClass);
      const snapshot = await get(studentsRef);
      
      if (snapshot.exists()) {
        const studentsData = snapshot.val();
        const studentsArray = Array.isArray(studentsData) 
          ? studentsData 
          : Object.entries(studentsData).map(([key, value]) => ({
              id: key,
              ...value
            }));
        setStudents(studentsArray.filter(Boolean)); // Filter out null entries
      } else {
        setStudents([]);
      }
    } catch (err) {
      setError('Failed to fetch students: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const db = getDatabase(app);

      // Check if serialNo already exists in current class
      const existingStudentsRef = ref(db, selectedClass);
      const snapshot = await get(existingStudentsRef);
      const existingStudents = snapshot.val() || {};

      // Check for duplicate serialNo (except for the current student being edited)
      const isDuplicate = Object.values(existingStudents).some(student =>
        student.serialNo === formData.serialNo &&
        (!editingStudent || student.id !== editingStudent.id)
      );

      if (isDuplicate) {
        setError('A student with this Serial Number already exists');
        return;
      }

      // Always use serialNo as the ID for consistency
      const studentId = formData.serialNo;
      if (!studentId) {
        setError('Serial Number is required');
        return;
      }

      if (editingStudent) {
        // Update existing student
        await set(ref(db, `${selectedClass}/${studentId}`), {
          ...formData,
          id: studentId
        });
      } else {
        // Add new student
        await set(ref(db, `${selectedClass}/${studentId}`), {
          ...formData,
          id: studentId
        });
      }

      setIsModalOpen(false);
      setEditingStudent(null);
      setFormData({ name: '', rollNo: '', serialNo: '' });
      fetchStudents();
    } catch (err) {
      setError('Failed to save student: ' + err.message);
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      rollNo: student.rollNo,
      serialNo: student.serialNo
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (studentId) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    
    try {
      const db = getDatabase(app);
      await remove(ref(db, `${selectedClass}/${studentId}`));
      fetchStudents();
    } catch (err) {
      setError('Failed to delete student: ' + err.message);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Student Management</h2>
          <p className="text-gray-600 mt-2">Manage students in different classes</p>
        </div>
        <button
          onClick={() => {
            setEditingStudent(null);
            setFormData({ name: '', rollNo: '', serialNo: '' });
            setIsModalOpen(true);
          }}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add New Student
        </button>
      </div>

      {/* Class Selection */}
      <div className="mb-6 flex gap-4">
        {classes.map((classOption) => (
          <button
            key={classOption}
            onClick={() => setSelectedClass(classOption)}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedClass === classOption
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {classOption}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
          {error}
        </div>
      )}

      {/* Students Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Serial No
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Roll No
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                  No students found in this class
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr key={student.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.serialNo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.rollNo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(student)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(student.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Student Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl p-8 max-w-md w-full mx-4"
            >
              <h3 className="text-2xl font-bold mb-6">
                {editingStudent ? 'Edit Student' : 'Add New Student'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Roll No
                  </label>
                  <input
                    type="text"
                    value={formData.rollNo}
                    onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Serial No
                  </label>
                  <input
                    type="text"
                    value={formData.serialNo}
                    onChange={(e) => setFormData({ ...formData, serialNo: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div className="flex justify-end gap-4 mt-8">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingStudent(null);
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    {editingStudent ? 'Save Changes' : 'Add Student'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentManagement;