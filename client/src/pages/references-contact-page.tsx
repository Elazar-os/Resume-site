import { motion } from "framer-motion";
import { Phone, Mail, User, Lock, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { TopNavigation } from "@/components/top-navigation";
import { PrivateAccessGate } from "@/components/private-access-gate";
import { SHIDDUCH_DATA, RESUME_DATA } from "@/lib/data";

/**
 * References Contact Page
 *
 * A dedicated, passcode-gated page that reveals full contact details for
 * references. The data is shown only after the PrivateAccessGate verifies
 * the passcode (or biometric) for the current session.
 *
 * NOTE: This is a client-side convenience gate — see private-access-gate.tsx
 * for the full security disclaimer.
 */
export default function ReferencesContactPage() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <TopNavigation />

      <div className="max-w-2xl mx-auto px-5 py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Back link */}
          <div className="mb-6">
            <Button variant="ghost" size="sm" asChild>
              <a href="#/combined">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to profile
              </a>
            </Button>
          </div>

          <Card className="shadow-lg border-none bg-card">
            <CardContent className="p-6 md:p-10">
              {/* Header */}
              <div className="space-y-3 text-center mb-8">
                <div className="flex items-center justify-center gap-2">
                  <Lock className="h-5 w-5 text-primary" />
                  <h1 className="text-2xl md:text-3xl font-bold font-heading text-primary">
                    References & Contact Details
                  </h1>
                </div>
                <p className="text-sm text-muted-foreground">
                  This page contains private reference contact information.
                  Enter the passcode to view the full details.
                </p>
              </div>

              {/* Gated content — only visible after passcode/biometric verification */}
              <PrivateAccessGate
                title="Authorized access required"
                description="Enter the passcode provided to you to reveal full reference contact details."
              >
                {/* Personal contact */}
                <section className="space-y-3">
                  <h2 className="text-lg font-bold text-primary uppercase tracking-wide border-b pb-2">
                    Personal Contact
                  </h2>
                  <div className="space-y-2 text-base">
                    <p className="flex items-center gap-2 text-muted-foreground">
                      <User className="h-4 w-4 text-primary/60" />
                      <span className="font-medium text-foreground">{SHIDDUCH_DATA.basics.name}</span>
                    </p>
                    <p className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4 text-primary/60" />
                      <a href={`tel:${SHIDDUCH_DATA.basics.phone}`} className="hover:underline">
                        {SHIDDUCH_DATA.basics.phone}
                      </a>
                    </p>
                    <p className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4 text-primary/60" />
                      <a href={`mailto:${SHIDDUCH_DATA.basics.email}`} className="hover:underline">
                        {SHIDDUCH_DATA.basics.email}
                      </a>
                    </p>
                  </div>
                </section>

                <Separator className="my-6" />

                {/* Occupation reference */}
                <section className="space-y-3">
                  <h2 className="text-lg font-bold text-primary uppercase tracking-wide border-b pb-2">
                    Employer Reference
                  </h2>
                  <div className="space-y-1 text-base">
                    <p className="font-medium text-primary">{SHIDDUCH_DATA.occupation.title}</p>
                    <p className="text-muted-foreground">{SHIDDUCH_DATA.occupation.reference}</p>
                  </div>
                </section>

                <Separator className="my-6" />

                {/* Full references list */}
                <section className="space-y-3">
                  <h2 className="text-lg font-bold text-primary uppercase tracking-wide border-b pb-2">
                    Character References
                  </h2>
                  <ul className="space-y-3 text-base text-muted-foreground">
                    {SHIDDUCH_DATA.references.map((ref, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-primary/40 font-bold text-sm mt-0.5">{i + 1}.</span>
                        <span>{ref}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <Separator className="my-6" />

                {/* Resume contact info */}
                <section className="space-y-3">
                  <h2 className="text-lg font-bold text-primary uppercase tracking-wide border-b pb-2">
                    Resume Contact
                  </h2>
                  <div className="space-y-2 text-base text-muted-foreground">
                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-primary/60" />
                      <a href={`tel:${RESUME_DATA.personalInfo.phone}`} className="hover:underline">
                        {RESUME_DATA.personalInfo.phone}
                      </a>
                    </p>
                    <p className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-primary/60" />
                      <a href={`mailto:${RESUME_DATA.personalInfo.email}`} className="hover:underline">
                        {RESUME_DATA.personalInfo.email}
                      </a>
                    </p>
                  </div>
                </section>
              </PrivateAccessGate>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
