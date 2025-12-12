// src/components/ChatDashBoard/SidebarItem.jsx
import React from "react";

const SidebarItem = ({ title, subtitle, active, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-full text-left px-3 py-2.5 rounded-2xl transition cursor-pointer",
        active
          ? "bg-slate-100/10 text-slate-50 shadow-sm border border-slate-700"
          : "text-slate-400 hover:bg-slate-900/50 hover:text-slate-100",
      ].join(" ")}
    >
      <div className="text-sm font-medium leading-snug line-clamp-2">
        {title}
      </div>
      {subtitle && (
        <div className="text-[11px] text-slate-500 mt-0.5">{subtitle}</div>
      )}
    </button>
  );
};

export default SidebarItem;
