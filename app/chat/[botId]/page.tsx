"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import {
  addMessage,
  updateLastAssistantMessage,
  setIsStreaming,
  clearChat,
} from "@/lib/redux/chatSlice";
import { getOrCreateChatSessionAction } from "@/actions/chat.actions";
import { Send, Bot, User as UserIcon, Loader2 } from "lucide-react";

export default function PublicChatPage() {
  const { botId } = useParams();
  const dispatch = useDispatch();
  const { messages, isStreaming } = useSelector(
    (state: RootState) => state.chat,
  );

  const [input, setInput] = useState("");
  const [botInfo, setBotInfo] = useState<any>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loadingBot, setLoadingBot] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    dispatch(clearChat());

    const initChat = async () => {
      try {
        // 1. Fetch Bot Info
        const infoRes = await fetch(`/api/chat/info?botId=${botId}`);
        const infoData = await infoRes.json();

        if (infoData.bot) {
          setBotInfo(infoData.bot);
        }

        // 2. Get or Create DB Chat Session
        const storedSessionId = localStorage.getItem(`chat_session_${botId}`);
        const sessionRes = await getOrCreateChatSessionAction(
          botId as string,
          storedSessionId || undefined,
        );

        if (sessionRes.success && sessionRes.session) {
          setSessionId(sessionRes.session.id);
          localStorage.setItem(`chat_session_${botId}`, sessionRes.session.id);

          // 3. Populate existing chat history or set welcome message
          if (sessionRes.session.messages.length > 0) {
            sessionRes.session.messages.forEach((msg: any) => {
              dispatch(
                addMessage({
                  id: msg.id,
                  role: msg.role,
                  content: msg.content,
                }),
              );
            });
          } else if (infoData.bot?.welcomeMessage) {
            dispatch(
              addMessage({
                id: "welcome-msg",
                role: "assistant",
                content: infoData.bot.welcomeMessage,
              }),
            );
          }
        }
      } catch (err) {
        console.error("Failed to initialize chat session", err);
      } finally {
        setLoadingBot(false);
      }
    };

    initChat();
  }, [botId, dispatch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;

    const userMsg = input.trim();
    setInput("");

    const newUserMessage = {
      id: Date.now().toString(),
      role: "user" as const,
      content: userMsg,
    };

    dispatch(addMessage(newUserMessage));
    const updatedMessages = [...messages, newUserMessage];

    const assistantMessageId = (Date.now() + 1).toString();
    dispatch(
      addMessage({
        id: assistantMessageId,
        role: "assistant",
        content: "",
      }),
    );

    dispatch(setIsStreaming(true));

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          botId,
          sessionId,
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.body) throw new Error("No response stream");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        dispatch(updateLastAssistantMessage(chunk));
      }
    } catch (err) {
      dispatch(
        updateLastAssistantMessage(
          " Sorry, an error occurred while generating response.",
        ),
      );
    } finally {
      dispatch(setIsStreaming(false));
    }
  };

  if (loadingBot) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 text-slate-400">
        <Loader2 className="animate-spin h-6 w-6 mr-2" /> Loading Chatbot...
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col bg-slate-950 text-slate-100 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-800 bg-slate-900/80 backdrop-blur px-6 py-3.5 z-10 shrink-0">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/30">
          <Bot size={20} />
        </div>
        <div>
          <h1 className="font-semibold text-white text-sm sm:text-base">
            {botInfo?.name || "AI Assistant"}
          </h1>
          <p className="text-xs text-slate-400">
            {botInfo?.description || "Powered by Groq"}
          </p>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        <div className="max-w-3xl mx-auto space-y-6 w-full">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-3.5 ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {m.role === "assistant" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
                  <Bot size={16} />
                </div>
              )}
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                  m.role === "user"
                    ? "bg-blue-600 text-white rounded-br-xs"
                    : "bg-slate-900 border border-slate-800/80 text-slate-200 rounded-bl-xs"
                }`}
              >
                <p className="whitespace-pre-wrap break-words">{m.content}</p>
              </div>
              {m.role === "user" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-slate-300 border border-slate-700">
                  <UserIcon size={16} />
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Form Footer */}
      <div className="border-t border-slate-800/80 bg-slate-900/60 backdrop-blur p-4 shrink-0">
        <form
          onSubmit={handleSend}
          className="mx-auto flex max-w-3xl gap-3 items-center"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here..."
            className="flex-1 rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none shadow-inner"
          />
          <button
            type="submit"
            disabled={isStreaming || !input.trim()}
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-white hover:bg-blue-500 disabled:opacity-50 transition shadow-lg shadow-blue-600/20 shrink-0 font-medium text-sm"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
