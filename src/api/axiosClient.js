// src/api/axiosClient.js
import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true, // ALWAYS send cookies
});

// ✅ Cookie-only auth: do NOT attach Authorization headers from localStorage
apiClient.interceptors.request.use((config) => {
  return config;
});

// ✅ Don't hard-redirect on 401 here.
// Let the UI decide (ProtectedRoute / auth check).
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
