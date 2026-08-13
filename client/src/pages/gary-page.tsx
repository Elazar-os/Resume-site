import { TopNavigation } from "@/components/top-navigation";
import { GaryChat } from "@/components/gary-chat";
import { modeFromQuery, type GaryMode } from "@/lib/gary-types";

export default function GaryPage() {
  const hash = window.location.hash || "";
  const queryPart = hash.includes("?") ? hash.split("?")[1] : "";
  const initialMode: GaryMode | undefined = modeFromQuery(queryPart) ?? undefined;

  return (
    <div className="min-h-screen bg-background">
      <TopNavigation />
      <div className="px-4 py-6">
        <div className="text-center mb-6 space-y-1">
          <h1 className="text-2xl font-bold text-primary">Gary</h1>
          <p className="text-sm text-muted-foreground">
            Elazar’s AI portfolio assistant. Ask anything about his background, projects, or approach.
          </p>
        </div>
        <GaryChat fullPage initialMode={initialMode} />
      </div>
    </div>
  );
}
