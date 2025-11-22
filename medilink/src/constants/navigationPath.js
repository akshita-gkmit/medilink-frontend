const ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",

  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_ADD_DOCTOR: "/admin/create-doctor",

  DOCTOR_DASHBOARD: "/doctor/dashboard",
  PATIENT_DASHBOARD: "/patient/dashboard",
  ADMIN_VIEW_APPOINTMENTS: "/admin/appointments",

  DOCTOR_ID_SLOTS: "/doctor/:doctor_id/slots",
  DOCTOR_ID_APPOINTMENTS: "/doctor/:doctorId/appointments",
  UPDATE_DOCTOR: (doctorId) => `/admin/doctor/update/${doctorId}`,
  ADMIN_DOCTOR_UPDATE_ID: "/admin/doctor/update/:doctor_id",
  DOCTOR_ID: "/doctor/${doctor.id}",
  MY_SLOTS: "/doctor/my-slots",
  PATIENT_BOOK_DOCTOR_ID: "/patient/book/:doctorId"
};

export default ROUTES;