import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ClassSelection from './components/ClassSelection'
import AttendanceScreen from './components/AttendanceScreen'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<ClassSelection />} />
          <Route path="attendance" element={<AttendanceScreen />} />
        </Route>
      </Routes>
    </Router>
  </React.StrictMode>,
)
