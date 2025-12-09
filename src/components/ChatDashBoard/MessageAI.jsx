import React from "react";
import ReactMarkdown from "react-markdown";

const MessageAI = ({ text }) => (
  <div className="flex gap-3 items-start">
    <div className="bg-slate-100 text-slate-700 px-4 py-3 rounded-xl max-w-xl shadow-sm prose prose-slate">
      <ReactMarkdown>{text}</ReactMarkdown>
    </div>
  </div>
);

export default MessageAI;
