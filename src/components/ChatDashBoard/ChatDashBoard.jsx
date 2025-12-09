// src/components/ChatDashBoard/ChatDashBoard.jsx
import React, { useEffect, useState, useRef, useCallback, use } from "react";
import SidebarItem from "./SidebarItem";
import MessageAI from "./MessageAI";
import MessageUser from "./MessageUser";
import apiClient from "../../api/axiosClient";
import TypingIndicator from "./TypingIndicator";
import { useNavigate } from "react-router-dom";

const createNewThreadId = () => {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }
  return `thread-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
};

const ChatDashBoard = () => {
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [historyError, setHistoryError] = useState("");
  const [selectedThread, setSelectedThread] = useState(null);
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messagesError, setMessagesError] = useState("");
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [name, setName] = useState("UT System Chat");
  const [intial, setIntial] = useState("UT");
  const navigate = useNavigate();

  const handleSignOut = () => {
    // clear auth + go to login
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleProfile = () => {
    navigate("/profile");
    setIsAccountMenuOpen(false);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // handle new chat creation
  const handleNewChat = () => {
    const now = new Date().toISOString();

    const newThread = {
      thread_id: createNewThreadId(),
      title: "New chat",
      created_at: now,
      updated_at: now,
    };

    // select it
    setSelectedThread(newThread);

    // clear current messages / errors
    setMessages([]);
    setMessagesError("");
  };

  // Load personal chat history
  const fetchHistory = useCallback(async () => {
    try {
      setLoadingHistory(true);
      setHistoryError("");

      const res = await apiClient.get("/chats/personal-history");
      const personalHistory = res.data.personal_history || [];

      setHistory(personalHistory);

      // only auto-select if nothing selected yet
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

          setIntial(initials);
        } else {
          // fallback
          setName("UT System Chat");
          setIntial("UT");
        }
      } catch (err) {
        console.error("Failed to load user:", err?.response?.data || err);
        setName("UT System Chat");
        setIntial("UT");
      }
    };

    loadUser();
  }, []);

  // Load messages when a thread is selected
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

    // Optimistically add the human message to UI
    setMessages((prev) => [...prev, { role: "human", content: text }]);

    // AI is thinking...
    setIsThinking(true);

    try {
      const res = await apiClient.post(`/chats/${selectedThread.thread_id}`, {
        user_message: text,
      });
      // AI response returned by backend
      const aiMessage = res.data.model_response;

      setMessages((prev) => [...prev, { role: "ai", content: aiMessage }]);
      fetchHistory();
    } catch (err) {
      console.error("Failed to send message:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: "Sorry, something went wrong with the server.",
        },
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

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">
      <div className="flex h-[90vh] w-full max-w-6xl rounded-3xl border border-slate-800 bg-slate-900/80 shadow-[0_24px_80px_rgba(0,0,0,0.85)] backdrop-blur-xl overflow-hidden text-slate-100">
        {/* Sidebar */}
        <aside className="w-64 border-r border-slate-800/70 bg-slate-950/40 p-4 flex flex-col">
          <div className="mb-4 relative">
            <button
              type="button"
              onClick={() => setIsAccountMenuOpen((prev) => !prev)}
              className="w-full flex items-center gap-2 rounded-2xl px-2 py-1.5 hover:bg-slate-900/60 transition"
            >
              <div className="h-9 w-9 rounded-2xl bg-sky-500 flex items-center justify-center text-xs font-semibold shadow-lg shadow-sky-900/40">
                {intial}
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

          <div className="flex flex-col h-full overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
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

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col bg-slate-950/30">
          {/* Header */}
          <div className="h-16 border-b border-slate-800/80 px-6 flex items-center justify-between bg-slate-900/60 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-sm font-semibold">
                  {selectedThread?.title || "UT System Chat"}
                </h1>
                <p className="text-[11px] text-slate-400">
                  Ask about any UT campus, program, or policy.
                </p>
              </div>
            </div>

            {selectedThread && (
              <div className="hidden md:flex items-center gap-2 text-[11px] text-slate-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
              </div>
            )}
          </div>
          {/* Messages area */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-linear-to-b from-slate-900/60 to-slate-950/80 custom-scrollbar">
            {loadingMessages && (
              <div className="text-sm text-slate-400">Loading messages…</div>
            )}

            {messagesError && (
              <div className="text-sm text-red-400">{messagesError}</div>
            )}

            {!loadingMessages && !messagesError && messages.length === 0 && (
              <div className="flex h-full items-end justify-center pb-6">
                <p className="text-sm text-slate-400">
                  <span className="animate-pulse">Start Messaging Below!</span>
                  <span className="inline-block ml-2 animate-bounce">⬇</span>
                </p>
              </div>
            )}

            {messages.map((msg, idx) => {
              const role = msg.role;
              const content = msg.content || "";

              if (role === "human") {
                return <MessageUser key={idx} text={content} />;
              }

              return <MessageAI key={idx} text={content} />;
            })}
            {isThinking && (
              <div>
                <TypingIndicator />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          {/* Input Bar */}
          <div className="h-20 border-t border-slate-800/80 px-6 flex items-center bg-slate-900/80 backdrop-blur-md">
            <div className="flex w-full items-center gap-3 bg-slate-900 rounded-2xl px-4 py-2.5 shadow-[0_12px_30px_rgba(0,0,0,0.65)] border border-slate-800">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask about tuition, majors, housing, or campus life..."
                className="flex-1 bg-transparent outline-none text-sm text-slate-100 placeholder:text-slate-500"
              />
              <button
                onClick={sendMessage}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-500 hover:bg-sky-400 text-white text-sm font-semibold shadow-md shadow-sky-900/40 transition"
              >
                ➤
              </button>
            </div>
          </div>
          {/*  */}
        </main>
      </div>
    </div>
  );
};

export default ChatDashBoard;
