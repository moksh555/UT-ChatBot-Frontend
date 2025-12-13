// src/components/ChatDashBoard/ChatDashBoard.jsx
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import SidebarItem from "./SidebarItem";
import MessageAI from "./MessageAI";
import MessageUser from "./MessageUser";
import TypingIndicator from "./TypingIndicator";
import ChatInput from "./ChatInput";
import apiClient from "../../api/axiosClient";

const createNewThreadId = () => {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return `thread-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
};

const ChatDashBoard = () => {
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [historyError, setHistoryError] = useState("");

  const [selectedThread, setSelectedThread] = useState(null);

  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messagesError, setMessagesError] = useState("");

  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [name, setName] = useState("UT System Chat");
  const [initial, setInitial] = useState("UT");

  const messagesEndRef = useRef(null);
  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const handleSignOut = async () => {
    try {
      await apiClient.post("/auth/logout");
    } catch (err) {
      console.warn("Logout failed:", err);
    } finally {
      window.location.replace("/login");
    }
  };

  const handleProfile = () => {
    setIsAccountMenuOpen(false);
    navigate("/profile");
  };

  const handleNewChat = () => {
    const now = new Date().toISOString();
    const newThread = {
      thread_id: createNewThreadId(),
      title: "New chat",
      created_at: now,
      updated_at: now,
    };

    setSelectedThread(newThread);
    setMessages([]);
    setMessagesError("");
    setInput("");

    // Optional: makes it show instantly in the sidebar
    setHistory((prev) => [...prev, newThread]);
  };

  const fetchHistory = useCallback(async () => {
    try {
      setLoadingHistory(true);
      setHistoryError("");

      const res = await apiClient.get("/chats/personal-history");
      const personalHistory = res.data.personal_history || [];

      setHistory(personalHistory);

      if (!selectedThread && personalHistory.length > 0) {
        setSelectedThread(personalHistory[personalHistory.length - 1]);
      }
    } catch (err) {
      console.error("Failed to load personal history:", err);
      setHistoryError("Could not load your chats.");
    } finally {
      setLoadingHistory(false);
    }
  }, [selectedThread]);

  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await apiClient.get("/auth/me");
        const username = res?.data?.full_name;

        if (username) {
          setName(username);
          const initials = username
            .trim()
            .split(/\s+/)
            .map((n) => n[0])
            .join("")
            .toUpperCase();
          setInitial(initials);
        } else {
          setName("UT System Chat");
          setInitial("UT");
        }
      } catch (err) {
        console.error("Failed to load user:", err?.response?.data || err);
        setName("UT System Chat");
        setInitial("UT");
      }
    };

    loadUser();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedThread?.thread_id) return;

      try {
        setLoadingMessages(true);
        setMessagesError("");
        setMessages([]);

        const res = await apiClient.get(
          `/chats/specific/${selectedThread.thread_id}`
        );
        setMessages(res.data.messages || []);
      } catch (err) {
        console.error("Failed to load messages:", err);
        setMessagesError("Could not load this conversation.");
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [selectedThread?.thread_id]);

  const sendMessage = async () => {
    if (!input.trim() || !selectedThread?.thread_id) return;

    const text = input;
    setInput("");

    // optimistic user message
    setMessages((prev) => [...prev, { role: "human", content: text }]);
    setIsThinking(true);

    try {
      const res = await apiClient.post(`/chats/${selectedThread.thread_id}`, {
        user_message: text,
      });

      const aiMessage = res.data.model_response;
      setMessages((prev) => [...prev, { role: "ai", content: aiMessage }]);
      fetchHistory();
    } catch (err) {
      console.error("Failed to send message:", err);
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "Sorry, something went wrong with the server." },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const formatUpdatedAt = (iso) => {
    if (!iso) return "";
    try {
      const d = new Date(iso);
      return d.toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  const isEmptyThread =
    !loadingMessages && !messagesError && messages.length === 0;

  return (
    <div className="h-screen w-screen bg-linear-to-b from-[#0f0f10] to-[#141414] text-slate-100 overflow-hidden">
      <div className="h-full w-full flex">
        {/* Sidebar */}
        <aside className="w-80 min-w-[20rem] border-r border-slate-800/60 bg-slate-950/20 p-4 flex flex-col">
          <div className="mb-4 relative">
            <button
              type="button"
              onClick={() => setIsAccountMenuOpen((prev) => !prev)}
              className="w-full flex items-center gap-2 rounded-2xl px-2 py-1.5 hover:bg-slate-900/40 transition"
            >
              <div className="h-9 w-9 rounded-2xl bg-sky-500 flex items-center justify-center text-xs font-semibold shadow-lg shadow-sky-900/40">
                {initial}
              </div>
              <div className="flex flex-col items-start">
                <p className="text-sm font-semibold leading-tight text-slate-50">
                  {name}
                </p>
                <p className="text-[11px] text-slate-400">
                  Multi-campus RAG assistant
                </p>
              </div>
            </button>

            {isAccountMenuOpen && (
              <div className="absolute left-0 top-11 w-44 rounded-2xl bg-slate-950/95 border border-slate-800 shadow-xl z-20 py-1">
                <button
                  type="button"
                  onClick={handleProfile}
                  className="w-full text-left px-4 py-2 text-sm text-slate-100 hover:bg-slate-900/80"
                >
                  Profile
                </button>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2 text-sm text-red-300 hover:bg-red-500/10"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>

          <button
            onClick={handleNewChat}
            className="mb-4 bg-sky-500 hover:bg-sky-400 text-white font-medium py-2.5 rounded-xl shadow-md shadow-sky-900/40 transition text-sm"
          >
            + New Chat
          </button>

          <div className="flex-1 overflow-y-auto pr-1">
            {loadingHistory && (
              <div className="text-xs text-slate-400 px-1">Loading chats…</div>
            )}
            {historyError && (
              <div className="text-xs text-red-400 px-1">{historyError}</div>
            )}
            {!loadingHistory && !historyError && history.length === 0 && (
              <div className="text-xs text-slate-400 px-1">
                No chats yet. Start a new one!
              </div>
            )}

            {[...history].reverse().map((item) => (
              <SidebarItem
                key={item.thread_id}
                title={item.title || "Untitled chat"}
                subtitle={formatUpdatedAt(item.updated_at)}
                active={selectedThread?.thread_id === item.thread_id}
                onClick={() => setSelectedThread(item)}
              />
            ))}
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 flex flex-col bg-transparent">
          {/* Header (transparent – no slab) */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800/50 bg-transparent">
            <div>
              <h1 className="text-sm font-semibold">
                {selectedThread?.title || "UT System Chat"}
              </h1>
              <p className="text-[11px] text-slate-400">
                Ask about any UT campus, program, or policy.
              </p>
            </div>

            {selectedThread && (
              <div className="hidden md:flex items-center gap-2 text-[11px] text-slate-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6 pb-28">
            {loadingMessages && (
              <div className="text-sm text-slate-400">Loading messages…</div>
            )}
            {messagesError && (
              <div className="text-sm text-red-400">{messagesError}</div>
            )}

            {isEmptyThread ? (
              <div className="h-full flex flex-col items-center justify-center gap-6">
                <div className="text-center">
                  <h2 className="text-4xl font-semibold text-slate-100">
                    What’s on your mind?
                  </h2>
                  <p className="text-base text-slate-400 mt-2">
                    Ask about any UT campus, program, or policy.
                  </p>
                </div>

                <div className="w-full max-w-[720px]">
                  <ChatInput
                    input={input}
                    setInput={setInput}
                    onSend={sendMessage}
                    placeholder="Ask about tuition, majors, housing, or campus life..."
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg, idx) => {
                  const role = msg.role;
                  const content = msg.content || "";
                  if (role === "human")
                    return <MessageUser key={idx} text={content} />;
                  return <MessageAI key={idx} text={content} />;
                })}

                {isThinking && <TypingIndicator />}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
          {!isEmptyThread && (
            <div className="sticky bottom-4 z-10 px-6">
              <div className="max-w-4xl mx-auto">
                <ChatInput
                  input={input}
                  setInput={setInput}
                  onSend={sendMessage}
                  placeholder="Ask about tuition, majors, housing, or campus life..."
                />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ChatDashBoard;
