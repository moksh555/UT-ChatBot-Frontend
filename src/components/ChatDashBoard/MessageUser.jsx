// src/components/ChatDashBoard/MessageUser.jsx
import React from "react";

const MessageUser = ({ text }) => (
  <div className="flex justify-end w-full">
    <div
      className="
        max-w-4xl
        px-4 py-3
        rounded-2xl
        bg-sky-500/70
        text-white
        text-[15px]
        leading-relaxed
        shadow-sm
        backdrop-blur-sm
      "
    >
      {text}
    </div>
  </div>
);

export default MessageUser;
