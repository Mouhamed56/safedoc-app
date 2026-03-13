import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing        from './components/Landing';
import Login          from './components/Login';
import Register       from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword  from './components/ResetPassword';
import Dashboard      from './components/Dashboard';

function PrivateRoute({ children }) {
  const ok = sessionStorage.getItem('safedoc_auth') === 'true';
  return ok ? children : <Navigate to="/login" replace />;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                element={<Landing />} />
        <Route path="/login"           element={<Login />} />
        <Route path="/register"        element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password"  element={<ResetPassword />} />
        <Route path="/dashboard/*"     element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="*"                element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
