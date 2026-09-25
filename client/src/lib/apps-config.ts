import { UtensilsCrossed, Heart, MessageCircle, Briefcase, GraduationCap, Lock, Home, Grid3X3, Mail } from "lucide-react";

export interface AppConfig {
  id: string;
  name: string;
  description: string;
  subdomain: string;
  replitUrl: string;
  icon: typeof UtensilsCrossed;
  color: string;
  gradient: string;
  active: boolean;
  pausedMessage?: string;
  /** If true, open as an internal hash route instead of external URL */
  internal?: boolean;
}

export const APPS: AppConfig[] = [
  {
    id: "kod",
    name: "KOD Menu",
    description: "King of Delancey restaurant menu and ordering system. Real-time menu sync and screen display.",
    subdomain: "kod.elazaros.com",
    replitUrl: "https://elazaros.onrender.com/",
    icon: UtensilsCrossed,
    color: "text-orange-500",
    gradient: "from-orange-500 to-amber-500",
    active: true
  },
  {
    id: "gary",
    name: "Gary",
    description: "AI portfolio assistant for ElazarOS. Ask about Elazar’s background, projects, and approach.",
    subdomain: "gary.elazaros.com",
    replitUrl: "https://elazaros-app.elazar-greisman.workers.dev/#/gary",
    icon: MessageCircle,
    color: "text-[#1737c8]",
    gradient: "from-[#1737c8] to-[#3156e8]",
    active: true,
    internal: true
  }
];

export const ACTIVE_APPS = APPS.filter(app => app.active);
export const INACTIVE_APPS = APPS.filter(app => !app.active);

export const NAV_PAGES = [
  { id: "home", name: "Home", path: "/", icon: Home },
  { id: "professional", name: "Professional", path: "/resume", icon: Briefcase },
  { id: "personal", name: "Personal", path: "/shidduch", icon: Heart },
  { id: "full-access", name: "Full Access", path: "/combined", icon: Lock },
  { id: "apps", name: "Apps", path: "/apps", icon: Grid3X3 },
  { id: "contact", name: "Contact", path: "/contact", icon: Mail }
];

export function getAppById(id: string): AppConfig | undefined {
  return APPS.find(app => app.id === id);
}

export function getAppIcon(appId: string) {
  const app = getAppById(appId);
  return app?.icon || Grid3X3;
}
