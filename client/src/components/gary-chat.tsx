import { useState, useRef, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import {
  MessageCircle,
  X,
  Send,
  Loader2,
  Fingerprint,
  ShieldX,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

/** One-time setup password (client-side theater only). */
const GARY_SETUP_PASSWORD = "12Crazy34!";

const GARY_BIO_ENABLED_KEY = "gary-biometric-enabled";
const GARY_BIO_CRED_ID_KEY = "gary-biometric-cred-id";

const PRIVATE_PATTERNS: RegExp[] = [
  /\b(phone|cell|mobile|number|call me|text me)\b/i,
  /\b(address|home address|where (does|do) he live|street|apartment|apt)\b/i,
  /\b(email|e-mail|@outlook|contact (info|details|information))\b/i,
  /\b(ssn|social security|passport|driver.?s? license)\b/i,
  /\b(bank|account number|routing|credit card)\b/i,
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

function isGaryBiometricEnabled(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(GARY_BIO_ENABLED_KEY) === "true";
}

function getGaryCredId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(GARY_BIO_CRED_ID_KEY);
}

function setGaryBiometricRegistered(credentialId: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(GARY_BIO_ENABLED_KEY, "true");
  window.localStorage.setItem(GARY_BIO_CRED_ID_KEY, credentialId);
}

async function isPlatformBiometricAvailable(): Promise<boolean> {
  if (typeof window === "undefined" || !("PublicKeyCredential" in window)) return false;
  try {
    return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  } catch {
    return false;
  }
}

async function registerGaryBiometric(): Promise<string | null> {
  if (typeof window === "undefined" || !("PublicKeyCredential" in window)) return null;

  const challenge = new Uint8Array(32);
  crypto.getRandomValues(challenge);
  const userId = new Uint8Array(16);
  crypto.getRandomValues(userId);

  try {
    const credential = (await navigator.credentials.create({
      publicKey: {
        challenge,
        rp: { name: "Elazar OS — Gary" },
        user: {
          id: userId,
          name: "elazar",
          displayName: "Elazar Greisman",
        },
        pubKeyCredParams: [
          { type: "public-key", alg: -7 },
          { type: "public-key", alg: -257 },
        ],
        timeout: 60000,
        attestation: "none",
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          userVerification: "required",
          residentKey: "preferred",
        },
      },
    })) as PublicKeyCredential | null;

    if (!credential) return null;
    const rawId = new Uint8Array(credential.rawId);
    return btoa(String.fromCharCode(...rawId));
  } catch {
    return null;
  }
}

async function unlockWithGaryBiometric(): Promise<boolean> {
  if (typeof window === "undefined" || !("PublicKeyCredential" in window)) return false;
  const stored = getGaryCredId();
  if (!stored) return false;

  const rawId = Uint8Array.from(atob(stored), (c) => c.charCodeAt(0));
  const challenge = new Uint8Array(32);
  crypto.getRandomValues(challenge);

  try {
    const assertion = await navigator.credentials.get({
      publicKey: {
        challenge,
        timeout: 60000,
        rpId: window.location.hostname,
        userVerification: "required",
        allowCredentials: [
          { id: rawId, type: "public-key", transports: ["internal"] },
        ],
      },
    });
    return Boolean(assertion);
  } catch {
    return false;
  }
}

type ModalPhase =
  | "idle"
  | "setup-password"
  | "setup-register"
  | "unlock"
  | "success-gag"
  | "failed";

function GaryPrivateGateModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: (result: "success" | "failed" | "cancelled") => void;
}) {
  const [phase, setPhase] = useState<ModalPhase>("idle");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [bioAvailable, setBioAvailable] = useState(false);

  useEffect(() => {
    if (!open) {
      setPhase("idle");
      setPassword("");
      setError("");
      setBusy(false);
      return;
    }

    void isPlatformBiometricAvailable().then((ok) => {
      setBioAvailable(ok);
      if (isGaryBiometricEnabled()) {
        setPhase("unlock");
      } else {
        setPhase("setup-password");
      }
    });
  }, [open]);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== GARY_SETUP_PASSWORD) {
      setError("Incorrect password.");
      return;
    }
    if (!bioAvailable) {
      setError("This device does not support Face ID / Touch ID.");
      return;
    }
    setPhase("setup-register");
    setBusy(true);
    const credId = await registerGaryBiometric();
    setBusy(false);
    if (credId) {
      setGaryBiometricRegistered(credId);
      // After successful registration, still run the gag
      setPhase("success-gag");
    } else {
      setError("Biometric registration was cancelled or failed. Try again.");
      setPhase("setup-password");
    }
  };

  const handleUnlock = async () => {
    setBusy(true);
    setError("");
    const ok = await unlockWithGaryBiometric();
    setBusy(false);
    if (ok) {
      setPhase("success-gag");
    } else {
      setPhase("failed");
    }
  };

  if (!open || phase === "idle") return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-card border shadow-2xl rounded-2xl w-full max-w-sm overflow-hidden">
        <div className="px-6 pt-6 pb-2 text-center space-y-1">
          <p className="text-sm font-semibold text-primary">Private information locked</p>
          <p className="text-xs text-muted-foreground">
            {phase === "setup-password" || phase === "setup-register"
              ? "One-time setup required"
              : "Owner verification required"}
          </p>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* SETUP: password */}
          {phase === "setup-password" && (
            <form onSubmit={handlePasswordSubmit} className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="gary-setup-pw" className="text-sm">
                  Enter setup password
                </Label>
                <div className="relative">
                  <Input
                    id="gary-setup-pw"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    autoComplete="current-password"
                    autoFocus
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                    aria-label={showPassword ? "Hide" : "Show"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <Button type="submit" className="w-full" disabled={busy || !password}>
                <Lock className="mr-2 h-4 w-4" />
                Continue to Face ID setup
              </Button>
            </form>
          )}

          {/* SETUP: registering biometric */}
          {phase === "setup-register" && (
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-2 border-primary/30 flex items-center justify-center">
                  <Fingerprint className="w-10 h-10 text-primary animate-pulse" />
                </div>
                <div className="absolute inset-0 rounded-full border-2 border-t-primary border-transparent animate-spin" />
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Follow the prompt to register your Face ID / Touch ID…
              </p>
            </div>
          )}

          {/* UNLOCK with existing biometric */}
          {phase === "unlock" && (
            <div className="space-y-4">
              <div className="flex flex-col items-center gap-3 py-2">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Fingerprint className="w-8 h-8 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Use Face ID / Touch ID to unlock private details
                </p>
              </div>
              {error && <p className="text-sm text-red-600 text-center">{error}</p>}
              <Button className="w-full" onClick={handleUnlock} disabled={busy}>
                <Fingerprint className="mr-2 h-4 w-4" />
                {busy ? "Authenticating…" : "Use Face ID"}
              </Button>
            </div>
          )}

          {/* SUCCESS GAG — biometric worked but still no data */}
          {phase === "success-gag" && (
            <div className="flex flex-col items-center gap-4 py-2 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-emerald-600" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-primary">Identity verified</p>
                <p className="text-xs text-muted-foreground">
                  Nice try. Even authenticated, Gary still doesn’t hand out private details.
                </p>
              </div>
              <Button className="w-full" onClick={() => onClose("success")}>
                OK
              </Button>
            </div>
          )}

          {/* FAILED */}
          {phase === "failed" && (
            <div className="flex flex-col items-center gap-4 py-2 text-center">
              <div className="w-16 h-16 rounded-full bg-red-500/10 border-2 border-red-500/40 flex items-center justify-center">
                <ShieldX className="w-8 h-8 text-red-500" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-red-600">Verification failed</p>
                <p className="text-xs text-muted-foreground">Access denied</p>
              </div>
              <Button variant="outline" className="w-full" onClick={() => onClose("failed")}>
                OK
              </Button>
            </div>
          )}
        </div>

        {phase !== "success-gag" && phase !== "failed" && phase !== "setup-register" && (
          <div className="px-6 pb-5">
            <Button
              variant="ghost"
              className="w-full text-muted-foreground"
              onClick={() => onClose("cancelled")}
              disabled={busy}
            >
              Cancel
            </Button>
          </div>
        )}
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
  const [showGate, setShowGate] = useState(false);
  const pendingPrivateRef = useRef<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const prevModeRef = useRef(mode);

  useEffect(() => {
    if (fullPage || initialMode) return;
    const detected = detectModeFromPath(location);
    setMode(detected);
  }, [location, fullPage, initialMode]);

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

  const handleGateClose = useCallback((result: "success" | "failed" | "cancelled") => {
    setShowGate(false);
    const text = pendingPrivateRef.current;
    pendingPrivateRef.current = null;
    if (!text) return;

    let reply: string;
    if (result === "success") {
      reply =
        "Identity verified ✓\n\nNice try. Even with Face ID, that information stays private. Gary doesn’t hand out personal contact details.";
    } else if (result === "failed") {
      reply =
        "Biometric verification failed. Access denied. That information is locked to Elazar only.";
    } else {
      reply = "Verification cancelled. That information remains locked.";
    }

    setMessages((prev) => {
      const last = prev[prev.length - 1];
      const alreadyHasUser = last?.role === "user" && last.content === text;
      const base = alreadyHasUser ? prev : [...prev, { role: "user" as const, content: text }];
      return [...base, { role: "assistant" as const, content: reply }];
    });
  }, []);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    if (isPrivateQuery(text)) {
      setInput("");
      pendingPrivateRef.current = text;
      setMessages((prev) => [
        ...prev,
        { role: "user", content: text },
        {
          role: "assistant",
          content:
            "That information is protected.\n\nUse Face ID to unlock (owner verification required).",
        },
      ]);
      setShowGate(true);
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
          disabled={loading || showGate}
          className="flex-1 rounded-xl border bg-background px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50"
        />
        <Button
          size="icon"
          className="rounded-xl shrink-0"
          onClick={sendMessage}
          disabled={loading || !input.trim() || showGate}
          aria-label="Send"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {fullPage ? (
        chatPanel
      ) : (
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
      )}
      <GaryPrivateGateModal open={showGate} onClose={handleGateClose} />
    </>
  );
}
