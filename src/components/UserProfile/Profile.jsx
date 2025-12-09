// src/components/UserProfile/Profile.jsx
import React, { useEffect, useState } from "react";
import apiClient from "../../api/axiosClient";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMe = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await apiClient.get("/auth/me");
        setUser(res.data);
      } catch (err) {
        console.error("Failed to load user:", err);
        setError("Could not load your profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  const formatDate = (iso) => {
    if (!iso) return "";
    try {
      const d = new Date(iso);
      return d.toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return iso;
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/80 text-slate-100 shadow-[0_24px_80px_rgba(0,0,0,0.85)] backdrop-blur-xl p-6">
        {/* Simple header without UT block */}
        <div className="mb-6">
          <h1 className="text-base font-semibold">Account Profile</h1>
          <p className="text-[11px] text-slate-400">
            Your UT chatbot account details
          </p>
        </div>

        {/* Body */}
        {loading && (
          <div className="text-sm text-slate-400">Loading your profile…</div>
        )}

        {error && !loading && (
          <div className="text-sm text-red-400 mb-3">{error}</div>
        )}

        {!loading && !error && user && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-linear-to-tr from-sky-500 to-purple-500 flex items-center justify-center text-lg font-semibold">
                {user.full_name
                  ? user.full_name.charAt(0).toUpperCase()
                  : user.email?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold">
                  {user.full_name || "Unnamed user"}
                </p>
                <p className="text-xs text-slate-400">{user.email}</p>
              </div>
            </div>

            <div className="h-px bg-slate-800/80 my-2" />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Joined</span>
                <span className="text-slate-200">
                  {formatDate(user.created_at)}
                </span>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900/70 px-3 py-2">
              <p className="text-[11px] text-slate-400">
                Some details on this page are detected from your current
                session.
              </p>
            </div>

            {/* Back to chat at the bottom */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => navigate("/chat/dashboard")}
                className="text-xs px-3 py-1.5 rounded-full border border-slate-700 text-sky-400 hover:text-sky-300 hover:bg-slate-800 transition"
              >
                Back to chat
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
