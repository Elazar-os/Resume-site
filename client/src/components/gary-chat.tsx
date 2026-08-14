import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { MessageCircle, X, Send, Loader2, Fingerprint, ShieldX } from "lucide-react";
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

const WELCOME_MESSAGES: Record<GaryMode, string> = {
  professional:
    "Hi — I’m Gary, Elazar’s AI assistant on ElazarOS. I can tell you about his background, projects, and how he approaches building things. What would you like to know?",
  shidduch:
    "Hi, I’m Gary. I’m here to help you get a real sense of who Elazar is — his personality, values, background, and how he approaches life. Feel free to ask anything.",
  full:
    "Hi — I’m Gary, Elazar’s AI assistant. I can answer questions about his background, projects, personality, values, and more. What would you like to know?",
};

/** Keywords / patterns that trigger the fake biometric lock (private info). */
const PRIVATE_PATTERNS: RegExp[] = [
  /\b(phone|cell|mobile|number|call me|text me)\b/i,
  /\b(address|home address|where (does|do) he live|street|apartment|apt)\b/i,
  /\b(email|e-mail|@outlook|contact (info|details|information))\b/i,
  /\b(ssn|social security|passport|driver.?s? license)\b/i,
  /\b(bank|account number|routing|credit card|ssn)\b/i,
  /\b(exact (location|address)|precise (location|address)|home (phone|number))\b/i,
  /\b(private (info|information|details|data)|confidential|secret)\b/i,
  /\b(what is his (phone|number|address|email))\b/i,
  /\b(give me (his )?(phone|number|address|email|contact))\b/i,
  /\b(family.*(private|personal|details|info)|siblings.*(phone|number|address))\b/i,
  /\b(mother|father|parents).*(phone|number|address|email)\b/i,
  /\b(how (can|do) i (reach|contact|get in touch))\b/i,
];

function isPrivateQuery(text: string): boolean {
  const normalized = text.trim().toLowerCase();
  if (!normalized) return false;
  return PRIVATE_PATTERNS.some((re) => re.test(normalized));
}

function welcomeFor(mode: GaryMode): ChatMessage {
  return { role: "assistant", content: WELCOME_MESSAGES[mode] };
}

/** Fake biometric modal that always fails. Pure theater. */
function BiometricFailModal({
  open,
  onComplete,
}: {
  open: boolean;
  onComplete: () => void;
}) {
  const [phase, setPhase] = useState<"scanning" | "failed">("scanning");

  useEffect(() => {
    if (!open) {
      setPhase("scanning");
      return;
    }

    // Scan for ~1.6s then fail
    const scanTimer = setTimeout(() => setPhase("failed"), 1600);
    const doneTimer = setTimeout(() => {
      onComplete();
    }, 2800);

    return () => {
      clearTimeout(scanTimer);
      clearTimeout(doneTimer);
    };
  }, [open, onComplete]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-card border shadow-2xl rounded-2xl w-full max-w-sm overflow-hidden">
        <div className="px-6 pt-6 pb-4 text-center space-y-1">
          <p className="text-sm font-semibold text-primary">Biometric Verification</p>
          <p className="text-xs text-muted-foreground">
            Private information requires owner verification
          </p>
        </div>

        <div className="flex flex-col items-center justify-center py-8 gap-4">
          {phase === "scanning" ? (
            <>
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-2 border-primary/30 flex items-center justify-center">
                  <Fingerprint className="w-10 h-10 text-primary animate-pulse" />
                </div>
                <div className="absolute inset-0 rounded-full border-2 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin" />
              </div>
              <p className="text-sm text-muted-foreground">Scanning…</p>
            </>
          ) : (
            <>
              <div className="w-20 h-20 rounded-full bg-red-500/10 border-2 border-red-500/40 flex items-center justify-center">
                <ShieldX className="w-10 h-10 text-red-500" />
              </div>
              <div className="text-center space-y-1">
                <p className="text-sm font-semibold text-red-600">Verification failed</p>
                <p className="text-xs text-muted-foreground">Access denied</p>
              </div>
            </>
          )}
        </div>

        <div className="px-6 pb-5">
          <Button
            variant="outline"
            className="w-full"
            onClick={onComplete}
            disabled={phase === "scanning"}
          >
            {phase === "scanning" ? "Please wait…" : "OK"}
          </Button>
        </div>
      </div>
    </div>
  );
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
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    welcomeFor(
      initialMode ??
        (() => {
          const hash = window.location.hash || "";
          const queryPart = hash.includes("?") ? hash.split("?")[1] : "";
          return modeFromQuery(queryPart) ?? detectModeFromPath(location);
        })()
    ),
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showBiometric, setShowBiometric] = useState(false);
  const pendingPrivateRef = useRef<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const prevModeRef = useRef(mode);

  // Keep mode in sync with the current page (floating widget only)
  useEffect(() => {
    if (fullPage || initialMode) return;
    const detected = detectModeFromPath(location);
    setMode(detected);
  }, [location, fullPage, initialMode]);

  // When mode changes, reset to the matching welcome message
  useEffect(() => {
    if (prevModeRef.current !== mode) {
      prevModeRef.current = mode;
      setMessages([welcomeFor(mode)]);
      setInput("");
    }
  }, [mode]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  function handleBiometricComplete() {
    setShowBiometric(false);
    const text = pendingPrivateRef.current;
    pendingPrivateRef.current = null;

    if (!text) return;

    // Add the user message (if not already added) and the denial reply
    setMessages((prev) => {
      const alreadyHasUser = prev.some(
        (m, i) => i === prev.length - 1 && m.role === "user" && m.content === text
      );
      const base = alreadyHasUser ? prev : [...prev, { role: "user" as const, content: text }];
      return [
        ...base,
        {
          role: "assistant" as const,
          content:
            "Biometric verification failed. That information is locked and only accessible to Elazar. Access denied.",
        },
      ];
    });
  }

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    // Private query → show fake biometric that always fails
    if (isPrivateQuery(text)) {
      setInput("");
      pendingPrivateRef.current = text;
      // Optimistically show the user message
      setMessages((prev) => [...prev, { role: "user", content: text }]);
      setShowBiometric(true);
      return;
    }

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
          disabled={loading || showBiometric}
          className="flex-1 rounded-xl border bg-background px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50"
        />
        <Button
          size="icon"
          className="rounded-xl shrink-0"
          onClick={sendMessage}
          disabled={loading || !input.trim() || showBiometric}
          aria-label="Send"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );

  if (fullPage) {
    return (
      <>
        {chatPanel}
        <BiometricFailModal open={showBiometric} onComplete={handleBiometricComplete} />
      </>
    );
  }

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
      <BiometricFailModal open={showBiometric} onComplete={handleBiometricComplete} />
    </>
  );
}
