import { useState, useRef, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import {
  MessageCircle,
  Plus,
  X,
  Send,
  Fingerprint,
  BriefcaseBusiness,
  Heart,
  Shield,
  Check,
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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  type GaryMode,
  type ChatMessage,
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

const SCOPE_OPTIONS: Array<{
  mode: GaryMode;
  label: string;
  description: string;
  icon: typeof BriefcaseBusiness;
}> = [
  {
    mode: "professional",
    label: "Professional",
    description: "Work, projects, skills, and career background.",
    icon: BriefcaseBusiness,
  },
  {
    mode: "shidduch",
    label: "Shidduch",
    description: "Personality, values, relationships, and life.",
    icon: Heart,
  },
  {
    mode: "full",
    label: "Full Access",
    description: "A broader view of Elazar, personal and professional.",
    icon: Shield,
  },
];

const loadingPhrases = [
  "Thinking it through...",
  "Pulling that together...",
  "One sec...",
  "Let me think on that...",
  "Working on it...",
  "Give me a beat...",
  "Piecing that together...",
  "Just a moment...",
];

const SUGGESTED_QUESTIONS: Record<GaryMode, string[]> = {
  professional: [
    "What does he do at King of Delancey?",
    "What has he built?",
    "How did he learn to code?",
  ],
  shidduch: [
    "What's he like as a person?",
    "What matters to him?",
    "What does he do for fun?",
  ],
  full: [
    "Tell me about his work",
    "What's his personality like?",
    "What's important to him?",
  ],
};

type UIMessage = ChatMessage & {
  timing?: { model: string; timingMs: number };
};

function GaryAvatar() {
  return (
    <div className={cn(
      "w-7 h-7 shrink-0 rounded-full overflow-hidden shadow-sm"
    )}>
      <img src="/gary-favicon.svg" alt="" className="w-full h-full object-cover" />
    </div>
  );
}

function playPopSound() {
  if (typeof window === "undefined" || (!(window.AudioContext) && !(window as any).webkitAudioContext)) return;
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(520, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(720, ctx.currentTime + 0.07);
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.045, ctx.currentTime + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.09);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
    window.setTimeout(() => void ctx.close(), 180);
  } catch {}
}

function playReplyChime() {
  if (typeof window === "undefined" || (!(window.AudioContext) && !(window as any).webkitAudioContext)) return;
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    [660, 880].forEach((frequency, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = now + index * 0.09;
      osc.type = "sine";
      osc.frequency.setValueAtTime(frequency, start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.04, start + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.16);
      osc.connect(gain).connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.17);
    });
    window.setTimeout(() => void ctx.close(), 420);
  } catch {}
}

function buzz(duration = 12) {
  try {
    if ("vibrate" in navigator) navigator.vibrate(duration);
  } catch {}
}

/** SHA-256 digest of the one-time setup password; plaintext is not stored in the client bundle. */
const GARY_SETUP_PASSWORD_HASH = "3122572bc12b28d2117cf015eb0e4b5959d00be20429a60448c6de54cdbbf531";

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
    const digest = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(password),
    );
    const hash = Array.from(new Uint8Array(digest))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
    if (hash !== GARY_SETUP_PASSWORD_HASH) {
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
          <p className="text-sm font-semibold text-primary">I have that information</p>
          <p className="text-xs text-muted-foreground">
            {phase === "setup-password" || phase === "setup-register"
              ? "Owner setup required to release it"
              : "Unlock required to release it"}
          </p>
        </div>

        <div className="px-6 py-5 space-y-4">
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

          {phase === "unlock" && (
            <div className="space-y-4">
              <div className="flex flex-col items-center gap-3 py-2">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Fingerprint className="w-8 h-8 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Use Face ID to unlock and release this information
                </p>
              </div>
              {error && <p className="text-sm text-red-600 text-center">{error}</p>}
              <Button className="w-full" onClick={handleUnlock} disabled={busy}>
                <Fingerprint className="mr-2 h-4 w-4" />
                {busy ? "Authenticating…" : "Use Face ID to unlock"}
              </Button>
            </div>
          )}

          {phase === "success-gag" && (
            <div className="flex flex-col items-center gap-4 py-2 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-emerald-600" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-primary">Unlocked</p>
                <p className="text-xs text-muted-foreground">
                  Identity confirmed. Still not sharing it — some things stay between me and Elazar.
                </p>
              </div>
              <Button className="w-full" onClick={() => onClose("success")}>
                OK
              </Button>
            </div>
          )}

          {phase === "failed" && (
            <div className="flex flex-col items-center gap-4 py-2 text-center">
              <div className="w-16 h-16 rounded-full bg-red-500/10 border-2 border-red-500/40 flex items-center justify-center">
                <ShieldX className="w-8 h-8 text-red-500" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-red-600">Couldn’t verify</p>
                <p className="text-xs text-muted-foreground">
                  I have the info, but I’m not releasing it without the owner.
                </p>
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
  const [messages, setMessages] = useState<UIMessage[]>(() => [
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
  const [loadingPhrase, setLoadingPhrase] = useState(loadingPhrases[0]);
  const [showGate, setShowGate] = useState(false);
  const [scopeOpen, setScopeOpen] = useState(false);
  const pendingPrivateRef = useRef<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const prevModeRef = useRef(mode);
  const generationStartedAtRef = useRef<number | null>(null);

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
    if (open) {
      document.body.classList.add("gary-panel-open");
      chatScrollRef.current?.scrollTo({ top: 0, behavior: "auto" });
      inputRef.current?.focus();
      window.dispatchEvent(new Event("gary-open"));
    } else {
      document.body.classList.remove("gary-panel-open");
    }

    return () => {
      document.body.classList.remove("gary-panel-open");
    };
  }, [open]);

  useEffect(() => {
    const closeGary = () => setOpen(false);
    window.addEventListener("nav-open", closeGary);
    return () => window.removeEventListener("nav-open", closeGary);
  }, []);

  useEffect(() => {
    const favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!favicon) return;

    const previousHref = favicon.getAttribute("href");
    const previousType = favicon.getAttribute("type");
    favicon.setAttribute("href", "/gary-favicon.svg");
    favicon.setAttribute("type", "image/svg+xml");

    return () => {
      if (previousHref) favicon.setAttribute("href", previousHref);
      if (previousType) favicon.setAttribute("type", previousType);
    };
  }, []);

  const handleGateClose = useCallback((result: "success" | "failed" | "cancelled") => {
    setShowGate(false);
    const text = pendingPrivateRef.current;
    pendingPrivateRef.current = null;
    if (!text) return;

    let reply: string;
    if (result === "success") {
      reply =
        "Unlocked ✓\n\nI have it — but I’m still not sharing. Some things stay between me and Elazar.";
    } else if (result === "failed") {
      reply =
        "Couldn’t verify you.\n\nI do have that information, but I’m not releasing it without the owner.";
    } else {
      reply =
        "Cancelled.\n\nI have the information, but it stays locked unless the owner unlocks it.";
    }

    setMessages((prev) => {
      const last = prev[prev.length - 1];
      // The previous assistant message was the "I have it / use Face ID" one — replace the flow cleanly
      const alreadyHasUser = prev.some((m) => m.role === "user" && m.content === text);
      const base = alreadyHasUser ? prev : [...prev, { role: "user" as const, content: text }];
      return [...base, { role: "assistant" as const, content: reply }];
    });
  }, []);

  async function sendMessage(prefilledText?: string) {
    const text = (prefilledText ?? input).trim();
    if (!text || loading) return;

    playPopSound();
    buzz(12);

    if (isPrivateQuery(text)) {
      setInput("");
      pendingPrivateRef.current = text;
      setMessages((prev) => [
        ...prev,
        { role: "user", content: text },
        {
          role: "assistant",
          content:
            "I have that information.\\n\\nI’m not allowed to share it unless the owner unlocks it with Face ID.",
        },
      ]);
      setShowGate(true);
      return;
    }

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    generationStartedAtRef.current = performance.now();

    try {
      const res = await fetch("/api/gary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages, mode }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      const elapsed = performance.now() - (generationStartedAtRef.current ?? performance.now());
      const waitFor = Math.max(0, 400 - elapsed);
      if (waitFor > 0) await new Promise((resolve) => window.setTimeout(resolve, waitFor));

      const timing =
        data.model && typeof data.timingMs === "number"
          ? { model: data.model, timingMs: data.timingMs }
          : undefined;

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply || "Sorry, I didn’t get a response.", timing },
      ]);
      buzz(18);
      playReplyChime();
    } catch {
      const elapsed = performance.now() - (generationStartedAtRef.current ?? performance.now());
      const waitFor = Math.max(0, 400 - elapsed);
      if (waitFor > 0) await new Promise((resolve) => window.setTimeout(resolve, waitFor));
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong reaching the server. Please try again in a moment.",
        },
      ]);
      buzz(18);
      playReplyChime();
    } finally {
      generationStartedAtRef.current = null;
      setLoading(false);
    }
  }

  function startNewChat() {
    setMessages([welcomeFor(mode)]);
    setInput("");
    setLoading(false);
    setScopeOpen(false);
    inputRef.current?.focus();
  }

  function selectMode(nextMode: GaryMode) {
    setScopeOpen(false);
    if (nextMode !== mode) setMode(nextMode);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  const currentScope = SCOPE_OPTIONS.find((option) => option.mode === mode) ?? SCOPE_OPTIONS[2];

  const chatPanel = (
    <div
      className={cn(
        "flex flex-col bg-[#0b0d12] text-white border border-white/10 shadow-2xl overflow-hidden",
        fullPage
          ? "fixed inset-0 z-[60] w-full h-[100dvh] rounded-none border-0"
          : "fixed inset-0 z-[60] w-full h-[100dvh] rounded-none border-0"
      )}
    >
      <div className="flex items-center justify-end gap-1 px-3 py-2 border-b border-white/10 bg-[#0b0d12]">
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => setScopeOpen(true)}
              className="max-w-[150px] inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.07] px-3 py-1.5 text-xs font-semibold text-white/85 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition hover:bg-white/[0.1] hover:text-white focus:outline-none focus:border-white/25 focus:ring-2 focus:ring-[#6b7cff]/30"
              aria-label="Choose Gary scope"
            >
              <span className="truncate">{currentScope.label}</span>
            </button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={startNewChat}
              aria-label="Start new chat"
              title="New chat"
            >
              <Plus className="w-4 h-4" />
            </Button>
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

      <div ref={chatScrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-[#0b0d12]">
        {messages.map((msg, i) => {
          const isGary = msg.role === "assistant";
          const showGaryAvatar = isGary && (i === 0 || messages[i - 1].role !== "assistant");
          const showSuggestions = i === 0 && isGary && messages.length === 1;

          return (
            <div key={i} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
              {isGary && (
                <div className="w-7 mr-2 shrink-0 self-start">
                  {showGaryAvatar ? <GaryAvatar /> : null}
                </div>
              )}
              <div className={cn("flex max-w-[88%] flex-col", msg.role === "user" ? "items-end" : "items-start")}>
                <div
                  className={cn(
                    "rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap shadow-sm",
                    msg.role === "user"
                      ? "bg-[#1737c8] text-white rounded-br-md"
                      : "bg-[#171a22] text-white/90 rounded-bl-md border border-white/10"
                  )}
                >
                  {msg.content}
                </div>

                {isGary && msg.timing && (
                  <div className="mt-1 px-1 text-[10px] text-muted-foreground/65">
                    {msg.timing.model.includes("gemini-3.8-flash")
                      ? "Gary Flash 3.8"
                      : msg.timing.model.includes("gemini-3.7-flash")
                      ? "Gary Flash 3.7"
                      : msg.timing.model.includes("gemini-3.6-flash")
                      ? "Gary Flash 3.6"
                      : msg.timing.model.includes("gemini-3.5-flash")
                      ? "Gary Flash 3.5"
                      : "Gary"} · {(msg.timing.timingMs / 1000).toFixed(1)}s
                  </div>
                )}

                {showSuggestions && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {SUGGESTED_QUESTIONS[mode].map((question) => (
                      <button
                        key={question}
                        type="button"
                        onClick={() => void sendMessage(question)}
                        className="rounded-full border border-white/15 bg-[#171a22] px-3 py-2 text-left text-xs font-medium text-white/80 shadow-sm transition hover:border-[#3156e8]/50 hover:bg-[#1d2230] hover:text-white active:scale-[0.98]"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex justify-start">
            <div className="w-7 mr-2 shrink-0 self-start">
              <div className="gary-generation-signal" aria-hidden="true" />
            </div>
            <div className="bg-[#171a22] rounded-2xl rounded-bl-md px-4 py-2.5 text-xs text-white/55 border border-white/10">
              {loadingPhrase}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-white/10 bg-[#0b0d12]/98 p-3 pb-4 mb-3 flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about Elazar…"
          disabled={loading || showGate}
          className="flex-1 h-10 rounded-2xl border border-white/10 bg-white/[0.07] backdrop-blur-xl px-4 text-sm text-white placeholder:text-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-[border-color,box-shadow,background-color] duration-200 focus:outline-none focus:border-white/25 focus:bg-white/[0.09] focus:ring-2 focus:ring-[#6b7cff]/35 focus:shadow-[0_0_0_1px_rgba(107,124,255,0.18),inset_0_1px_0_rgba(255,255,255,0.1)] disabled:opacity-50"
        />
        <Button
          size="icon"
          className="h-10 w-10 rounded-2xl shrink-0 bg-[#1737c8] text-white hover:bg-[#122da5]"
          onClick={() => void sendMessage()}
          disabled={loading || !input.trim() || showGate}
          aria-label="Send"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>

      <Sheet open={scopeOpen} onOpenChange={setScopeOpen}>
        <SheetContent side="bottom" className="z-[70] rounded-t-3xl border-white/10 bg-[#11141b] px-4 pb-8 pt-3 text-white">
          <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-white/20" />
          <SheetHeader className="mb-3 text-left">
            <SheetTitle className="text-base font-semibold tracking-tight text-white">Choose a Gary scope</SheetTitle>
            <SheetDescription className="text-xs text-white/50">
              A new conversation starts when you switch.
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-2">
            {SCOPE_OPTIONS.map((option) => {
              const Icon = option.icon;
              const active = option.mode === mode;
              return (
                <button
                  key={option.mode}
                  type="button"
                  onClick={() => selectMode(option.mode)}
                  className={cn(
                    "w-full flex items-center gap-3 rounded-2xl border p-3.5 text-left transition-all duration-200",
                    active
                      ? "border-[#3156e8]/55 bg-[#1737c8]/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_0_18px_rgba(49,86,232,0.12)]"
                      : "border-white/10 bg-white/[0.045] hover:border-white/20 hover:bg-white/[0.07]"
                  )}
                >
                  <span className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border",
                    active ? "border-[#6b7cff]/40 bg-[#1737c8] text-white shadow-[0_0_14px_rgba(49,86,232,0.3)]" : "border-white/10 bg-white/[0.06] text-white/55"
                  )}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-white/90">{option.label}</span>
                    <span className="block text-xs leading-relaxed text-white/50">{option.description}</span>
                  </span>
                  {active && <Check className="h-5 w-5 shrink-0 text-[#6b7cff]" />}
                </button>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );

  return (
    <>
      <style>{`
        body.gary-panel-open {
          overflow: hidden;
          background: #0b0d12 !important;
        }
        html:has(body.gary-panel-open) {
          background: #0b0d12 !important;
        }
        body.gary-panel-open > * nav,
        body.gary-panel-open > * footer {
          display: none !important;
        }

        @keyframes gary-generation-glow {
          0%, 100% { opacity: 0.18; transform: scaleX(0.7); filter: blur(2px); }
          50% { opacity: 0.58; transform: scaleX(1); filter: blur(3px); }
        }
        .gary-generation-signal {
          width: 7px;
          height: 28px;
          margin-top: 2px;
          border-radius: 999px;
          background: linear-gradient(180deg, transparent, rgba(23, 55, 200, 0.7), transparent);
          box-shadow: 0 0 10px rgba(23, 55, 200, 0.2);
          animation: gary-generation-glow 1.8s ease-in-out infinite;
        }
      `}</style>
      {fullPage ? (
        chatPanel
      ) : (
        <>
          <button
            onClick={() => {
              setOpen((v) => {
                const nextOpen = !v;
                if (nextOpen) window.dispatchEvent(new Event("gary-open"));
                return nextOpen;
              });
            }}
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
