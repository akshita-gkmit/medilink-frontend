import api from './api';

export const apiGet = async (url, config = {}) => {
  return api.get(url, config);
};

export const apiPost = async (url, data, config = {}) => {
  return api.post(url, data, config);
};

export const apiPut = async (url, data, config = {}) => {
  return api.put(url, data, config);
};

export const apiDelete = async (url, config = {}) => {
  return api.delete(url, config);
};

export const authLogin = () => {
  return apiGet('/auth/login');
};