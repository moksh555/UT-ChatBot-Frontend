import React, { useEffect, useRef } from "react";

export default function ChatInput({ input, setInput, onSend, placeholder }) {
  const textareaRef = useRef(null);

  // Auto-grow up to max height (like ChatGPT)
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "auto"; // reset
    const maxPx = 160; // ~max-h-40
    el.style.height = `${Math.min(el.scrollHeight, maxPx)}px`;
  }, [input]);

  const handleKeyDown = (e) => {
    // Enter -> send, Shift+Enter -> newline
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="w-full">
      <div
        className="
          flex w-full items-center gap-2
          bg-slate-900/70 rounded-3xl
          px-4 py-1
          border border-slate-700/60
          shadow-[0_18px_50px_rgba(0,0,0,0.65)]
        "
      >
        <textarea
          ref={textareaRef}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="
    flex-1
    bg-transparent
    outline-none
    resize-none
    text-[15px] text-slate-100
    placeholder:text-slate-400
    leading-snug
    min-h-11
    py-2
    max-h-40
    overflow-y-auto
  "
        />

        <button
          onClick={onSend}
          className="
            flex h-10 w-10 items-center justify-center
            rounded-full bg-sky-500 hover:bg-sky-400
            text-white text-base font-semibold
            shadow-md shadow-sky-900/40 transition
            shrink-0
          "
          aria-label="Send message"
        >
          ➤
        </button>
      </div>
    </div>
  );
}
