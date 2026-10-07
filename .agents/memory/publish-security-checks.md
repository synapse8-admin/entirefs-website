---
name: Publish security checks
description: Why a passing frontend build is not sufficient to diagnose publishing failures.
---

Check publishing logs and workspace dependency security results separately from frontend compilation.

**Why:** Publishing was blocked by critical vulnerabilities in API-generation tooling even though the static website compiled successfully and did not use that tool at runtime.

**How to apply:** Do not diagnose build warnings as the cause without reading the publish failure. Update the vulnerable dependency and lockfile rather than bypassing security checks. Audit the replacement version too: the minimum fix listed by publishing can still have other known vulnerabilities.