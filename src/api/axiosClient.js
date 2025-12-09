// src/api/axiosClient.js
import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

// Interceptor to attach JWT if needed
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token", "");

  // Skip attaching JWT for login or register endpoints
  if (
    config.url.includes("/auth/login") ||
    config.url.includes("/auth/register")
  ) {
    return config;
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      // optional: maybe also clear other user state
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
