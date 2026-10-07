---
name: Production hosting
description: Why this site requires process-based hosting and strict production/preview separation.
---

For the original Replit publishing path, retain a process-based production server, not a static SPA catch-all deployment.

**Why:** Genuine HTTP 404s, one-hop permanent origin/path redirects, response security headers and host-specific indexing were explicit acceptance requirements. A working-looking static SPA can still fail them.

**How to apply:** Preserve those semantics when changing hosting or build tools. A configuration change does not publish or replace an existing deployment; verify the publishing type and live behavior separately.

The user subsequently specified cPanel shared hosting with PHP 8, no Composer and no Node process on the host for contact email delivery. That explicit cPanel requirement supersedes the Node-hosting preference for this deployment path.

**Why:** The user requested a bundled PHPMailer SMTP handler for their cPanel host, not a hosted Node enquiry API.

**How to apply:** Keep the existing Replit preview/build tooling, but do not require Node or Composer on cPanel. SMTP configuration must live outside the real web root. Do not assume Apache reproduces the original Node routing/indexing/header audit; check those independently when migrating the whole site.

The owner specified https://www.entirefs.com.au as the permanent production origin. Preview and staging addresses must not become replacement canonical origins.

**Why:** The owner explicitly requested this origin and prevention of staging indexing.

**How to apply:** Keep preview indexing protection active during audits. Do not spoof the production host or remove noindex merely to obtain better Lighthouse scores; record the penalty and measure the real canonical domain after valid HTTPS is available.