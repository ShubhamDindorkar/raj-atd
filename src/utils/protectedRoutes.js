import { Navigate } from 'react-router-dom';

export const TeacherRoute = ({ children }) => {
  const teacherData = sessionStorage.getItem('teacherData');
  if (!teacherData) {
    return <Navigate to="/teacher-login" replace />;
  }
  return children;
};

export const AdminRoute = ({ children }) => {
  const adminData = sessionStorage.getItem('adminData');
  if (!adminData) {
    return <Navigate to="/admin-login" replace />;
  }
  return children;
}; 