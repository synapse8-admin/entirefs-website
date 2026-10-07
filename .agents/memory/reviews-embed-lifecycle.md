---
name: Reviews embed lifecycle
description: External SociableKit initialization behavior that can leave the testimonials section empty.
---

Initialize SociableKit only after the React embed host exists, and explicitly remount it when returning to the homepage.

**Why:** The vendor loader inspected the DOM only once and missed React's host on initial load. Its remote runtime did not automatically discover newly inserted hosts after SPA route changes; the review feed itself was healthy.

**How to apply:** Keep initialization tied to the embed lifecycle rather than placing an independent deferred script in the HTML. Verify a direct homepage load and a return from another route whenever updating this integration. Recheck the live vendor implementation if its mounting API changes.