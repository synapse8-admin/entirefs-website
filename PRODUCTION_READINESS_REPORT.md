# Production readiness report — Entire Financial Services

Audit date: **5 October 2026**. Approved canonical origin: **https://www.entirefs.com.au**.

## Verdict

**Implementation and tested preview flows are ready for owner review; production launch remains blocked.** The permanent apex/www domains failed TLS hostname verification, no enquiry-delivery service is approved/configured, and regulatory-copy conflicts require owner/licensee approval. No publication, external DNS change, ownership verification or real enquiry submission occurred.

The approved structure, visible wording, photographs and legal source text were preserved. Changes were limited to production delivery, metadata, performance, dependency/security fixes and accessibility/functional corrections.

## Stack, package manager and commands

- React/TypeScript, Vite/Rollup, Tailwind CSS, Wouter, Framer Motion, Radix UI, React Hook Form/Zod.
- pnpm workspace; Node 24 runtime with a small Node HTTP production server. No database or authentication migration.
- Sharp generates responsive versions of the existing photos and branded icon/share assets. Poppins is self-hosted with its licence.
- Install reproducibly: `pnpm install --frozen-lockfile`
- Development: `pnpm --filter @workspace/entire-financial run dev`
- **Production build:** `pnpm --filter @workspace/entire-financial run build`
- **Production start:** `pnpm --filter @workspace/entire-financial run serve`
- Tests: `pnpm --filter @workspace/entire-financial test`
- Type check: `pnpm --filter @workspace/entire-financial typecheck`
- Lint: `pnpm --filter @workspace/entire-financial lint`

The artifact's production build/start configuration and root deployment target were schema-validated for process-based Autoscale hosting. A static SPA deployment cannot provide the required server routing/indexing behavior. Final performance/browser QA used the built Node server, not the development server. After recording that evidence, the normal live-editing Vite development preview was restored; production still runs the Node server.

## Implemented changes

### Search and HTTP delivery

- Centralised route-specific titles/descriptions, canonical/social metadata and shared business/service/page schema.
- Complete initial HTML for ten public routes plus the 404 page using build-time React rendering, followed by hydration. Crawlers do not need JavaScript to obtain the primary content.
- Resolved SSR source image URLs through Vite's client asset manifest so first-paint image requests and hydration use identical hashed files.
- Generated production robots.txt and sitemap.xml with exactly ten approved HTTPS www URLs; unknown/preview URLs are excluded. No fabricated modification dates.
- Genuine HTTP 404s, 405s for unsupported methods, guarded file paths and single-hop permanent 308 host/protocol/case/trailing-slash redirects preserving query strings.
- Preview/staging guards: noindex in HTML and headers; no production canonical, og:url, ownership tags or JSON-LD; disallow robots and no public preview sitemap.
- Real branded SVG/ICO/PNG favicons, Apple touch icon, manifest and 1200×630 share image. Supplied brand geometry and colours were used, not generic placeholders.

### Performance and behavior

- Lazy route bundles, removal of unused startup providers/query/chart code, responsive WebP/JPEG assets, stable dimensions and deferred below-fold loading.
- Local licensed Poppins weights with appropriate preloads and font-display behavior; no new font family or external-font dependency for the site itself.
- Gzip/Brotli text delivery, immutable hashed assets and revalidation for HTML/stable public files.
- Deferred SociableKIT loading while retaining real reviews, Load more, fallback link and SPA remount.
- Removed fake form success and visitor-data console logging. Blank delivery configuration gives a truthful unavailable notice/error and retains entries.
- Optional owner-approved HTTPS JSON endpoint contract; validation, bounded inputs, abort/timeout and duplicate-submission prevention. No endpoint or credential was invented.

### Accessibility and safety

- Focus-managed mobile drawer: inert closed/background content, scroll lock, focus trap, Escape, focus restoration; semantic desktop Services disclosure.
- Skip link, visible focus treatments, labelled required fields, descriptive link context, legal-heading hierarchy and contrast corrections in the existing palette.
- Legible dark-teal version of the approved wordmark on the sage mobile drawer; the main approved header wordmark remains unchanged.
- Pause controls and reduced-motion support. A detected Home hydration error came from rendering a different Play/Pause SVG before client hydration when reduced motion was already enabled. Preference-dependent icon changes now occur after hydration; the timer respects the preference immediately.
- Removed an unused malformed provider SVG containing HTML rather than an image.
- Explicit generic failures instead of false success, minimal structured server failure logging without request URLs/headers/bodies/visitor data, and no secrets in public configuration.

## Main changed files

All paths below are under `artifacts/entire-financial/` unless stated otherwise:

| Area | Main files |
|---|---|
| Route/bootstrap | `src/App.tsx`, `src/main.tsx`, `src/entry-server.tsx`, `src/pages/not-found.tsx` |
| Metadata/schema | `src/lib/site.ts`, `src/lib/metadata.ts`, `src/lib/structured-data.ts`, `src/components/PageMetadata.tsx` |
| Server | `server/index.mjs`, `server/routing.mjs`, `server/headers.mjs` |
| Build/assets | `vite.config.ts`, `scripts/prerender.mjs`, `scripts/prepare-assets.mjs`, `scripts/prepare-fonts.mjs`, responsive image component/assets, licensed font assets |
| UI/behavior | `src/components/Header.tsx`, `Footer.tsx`, `ContactForm.tsx`, `GoogleReviewsWidget.tsx`, `CTABanner.tsx`, `StatsCounter.tsx`, `PageHero.tsx`, `src/pages/home.tsx`, service pages, `src/index.css` |
| Checks | `tests/*.test.mjs`, `scripts/check-links.mjs`, lint configuration |
| Hosting/dependencies | `.replit-artifact/artifact.toml`, artifact `package.json`; root `.replit`, `package.json`, `pnpm-workspace.yaml`, `pnpm-lock.yaml` |
| Deliverables | Root `PRODUCTION_READINESS_REPORT.md`, `SEO_METADATA_MATRIX.md`, `LAUNCH_CHECKLIST.md`, `.env.example`, `qa/` |

Full changed-file inventory: `qa/CHANGED_FILES.txt`. Generated built output is in `dist/public/`. Original legal JSON remains unchanged.

## Dependency and security results

- Removed unused React Query/Recharts/chart UI code and unnecessary startup Toaster/Tooltip providers.
- Updated vulnerable workspace/toolchain dependencies using compatible audited versions. Rollup 4.64 caused a reproducible inclusion/GC build stall; profiling isolated it, and the audited 4.59.0 pin restored normal build time. Do not treat a successful dependency audit as proof an upgrade builds correctly.
- Baseline dependency findings: 19 high, 14 moderate, 5 low. Final audit: **0 critical/high/moderate/low/info findings**.
- SAST completed with no findings; sensitive-data scan reported no vulnerabilities. These are scanner results, not a guarantee of absence of all security defects.
- Frozen-lockfile installation, lint and typecheck passed. Baseline typecheck had 75 errors; final typecheck has none.

## Build and automated tests

- Final build **passed**: Vite stage **2.92 seconds**, followed by successful prerendering of **11 complete pages**, sitemap and robots. Baseline Vite build was 6.37 seconds.
- **30 tests passed, 0 failed**: route/redirect/query/path guards, preview stripping, complete initial content and unique production metadata, sitemap exclusions, JSON-LD, and branded asset sizes.
- No unresolved `/src/assets/` URLs remain in production initial HTML.
- Evidence: `qa/BUILD.txt`, `qa/UNIT_TESTS.txt`, `qa/CLEAN_INSTALL.txt`.

## Lighthouse and Core Web Vitals

Measured through the Replit HTTPS preview using the built Node server, Lighthouse 13.5.0 and the installed headless Chromium. Mobile uses Lighthouse simulated mobile throttling; desktop uses its desktop preset. These are single lab runs, not field measurements or production-domain results.

Scores are **Performance / Accessibility / Best Practices / SEO**.

| Page/device | Before | Final | Final LCP | Final CLS |
|---|---|---|---:|---:|
| Home mobile | 63 / 95 / 100 / 54 | **98 / 100 / 100 / 66** | 2.040s | 0 |
| Home desktop | 90 / 95 / 100 / 54 | **100 / 100 / 100 / 66** | 0.420s | 0.00039 |
| Contact mobile | 62 / 97 / 100 / 61 | **98 / 100 / 100 / 66** | 1.963s | 0 |
| Contact desktop | 99 / 97 / 100 / 61 | **100 / 100 / 100 / 66** | 0.568s | 0.00039 |
| Superannuation mobile | Not baselined | **97 / 100 / 100 / 66** | 2.263s | 0 |
| Superannuation desktop | Not baselined | **100 / 100 / 100 / 66** | 0.455s | 0.00039 |
| Retirement mobile | Not baselined | **99 / 100 / 100 / 66** | 1.811s | 0.00005 |
| Retirement desktop | Not baselined | **100 / 100 / 100 / 66** | 0.414s | 0.00042 |
| Transition mobile | Not baselined | **98 / 100 / 100 / 66** | 1.966s | 0.00006 |
| Transition desktop | Not baselined | **100 / 100 / 100 / 66** | 0.428s | 0.00043 |
| Aged care mobile | Not baselined | **98 / 100 / 100 / 66** | 1.963s | 0 |
| Aged care desktop | Not baselined | **100 / 100 / 100 / 66** | 0.411s | 0.00039 |

The **66 preview SEO score is caused by deliberate noindex/crawl blocking**, not a claim that production SEO scores are 66. Every final SEO audit other than indexing eligibility passes. No canonical-host spoofing, disabled noindex or certificate bypass was used to inflate scores. Permanent-domain HTTPS must be fixed before measuring its actual production SEO score.

Home mobile LCP improved from 6.008s to 2.040s; Contact mobile from 5.693s to 1.963s. Final lab LCP is below 2.5s for all six measured pages. Final CLS is below 0.001 on all runs, far below 0.1. Mobile TBT is 0ms for Home/Superannuation/Transition/Aged care, 13ms for Retirement and 63ms for Contact; desktop TBT is 0ms.

Lab LCP and CLS do not establish field Core Web Vitals or INP. There is no real-user traffic dataset/approved analytics installation here; field INP cannot be asserted. Further results can vary with host/network/load and the external reviews vendor.

Raw baseline/final JSON: `qa/lighthouse/baseline/` and `qa/lighthouse/final/`; extracted results: `qa/LIGHTHOUSE_SUMMARY.json`.

## Responsive, browser and accessibility QA

| Coverage | Result |
|---|---|
| All ten routes at widths 320, 360, 375, 390, 414, 768, 1024, 1280, 1440, 1920 | HTTP 200, one topical H1, no measured horizontal overflow |
| Unknown route | Genuine HTTP 404 and custom page |
| Desktop Services and mobile drawer | Keyboard navigation, Escape, trap/inert/restore, scroll lock and route closing passed |
| FSG landscape 844×390 | Visually inspected; heading below sticky header, no overflow |
| 320px reflow/200% approximation | Inspected, but this was **not actual browser zoom** |
| Contact fake-data local test | Validation and truthful unavailable error; values retained; no real enquiry/POST/mail/tel sent |
| Reviews | Real cards, Load more, fallback href and About→Home remount passed |
| Pause/reduced motion | Controls/CSS verified; focused Home hard reload passed with **zero hydration recoveries/pageerrors** under both reduced-motion settings |
| Mobile drawer wordmark after fix | Confirmed visible at 390×850 |
| Screen-reader announcements | Structural labels/descriptions/live regions present; actual screen reader not independently tested |

| Browser/device | Actual evidence |
|---|---|
| Chrome 140 on Linux | Comprehensive browser pass and focused failure correction |
| Installed headless Chromium | Lighthouse and screenshot captures |
| Safari/macOS, physical iPhone/iPad | Not available/tested; required owner follow-up |
| Firefox/Edge | Not executed; required owner follow-up |

Build compatibility targets are not evidence that those engines/devices were actually tested. Native links/phone/email actions were not sent. Sixty-two lazy images were still incomplete in the tester's targeted Home scan; that is not proof of broken images or proof every below-fold asset loaded. Final generation/manifest checks cover emitted paths; owner scroll-through remains in the checklist.

The original failed hydration observation and focused passing follow-up are preserved in `qa/browser/BROWSER_QA.md`. Screenshot references are in `qa/browser/SCREENSHOT_INDEX.md`; local screenshot evidence is in `qa/screenshots/`. A passing DOM/overflow check is not a substitute for visual footer/animation-spacing inspection.

## Links, redirects, robots and headers

- **61 unique internal route/anchor targets checked; 0 invalid.** Relative legal-document hash links were resolved against their actual page, not Home.
- Eight unique external targets: six returned 200; AFCA and the MoneySmart adviser register returned 403 to automated HEAD requests and require manual opening. This is not evidence they are dead. Privacy.gov.au redirects to OAIC successfully.
- Eleven mail/tel targets were inspected by href only; deliverability and real calling were not tested.
- No PDF exists in the supplied site. FSG is a checked web route; PDF checks are not applicable.
- Preview routes/robots return 200; sitemap intentionally returns 404 there. Local canonical-host simulation confirms production robots/sitemap return 200, main HTML 200, unknown route 404.
- Unit tests and preview smoke checks confirm known-route lowercase/trailing-slash normalization and query preservation with permanent 308 responses. Live www/apex chains remain blocked by invalid TLS hostname coverage.
- Header evidence: `qa/links-and-headers.json`, `qa/PRODUCTION_HOST_HEADERS.txt`. The latter is explicitly a localhost forwarded-host simulation, not a live DNS/certificate verification.

| Security/delivery control | Status |
|---|---|
| X-Content-Type-Options | Enforced `nosniff` |
| Referrer-Policy | Enforced `strict-origin-when-cross-origin` |
| Permissions-Policy | Camera, microphone, geolocation and payment disabled |
| CSP object/base restrictions | Enforced |
| Production frame-ancestors | Enforced `self`; omitted for non-production embedded preview compatibility |
| Full third-party script/style/connect/frame CSP | **Report-only**, not fully enforced; real reviews/map must remain functional |
| Reviews API origin | Observed `data.accentapi.com` added to report-only connect policy after QA |
| HSTS | One-year max-age on canonical HTTPS; no includeSubDomains/preload assumption |
| Compression/cache | Brotli/gzip for text, immutable hashed assets, revalidation HTML |
| Preview/404 indexing | Noindex/nofollow, canonical/schema stripping |

## Unresolved issues and manual dependencies

| Severity | Issue/impact | Required action |
|---|---|---|
| **Blocker** | www/apex TLS hostname verification fails; canonical domain cannot be safely crawled/tested | Owner connects both domain names with exact deployment A/TXT records, obtains valid SSL, then verifies live redirects/routes/headers |
| **Blocker** | No approved contact endpoint; online enquiries do not reach the business | Approve/configure delivery with backend validation/spam control and permissioned real receipt test |
| **High / launch gate** | FSG/complaints references FOS alongside AFCA, conflicting 30/45/90-day language, postcode/email variants and draft-like privacy wording | Licensee supplies approved replacement text; no unapproved legal rewrite |
| Medium | Old published staging deployment is still static/previous code | Owner confirms process-based publishing type and publishes only after approval; this audit changed configuration, not the running public deployment |
| Medium | Google/Bing ownership, real-domain sitemap/indexing, Rich Results, social previews and PSI not verified | Complete exact owner steps in launch checklist |
| Medium | Safari/iPhone/Firefox/Edge, actual zoom and screen-reader gaps | Perform the manual device/accessibility checklist |
| Medium | Full CSP remains report-only; third-party origin set can change | Review real production origins before enforcement; allow only approved enquiry provider needs |
| Low / owner confirmation | Home 15+ versus About 20+ experience language; provider/review claims may age | Confirm intended supplied wording/factual currency rather than inventing revised claims |
| Low | Two external HEAD checks returned 403; analytics property not supplied | Manually open external destinations; only enable owner-approved tracking/consent and verify real collection |

Entire's Clayton office details remain distinct from the licensee's Box Hill North address; these must not be merged into invented NAP values. No claims of search ownership, regulatory approval, analytics operation, rankings or immediate indexing are made.

## Launch and rollback

`LAUNCH_CHECKLIST.md` contains exact owner actions for hosting, DNS, HTTPS, redirects, Google/Bing verification, sitemap submission, enquiry receipt, analytics, manual devices, sharing, Rich Results, PSI and monitoring.

Pre-audit recovery checkpoint/reference: `3d4a7fc`. Use Replit Checkpoints to recover if a release causes broad breakage; review what the chosen checkpoint includes before restoring. Existing photos/legal originals remain available, and no database/data migration occurred. External DNS/provider configuration is not undone by a code rollback: keep the registrar's prior records and deployment settings separately.