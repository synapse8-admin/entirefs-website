---
name: Sticky navigation boundaries
description: Why long-document contents navigation needs special handling under this site's overflow wrappers.
---

Check overflow ancestors before relying on CSS sticky positioning for long-document navigation.

**Why:** This site's horizontal-overflow suppression creates non-scrolling containing ancestors. A contents menu with correct sticky styles still scrolled out of the viewport in the browser.

**How to apply:** When the request prohibits changes to unrelated pages, do not change global overflow rules to fix one regulatory page. Use page-scoped viewport positioning bounded by the document's end, preserve the mobile control's layout space, and verify deep-section navigation and the footer boundary.