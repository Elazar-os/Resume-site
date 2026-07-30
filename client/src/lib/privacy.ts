const PRIVATE_ACCESS_CREDENTIALS = {
  username: "Elazar",
  password: "12Crazy34!",
};

const TRUSTED_DEVICE_KEY = "private-access-trusted-device";

export function authenticatePrivateAccess(username: string, password: string): boolean {
  const valid =
    username.trim().toLowerCase() === PRIVATE_ACCESS_CREDENTIALS.username.toLowerCase() &&
    password === PRIVATE_ACCESS_CREDENTIALS.password;

  if (valid && typeof window !== "undefined") {
    window.sessionStorage.setItem("private-access-authorized", "true");
    window.localStorage.setItem(TRUSTED_DEVICE_KEY, "true");
  }

  return valid;
}

export function isPrivateAccessAuthorized(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  const trustedDevice = window.localStorage.getItem(TRUSTED_DEVICE_KEY) === "true";
  const sessionAuthorized = window.sessionStorage.getItem("private-access-authorized") === "true";

  return trustedDevice || sessionAuthorized;
}

export function clearPrivateAccessAuthorization(): void {
  if (typeof window !== "undefined") {
    window.sessionStorage.removeItem("private-access-authorized");
    window.localStorage.removeItem(TRUSTED_DEVICE_KEY);
  }
}

export function isTrustedDevice(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem(TRUSTED_DEVICE_KEY) === "true";
}

export function formatPrivateContact(value: string, reveal = false): string {
  if (reveal) {
    return value;
  }

  return "Available with approved access";
}

export function formatReference(reference: string, reveal = false): string {
  if (reveal) {
    return reference;
  }

  const separatorIndex = reference.lastIndexOf(" — ");
  if (separatorIndex >= 0) {
    return `${reference.slice(0, separatorIndex)} — Available with approved access`;
  }

  return "Available with approved access";
}
