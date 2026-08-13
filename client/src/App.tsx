import { Switch, Route, Router as WouterRouter } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import ResumePage from "@/pages/resume-page";
import ShidduchPage from "@/pages/shidduch-page";
import CombinedPage from "@/pages/combined-page";
import LandingPage from "@/pages/landing-page";
import SmartPhotoSelector from "@/pages/photo-selector-page";
import JSwipePage from "@/pages/jswipe-page";
import AppsHubPage from "@/pages/apps-hub-page";
import AppRedirectPage from "@/pages/app-redirect-page";
import ContactPage from "@/pages/contact-page";
import ResumePDF from "@/pages/resume-pdf";
import GaryPage from "@/pages/gary-page";
import { GaryChat } from "@/components/gary-chat";
import { useState, useEffect } from "react";

// Strip query string so routes like /gary?mode=full still match /gary
function cleanHashPath(): string {
  const raw = window.location.hash.replace(/^#/, "") || "/";
  return raw.split("?")[0] || "/";
}

// Custom hook for hash-based routing
const useHashLocation = () => {
  const [loc, setLoc] = useState(cleanHashPath);

  useEffect(() => {
    const handler = () => setLoc(cleanHashPath());
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  const navigate = (to: string) => {
    window.location.hash = to;
  };

  return [loc, navigate] as [string, (to: string) => void];
};

function Router() {
  return (
    <WouterRouter hook={useHashLocation}>
      <Switch>
        <Route path="/" component={LandingPage} />
        <Route path="/resume" component={ResumePage} />
        <Route path="/shidduch" component={ShidduchPage} />
        <Route path="/combined" component={CombinedPage} />
        <Route path="/photo-selector" component={SmartPhotoSelector} />
        <Route path="/jswipe" component={JSwipePage} />
        <Route path="/apps" component={AppsHubPage} />
        <Route path="/contact" component={ContactPage} />
        <Route path="/resume-pdf" component={ResumePDF} />
        <Route path="/gary" component={GaryPage} />
        <Route path="/kod" component={AppRedirectPage} />
        <Route path="/pti" component={AppRedirectPage} />
        <Route path="/shadchan" component={AppRedirectPage} />
        <Route component={NotFound} />
      </Switch>
    </WouterRouter>
  );
}

function App() {
  const [loc] = useHashLocation();
  const onGaryPage = loc.startsWith("/gary");

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
        {!onGaryPage && <GaryChat />}
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
