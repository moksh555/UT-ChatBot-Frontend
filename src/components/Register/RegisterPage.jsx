// src/components/Register/Register.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import apiClient from "../../api/axiosClient";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const updateField = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const registerData = await apiClient.post(`/auth/register`, {
        full_name: form.name,
        email: form.email,
        password: form.password,
      });

      console.log("Registration response:", registerData.data);
      navigate("/login");
    } catch (err) {
      const apiError = err.response?.data;

      console.error("Register error detail:", apiError || err);

      let message = "Could not create account. Please check your details.";

      if (
        apiError?.detail &&
        Array.isArray(apiError.detail) &&
        apiError.detail.length > 0
      ) {
        // Take the first validation error message from FastAPI
        message = apiError.detail[0].msg || message;
      }

      setError(message);
    } finally {
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
            Create your account
          </h1>
          <p className="mt-2 text-sm text-slate-400 text-center max-w-xs">
            Register to access the UT System RAG Chatbot.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-3xl bg-slate-900/70 border border-slate-800 shadow-[0_18px_45px_rgba(0,0,0,0.7)] backdrop-blur-xl">
          <div className="px-6 py-7 sm:px-8 sm:py-8">
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Name */}
              <div>
                <label
                  className="block text-xs font-medium text-slate-300 mb-1"
                  htmlFor="name"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-900/70 px-3.5 py-2.5 text-sm text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/40 placeholder:text-slate-500"
                  placeholder="John Doe"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  className="block text-xs font-medium text-slate-300 mb-1"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-900/70 px-3.5 py-2.5 text-sm text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/40 placeholder:text-slate-500"
                  placeholder="you@utdallas.edu"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  className="block text-xs font-medium text-slate-300 mb-1"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-900/70 px-3.5 py-2.5 text-sm text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/40 placeholder:text-slate-500"
                  placeholder="••••••••"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  className="block text-xs font-medium text-slate-300 mb-1"
                  htmlFor="confirmPassword"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  value={form.confirmPassword}
                  onChange={(e) =>
                    updateField("confirmPassword", e.target.value)
                  }
                  className="w-full rounded-2xl border border-slate-700 bg-slate-900/70 px-3.5 py-2.5 text-sm text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/40 placeholder:text-slate-500"
                  placeholder="••••••••"
                />
              </div>

              {error && <p className="text-xs text-red-400">{error}</p>}

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 inline-flex w-full items-center justify-center rounded-2xl bg-sky-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-sky-900/40 transition active:scale-[0.99] hover:bg-sky-400 disabled:opacity-60 disabled:hover:bg-sky-500"
              >
                {isLoading ? "Creating account…" : "Register"}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-5 flex items-center justify-between text-xs text-slate-400">
              <Link to="/login">
                <span className="font-medium hover:text-sky-600">
                  Already have an account?
                </span>
              </Link>
            </div>
          </div>
        </div>

        <p className="mt-6 text-[11px] text-center text-slate-500">
          Welcome to the UT System chatbot platform — built for students and
          future Mavericks.
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
