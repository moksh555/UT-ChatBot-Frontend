import React from "react";
import ReactMarkdown from "react-markdown";

const MessageAI = ({ text }) => (
  <div className="flex justify-start w-full">
    <div className="w-full px-6 py-4 rounded-2xl bg-[#181818] border border-[#2a2a2a]">
      <ReactMarkdown
        components={{
          p: ({ children }) => (
            <p className="text-neutral-100 text-[15px] leading-relaxed whitespace-pre-wrap mb-3 last:mb-0">
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-neutral-50">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-neutral-100">{children}</em>
          ),
          ul: ({ children }) => (
            <ul className="list-disc pl-6 text-neutral-100 mb-3">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-6 text-neutral-100 mb-3">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="mb-1">{children}</li>,
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="text-sky-400 hover:text-sky-300 underline underline-offset-2"
            >
              {children}
            </a>
          ),
          code: ({ inline, children }) =>
            inline ? (
              <code className="px-1.5 py-0.5 rounded bg-black/40 border border-white/10 text-neutral-100 text-[13px]">
                {children}
              </code>
            ) : (
              <pre className="p-4 rounded-xl bg-black/40 border border-white/10 overflow-x-auto mb-3">
                <code className="text-neutral-100 text-[13px] leading-relaxed">
                  {children}
                </code>
              </pre>
            ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-white/10 pl-4 text-neutral-200 italic mb-3">
              {children}
            </blockquote>
          ),
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  </div>
);

export default MessageAI;
