import React from "react";

const TypingIndicator = () => {
  return (
    <div className="flex items-center gap-2 ml-10">
      <div
        className="h-2 w-2 bg-sky-400 rounded-full animate-bounce"
        style={{ animationDelay: "0ms" }}
      ></div>
      <div
        className="h-2 w-2 bg-sky-400 rounded-full animate-bounce"
        style={{ animationDelay: "150ms" }}
      ></div>
      <div
        className="h-2 w-2 bg-sky-400 rounded-full animate-bounce"
        style={{ animationDelay: "300ms" }}
      ></div>
    </div>
  );
};

export default TypingIndicator;
