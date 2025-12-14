// src/components/Common/ConfirmDialog.jsx
import React from "react";

const ConfirmDialog = ({
  open,
  title = "Are you sure?",
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false,
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <button
        type="button"
        onClick={onCancel}
        className="absolute inset-0 bg-black/60"
        aria-label="Close dialog"
      />

      {/* Modal */}
      <div className="relative w-[92%] max-w-md rounded-2xl border border-slate-700 bg-slate-950 p-5 shadow-xl">
        <h2 className="text-base font-semibold text-slate-100">{title}</h2>

        {description && (
          <p className="mt-2 text-sm text-slate-400">{description}</p>
        )}

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:bg-slate-900/60 disabled:opacity-60"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500 disabled:opacity-60"
          >
            {isLoading ? "Deleting…" : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
