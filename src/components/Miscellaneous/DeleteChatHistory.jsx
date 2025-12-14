// src/components/Miscellaneous/DeleteChatHistory.jsx
import React from "react";

const DeleteChatHistory = ({ onDelete }) => {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation(); // ← critical
        onDelete?.();
      }}
      className="shrink-0 rounded-lg px-2 py-1 text-slate-400 hover:text-red-400 hover:bg-slate-800/60"
      aria-label="Delete chat"
      title="Delete chat"
    >
      <img src="/delete-chat.svg" alt="Delete Icon" className="h-4 w-4" />
    </button>
  );
};

export default DeleteChatHistory;
