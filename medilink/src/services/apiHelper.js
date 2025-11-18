import api from "./api";

export const apiCall = (method, url, data, config = {}) => {
  return api({
    method,
    url,
    data,
    ...config
  });
};
