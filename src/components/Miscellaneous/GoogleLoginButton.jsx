import React from "react";

const GoogleLoginButton = ({
  loadingText,
  beforeLoadingText,
  handleSubmit,
  isLoading,
}) => {
  return (
    <button
      type="button"
      onClick={handleSubmit}
      disabled={isLoading}
      className="mb-4 inline-flex w-full items-center justify-center rounded-2xl bg-slate-800 px-4 py-2.5 text-sm font-medium text-white border border-slate-700 shadow-lg transition active:scale-[0.99] hover:bg-slate-700 disabled:opacity-60"
    >
      <span className="mr-2">
        <img
          src="./google-login-logo.svg"
          alt="Google Logo"
          className="h-5 w-5"
        />
      </span>
      {isLoading ? loadingText : beforeLoadingText}
    </button>
  );
};

export default GoogleLoginButton;
