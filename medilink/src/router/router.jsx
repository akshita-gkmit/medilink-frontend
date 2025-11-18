import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/login";
import Register from "../pages/auth/register";
import Dashboard from "../pages/admin/Dashboard";
import ManageDoctors from "../pages/admin/manageDoctor";
import ROUTES from "../constants/routes";
import { useAuth } from "../context/authContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <>Loading...</>; //Checks if app is still verifying token
  return isAuthenticated ? children : <Navigate to={ROUTES.AUTH_LOGIN} replace />;
};

const AppRouter = () => (
  <Routes>
    <Route path={ROUTES.AUTH_LOGIN} element={<Login />} />
    <Route path={ROUTES.AUTH_REGISTER} element={<Register />} /> 
    <Route path={ROUTES.ADMIN_DASHBOARD} element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
    <Route path={ROUTES.ADMIN_DOCTORS} element={<ProtectedRoute><ManageDoctors /></ProtectedRoute>} />

    <Route path="*" element={<Navigate to={ROUTES.AUTH_LOGIN} replace />} />
  </Routes>
);

export default AppRouter;
