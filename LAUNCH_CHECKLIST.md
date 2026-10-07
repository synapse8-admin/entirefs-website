# Launch checklist — Entire Financial Services

Approved production origin: **https://www.entirefs.com.au**.

**Do not launch until the domain, enquiry delivery and regulatory-copy approvals below are resolved.** This audit did not publish changes, alter external DNS or verify Google/Bing ownership.

## 1. Approve the unresolved business decisions

- [ ] Have the owner/licensee approve current complaints/FSG wording. Resolve Financial Ombudsman Service versus AFCA references, conflicting complaint timelines, Box Hill North 3129 versus 3128, `info@apexmacro.com` versus `.com.au`, and the FSG privacy sentence containing “consider whether there are other parties where there may not be consent.” Do not silently rewrite legal text.
- [ ] Confirm that Home's 15+ experience counter and About's 20+ experience wording are intentional. Confirm public contact details, provider affiliations and review claims remain current.
- [ ] Choose and approve an enquiry-delivery provider/backend. Until this is done, the form explicitly says it is unavailable; it does not send enquiries or fake success.

## 2. Configure process-based publishing

- [ ] In Replit Publishing, use **Autoscale/process-based hosting**, not a static SPA deployment. The validated repository configuration now targets Autoscale and runs the Node server. The existing published staging deployment was static and has not been replaced by this audit; confirm the selected publishing type in the UI.
- [ ] Build: `pnpm --filter @workspace/entire-financial run build`
- [ ] Start: `pnpm --filter @workspace/entire-financial run serve`
- [ ] Keep the platform-supplied `PORT`; do not run a second server or add a blanket SPA-to-index rewrite. The server is needed for actual 404s, redirects, indexing guards and headers.
- [ ] Set public configuration through Replit environment variables: `SITE_URL=https://www.entirefs.com.au`; leave `SITE_INDEXABLE` unset or set it to `true` for launch. `false` intentionally blocks indexing even on the canonical hostname. Do not copy blank `PORT` from `.env.example` over the platform value.
- [ ] Rebuild after changing ownership tokens or `CONTACT_FORM_ENDPOINT`: those values are embedded at build time. `.env.example` contains no credentials; never place API keys in the public form endpoint.
- [ ] Publish only after owner approval and the blocking checks are satisfied. Repository configuration changes alone do not update an existing deployment.

## 3. Connect both custom domain names and fix HTTPS

- [ ] Open Publishing → Settings → Domains and add **www.entirefs.com.au** and **entirefs.com.au** individually. Replit does not automatically add or redirect the other name.
- [ ] At the domain registrar/DNS provider, copy the **exact A and TXT records shown by Replit** for each entry. No IP address or ownership TXT value is supplied here because those values must come from this deployment.
- [ ] Resolve conflicting web A/AAAA/CNAME records only after reviewing their purpose. Preserve unrelated MX, SPF, DKIM, DMARC and other email records. Do not delete unrelated TXT records.
- [ ] Keep Replit's verification TXT records in DNS for SSL renewal. Wait for both entries to show verified/healthy.
- [ ] Check the certificate separately for apex and www. Both currently failed hostname verification during this audit; this is not an expired-certificate diagnosis. Do not work around it with `curl -k`, disabled certificate validation or browser exceptions.
- [ ] Open the site without certificate warnings on desktop and mobile.
- [ ] Verify each variant reaches the destination in **one permanent 308 hop**, preserving its query:
  - `http://entirefs.com.au/ABOUT/?ref=launch` → `https://www.entirefs.com.au/about?ref=launch`
  - `https://entirefs.com.au/ABOUT/?ref=launch` → the same destination
  - `http://www.entirefs.com.au/ABOUT/?ref=launch` → the same destination
  - `https://www.entirefs.com.au/ABOUT/?ref=launch` → the same destination
- [ ] Use `curl -I` to inspect the first response, then `curl -IL` to check the full chain. Do not confuse the tested localhost forwarded-host simulation with real live TLS/DNS verification.
- [ ] Check all ten routes in `SEO_METADATA_MATRIX.md` directly, then refresh each. Check an unknown path returns HTTP 404 and the custom error page.
- [ ] Confirm `/robots.txt` is 200 and allows production crawling, `/sitemap.xml` is 200 valid XML with exactly ten HTTPS www URLs, and production HTML/headers are **not noindex**. Preview/staging should remain noindexed, without production canonical/schema; its sitemap is intentionally 404.

## 4. Connect and safely test enquiry delivery

- [ ] The approved HTTPS endpoint must accept JSON fields `fullName`, `email`, `phone`, `enquiryType`, `message`, `preferredContact`, `bestTime`; return a 2xx JSON response with `{ "success": true }` **only after genuine acceptance**. Other responses show an error and preserve entered values.
- [ ] Validate and limit every field server-side, enforce spam/rate controls, configure allowed-origin CORS if external, and keep provider credentials server-side in Secrets. The static website server is not an enquiry backend.
- [ ] Agree who receives enquiries, retention/deletion policy, consent wording and failure handling. Do not log message contents or visitor personal information.
- [ ] With permission, submit one clearly identified live test enquiry. Confirm actual receipt in the destination inbox/system, not merely a green UI message.
- [ ] Test invalid input, server rejection, timeout, duplicate clicks and retry; failures must retain entries and never claim success. Check successful reset and keyboard/screen-reader announcements.
- [ ] If unavailable, leave the truthful notice and phone/email alternatives in place; do not pretend the site has a functioning online-enquiry workflow.

## 5. Verify search ownership and submit the sitemap

- [ ] **Google Search Console:** add the Domain property `entirefs.com.au` and copy its supplied DNS TXT verification record into DNS, or add the URL-prefix property `https://www.entirefs.com.au/`. For HTML-tag verification, put the exact `content` value into `GOOGLE_SITE_VERIFICATION` and rebuild/publish; do not paste an entire tag or invent a token.
- [ ] Click Verify in Search Console and wait for success. In Sitemaps submit `https://www.entirefs.com.au/sitemap.xml`. Inspect Home and a service URL; check fetched canonical and indexing eligibility before requesting indexing.
- [ ] **Bing Webmaster Tools:** add the same canonical website, use its supplied DNS record or place the exact HTML-tag `content` value in `BING_SITE_VERIFICATION`, rebuild/publish, and complete its verification. Submit the same sitemap.
- [ ] Empty verification variables emit no tags. Neither service has been verified in this audit.
- [ ] If old staging aliases were indexed, use the appropriate owner-controlled removal/recrawl process. Robots blocking alone cannot guarantee removal of already-indexed URLs.

## 6. Complete real-browser, sharing and performance checks

- [ ] Safari/macOS and a physical iPhone/iPad: portrait/landscape, text zoom to 200%, Home, all service pages, Contact and FSG, sticky header, menus/focus, footer/legal links, selects/radios, reduced motion and phone/email actions.
- [ ] Firefox and Edge: repeat essential navigation and form checks. Automated testing here used Chrome on Linux only.
- [ ] Keyboard and an actual screen reader: skip link, Services disclosure, drawer trap/Escape/restore, form labels, invalid-field descriptions, success/error announcements and legal-page table of contents.
- [ ] Scroll through lazy images and reviews; check real cards, Load more, fallback link and Home→About→Home remount. Inspect mobile footers visually, not just for zero overflow.
- [ ] Open every internal legal/CTA/anchor link. Manually open AFCA and the MoneySmart adviser register: automated HEAD requests received 403, not proof of dead links. No PDF was supplied; FSG is a web document.
- [ ] Open `/favicon.ico`, `/favicon.svg`, `/favicon-48.png`, `/apple-touch-icon.png`, `/icon-192.png`, `/icon-512.png`, `/site.webmanifest` and `/opengraph.jpg`. Confirm fresh icons and legible branded assets.
- [ ] Use Facebook Sharing Debugger, LinkedIn Post Inspector and a real messaging/social share to check title, description and the 1200×630 image. Refresh caches after publishing.
- [ ] Run Google's Rich Results Test on Home and a service URL; inspect errors against visible content. Valid schema does not guarantee a rich result.
- [ ] Run PageSpeed Insights/Lighthouse on the **live canonical HTTPS domain**, mobile and desktop, for Home, Contact and all four service routes. The recorded preview SEO scores include deliberate noindex penalties and are not production SEO scores.
- [ ] Check field LCP/CLS/INP once sufficient real traffic exists; a lab run is not field Core Web Vitals evidence.

## 7. Monitor after launch

- [ ] No analytics property or measurement ID was supplied or invented. If analytics is desired, obtain owner-approved tracking/consent configuration, exclude PII and test actual event receipt before claiming it works.
- [ ] Check publishing logs for `request_failed`, browser errors, 404s, enquiry failures, HTTPS renewal, Search Console/Bing crawl and indexing reports.
- [ ] Inspect enforced nosniff/referrer/permissions/CSP headers and HTTPS HSTS. The full third-party script policy is **report-only**, not a fully enforced CSP; review observed widget/map/approved endpoint origins before tightening it.
- [ ] Keep recovery checkpoints and repeat live smoke checks after any hosting, dependency, metadata or legal-copy change. Roll back through Replit Checkpoints if a release causes broad breakage; do not overwrite approved content to mask a failure.

No rankings, traffic, rich results, favicon display or immediate indexing are guaranteed.