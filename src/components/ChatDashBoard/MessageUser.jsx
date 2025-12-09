// src/components/ChatDashBoard/MessageUser.jsx
import React from "react";

const MessageUser = ({ text }) => (
  <div className="flex justify-end">
    <div className="bg-sky-400 text-white px-4 py-3 rounded-xl max-w-xl shadow-md">
      {text}
    </div>
  </div>
);

export default MessageUser;
