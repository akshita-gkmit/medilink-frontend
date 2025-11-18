const API = {
  AUTH_LOGIN: "/auth/login",
  AUTH_REGISTER: "/auth/register",
  AUTH_VALIDATE_TOKEN: "/auth/validate-token",

  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_LIST_DOCTOR: "/admin/",
  ADMIN_ADD_DOCTOR: "/admin/create",
  ADMIN_UPDATE_DOCTOR: "/admin/doctor/update",
  ADMIN_DOCTOR_DELETE: "/admin/doctor/delete",
  GET_DOCTOR: "/doctor",
           
  PATIENT_DASHBOARD: "/patient/dashboard",
  DOCTOR_DASHBOARD: "/doctor/dashboard",

  GET_DOCTOR_SLOTS: "/doctor/slots",
  CREATE_DOCTOR_SLOTS: "/doctor/slots/create",
  
  ADMIN_DOCTOR_EMAIL: "/admin/doctor/email"
};

export default API;
