import React, { createContext, useState, useEffect } from 'react';
import api from '../services/axios';
import { apiGet, apiPost } from '../services/apiHelper';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    validateToken();
  }, []);

  const validateToken = async () => {
    const access_token = localStorage.getItem('access_token');
    if (!access_token) {
      setLoading(false);
      return;
    }

    try {
      const response = await apiGet('/auth/validate-token');
      setUser(response.data.user);
      setIsAuthenticated(true);
    } catch (error) {
      localStorage.removeItem('access_token');
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
  try {
    const response = await apiPost('/auth/login', { email, password });

    const accessToken = response?.data?.accessToken;
    const loggedInUser = response?.data?.user;

    if (!accessToken || !loggedInUser) {
      return { success: false, error: 'Invalid response from server' };
    }

    localStorage.setItem('accessToken', accessToken);
    setUser(loggedInUser);
    setIsAuthenticated(true);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Login failed'
    };
  }
};


  const register = async (userData) => {
    try {
      const response = await apiPost('/auth/register', userData);
      return { success: true, message: response.data.message };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        validateToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};