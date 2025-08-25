import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from 'react-router-dom'
import Projecthomepage from './components/Projecthomepage.jsx'
import Dashboard from './components/Dashboard.jsx'
import { getSession } from './api'

const ProtectedRoute = ({ children }) => {
  const csrid = getSession("csrid");
  if (!csrid || csrid === "undefined" || csrid === "null") {
    return <Navigate to="/" replace />;
  }
  return children;
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Projecthomepage />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        {/* Redirect misspelled dashboard to correct route */}
        <Route path="/dasboard" element={<Navigate to="/dashboard" replace />} />
        {/* Catch all invalid routes and redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);