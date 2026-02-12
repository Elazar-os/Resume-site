import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Send, User, MessageSquare, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 50 }
  }
};

const CONTACT_EMAIL = "Elazar.greisman@outlook.com";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const mailtoSubject = encodeURIComponent(subject || "Contact from Elazar OS");
    const mailtoBody = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${message}`
    );

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${mailtoSubject}&body=${mailtoBody}`;
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <TopNavigation />

      <div className="max-w-2xl mx-auto p-4 md:p-8 lg:p-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-8"
        >
          <motion.div variants={itemVariants} className="text-center space-y-3">
            <h1 className="text-4xl md:text-5xl font-bold font-heading text-primary">
              Get in Touch
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg mx-auto">
              Have a question or want to connect? Send me a message.
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="shadow-xl border-none">
              <CardHeader className="text-center pb-2">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Mail className="w-7 h-7 text-primary" />
                </div>
                <CardTitle className="text-xl font-heading">Contact Form</CardTitle>
                <CardDescription>
                  Fill out the form below and it will open your email app to send.
                </CardDescription>
              </CardHeader>

              <CardContent>
                {sent ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8 space-y-4"
                  >
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-primary">Email App Opened</h3>
                    <p className="text-muted-foreground">
                      Your email client should have opened with the message ready to send.
                      If it didn't open, you can email me directly at:
                    </p>
                    <a
                      href={`mailto:${CONTACT_EMAIL}`}
                      className="text-primary font-medium hover:underline"
                      data-testid="link-direct-email"
                    >
                      {CONTACT_EMAIL}
                    </a>
                    <div className="pt-4">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSent(false);
                          setName("");
                          setEmail("");
                          setSubject("");
                          setMessage("");
                        }}
                        data-testid="button-send-another"
                      >
                        Send Another Message
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        Your Name
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        data-testid="input-name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        Your Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        data-testid="input-email"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject" className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-muted-foreground" />
                        Subject
                      </Label>
                      <Input
                        id="subject"
                        type="text"
                        placeholder="What's this about?"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        data-testid="input-subject"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Type your message here..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        rows={5}
                        className="resize-none"
                        data-testid="input-message"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      data-testid="button-submit-contact"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants} className="text-center">
            <p className="text-sm text-muted-foreground">
              Or email me directly at{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-primary font-medium hover:underline"
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
