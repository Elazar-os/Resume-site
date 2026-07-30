/**
 * PrivateAccessGate — a client-side passcode + optional biometric gate.
 *
 * IMPORTANT: This is a CLIENT-SIDE convenience gate, not server-verified
 * authentication. It deters casual visitors but does not provide real security.
 * The protected data is still bundled in the static app; a determined visitor
 * could bypass this gate. Use it only for low-sensitivity convenience gating.
 */

import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Fingerprint, Lock, ShieldCheck, Sparkles, X, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  authenticateWithPasscode,
  clearAuthorization,
  clearBiometric,
  isAccessAuthorized,
  isBiometricEnabled,
  isBiometricSupported,
  getStoredCredentialId,
  setBiometricRegistered,
} from "@/lib/privacy";

type PrivateAccessGateProps = {
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
};

// ----- WebAuthn helpers ----------------------------------------------------

/**
 * Register a new platform biometric credential on this device.
 * Called after the user enters the passcode and opts in to biometric unlock.
 * Returns the credential ID (base64) or null if registration fails / is cancelled.
 */
async function registerBiometric(): Promise<string | null> {
  if (typeof window === "undefined" || !("PublicKeyCredential" in window)) return null;

  const challenge = new Uint8Array(32);
  window.crypto.getRandomValues(challenge);

  const userId = new Uint8Array(16);
  window.crypto.getRandomValues(userId);

  try {
    const credential = (await navigator.credentials.create({
      publicKey: {
        challenge,
        rp: { name: "Elazar OS" },
        user: {
          id: userId,
          name: "Authorized Viewer",
          displayName: "Authorized Viewer",
        },
        pubKeyCredParams: [
          { type: "public-key", alg: -7 },   // ES256
          { type: "public-key", alg: -257 },  // RS256
        ],
        timeout: 60000,
        attestation: "none",
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          userVerification: "preferred",
          residentKey: "preferred",
        },
      },
    })) as PublicKeyCredential | null;

    if (!credential) return null;

    // Store the credential ID as base64 for later use in navigator.credentials.get()
    const rawId = new Uint8Array(credential.rawId);
    return btoa(String.fromCharCode(...rawId));
  } catch {
    return null;
  }
}

/**
 * Attempt biometric unlock using a previously registered platform credential.
 * Returns true if the biometric verification succeeded (and sets session auth).
 */
async function unlockWithBiometric(): Promise<boolean> {
  if (typeof window === "undefined" || !("PublicKeyCredential" in window)) return false;

  const storedCredId = getStoredCredentialId();
  if (!storedCredId) return false;

  // Decode the stored base64 credential ID
  const rawId = Uint8Array.from(atob(storedCredId), (c) => c.charCodeAt(0));

  const challenge = new Uint8Array(32);
  window.crypto.getRandomValues(challenge);

  try {
    const assertion = await navigator.credentials.get({
      publicKey: {
        challenge,
        timeout: 60000,
        rpId: window.location.hostname,
        userVerification: "preferred",
        allowCredentials: [
          {
            id: rawId,
            type: "public-key",
            transports: ["internal"],
          },
        ],
      },
    });

    if (assertion) {
      // Biometric verification succeeded — grant session access.
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem("references-access-authorized", "true");
      }
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

// ----- Component -----------------------------------------------------------

export function PrivateAccessGate({
  children,
  title = "Private access",
  description = "Enter the passcode to unlock sensitive information.",
  className = "",
}: PrivateAccessGateProps) {
  const [authorized, setAuthorized] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);

  // Biometric state
  const [biometricSupported, setBiometricSupported] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [biometricBusy, setBiometricBusy] = useState(false);

  // Post-passcode biometric enrollment prompt
  const [showBiometricPrompt, setShowBiometricPrompt] = useState(false);
  const [showPasscode, setShowPasscode] = useState(false);

  useEffect(() => {
    setReady(true);
    setAuthorized(isAccessAuthorized());
    setBiometricEnabled(isBiometricEnabled());

    void isBiometricSupported().then(setBiometricSupported);
  }, []);

  const biometricLabel = useMemo(() => {
    if (!biometricSupported) return "Biometric unavailable";
    if (!biometricEnabled) return "Biometric not set up";
    return "Unlock with Face ID / Touch ID";
  }, [biometricSupported, biometricEnabled]);

  // ----- Passcode submit -----
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (authenticateWithPasscode(passcode)) {
      setAuthorized(true);
      setError("");
      setPasscode("");

      // After successful passcode entry, offer biometric enrollment if:
      // 1. The device supports platform biometrics
      // 2. Biometric is not already enabled on this device
      if (biometricSupported && !biometricEnabled) {
        setShowBiometricPrompt(true);
      }
    } else {
      setError("Incorrect passcode. Please try again.");
    }
  };

  // ----- Biometric enrollment (after passcode success) -----
  const handleEnableBiometric = async () => {
    setShowBiometricPrompt(false);
    setBiometricBusy(true);
    setError("");

    const credentialId = await registerBiometric();

    if (credentialId) {
      setBiometricRegistered(credentialId);
      setBiometricEnabled(true);
    } else {
      // Registration failed or was cancelled — silently skip, user can use passcode
    }

    setBiometricBusy(false);
  };

  const handleSkipBiometric = () => {
    setShowBiometricPrompt(false);
  };

  // ----- Biometric unlock (returning visits) -----
  const handleBiometricUnlock = async () => {
    setBiometricBusy(true);
    setError("");

    const success = await unlockWithBiometric();

    if (success) {
      setAuthorized(true);
    } else {
      setError("Biometric unlock was cancelled or failed. Please enter the passcode.");
    }

    setBiometricBusy(false);
  };

  // ----- Clear biometric registration -----
  const handleClearBiometric = () => {
    clearBiometric();
    setBiometricEnabled(false);
    clearAuthorization();
    setAuthorized(false);
  };

  if (!ready) return null;

  if (authorized) {
    return (
      <>
        {children}
        {/* Option to lock again */}
        <div className="mt-4 flex justify-end">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              clearAuthorization();
              setAuthorized(false);
            }}
          >
            <Lock className="mr-2 h-3 w-3" />
            Lock again
          </Button>
        </div>
      </>
    );
  }

  // ----- Biometric enrollment prompt (shown after passcode success) -----
  if (showBiometricPrompt) {
    return (
      <div className={`rounded-2xl border border-primary/20 bg-primary/5 p-4 sm:p-5 ${className}`}>
        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
          <Sparkles className="h-4 w-4" />
          Enable Face ID / Touch ID for faster access next time?
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Your passcode worked. Would you like to register this device's biometric
          sensor so you can unlock with Face ID or Touch ID on future visits?
        </p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            className="flex-1"
            onClick={handleEnableBiometric}
            disabled={biometricBusy}
          >
            <Fingerprint className="mr-2 h-4 w-4" />
            {biometricBusy ? "Setting up..." : "Yes, enable biometric"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleSkipBiometric}
            disabled={biometricBusy}
          >
            <X className="mr-2 h-4 w-4" />
            Not now
          </Button>
        </div>
      </div>
    );
  }

  // ----- Gate (unauthorized state) -----
  return (
    <div className={`rounded-2xl border border-dashed border-primary/20 bg-primary/5 p-4 sm:p-5 ${className}`}>
      <div className="flex items-center gap-2 text-sm font-semibold text-primary">
        <Lock className="h-4 w-4" />
        {title}
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>

      {/* Biometric unlock button — only shown if biometric is enabled on this device */}
      {biometricEnabled && biometricSupported ? (
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button
            type="button"
            className="flex-1"
            onClick={handleBiometricUnlock}
            disabled={biometricBusy}
          >
            <Fingerprint className="mr-2 h-4 w-4" />
            {biometricBusy ? "Authenticating..." : biometricLabel}
          </Button>
          <div className="text-xs text-muted-foreground self-center">or enter the passcode below</div>
        </div>
      ) : null}

      {/* Biometric status info */}
      {biometricSupported && !biometricEnabled ? (
        <div className="mt-4 rounded-xl border border-primary/10 bg-background/70 p-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2 font-medium text-foreground">
            <Sparkles className="h-4 w-4 text-accent" />
            Biometric unlock available
          </div>
          <p className="mt-1">
            After entering the passcode, you can enable Face ID / Touch ID for faster access on future visits.
          </p>
        </div>
      ) : null}

      {/* Passcode form */}
      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <div className="space-y-2">
          <Label htmlFor="private-passcode" className="text-sm">Passcode</Label>
          <div className="relative">
            <Input
              id="private-passcode"
              type={showPasscode ? "text" : "password"}
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Enter passcode"
              autoComplete="current-password"
              autoFocus
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPasscode(!showPasscode)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
              aria-label={showPasscode ? "Hide passcode" : "Show passcode"}
            >
              {showPasscode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <Button type="submit" className="w-full">
          <ShieldCheck className="mr-2 h-4 w-4" />
          Unlock private details
        </Button>
      </form>

      {/* Manage biometric registration */}
      {biometricEnabled ? (
        <div className="mt-3 flex justify-end">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClearBiometric}
          >
            Clear biometric registration
          </Button>
        </div>
      ) : null}

      {/* Link to contact form for access requests */}
      <div className="mt-3 border-t border-primary/10 pt-3 text-center">
        <p className="text-xs text-muted-foreground">
          Need access?{" "}
          <a
            href="#/contact"
            className="font-medium text-primary hover:underline underline-offset-4"
          >
            Request it via the contact form
          </a>
        </p>
      </div>
    </div>
  );
}
