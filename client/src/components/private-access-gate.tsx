import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Fingerprint, Lock, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authenticatePrivateAccess, clearPrivateAccessAuthorization, isPrivateAccessAuthorized, isTrustedDevice } from "@/lib/privacy";

type PrivateAccessGateProps = {
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
};

export function PrivateAccessGate({
  children,
  title = "Private access",
  description = "Use the approved credentials to unlock sensitive information.",
  className = "",
}: PrivateAccessGateProps) {
  const [authorized, setAuthorized] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  const [biometricSupported, setBiometricSupported] = useState(false);
  const [biometricBusy, setBiometricBusy] = useState(false);
  const [trustedDeviceActive, setTrustedDeviceActive] = useState(false);
  const [biometricMessage, setBiometricMessage] = useState("Secure biometric unlock for supported devices.");

  useEffect(() => {
    setReady(true);
    const trusted = isTrustedDevice();
    setTrustedDeviceActive(trusted);
    setAuthorized(isPrivateAccessAuthorized());

    if (typeof window !== "undefined" && "PublicKeyCredential" in window) {
      void window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable().then((available) => {
        setBiometricSupported(available);
      });
    }
  }, []);

  const biometricLabel = useMemo(() => {
    if (biometricSupported) {
      return "Unlock with Face ID / Touch ID";
    }
    return "Biometric unlock unavailable";
  }, [biometricSupported]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (authenticatePrivateAccess(username, password)) {
      setAuthorized(true);
      setTrustedDeviceActive(true);
      setError("");
      setBiometricMessage("Private details unlocked. This device is now trusted for secure future access.");
    } else {
      setError("Invalid username or password.");
    }
  };

  const handleBiometricUnlock = async () => {
    if (typeof window === "undefined" || !("PublicKeyCredential" in window) || !window.PublicKeyCredential) {
      setError("Biometric unlock is not available in this browser.");
      return;
    }

    if (!biometricSupported) {
      setError("This device does not currently support platform biometrics.");
      return;
    }

    setBiometricBusy(true);
    setError("");
    setBiometricMessage("Preparing secure biometric unlock...");

    try {
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);

      const publicKeyCredential = await navigator.credentials.get({
        publicKey: {
          challenge,
          timeout: 60000,
          rpId: window.location.hostname,
          userVerification: "preferred",
          allowCredentials: [],
          authenticatorSelection: {
            userVerification: "preferred",
          },
        },
      });

      if (publicKeyCredential) {
        authenticatePrivateAccess("Elazar", "12Crazy34!");
        setAuthorized(true);
        setTrustedDeviceActive(true);
        setBiometricMessage("Face ID verification succeeded. Private details are now available.");
        window.localStorage.setItem("private-access-biometric", "enabled");
      } else {
        setError("Biometric unlock was cancelled.");
      }
    } catch (biometricError) {
      const message = biometricError instanceof Error ? biometricError.message : "Biometric unlock failed.";
      setError(message);
      setBiometricMessage("Biometric unlock was not completed.");
    } finally {
      setBiometricBusy(false);
    }
  };

  if (!ready) {
    return null;
  }

  if (authorized) {
    return <>{children}</>;
  }

  return (
    <div className={`rounded-2xl border border-dashed border-primary/20 bg-primary/5 p-4 sm:p-5 ${className}`}>
      <div className="flex items-center gap-2 text-sm font-semibold text-primary">
        <Lock className="h-4 w-4" />
        {title}
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>

      <div className="mt-4 rounded-xl border border-primary/10 bg-background/70 p-3 text-sm text-muted-foreground">
        <div className="flex items-center gap-2 font-medium text-foreground">
          <Sparkles className="h-4 w-4 text-accent" />
          Secure biometric access
        </div>
        <p className="mt-1">{biometricMessage}</p>
        {trustedDeviceActive ? (
          <div className="mt-2 flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-2 text-emerald-700 dark:text-emerald-400">
            <ShieldCheck className="h-4 w-4" />
            Trusted-device memory is active on this browser.
          </div>
        ) : null}
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <Button
          type="button"
          className="flex-1"
          onClick={handleBiometricUnlock}
          disabled={biometricBusy || !biometricSupported}
        >
          <Fingerprint className="mr-2 h-4 w-4" />
          {biometricBusy ? "Preparing..." : biometricLabel}
        </Button>
        <div className="text-xs text-muted-foreground self-center">or use the password below</div>
      </div>

      {trustedDeviceActive ? (
        <div className="mt-3 flex justify-end">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              clearPrivateAccessAuthorization();
              setTrustedDeviceActive(false);
              setBiometricMessage("Trusted-device memory cleared. You can re-authorize whenever you like.");
            }}
          >
            Clear trusted-device memory
          </Button>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <div className="space-y-2">
          <Label htmlFor="private-username" className="text-sm">Username</Label>
          <Input
            id="private-username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Elazar"
            autoComplete="username"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="private-password" className="text-sm">Password</Label>
          <Input
            id="private-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="12Crazy34!"
            autoComplete="current-password"
          />
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <Button type="submit" className="w-full">
          <ShieldCheck className="mr-2 h-4 w-4" />
          Unlock private details
        </Button>
      </form>
    </div>
  );
}
