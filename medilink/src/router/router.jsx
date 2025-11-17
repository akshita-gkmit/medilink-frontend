import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Login from '../pages/auth/login';
import Register from '../pages/auth/register';
import Dashboard from '../pages/admin/Dashboard';
import ManageDoctors from '../pages/admin/manageDoctors';
import ROUTES from '../constants/routes';
import { useAuth } from "../context/authContext";


const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        Loading...
      </div>
    );
  }
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AppRouter = () => {
  return (
    <Routes>
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.REGISTER} element={<Register />} />      
      <Route
        path={ROUTES.ADMIN_DASHBOARD}
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.ADMIN_DOCTORS}
        element={
          <ProtectedRoute>
            <ManageDoctors />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />
    </Routes>
  );
};

export default AppRouter;