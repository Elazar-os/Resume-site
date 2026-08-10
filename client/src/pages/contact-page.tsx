import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle2, Loader2, AlertCircle, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { TopNavigation } from "@/components/top-navigation";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 24, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 40, damping: 12 },
  },
};

// Public form key — restrict this key to your domain in the Web3Forms dashboard
const WEB3FORMS_KEY = "069c632f-2df7-4f2d-8ffb-767be8d1d12e";

const RATE_LIMIT_KEY = "elazaros_contact_submissions";
const RATE_LIMIT_MAX = 3; // max submissions
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // per 1 hour

function checkRateLimit(): { allowed: boolean; retryAfterMinutes?: number } {
  try {
    const raw = localStorage.getItem(RATE_LIMIT_KEY);
    const now = Date.now();
    const timestamps: number[] = raw ? JSON.parse(raw) : [];
    const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

    if (recent.length >= RATE_LIMIT_MAX) {
      const oldest = Math.min(...recent);
      const retryAfterMinutes = Math.ceil(
        (RATE_LIMIT_WINDOW_MS - (now - oldest)) / 60000
      );
      return { allowed: false, retryAfterMinutes };
    }
    return { allowed: true };
  } catch {
    return { allowed: true };
  }
}

function recordSubmission() {
  try {
    const raw = localStorage.getItem(RATE_LIMIT_KEY);
    const now = Date.now();
    const timestamps: number[] = raw ? JSON.parse(raw) : [];
    const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
    recent.push(now);
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(recent));
  } catch {
    // ignore storage errors
  }
}

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  // Honeypot — bots fill this; humans never see it
  const [botField, setBotField] = useState("");
  const [status, setStatus] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    // Honeypot: if filled, pretend success and do nothing
    if (botField.trim() !== "") {
      setStatus("sent");
      return;
    }

    const rate = checkRateLimit();
    if (!rate.allowed) {
      setStatus("error");
      setErrorMsg(
        `Too many messages. Please try again in about ${rate.retryAfterMinutes} minute${rate.retryAfterMinutes === 1 ? "" : "s"}.`
      );
      return;
    }

    setStatus("sending");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          name,
          email,
          subject: subject || "Contact from Elazar OS",
          message,
          from_name: "Elazar OS Contact Form",
          // Web3Forms also supports botcheck if configured in dashboard
          botcheck: botField,
        }),
      });

      const data = await response.json();

      if (data.success) {
        recordSubmission();
        setStatus("sent");
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
        setBotField("");
      } else {
        setStatus("error");
        setErrorMsg(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Could not send the message. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <TopNavigation />

      <div className="max-w-xl mx-auto px-5 py-12 md:py-20">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-10"
        >
          <motion.div variants={itemVariants} className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading tracking-tight text-foreground">
              Start the Conversation.
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
              Have an idea, opportunity, or project in mind? Send a message below — I'll get back to you as soon as I can.
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            {status === "sent" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 40, damping: 12 }}
                className="text-center py-16 space-y-5"
              >
                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>
                <h3
                  className="text-2xl font-bold text-foreground"
                  data-testid="text-success"
                >
                  Message Sent.
                </h3>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  Thanks for reaching out. I'll get back to you as soon as I can.
                </p>
                <div className="pt-6">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setStatus("idle")}
                    className="rounded-full px-8"
                    data-testid="button-send-another"
                  >
                    Send Another Message
                  </Button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-7">
                {/* Honeypot — hidden from real users */}
                <div
                  className="absolute -left-[9999px] opacity-0 h-0 w-0 overflow-hidden"
                  aria-hidden="true"
                >
                  <label htmlFor="website">Website</label>
                  <input
                    id="website"
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={botField}
                    onChange={(e) => setBotField(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-sm font-medium text-foreground"
                  >
                    Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={status === "sending"}
                    className="h-12 bg-muted/40 border-border/50 focus:border-primary transition-colors"
                    data-testid="input-name"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-foreground"
                  >
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={status === "sending"}
                    className="h-12 bg-muted/40 border-border/50 focus:border-primary transition-colors"
                    data-testid="input-email"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="subject"
                    className="text-sm font-medium text-foreground"
                  >
                    Subject
                  </Label>
                  <Input
                    id="subject"
                    type="text"
                    placeholder="What's this about?"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    disabled={status === "sending"}
                    className="h-12 bg-muted/40 border-border/50 focus:border-primary transition-colors"
                    data-testid="input-subject"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="message"
                    className="text-sm font-medium text-foreground"
                  >
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Tell me what you have in mind..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={6}
                    className="resize-none bg-muted/40 border-border/50 focus:border-primary transition-colors"
                    disabled={status === "sending"}
                    data-testid="input-message"
                  />
                </div>

                {status === "error" && (
                  <div
                    className="flex items-center gap-2 text-sm text-red-600 bg-red-50 dark:bg-red-950/30 p-3 rounded-lg"
                    data-testid="text-error"
                  >
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {errorMsg}
                  </div>
                )}

                <div className="space-y-4 pt-2">
                  <Button
                    type="submit"
                    className="w-full h-13 text-base font-semibold rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200"
                    size="lg"
                    disabled={status === "sending"}
                    data-testid="button-submit-contact"
                  >
                    {status === "sending" ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1.5">
                    <Lock className="w-3 h-3" />
                    Your information is private and will never be shared.
                  </p>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
