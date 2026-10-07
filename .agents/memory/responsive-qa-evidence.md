---
name: Responsive QA evidence
description: Lessons for verifying this site's animated pages and shared footer across screen sizes.
---

Do not treat correct rendered text and zero horizontal overflow as proof that a page is visually readable.

**Why:** The initial responsive checks passed those measurements, but a full visual review still found nearly unreadable footer disclosures and an email address wrapping its last character alone at tablet width.

**How to apply:** Visually inspect shared footer text contrast and contact wrapping at desktop, tablet, and mobile widths. For scroll-animated sections, inspect settled states after scrolling before reporting large blank spaces; a full-page capture can include content that has not yet animated into view.