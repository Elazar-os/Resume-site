import { useEffect } from "react";
import { useLocation } from "wouter";
import { Loader2, PauseCircle, ArrowLeft } from "lucide-react";
import { getAppById } from "@/lib/apps-config";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function AppRedirectPage() {
  const [location, setLocation] = useLocation();
  const appId = location.split('/').filter(Boolean)[0] || "";
  const app = getAppById(appId);

  useEffect(() => {
    if (app && app.active) {
      window.location.href = app.replitUrl;
    }
  }, [app]);

  // Show paused message for inactive apps
  if (app && !app.active) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full shadow-xl">
          <CardContent className="p-8">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center">
                <PauseCircle className="w-8 h-8 text-amber-600" />
              </div>
              <h2 className="text-2xl font-bold text-primary">{app.name}</h2>
              <p className="text-muted-foreground">
                {app.pausedMessage || "This app is temporarily unavailable."}
              </p>
              <Button 
                variant="outline" 
                onClick={() => setLocation("/apps")}
                className="mt-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Apps
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
