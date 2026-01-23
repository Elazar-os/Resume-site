# DNS Setup Instructions for Elazaros.com Apps

This guide explains how to set up subdomains for your apps and deploy safely to elazaros.com.

## Step 1: DNS Configuration (Cloudflare or your DNS provider)

Add the following CNAME records to your DNS:

| Type  | Name      | Target                                              | Proxy |
|-------|-----------|-----------------------------------------------------|-------|
| CNAME | kod       | replit.com/@hdg4bz496c/Menu-SyncScreen.repl.co      | Yes   |
| CNAME | pti       | replit.com/@hdg4bz496c/PtiYoungPros.repl.co         | Yes   |
| CNAME | shadchan  | replit.com/@hdg4bz496c/PrivacyFirstMatchmaking.repl.co | Yes |
| CNAME | gary      | replit.com/@hdg4bz496c/GaryKingChatbot.repl.co      | Yes   |

**Note:** If using Replit deployments, the target will be your Replit deployment URL.

### For Cloudflare Pages (if hosting main site there):

1. Go to Cloudflare Dashboard → DNS → Records
2. Add CNAME records for each subdomain pointing to the Replit app URL
3. Enable orange cloud (Proxy) for SSL

## Step 2: Configure Custom Domains in Replit

For each Replit app:

1. Open the Replit app
2. Go to the "Deployments" tab
3. Click "Add Custom Domain"
4. Enter the subdomain (e.g., `kod.elazaros.com`)
5. Follow Replit's verification steps

## Step 3: Safe Deployment to Elazaros.com

### Option A: If hosting on Cloudflare Pages

1. Push this project to GitHub
2. Connect GitHub repo to Cloudflare Pages
3. Set build command: `npm run build`
4. Set output directory: `dist/public`
5. Deploy

### Option B: If hosting on Netlify

1. Push to GitHub
2. Connect to Netlify
3. Build command: `npm run build`
4. Publish directory: `dist/public`

### Option C: If hosting on Replit

1. Deploy this Replit project
2. Add custom domain `elazaros.com` in deployment settings

## Step 4: Adding More Apps (Future)

To add a new app, edit `client/src/lib/apps-config.ts`:

```typescript
export const APPS: AppConfig[] = [
  // ... existing apps ...
  {
    id: "newapp",           // URL path (/newapp)
    name: "New App Name",   // Display name
    description: "What the app does.",
    subdomain: "newapp.elazaros.com",
    replitUrl: "https://replit.com/@username/app-name?s=app",
    icon: SomeIcon,         // Import from lucide-react
    color: "text-green-500",
    gradient: "from-green-500 to-emerald-500"
  }
];
```

### Available Icons (from lucide-react):
- `UtensilsCrossed` - Food/Restaurant
- `Users` - Community/Groups
- `Heart` - Dating/Matchmaking
- `MessageCircle` - Chat/Messaging
- `Briefcase` - Business/Work
- `ShoppingCart` - E-commerce
- `Music` - Music/Audio
- `Camera` - Photography
- `Code` - Development
- `BookOpen` - Education
- `Calendar` - Events/Scheduling

## Quick Reference: URLs

| Page/App      | URL                          | Redirect           |
|---------------|------------------------------|--------------------|
| Home          | elazaros.com                 | -                  |
| Professional  | elazaros.com/#/resume        | -                  |
| Personal      | elazaros.com/#/shidduch      | -                  |
| Full Access   | elazaros.com/#/combined      | -                  |
| Apps Hub      | elazaros.com/#/apps          | -                  |
| KOD App       | kod.elazaros.com             | elazaros.com/#/kod |
| PTI App       | pti.elazaros.com             | elazaros.com/#/pti |
| Shadchan App  | shadchan.elazaros.com        | elazaros.com/#/shadchan |
| Gary App      | gary.elazaros.com            | elazaros.com/#/gary |

## Troubleshooting

### Subdomain not working?
1. Check DNS propagation (can take up to 48 hours)
2. Verify CNAME record is correct
3. Check Replit app is deployed and accessible

### SSL Certificate errors?
1. Wait 24 hours for certificate provisioning
2. Ensure Cloudflare proxy is enabled (orange cloud)
3. Set SSL mode to "Full" or "Full (Strict)" in Cloudflare

### App redirects not working?
1. Make sure you're using hash-based URLs: `elazaros.com/#/kod`
2. Clear browser cache
3. Check console for errors

## Support

For technical issues with:
- DNS/Domains: Contact your domain registrar or Cloudflare support
- Replit Apps: Check Replit documentation
- This navigation system: Review the code in `client/src/lib/apps-config.ts`
