import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./components/Login/LoginPage";
import RegisterPage from "./components/Register/RegisterPage";
import ChatDashBoard from "./components/ChatDashBoard/ChatDashBoard";
import Profile from "./components/UserProfile/Profile";
import apiClient from "./api/axiosClient";

const ProtectedRoute = ({ authStatus, children }) => {
  if (authStatus === "loading") {
    return <div>Loading...</div>;
  }
  if (authStatus !== "authed") {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => {
  // authStatus: "loading" | "authed" | "not_authed"
  const [authStatus, setAuthStatus] = useState("loading");

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await apiClient.get("/auth/me");
        // Axios: if we got here, it's a 2xx response
        console.log("Session check response:", res.data);
        setAuthStatus("authed");
      } catch (err) {
        console.warn("Session check failed:", err);
        setAuthStatus("not_authed");
      }
    };

    checkSession();
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={
          authStatus === "loading" ? (
            <div>Loading...</div>
          ) : authStatus === "authed" ? (
            <Navigate to="/chat/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/login"
        element={
          authStatus === "authed" ? (
            <Navigate to="/chat/dashboard" replace />
          ) : (
            <LoginPage />
          )
        }
      />
      <Route
        path="/register"
        element={
          authStatus === "authed" ? (
            <Navigate to="/chat/dashboard" replace />
          ) : (
            <RegisterPage />
          )
        }
      />

      <Route
        path="/chat/dashboard"
        element={
          <ProtectedRoute authStatus={authStatus}>
            <ChatDashBoard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute authStatus={authStatus}>
            <Profile />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
