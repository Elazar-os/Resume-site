import { useEffect } from "react";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";
import { getAppById } from "@/lib/apps-config";

export default function AppRedirectPage() {
  const [location] = useLocation();
  const appId = location.split('/').filter(Boolean)[0] || "";
  const app = getAppById(appId);

  useEffect(() => {
    if (app) {
      window.location.href = app.replitUrl;
    }
  }, [app]);

  if (!app) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-primary">App Not Found</h1>
          <p className="text-muted-foreground">The app "{appId}" doesn't exist.</p>
          <a href="#/" className="text-accent hover:underline">Go back home</a>
        </div>
      </div>
    );
  }

  const Icon = app.icon;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${app.gradient} flex items-center justify-center mx-auto shadow-lg`}>
          <Icon className="w-10 h-10 text-white" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold font-heading text-primary">
            Opening {app.name}...
          </h1>
          <p className="text-muted-foreground">
            Redirecting to {app.subdomain}
          </p>
        </div>
        <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
        <p className="text-sm text-muted-foreground">
          If you're not redirected, <a href={`https://${app.subdomain}`} className="text-accent hover:underline">click here</a>
        </p>
      </div>
    </div>
  );
}
