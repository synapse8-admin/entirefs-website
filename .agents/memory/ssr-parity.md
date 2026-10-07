---
name: SSR first-render parity
description: Non-obvious asset and media-preference differences that broke prerendering/hydration.
---

Media preferences may affect timers immediately, but must not change the first hydrating DOM structure relative to the server.

**Why:** A browser already requesting reduced motion rendered a Play SVG where the server rendered Pause. Different SVG path counts caused React hydration regeneration even though the recovered page looked correct.

**How to apply:** Update preference-dependent control structure after mount, or use identical markup with CSS changes. Check hard reload with reduced motion both enabled and disabled when modifying SSR controls.

Vite's development SSR loader can return source asset URLs even when invoked in production mode.

**Why:** The prerendered HTML requested source files that do not exist on the production server and disagreed with the client's hashed asset URLs.

**How to apply:** Resolve prerendered asset URLs using the actual client-build manifest and fail the build if unresolved source URLs remain. A visually recovered client page is not evidence the initial HTML works.