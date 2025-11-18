import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/login";
import ROUTES from "../constants/navigationPath";
import { useAuth } from "../context/authContext";
import Register from "../pages/auth/register";
import Dashboard from "../pages/admin/dashboard";
import ManageDoctors from "../pages/admin/manageDoctor";
import ViewDoctor from "../pages/ViewDoctor";
import CreateDoctor from "../pages/admin/createDoctor";
import UpdateDoctor from "../pages/admin/UpdateDoctor";
import ManageSlots from "../pages/doctor/manageSlots";
import DoctorDashboard from "../pages/doctor/doctorDashboad";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <>Loading...</>; //Checks if app is still verifying token
  return isAuthenticated ? children : <Navigate to={ROUTES.LOGIN} replace />;
};

const AppRouter = () => (
  <Routes>
    <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
    <Route path="/doctor/:doctor_id/slots" element={<ManageSlots />} />
    <Route path={ROUTES.LOGIN} element={<Login />} />
    <Route path={ROUTES.REGISTER} element={<Register />} /> 
    <Route path={ROUTES.ADMIN_DASHBOARD} element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
    <Route path={ROUTES.ADMIN_MANAGE_DOCTOR} element={<ProtectedRoute><ManageDoctors /></ProtectedRoute>} />
    <Route path={ROUTES.ADMIN_ADD_DOCTOR} element={<CreateDoctor />} />
    <Route path="/admin/doctor/update/:doctor_id" element={<UpdateDoctor />} />
    <Route path="/doctor/:id" element={<ViewDoctor />} />
    <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
  </Routes>
);

export default AppRouter;
