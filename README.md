# Elazar OS – Personal Portfolio & Apps Hub

Personal portfolio site for **Elazar Greisman** featuring:

- Professional resume & experience
- Personal / Shidduch profile
- Photo selector
- Apps hub (KOD Menu and other projects)
- Contact page
- Resume PDF download

**Live site:** [https://elazaros-app.elazar-greisman.workers.dev/](https://elazaros-app.elazar-greisman.workers.dev/)

---

## Tech Stack

- **Frontend:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS + shadcn/ui
- **Routing:** Wouter (hash-based for static hosting)
- **Animations:** Framer Motion
- **Backend:** Lightweight Express (mostly static serving)
- **Deployment:** Cloudflare Workers

## Getting Started

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm start
```

## Project Structure

- `client/` – React frontend
- `server/` – Express server
- `shared/` – Shared types/schema
- `client/public/photos/` – Profile photos

## Notes

This repo was cleaned up and moved to the `main` branch from the original Replit export.
