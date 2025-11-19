const API = {
  // AUTH
  AUTH_LOGIN: "/auth/login",
  AUTH_REGISTER: "/auth/register",
  AUTH_VALIDATE_TOKEN: "/auth/validate-token",

  // ADMIN
  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_LIST_DOCTOR: "/admin/",
  ADMIN_ADD_DOCTOR: "/admin/create",
  ADMIN_UPDATE_DOCTOR: "/admin/doctor/update",
  ADMIN_DOCTOR_DELETE: "/admin/doctor/delete",
  ADMIN_ALL_APPOINTMENTS: "/admin/appointments/all",

  // DOCTOR
  GET_DOCTOR: "/doctor",
  
  // GET_DOCTOR_SLOTS: "/doctor/slots",
  CREATE_DOCTOR_SLOTS: "/doctor/slots/create",
  DOCTOR_DASHBOARD: "/doctor/dashboard",

  // PATIENT
  PATIENT_DASHBOARD: "/patient/dashboard",
  GET_ALL_DOCTORS: "/patient/doctors",
  PATIENT_APPOINTMENTS: "/patient/appointments",

  // **Most important**
  PATIENT_DOCTOR_SLOTS: "/patient/doctor",     
  DOCTOR_SLOTS: "/patient/doctor",             

  // BOOKING
  PATIENT_BOOK_APPOINTMENT: "/patient/appointment/book",
  CANCEL_APPOINTMENT: "/patient/cancel",

};

export default API;
