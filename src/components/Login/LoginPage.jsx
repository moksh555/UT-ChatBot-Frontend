// src/components/Login/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import apiClient from "../../api/axiosClient";

const LoginPage = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await apiClient.post(`/auth/login`, { email, password });
      await apiClient.get("/auth/me");
      if (onLoginSuccess) await onLoginSuccess();
      console.log("Login response:", response.data);
      navigate("/chat/dashboard", { replace: true });
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid email or password.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setIsLoading(true);

    try {
      // Must include credentials so oauth_state + pkce_verifier cookies are stored
      const res = await apiClient.get(`/auth/google/login`);
      console.log(res);
      console.log(
        "Google login response:",
        res.statusText,
        typeof res.statusText
      );
      if (res.statusText !== "OK") {
        throw new Error("Failed to start Google OAuth");
      }

      const auth_url = res.data.auth_url;
      window.location.href = auth_url;
    } catch (err) {
      console.error("Google login error:", err);
      setError("Google sign-in failed. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800/70 border border-slate-700 shadow-lg">
            <span className="text-lg font-semibold tracking-tight">UT</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            UT System RAG Chatbot
          </h1>
          <p className="mt-2 text-sm text-slate-400 text-center max-w-xs">
            Sign in to ask questions across UT campuses with verified and
            up-to-date answers.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-3xl bg-slate-900/70 border border-slate-800 shadow-[0_18px_45px_rgba(0,0,0,0.7)] backdrop-blur-xl">
          <div className="px-6 py-7 sm:px-8 sm:py-8">
            <h2 className="mb-1 text-lg font-medium text-slate-100">Sign in</h2>
            <p className="mb-6 text-xs text-slate-400">
              Use your registered email and password.
            </p>
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="mb-4 inline-flex w-full items-center justify-center rounded-2xl bg-slate-800 px-4 py-2.5 text-sm font-medium text-white border border-slate-700 shadow-lg transition active:scale-[0.99] hover:bg-slate-700 disabled:opacity-60"
            >
              Continue with Google
            </button>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-1">
                <label
                  htmlFor="email"
                  className="block text-xs font-medium text-slate-300"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-900/70 px-3.5 py-2.5 text-sm text-slate-100 outline-none ring-0 transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/40 placeholder:text-slate-500"
                  placeholder="you@utdallas.edu"
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="password"
                  className="block text-xs font-medium text-slate-300"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-900/70 px-3.5 py-2.5 text-sm text-slate-100 outline-none ring-0 transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/40 placeholder:text-slate-500"
                  placeholder="••••••••"
                />
              </div>

              {error && <p className="text-xs text-red-400 mt-1">{error}</p>}

              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 inline-flex w-full items-center justify-center rounded-2xl bg-sky-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-sky-900/40 transition active:scale-[0.99] hover:bg-sky-400 disabled:opacity-60 disabled:hover:bg-sky-500"
              >
                {isLoading ? "Signing in…" : "Sign in"}
              </button>
            </form>

            <div className="mt-5 flex items-center justify-between text-xs text-slate-400">
              <Link to="/register" className="font-medium hover:text-sky-600">
                Don’t have an account?
              </Link>
            </div>
          </div>
        </div>

        {/* Footer text */}
        <p className="mt-6 text-[11px] text-center text-slate-500">
          Built for the University of Texas system. Please don’t share passwords
          with others.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
