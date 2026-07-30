/**
 * Privacy access utilities for the references contact page.
 *
 * IMPORTANT: This is a CLIENT-SIDE convenience gate only — NOT server-verified
 * authentication. The reference data is bundled in the static app build, so a
 * determined visitor could still find it. This gate is appropriate for deterring
 * casual visitors, NOT for protecting genuinely sensitive data.
 */

const SESSION_KEY = "references-access-authorized";

// localStorage keys for biometric registration (NOT for authorization).
// Biometric being "enabled" only means a WebAuthn credential has been registered
// on this device. Authorization still requires a successful navigator.credentials.get()
// call each session.
const BIOMETRIC_ENABLED_KEY = "references-biometric-enabled";
const BIOMETRIC_CRED_ID_KEY = "references-biometric-cred-id";

/**
 * The passcode is read from the Vite environment variable at build time.
 * It must NOT be hardcoded in source. Set VITE_REFERENCES_PASSCODE in your
 * .env file locally and as a GitHub Actions secret for production builds.
 */
const PASSCODE = import.meta.env.VITE_REFERENCES_PASSCODE;

// ---------------------------------------------------------------------------
// Passcode authentication
// ---------------------------------------------------------------------------

export function authenticateWithPasscode(passcode: string): boolean {
  const valid = Boolean(PASSCODE) && passcode === PASSCODE;

  if (valid && typeof window !== "undefined") {
    window.sessionStorage.setItem(SESSION_KEY, "true");
  }

  return valid;
}

// ---------------------------------------------------------------------------
// Session authorization (sessionStorage only — per-tab, cleared on close)
// ---------------------------------------------------------------------------

export function isAccessAuthorized(): boolean {
  if (typeof window === "undefined") return false;
  return window.sessionStorage.getItem(SESSION_KEY) === "true";
}

export function clearAuthorization(): void {
  if (typeof window !== "undefined") {
    window.sessionStorage.removeItem(SESSION_KEY);
  }
}

// ---------------------------------------------------------------------------
// Biometric (WebAuthn) registration state — stored in localStorage so it
// persists across sessions, but does NOT grant authorization on its own.
// ---------------------------------------------------------------------------

export function isBiometricEnabled(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(BIOMETRIC_ENABLED_KEY) === "true";
}

export function getStoredCredentialId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(BIOMETRIC_CRED_ID_KEY);
}

export function setBiometricRegistered(credentialId: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(BIOMETRIC_ENABLED_KEY, "true");
  window.localStorage.setItem(BIOMETRIC_CRED_ID_KEY, credentialId);
}

export function clearBiometric(): void {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(BIOMETRIC_ENABLED_KEY);
    window.localStorage.removeItem(BIOMETRIC_CRED_ID_KEY);
  }
}

export async function isBiometricSupported(): Promise<boolean> {
  if (typeof window === "undefined" || !("PublicKeyCredential" in window)) {
    return false;
  }
  try {
    return await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Formatting helpers (used by existing pages to mask/unmask data)
// ---------------------------------------------------------------------------

export function formatPrivateContact(value: string, reveal = false): string {
  return reveal ? value : "Available with approved access";
}

export function formatReference(reference: string, reveal = false): string {
  if (reveal) return reference;

  const separatorIndex = reference.lastIndexOf(" — ");
  if (separatorIndex >= 0) {
    return `${reference.slice(0, separatorIndex)} — Available with approved access`;
  }

  return "Available with approved access";
}

// ---------------------------------------------------------------------------
// Backward-compatible exports (existing pages import these)
// ---------------------------------------------------------------------------

/** @deprecated Use isAccessAuthorized() instead */
export function isPrivateAccessAuthorized(): boolean {
  return isAccessAuthorized();
}

/** @deprecated Use authenticateWithPasscode() instead */
export function authenticatePrivateAccess(_username: string, password: string): boolean {
  return authenticateWithPasscode(password);
}

/** @deprecated Use clearAuthorization() instead */
export function clearPrivateAccessAuthorization(): void {
  clearAuthorization();
}

/** @deprecated Use isBiometricEnabled() instead */
export function isTrustedDevice(): boolean {
  // NOTE: Previously this returned true if localStorage had a trusted-device flag,
  // which auto-authorized without any credential check. Now it only reports whether
  // biometric registration exists — it does NOT grant access.
  return isBiometricEnabled();
}
