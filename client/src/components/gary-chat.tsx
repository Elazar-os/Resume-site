import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  type GaryMode,
  type ChatMessage,
  MODE_LABELS,
  detectModeFromPath,
  modeFromQuery,
} from "@/lib/gary-types";

interface GaryChatProps {
  fullPage?: boolean;
  initialMode?: GaryMode;
}

export function GaryChat({ fullPage = false, initialMode }: GaryChatProps) {
  const [location] = useLocation();
  const [open, setOpen] = useState(fullPage);
  const [mode, setMode] = useState<GaryMode>(() => {
    if (initialMode) return initialMode;
    const hash = window.location.hash || "";
    const queryPart = hash.includes("?") ? hash.split("?")[1] : "";
    const fromQuery = modeFromQuery(queryPart);
    if (fromQuery) return fromQuery;
    return detectModeFromPath(location);
  });
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi — I’m Gary, Elazar’s AI assistant on ElazarOS. I can tell you about his background, projects, and how he approaches building things. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (fullPage || initialMode) return;
    setMode(detectModeFromPath(location));
  }, [location, fullPage, initialMode]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/gary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages, mode }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply || "Sorry, I didn’t get a response." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong reaching the server. Please try again in a moment.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  const chatPanel = (
    <div
      className={cn(
        "flex flex-col bg-background border shadow-2xl overflow-hidden",
        fullPage
          ? "w-full h-[calc(100vh-4rem)] max-w-2xl mx-auto rounded-xl border-border"
          : "fixed bottom-24 right-4 z-50 w-[min(100vw-2rem,380px)] h-[min(70vh,520px)] rounded-2xl"
      )}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b bg-primary/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-white text-sm font-bold">
            G
          </div>
          <div>
            <p className="font-semibold text-sm text-primary leading-tight">Gary</p>
            <p className="text-[11px] text-muted-foreground">Elazar’s AI assistant</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as GaryMode)}
            className="text-xs rounded-md border bg-background px-2 py-1 text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            title="Conversation mode"
          >
            {(Object.keys(MODE_LABELS) as GaryMode[]).map((m) => (
              <option key={m} value={m}>
                {MODE_LABELS[m]}
              </option>
            ))}
          </select>

          {!fullPage && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}
          >
            <div
              className={cn(
                "max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed whitespace-pre-wrap",
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : "bg-secondary text-foreground rounded-bl-md"
              )}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-secondary rounded-2xl rounded-bl-md px-4 py-2.5">
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="border-t p-3 flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about Elazar…"
          disabled={loading}
          className="flex-1 rounded-xl border bg-background px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50"
        />
        <Button
          size="icon"
          className="rounded-xl shrink-0"
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          aria-label="Send"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );

  if (fullPage) return chatPanel;

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all",
          "bg-gradient-to-br from-purple-500 to-violet-600 text-white hover:scale-105 active:scale-95",
          open && "scale-0 opacity-0 pointer-events-none"
        )}
        aria-label="Open Gary chat"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
      {open && chatPanel}
    </>
  );
}
