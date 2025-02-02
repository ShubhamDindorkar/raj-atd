import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import TeacherLogin from './components/TeacherLogin'
import AdminLogin from './components/AdminLogin'
import AdminDashboard from './components/AdminDashboard'
import Layout from './components/Layout'
import ClassSelection from './components/ClassSelection'
import SubjectSelection from './components/SubjectSelection'
import AttendanceScreen from './components/AttendanceScreen'
import './index.css'

// Simple protected route component
const TeacherRoute = ({ children }) => {
  const teacherData = sessionStorage.getItem('teacherData')
  if (!teacherData) {
    return window.location.href = '/teacher-login'
  }
  return children
}

const AdminRoute = ({ children }) => {
  const adminData = sessionStorage.getItem('adminData')
  if (!adminData) {
    return window.location.href = '/admin-login'
  }
  return children
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/teacher-login" element={<TeacherLogin />} />
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Teacher Routes */}
        <Route path="/" element={<TeacherRoute><Layout /></TeacherRoute>}>
          <Route path="class-selection" element={<ClassSelection />} />
          <Route path="subject" element={<SubjectSelection />} />
          <Route path="attendance" element={<AttendanceScreen />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
