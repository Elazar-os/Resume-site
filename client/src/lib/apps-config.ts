import { UtensilsCrossed, Users, Heart, MessageCircle, Briefcase, GraduationCap, Lock, Home, Grid3X3, Mail } from "lucide-react";

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
    id: "pti",
    name: "PTI Young Pros",
    description: "Yeshivas Ner Boruch PTI Young Professionals community platform and event management.",
    subdomain: "pti.elazaros.com",
    replitUrl: "https://pti-young-pros--hdg4bz496c.replit.app/",
    icon: Users,
    color: "text-blue-500",
    gradient: "from-blue-500 to-cyan-500",
    active: false,
    pausedMessage: "PTI Young Pros is temporarily paused. Check back soon!"
  },
  {
    id: "shadchan",
    name: "Shadchan",
    description: "Privacy-first matchmaking platform. Secure and confidential shidduch networking.",
    subdomain: "shadchan.elazaros.com",
    replitUrl: "https://privacy-first-matchmaking--hdg4bz496c.replit.app/",
    icon: Heart,
    color: "text-pink-500",
    gradient: "from-pink-500 to-rose-500",
    active: false,
    pausedMessage: "Shadchan is temporarily paused for maintenance. Check back soon!"
  },
  {
    id: "gary",
    name: "Gary King",
    description: "AI-powered chatbot assistant. Your friendly helper for questions and conversations.",
    subdomain: "gary.elazaros.com",
    replitUrl: "https://gary-king-chatbot-hdg4bz496c.replit.app/",
    icon: MessageCircle,
    color: "text-purple-500",
    gradient: "from-purple-500 to-violet-500",
    active: false,
    pausedMessage: "Gary King is taking a break. Check back soon!"
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
