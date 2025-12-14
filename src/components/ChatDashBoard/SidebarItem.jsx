import React from "react";
import DeleteChatHistory from "../Miscellaneous/DeleteChatHistory";

const SidebarItem = ({ title, subtitle, active, onClick, onDelete }) => {
  return (
    <div
      className={[
        "w-full rounded-2xl transition",
        active
          ? "bg-slate-100/10 text-slate-50 shadow-sm border border-slate-700"
          : "text-slate-400 hover:bg-slate-900/50 hover:text-slate-100",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-2 px-3 py-2.5">
        {/* Main clickable area */}
        <button
          type="button"
          onClick={onClick}
          className="flex-1 text-left min-w-0"
        >
          <div className="text-sm font-medium leading-snug line-clamp-2">
            {title}
          </div>
          {subtitle && (
            <div className="text-[11px] text-slate-500 mt-0.5">{subtitle}</div>
          )}
        </button>

        {/* Delete button (separate, legal) */}
        <DeleteChatHistory onDelete={onDelete} />
      </div>
    </div>
  );
};

export default SidebarItem;
