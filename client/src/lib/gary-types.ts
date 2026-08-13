export type GaryMode = "professional" | "shidduch" | "full";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export const MODE_LABELS: Record<GaryMode, string> = {
  professional: "Professional",
  shidduch: "Shidduch",
  full: "Full Access",
};

export function detectModeFromPath(path: string): GaryMode {
  if (path.startsWith("/shidduch") || path.startsWith("/jswipe")) return "shidduch";
  if (path.startsWith("/combined")) return "full";
  return "full"; // default is now Full Access
}

export function modeFromQuery(search: string): GaryMode | null {
  const params = new URLSearchParams(search.replace(/^\?/, ""));
  const m = params.get("mode");
  if (m === "shidduch" || m === "full" || m === "professional") return m;
  return null;
}
