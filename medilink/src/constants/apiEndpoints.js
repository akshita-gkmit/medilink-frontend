const API = {
  AUTH_LOGIN: "/auth/login",
  AUTH_REGISTER: "/auth/register",
  AUTH_VALIDATE_TOKEN: "/auth/validate-token",

  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_LIST_DOCTOR: "/admin/",
  ADMIN_ADD_DOCTOR: "/admin/create",
  ADMIN_UPDATE_DOCTOR: "/admin/doctor/update",
  ADMIN_DOCTOR_DELETE: "/admin/doctor/delete",
  ADMIN_ALL_APPOINTMENTS: "/admin/appointments/all",

  GET_DOCTOR: "/doctor",
  CREATE_DOCTOR_SLOTS: "/doctor/slots/create",
  DOCTOR_DASHBOARD: "/doctor/dashboard",

  PATIENT_DASHBOARD: "/patient/dashboard",
  PATIENT_APPOINTMENTS: "/patient/appointments",
  PATIENT_DOCTOR_SLOTS: "/patient/doctor",     
  GET_ALL_DOCTORS: "/patient/doctors",
  DOCTOR_SLOTS: "/patient/doctor",             
  PATIENT_BOOK_APPOINTMENT: "/patient/appointment/book",
  CANCEL_APPOINTMENT: "/patient/cancel",
};
export default API;
