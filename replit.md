# Elazar OS - Personal Portfolio & Apps Hub

## Overview

Elazar OS is a personal portfolio and multi-purpose web application that serves as a central hub for professional resume, shidduch (matchmaking) profile, and a collection of micro-apps. The application is built as a single-page application with hash-based routing, designed to be deployable on static hosting platforms while maintaining a modular architecture for multiple sub-applications.

The platform includes:
- Professional resume/portfolio display
- Shidduch (matchmaking) profile page
- Smart photo selector with AI-powered categorization using TensorFlow.js
- JSwipe-style dating profile preview
- Apps hub linking to external Replit-hosted applications
- Daily missions and wellness features

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter with custom hash-based routing hook for static hosting compatibility
- **Styling**: Tailwind CSS v4 with shadcn/ui component library (New York style)
- **State Management**: TanStack React Query for server state
- **Animations**: Framer Motion for UI animations
- **Build Tool**: Vite with custom plugins for meta image handling

### Backend Architecture
- **Runtime**: Node.js with Express
- **Development**: tsx for TypeScript execution in development
- **Production**: esbuild bundling for production server
- **API Pattern**: RESTful endpoints prefixed with `/api`

### Data Storage
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` for shared type definitions
- **Current State**: Uses in-memory storage (`MemStorage`) with database schema prepared for PostgreSQL migration
- **Database Config**: Neon serverless PostgreSQL adapter configured

### Key Design Decisions

1. **Hash-based Routing**: Chosen over standard history-based routing to ensure compatibility with static hosting platforms (Cloudflare Pages, Netlify) without server-side rewrite rules.

2. **Shared Schema**: TypeScript types and Zod validation schemas are defined in `shared/` directory, enabling type safety across client and server.

3. **Component Architecture**: UI components are organized using shadcn/ui patterns with Radix UI primitives, providing accessible and customizable building blocks.

4. **Client-side AI**: TensorFlow.js and MobileNet are loaded via CDN for the photo selector feature, enabling browser-based image classification without backend processing.

5. **Multi-app Architecture**: External apps are hosted separately on Replit and accessed via subdomain configuration, with the main site serving as a routing hub.

## External Dependencies

### Third-Party Services
- **Database**: Neon PostgreSQL (serverless) - configured via `DATABASE_URL` environment variable
- **Hosting**: Designed for Replit deployments with custom domain support (elazaros.com)
- **CDN**: TensorFlow.js and MobileNet loaded from jsDelivr CDN

### Key NPM Packages
- **UI**: Radix UI primitives, shadcn/ui components, Lucide icons
- **Forms**: React Hook Form with Zod resolvers
- **Database**: Drizzle ORM, @neondatabase/serverless
- **Animation**: Framer Motion
- **AI/ML**: @tensorflow/tfjs, @tensorflow-models/mobilenet

### External App Integrations
The platform links to externally hosted Replit applications:
- KOD Menu (restaurant menu system) - **ACTIVE**
- PTI Young Pros (community platform) - **PAUSED**
- Shadchan (matchmaking platform) - **PAUSED**
- Gary King (AI chatbot) - **PAUSED**

These are configured in `client/src/lib/apps-config.ts` with an `active` boolean flag.

## App Status Management

Apps can be toggled between active and inactive (paused) states in `apps-config.ts`:

```typescript
{
  id: "appname",
  active: true,  // or false to pause
  pausedMessage: "Custom message for paused apps"
}
```

**Inactive app behavior:**
- Cards appear greyed out with "Paused" badge
- Clicking shows a friendly modal with the pause message
- Direct URL access (`/#/appname`) shows a dedicated paused page
- No backend logic, database queries, or external requests are triggered
- Desktop nav only shows active apps; mobile nav shows all with paused indicator

## Offline / Self-Archiving

A Service Worker (`client/public/sw.js`) is registered in `client/src/main.tsx`. It uses a **network-first with cache fallback** strategy:
- On every visit, it fetches the latest version from the server and caches it.
- If the server is unreachable (site goes down), it serves the last cached version seamlessly.
- Static assets (photos, favicon, etc.) are pre-cached on first load.
- Old caches are automatically cleaned up when a new version is deployed (bump `CACHE_NAME` in `sw.js`).

## Cost Optimization Notes

**Current architecture is already cost-optimized:**
- **No database usage**: App uses in-memory storage (`MemStorage`), not PostgreSQL
- **No API routes**: Backend only serves static files - no data processing
- **Client-side only**: All logic runs in the browser
- **Static-compatible**: Can be deployed to free static hosting (Cloudflare Pages, Netlify)
- **No autoscaling needed**: Single instance sufficient for this static site
- **External apps hosted separately**: No resource consumption when inactive