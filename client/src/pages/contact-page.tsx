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
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 24, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 40, damping: 12 }
  }
};

const CONTACT_EMAIL = "Elazar.greisman@outlook.com";
const WEB3FORMS_KEY = "069c632f-2df7-4f2d-8ffb-767be8d1d12e";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

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
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus("sent");
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
      } else {
        setStatus("error");
        setErrorMsg(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Could not send the message. Please try again or email directly.");
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
              Have an idea, opportunity, or project in mind? Send a message below and I'll personally respond within 24 hours.
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
                <h3 className="text-2xl font-bold text-foreground" data-testid="text-success">Message Sent.</h3>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  Thanks for reaching out. I'll get back to you within 24 hours.
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
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-foreground">
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
                  <Label htmlFor="email" className="text-sm font-medium text-foreground">
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
                  <Label htmlFor="subject" className="text-sm font-medium text-foreground">
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
                  <Label htmlFor="message" className="text-sm font-medium text-foreground">
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
                  <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 dark:bg-red-950/30 p-3 rounded-lg" data-testid="text-error">
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

          <motion.div variants={itemVariants} className="text-center pt-2">
            <p className="text-sm text-muted-foreground">
              Prefer email?{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-primary font-medium hover:underline underline-offset-4"
                data-testid="link-footer-email"
              >
                {CONTACT_EMAIL}
              </a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
