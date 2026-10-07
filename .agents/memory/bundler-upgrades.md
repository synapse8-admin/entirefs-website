---
name: Bundler upgrade regressions
description: Audit-clean dependency upgrades can cause severe Rollup build regressions.
---

Profile a stalled production build before changing application architecture or repeatedly increasing timeouts.

**Why:** Rollup 4.64 caused sustained inclusion/garbage-collection work and multi-minute build stalls despite a clean vulnerability audit. The compatible audited 4.59 release restored builds to a few seconds. Security compatibility alone did not establish runtime/build compatibility.

**How to apply:** Treat the bundler pin as a deliberate reliability decision. Test a proposed replacement with a clean install and timed production build; retain the working audited release until another is proved viable.