import { useState } from "react";
import { useLocation } from "wouter";
import { Menu, X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NAV_PAGES, APPS } from "@/lib/apps-config";
import { cn } from "@/lib/utils";

export function TopNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();

  const isActive = (path: string) => {
    if (path === "/") return location === "/";
    return location.startsWith(path);
  };

  const navigateTo = (path: string) => {
    window.location.hash = path;
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a 
            href="#/"
            onClick={(e) => { e.preventDefault(); navigateTo("/"); }}
            className="flex items-center space-x-2 cursor-pointer"
            data-testid="nav-logo"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm">
              EG
            </div>
            <span className="font-heading font-bold text-lg text-primary hidden sm:block">Elazar OS</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {/* Main Pages */}
            {NAV_PAGES.map((page) => {
              const Icon = page.icon;
              return (
                <a
                  key={page.id}
                  href={`#${page.path}`}
                  onClick={(e) => { e.preventDefault(); navigateTo(page.path); }}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer",
                    isActive(page.path)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-primary hover:bg-secondary"
                  )}
                  data-testid={`nav-link-${page.id}`}
                >
                  <Icon className="w-4 h-4" />
                  {page.name}
                </a>
              );
            })}

            {/* Separator */}
            <div className="w-px h-6 bg-border mx-2" />

            {/* App Links */}
            {APPS.map((app) => {
              const Icon = app.icon;
              return (
                <a
                  key={app.id}
                  href={`https://${app.subdomain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5",
                    "text-muted-foreground hover:text-primary hover:bg-secondary"
                  )}
                  data-testid={`nav-app-${app.id}`}
                >
                  <Icon className={cn("w-4 h-4", app.color)} />
                  {app.name.split(" ")[0]}
                  <ExternalLink className="w-3 h-3 opacity-50" />
                </a>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            data-testid="mobile-menu-toggle"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t">
            <div className="space-y-1">
              {/* Main Pages */}
              <div className="pb-2 mb-2 border-b">
                <p className="px-3 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pages</p>
                {NAV_PAGES.map((page) => {
                  const Icon = page.icon;
                  return (
                    <a
                      key={page.id}
                      href={`#${page.path}`}
                      onClick={(e) => { e.preventDefault(); navigateTo(page.path); setIsMenuOpen(false); }}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer",
                        isActive(page.path)
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-primary hover:bg-secondary"
                      )}
                      data-testid={`mobile-nav-link-${page.id}`}
                    >
                      <Icon className="w-4 h-4" />
                      {page.name}
                    </a>
                  );
                })}
              </div>

              {/* Apps */}
              <div>
                <p className="px-3 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Apps</p>
                {APPS.map((app) => {
                  const Icon = app.icon;
                  return (
                    <a
                      key={app.id}
                      href={`https://${app.subdomain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-primary hover:bg-secondary transition-colors"
                      data-testid={`mobile-nav-app-${app.id}`}
                    >
                      <Icon className={cn("w-4 h-4", app.color)} />
                      {app.name}
                      <ExternalLink className="w-3 h-3 opacity-50 ml-auto" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
