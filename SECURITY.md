# Security Policy

This repository powers a personal static portfolio site (React + Vite, deployed on Cloudflare Workers).

## Reporting a vulnerability

**Please do not open a public issue** for security findings.

Prefer one of these private channels:

1. **GitHub private vulnerability report** (preferred)  
   Use the “Report a vulnerability” button on this repository’s [Security](https://github.com/Elazar-os/Resume-site/security) tab, or go directly to:  
   https://github.com/Elazar-os/Resume-site/security/advisories/new

2. **Contact form on the live site**  
   https://elazaros-app.elazar-greisman.workers.dev/#/contact  
   Mark the subject clearly as a security report.

I will acknowledge reports when I can and aim to address confirmed issues in a reasonable timeframe for a personal project.

## Scope

**In scope**
- Cross-site scripting (XSS) or injection in this site’s UI
- Exposure of secrets or private data that should not be public
- Abuse paths in the contact form (spam/bypass of basic protections)
- Issues in dependencies that meaningfully affect this site’s users

**Out of scope**
- Denial of service / rate limits against Cloudflare or third-party hosts
- Vulnerabilities only in third-party services (e.g. Web3Forms, CDNs, TensorFlow.js) with no practical impact on this site
- Social engineering, physical attacks, or reports that require privileged access you do not have
- Theoretical issues with no realistic exploit path

## Notes

- This is a static frontend. There is no application database or authenticated backend in this repo.
- Public profile content (resume, shidduch details, etc.) is intentional and not considered a vulnerability.
- Please include steps to reproduce, impact, and (if possible) a suggested fix.
