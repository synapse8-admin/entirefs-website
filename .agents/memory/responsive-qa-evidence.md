---
name: Responsive QA evidence
description: Lessons for verifying this site's animated pages and shared footer across screen sizes.
---

Do not treat correct rendered text and zero horizontal overflow as proof that a page is visually readable.

**Why:** The initial responsive checks passed those measurements, but a full visual review still found nearly unreadable footer disclosures and an email address wrapping its last character alone at tablet width.

**How to apply:** Visually inspect shared footer text contrast and contact wrapping at desktop, tablet, and mobile widths. For scroll-animated sections, inspect settled states after scrolling before reporting large blank spaces; a full-page capture can include content that has not yet animated into view.

For enquiry-form QA, verify a clean success/reset state and the next blank-submit validation, not merely an HTTP success and empty field values. Hold mocked responses pending until disabled-button assertions are complete instead of relying on a short fixed delay.

**Why:** Browser checks found reset controls and a thank-you message alongside stale required-choice errors. A short response delay also expired between separate pending-state assertions, making a disabled-button observation unreliable.

**How to apply:** Test the whole submission lifecycle with a controllable mock response: pending, failure retention, success with no stale errors, and validation of a fresh empty form. Keep actual SMTP receipt verification separate and permissioned.