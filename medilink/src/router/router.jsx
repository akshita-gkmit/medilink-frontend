import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/login";
import Register from "../pages/auth/register";

import Dashboard from "../pages/admin/dashboard";
import ViewDoctor from "../pages/ViewDoctor";
import CreateDoctor from "../pages/admin/createDoctor";
import UpdateDoctor from "../pages/admin/UpdateDoctor";
import ManageSlots from "../pages/doctor/manageSlots";

import DoctorDashboard from "../pages/doctor/doctorDashboad";

import PatientDashboard from "../pages/patient/dashboard";
import BookAppointment from "../pages/patient/bookAppointment";

import ROUTES from "../constants/navigationPath";
import { useAuth } from "../context/authContext";

import AdminAppointments from "../pages/admin/AdminAppointments";
import DoctorAppointments from "../pages/doctor/DoctorAppointments";


const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <>Loading...</>;
  return isAuthenticated ? children : <Navigate to={ROUTES.LOGIN} replace />;
};

const AppRouter = () => (
  <Routes>
    <Route path={ROUTES.DOCTOR_DASHBOARD} element={<DoctorDashboard />} />

    <Route path={ROUTES.PATIENT_DASHBOARD} element={<PatientDashboard />} />

    <Route path={ROUTES.PATIENT_BOOK_DOCTOR_ID} element={<BookAppointment />} />

    <Route path={ROUTES.DOCTOR_ID_SLOTS} element={<ManageSlots />} />

    <Route path={ROUTES.LOGIN} element={<Login />} />
    <Route path={ROUTES.REGISTER} element={<Register />} />

    <Route path={ROUTES.ADMIN_DASHBOARD} element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      }
    />
    <Route path={ROUTES.DOCTOR_ID_APPOINTMENTS} element={<DoctorAppointments />} />
    <Route path={ROUTES.ADMIN_VIEW_APPOINTMENTS} element={<AdminAppointments />} />
    <Route path={ROUTES.ADMIN_ADD_DOCTOR} element={<CreateDoctor />} />
    <Route path={ROUTES.ADMIN_DOCTOR_UPDATE_ID} element={<UpdateDoctor />} />
    <Route path={ROUTES.DOCTOR_ID} element={<ViewDoctor />} />
    <Route path={ROUTES.ADMIN_ALL_APPOINTMENTS} element={<AdminAppointments />} />
    <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
  </Routes>
);

export default AppRouter;
