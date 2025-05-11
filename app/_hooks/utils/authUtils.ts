import axios, { AxiosRequestConfig } from "axios";

// Get auth token from localStorage
export const getAuthToken = () => localStorage.getItem("authToken");

// Set auth headers globally for all requests
export const setAuthHeader = (token: string | null) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

// Create request config with auth token
export const createAuthConfig = (
  config?: AxiosRequestConfig
): AxiosRequestConfig => {
  const token = getAuthToken();
  return {
    ...config,
    withCredentials: true,
    headers: {
      ...(config?.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
};

// Initialize auth from localStorage
export const initializeAuth = () => {
  const token = getAuthToken();
  if (token) {
    setAuthHeader(token);
  }
};

// Store token received after login
export const storeAuthToken = (token: string) => {
  localStorage.setItem("authToken", token);
  setAuthHeader(token);
};

// Clear token on logout
export const clearAuthToken = () => {
  localStorage.removeItem("authToken");
  setAuthHeader(null);
};
