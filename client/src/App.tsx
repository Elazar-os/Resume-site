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
import { useState, useEffect } from "react";

// Custom hook for hash-based routing
// This ensures the app works on static hosts or servers without SPA rewrite support
const useHashLocation = () => {
  const [loc, setLoc] = useState(window.location.hash.replace(/^#/, "") || "/");
  
  useEffect(() => {
    const handler = () => setLoc(window.location.hash.replace(/^#/, "") || "/");
    
    // Subscribe to hash changes
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  const navigate = (to: string) => (window.location.hash = to);
  
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
        <Route component={NotFound} />
      </Switch>
    </WouterRouter>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
