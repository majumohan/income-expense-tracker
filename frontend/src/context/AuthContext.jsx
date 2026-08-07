import React, { createContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import AuthReducer from './AuthReducer';

// Initial state
const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  loading: true,
  user: null,
  error: null
};

export const AuthContext = createContext(initialState);

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, initialState);

  // Load User
  const loadUser = async () => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }

    try {
      let API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5006/api';
      if (API_URL.endsWith('/')) API_URL = API_URL.slice(0, -1);
      if (!API_URL.endsWith('/api')) API_URL += '/api';
      const res = await axios.get(`${API_URL}/auth/me`);

      dispatch({
        type: 'USER_LOADED',
        payload: res.data.data
      });
    } catch (err) {
      dispatch({ type: 'AUTH_ERROR' });
    }
  };

  // Register User
  const register = async (formData) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      let API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5006/api';
      if (API_URL.endsWith('/')) API_URL = API_URL.slice(0, -1);
      if (!API_URL.endsWith('/api')) API_URL += '/api';
      const res = await axios.post(`${API_URL}/auth/register`, formData, config);

      setAuthToken(res.data.token);

      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: res.data
      });

      loadUser();
    } catch (err) {
      dispatch({
        type: 'REGISTER_FAIL',
        payload: err.response?.data?.error || 'Registration failed'
      });
    }
  };

  // Login User
  const login = async (formData) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      let API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5006/api';
      if (API_URL.endsWith('/')) API_URL = API_URL.slice(0, -1);
      if (!API_URL.endsWith('/api')) API_URL += '/api';
      const res = await axios.post(`${API_URL}/auth/login`, formData, config);

      setAuthToken(res.data.token);

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: res.data
      });

      loadUser();
    } catch (err) {
      dispatch({
        type: 'LOGIN_FAIL',
        payload: err.response?.data?.error || 'Login failed'
      });
    }
  };

  // Logout
  const logout = () => dispatch({ type: 'LOGOUT' });

  // Forgot Password
  const forgotPassword = async (email) => {
    const config = { headers: { 'Content-Type': 'application/json' } };
    try {
      let API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5006/api';
      if (API_URL.endsWith('/')) API_URL = API_URL.slice(0, -1);
      if (!API_URL.endsWith('/api')) API_URL += '/api';
      const res = await axios.post(`${API_URL}/auth/forgotpassword`, { email }, config);
      return { success: true, data: res.data };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Email could not be sent' };
    }
  };

  // Reset Password
  const resetPassword = async (token, password) => {
    const config = { headers: { 'Content-Type': 'application/json' } };
    try {
      let API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5006/api';
      if (API_URL.endsWith('/')) API_URL = API_URL.slice(0, -1);
      if (!API_URL.endsWith('/api')) API_URL += '/api';
      const res = await axios.put(`${API_URL}/auth/resetpassword/${token}`, { password }, config);

      setAuthToken(res.data.token);
      dispatch({ type: 'LOGIN_SUCCESS', payload: res.data });
      loadUser();

      return { success: true, data: res.data };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Password reset failed' };
    }
  };

  // Clear Errors
  const clearErrors = () => dispatch({ type: 'CLEAR_ERRORS' });

  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        user: state.user,
        error: state.error,
        register,
        login,
        logout,
        forgotPassword,
        resetPassword,
        loadUser,
        clearErrors
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const setAuthToken = token => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};
