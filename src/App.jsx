import React, { useRef, useEffect, useCallback, useState } from "react";
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
  const didRun = useRef(false);

  const checkSession = useCallback(async () => {
    try {
      const res = await apiClient.get("/auth/me");
      console.log("Session check response:", res.data);
      setAuthStatus("authed");
      return true;
    } catch (err) {
      console.warn("Session check failed:", err);
      setAuthStatus("not_authed");
      return false;
    }
  }, []);

  useEffect(() => {
    // React 18 StrictMode runs effects twice in dev; prevent double-run
    if (didRun.current) return;
    didRun.current = true;

    // run async without returning a promise from useEffect
    (async () => {
      await checkSession();
    })();
  }, [checkSession]);

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
            <LoginPage onLoginSuccess={checkSession} />
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
