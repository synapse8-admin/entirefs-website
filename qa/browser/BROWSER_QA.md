# Final browser QA status

The original hydration failure below was fixed and the same tester confirmed zero recovery errors and pageerrors with both reduced-motion settings. The light-panel drawer wordmark was also confirmed visible. See the focused follow-up at the end. This passes the tested browser flows, not untested live-domain, delivery, Safari or physical-device checks.

---

# Entire Financial Services — production readiness browser pass

**Verdict: FAIL for production readiness.** The app is navigable and key flows behave as expected, but a fresh Home hard reload on the restarted production bundle reproducibly raises React minified error **#418** (hydration mismatch) twice. The UI recovers/renders, but the requested “no runtime/hydration failures” condition is not met.

## Environment and scope
- Managed production Node bundle at preview `/`; Chrome 140.0.0.0 (Linux x86_64, UA `Chrome/140.0.0.0`). No Firefox, Safari, or physical iPhone/iPad tested.
- One original full route/viewport pass, then only image/hydration observations rechecked after the announced image-manifest build restart (no duplicate full matrix).
- Screenshot captures are listed in `screenshot-index.md` and are attachable by their browser observation IDs. The browser tool exposes automatic screenshots as IDs, not local image bytes; no screenshot API was available to export PNG/JPEG files into this directory.

## Direct routes and reflow matrix
The original production pass loaded each public route directly; each returned HTTP 200 with one topical H1. No horizontal document overflow was measured at any listed width. Mobile height was 850px; desktop height 900px.

| Route | HTTP | One H1 |
|---|---:|---|
| `/` | 200 | Purpose driven financial advice |
| `/about` | 200 | About Us |
| `/contact` | 200 | Let's start the conversation. |
| `/services/superannuation` | 200 | Make your super work harder for you. |
| `/transition-to-retirement` | 200 | Ease into retirement on your terms |
| `/retirement-planning` | 200 | Plan for the retirement you want to live |
| `/aged-care` | 200 | Clear financial guidance when your family needs it most |
| `/privacy-policy` | 200 | Privacy Policy |
| `/financial-services-guide` | 200 | Financial Services Guide (FSG) |
| `/complaints` | 200 | Complaints & Dispute Resolution |
| `/missing-audit-route` | **404** | custom “404 Page not found” |

| CSS viewport width | 320 | 360 | 375 | 390 | 414 | 768 | 1024 | 1280 | 1440 | 1920 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Overflow on any public route | No | No | No | No | No | No | No | No | No | No |

FSG was additionally inspected at 844×390 landscape (sticky header 101px; title below it; no horizontal overflow). 320×850 was used as the requested 200%-zoom/reflow approximation (equivalent to a 640px layout viewport at 200%); this was not actual browser zoom. Latest refreshed FSG screenshot at 320px shows the “On this page” disclosure and readable document text.

## Rechecked after production asset-manifest fix
- Refreshed `/financial-services-guide` returned 200. Header wordmarks loaded from hashed `/assets/logo-nav-beige-D_Qh1SoA.svg` (natural width 240); footer submark `/assets/logo-submark-_t5QSFHC.png` loaded after scrolling (width 673).
- Refreshed Home and Contact also show the correct wordmark via hashed `/assets/` URL; Home hero photo loaded. Targeted Home scroll recorded no `/assets/` HTTP 4xx and no completed image with `naturalWidth=0`. 62 of 73 Home images were still `complete=false` in the scan (lazy/offscreen), so not every image was proven loaded; no new broken-image indicator was visible in the refreshed Home, Contact, or FSG screenshots. The earlier `/src/assets/...` URL issue is not present in these refreshed observations.
- Direct routes/status/H1 matrix was not repeated after the image-only restart, per instruction; refreshed `/`, `/contact`, and `/financial-services-guide` spot checks returned 200.

## Interaction and content checks
- **Desktop Services:** disclosure opened to Transition to retirement, Retirement planning, and Aged care; Tab reached its first link; Escape closed and restored focus to Services. Navigated to a service page and returned Home.
- **Mobile drawer:** initial focus went to Close menu; Tab/Shift+Tab stayed within the drawer; Escape returned focus to Open menu. `main.inert=true` and body scrolling was locked only while open; closing released them. Services submenu displayed the three expected routes; drawer navigation to About, Aged care, and Contact worked and closed the drawer.
- **Skip link:** Tab revealed “Skip to main content”; activation focused `main#main-content`. The main landmark box starts at y=0 beneath the sticky header (header bottom y=101), although the visible Home hero heading begins below the header and was not covered.
- **Contact form:** empty submit showed required-field validation/native invalid messages and focused Full Name. Fake local-only values were entered, with Initial Consultation, Email, and Anytime selected. Submit showed the honest unavailable notice (“Online enquiries are not configured yet. Please phone 0421 833 372 or email bevan@entirefs.com.au.”), retained values, and showed no success message. No same-origin enquiry POST occurred; no message was sent. Phone, email, and Privacy Policy hrefs were inspected but not activated.
- **Reviews:** scrolling triggered the deferred SociableKIT loader. The widget rendered a 5.0 rating, +82, five review cards and an external Google fallback; Load more expanded the cards to 11. About→Home SPA navigation reset the widget and scrolling back mounted it again. The Write-a-review external action was not activated. SociableKIT scripts/styles and avatar requests returned 200.
- **Motion:** partner-logo pause/resume toggled labels/pressed state; slideshow pause/resume toggled between Pause/Play and was restored. Emulated `prefers-reduced-motion: reduce` removed computed CSS animations (one animated element→none; Web Animations entries 3→2); the slideshow control subsequently appeared disabled. This is browser emulation, not physical-device timing verification.
- **Preview indexing:** response `X-Robots-Tag` includes `noindex, nofollow` (and other noindex directives); DOM has `robots=noindex,nofollow`. No canonical, `og:url`, or JSON-LD/schema was present.

## Remaining issues / limitations
1. **Blocking:** after navigating to Home and again on hard reload of `/` on the restarted bundle, a `pageerror: Minified React error #418` was recorded each time. React #418 indicates server/client hydration mismatch and client regeneration; the page remained visible, but hydration did not pass.
2. **Report-only CSP (not fatal):** SociableKIT logs `[Report Only] Refused to connect to https://data.accentapi.com/feed/...` because it is outside `connect-src 'self' https://*.sociablekit.com`. The widget nevertheless rendered real review cards; treat this separately from React #418.
3. Drawer screenshot after asset fix shows a pale panel with the underlying page visible through the left/backdrop strip; its top wordmark is not visually apparent despite the image node in the accessibility tree. Main site wordmark is now visible and loads correctly.
4. Skip-link focus is on the `main` landmark whose box lies beneath the fixed header; visible hero text itself remains below the header.
5. Form errors were visibly/native-validity checked; a dedicated screen-reader announcement/ARIA live-region behavior was not independently verified. Audio, animation timing, external-link destinations beyond href inspection, and real-device Safari/iOS behavior were not tested.

No application files were edited. The only files written are this report and the screenshot-ID index under `/tmp/readiness-browser/`.

## Focused follow-up after hydration fix (no matrix rerun)
Following the workflow restart, only the requested checks were run:

| Home hard reload | HTTP | `prefers-reduced-motion: reduce` | Recovery/hydration console errors | `pageerror` |
|---|---:|---|---:|---:|
| Reduced motion | 200 | true | 0 | 0 |
| No preference | 200 | false | 0 | 0 |

Both reloads rendered the Home H1. The 390×850 mobile drawer was then opened once. Its wordmark was visibly dark teal on the sage panel; the drawer image loaded from `logo-nav-dark-CKfqXvyj.svg` at opacity 1, with panel background `rgb(215, 220, 199)`. Screenshot evidence: `yq9547`.
