---
name: Production hosting
description: Why this site requires process-based hosting and strict production/preview separation.
---

Retain a process-based production server, not a static SPA catch-all deployment.

**Why:** Genuine HTTP 404s, one-hop permanent origin/path redirects, response security headers and host-specific indexing were explicit acceptance requirements. A working-looking static SPA can still fail them.

**How to apply:** Preserve those semantics when changing hosting or build tools. A configuration change does not publish or replace an existing deployment; verify the publishing type and live behavior separately.

The owner specified https://www.entirefs.com.au as the permanent production origin. Preview and staging addresses must not become replacement canonical origins.

**Why:** The owner explicitly requested this origin and prevention of staging indexing.

**How to apply:** Keep preview indexing protection active during audits. Do not spoof the production host or remove noindex merely to obtain better Lighthouse scores; record the penalty and measure the real canonical domain after valid HTTPS is available.