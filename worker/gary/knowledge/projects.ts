export const PROJECT_KNOWLEDGE = {
  kodDigitalMenu: {
    name: "KOD Digital Menu System",
    description: "Custom five-screen digital menu and restaurant management system for King of Delancey.",
    why: "The previous external digital-signage menus were difficult and expensive to update or rearrange, so Elazar built a system tailored to the restaurant.",
    features: ["five screens", "menu management", "categories", "search", "86 system and report", "Push to Screens", "screen freezing", "voice commands", "PWA", "service-worker caching", "polling"],
    caveat: "Do not claim every caching issue was fully solved or invent backend architecture details.",
  },
  kodInvoiceTracker: {
    name: "KOD Invoice Tracker",
    description: "Tracks supplier and paper-goods pricing over time.",
    workflow: "scan/upload invoice → Gemini helps generate SQL → Elazar executes the SQL → pricing history and changes can be reviewed",
    features: ["item and supplier tracking", "price history", "price increases", "top expensive items", "reorder lists", "email/text/copy reorder lists", "WebstaurantStore item-code clipboard flow", "biometric auth", "light/dark mode"],
    caveat: "Automatic invoice parsing is planned, not the current primary workflow.",
  },
  elazarOS: {
    name: "ElazarOS",
    description: "Elazar's personal resume and portfolio site and the home for Gary.",
    origin: "It started partly as a better way to present Elazar and partly because he enjoys building useful features.",
  },
  inactive: ["former restaurant chatbot", "PTI Young Pros", "Shidduch View", "Minyanim app"],
} as const;
