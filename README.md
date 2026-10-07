**Site:** https://entirefs.com.au
**Prepared as:** Technical as-built / handover documentation
**Scope:** Hosting, CI/CD deployment pipeline, SSL, DNS, and the contact form

> This document describes how the Entire Financial website is built, hosted, deployed, and
> maintained. Replace any `__PLACEHOLDER__` values and store real passwords in a password
> manager — never in this document or in the code repository.

---

## 1. Summary

The Entire Financial website is a **static, pre-rendered multi-page site** (React + Vite with a
build-time prerender step) hosted on **cPanel shared hosting** with **Synergy**. Code lives in a
private **GitHub** repository. Every push to `main` automatically builds and deploys the site via
**GitHub Actions**. SSL is automatic (Let's Encrypt / AutoSSL, auto-renewing). A **contact form**
emails enquiries to the business via a PHP handler and a dedicated sending mailbox.

The domain's **email is hosted on Microsoft 365** (not on the web server). This separation matters
for the contact form and email authentication (see sections 8–9).

---

## 2. Infrastructure at a glance

| Item | Value |
|---|---|
| Public URL | https://entirefs.com.au |
| Hosting provider | Synergy (cPanel shared hosting) |
| Server IP | 43.250.142.67 |
| cPanel username | entirefs |
| Home directory | /home/entirefs |
| Web root | /home/entirefs/public_html |
| Domain registrar / DNS | Crazy Domains (Dreamscape) |
| Email platform | Microsoft 365 |
| Source code | GitHub — private repo `synapse8-admin/entirefs-website` |
| Framework | React + Vite, static multi-page (prerendered) |
| Package name (build filter) | `@workspace/entire-financial` |
| Package manager | pnpm (workspace / monorepo) |
| CI/CD | GitHub Actions → FTPS deploy to cPanel |
| SSL | Let's Encrypt via cPanel AutoSSL (auto-renewing) |

---

## 3. Architecture overview

```
  Developer (Replit)
        │  edit code, push to GitHub
        ▼
  GitHub repo: entirefs-website  (branch: main)
        │  push triggers…
        ▼
  GitHub Actions (.github/workflows/deploy.yml)
        │  1. install pnpm + Node
        │  2. build (Vite + prerender → static pages)
        │  3. upload over FTPS
        ▼
  cPanel server (public_html)  ◄── AutoSSL issues/renews HTTPS certificates
        │
        ▼
  Live site: https://entirefs.com.au
        │  contact form POST → /contact.php
        ▼
  contact.php → authenticated SMTP (cPanel mailbox) → enquiry delivered to inbox
```

The build (including the prerender that generates each route as static HTML) happens **in GitHub's
cloud**. The cPanel server only receives finished files plus the PHP contact handler.

---

## 4. Source code & repository

- **Repository:** `synapse8-admin/entirefs-website` (private, GitHub)
- **Primary branch:** `main` (pushing here triggers deployment)
- **Structure:** pnpm workspace (monorepo). The website lives in `artifacts/entire-financial/`.

```
entirefs-website/                      (repo root)
├─ .github/workflows/deploy.yml        CI/CD pipeline
├─ pnpm-workspace.yaml
└─ artifacts/
   └─ entire-financial/                ← THE WEBSITE  (package: @workspace/entire-financial)
      ├─ index.html
      ├─ src/
      │  └─ pages/                      (about, aged-care, complaints, contact, etc.)
      ├─ public/
      │  ├─ contact.php                 contact-form handler
      │  └─ lib/                        bundled PHPMailer (+ .htaccess blocking access)
      ├─ scripts/prerender.mjs          generates static route pages at build time
      ├─ server/                        dev-only Node server — NOT used in production
      ├─ contact-config.sample.php      template for server config (no real secrets)
      └─ vite.config.ts
```

### ⚠️ Build output path (important, non-obvious)

This project's build outputs to the **repo root** `dist/public/`, NOT inside the package folder.
The build log shows paths like `../../dist/public/...`. This is why the deploy workflow's
`local-dir` is `./dist/public/` (see section 5). Do not assume `artifacts/entire-financial/dist/`.

### Build command

```bash
pnpm install
pnpm --filter @workspace/entire-financial run build
```

The `build` script runs `vite build` **and then** `node scripts/prerender.mjs`, which generates
each route as a static HTML page (11 pages: home, about, aged-care, complaints,
financial-services-guide, privacy-policy, retirement-planning, services, superannuation,
transition-to-retirement, contact) plus sitemap and robots.txt.

- `dist/` is NOT committed — regenerated every build.
- `contact-config.php` is NOT committed — `.gitignore`d; lives only on the server.

---

## 5. CI/CD pipeline (GitHub Actions)

On every push to `main` (or manual run from the Actions tab), the pipeline installs pnpm + Node,
builds the site (Vite + prerender), and uploads the output over FTPS to `public_html`.

### The workflow file (`.github/workflows/deploy.yml`)

```yaml
name: Deploy Entire Financial to cPanel

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout source
        uses: actions/checkout@v5

      - name: Install pnpm
        uses: pnpm/action-setup@v6
        with:
          version: 10

      - name: Set up Node
        uses: actions/setup-node@v5
        with:
          node-version: 20
          cache: pnpm

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build the site
        run: pnpm --filter @workspace/entire-financial run build

      - name: Deploy to cPanel over FTPS
        uses: SamKirkland/FTP-Deploy-Action@4.3.2
        with:
          server: ${{ secrets.FTP_SERVER }}
          username: ${{ secrets.FTP_USERNAME }}
          password: ${{ secrets.FTP_PASSWORD }}
          protocol: ftps
          port: 21
          local-dir: ./dist/public/     # repo-root output — NOT artifacts/.../dist
          server-dir: ./
```

### Deploy credentials (GitHub repository secrets)

Under **GitHub repo → Settings → Secrets and variables → Actions**:

| Secret | Value | Notes |
|---|---|---|
| `FTP_SERVER` | 43.250.142.67 | Server IP (DNS-independent) |
| `FTP_USERNAME` | deploy@entirefs.com.au | Dedicated, directory-scoped FTP account |
| `FTP_PASSWORD` | `__STORED_IN_PASSWORD_MANAGER__` | Keep free of exotic symbols (`% \ $ # ` etc.) |

### Dedicated deploy FTP account

Created in cPanel → FTP Accounts, scoped to `public_html`:
- **Username:** `deploy@entirefs.com.au`
- **Directory:** `public_html` (so the account can only touch the website folder; this is why
  the workflow uses `server-dir: ./`)
- **Protocol/port:** FTPS (explicit), port 21.

### Note on pushing from Replit

Replit's GitHub integration was unreliable during setup. Pushes were done via the Shell using a
GitHub **Personal Access Token**:
```
git push https://synapse8-admin:TOKEN@github.com/synapse8-admin/entirefs-website.git main
```
If a push is rejected with "fetch first" (divergent branches — e.g. workflow edits made directly
on GitHub), run `git pull --no-rebase <same URL> main` first, then push.
**Never paste a token into chat or commit it; revoke any token that gets exposed.**

### Deploy manages `public_html`

The deploy syncs `public_html` to the build output and may remove files there that aren't part of
the build. Keep `public_html` dedicated to the site. The one hand-placed file,
`contact-config.php`, lives **above** `public_html` and is untouched.

---

## 6. Hosting & file locations (cPanel)

| Path | What it is |
|---|---|
| `/home/entirefs/public_html/` | Web root — the deployed site |
| `/home/entirefs/public_html/index.html` | Home page |
| `/home/entirefs/public_html/<route>/` | Prerendered route pages (about, services, etc.) |
| `/home/entirefs/public_html/contact.php` | Contact-form handler |
| `/home/entirefs/public_html/lib/` | Bundled PHPMailer (+ `.htaccess` blocking access) |
| `/home/entirefs/public_html/.htaccess` | Routing, HTTPS redirect, caching, headers |
| `/home/entirefs/contact-config.php` | **Private** contact config (SMTP + destination). Above web root, not in repo. |
| `/home/entirefs/public_html/error_log` | PHP error log (safe to delete to clear noise) |

- **PHP version:** 8.1 (confirmed via server logs — `php81`). PHPMailer 7.1.1 targets this fine.

---

## 7. SSL / HTTPS

- **Provider:** Let's Encrypt via cPanel **AutoSSL**.
- **Covers:** `entirefs.com.au`, `www.entirefs.com.au`, and `mail.entirefs.com.au`.
- **Renewal:** automatic.
- **Manage:** cPanel → SSL/TLS → **Status** tab → "Run AutoSSL" if ever needed.
- The site's `.htaccess` enforces HTTP → HTTPS.

> `mail.entirefs.com.au` needs its own A record (see section 8) so AutoSSL can issue a cert for it.
> That cert is what the contact form's SMTP connection validates against.

---

## 8. DNS configuration (Crazy Domains)

| Type | Name | Value | Purpose |
|---|---|---|---|
| A | `entirefs.com.au` (root) | 43.250.142.67 | Website |
| A | `www` | 43.250.142.67 | Website (www) |
| A | `mail` | 43.250.142.67 | **Mail service hostname** (so it resolves + gets a cert for SMTP) |
| MX | `entirefs.com.au` | entirefs-com-au.mail.protection.outlook.com (pri 1) | **Email → Microsoft 365** |
| CNAME | `autodiscover` | autodiscover.outlook.com | Microsoft 365 |
| CNAME | `dkim` (selector1) | selector1-...entirefinancial.onmicrosoft.com | Microsoft 365 DKIM |
| CNAME | `dkim` (selector2) | selector2-...entirefinancial.onmicrosoft.com | Microsoft 365 DKIM |
| CNAME | `enterpriseenrollment`, `enterpriseregistration`, `lyncdiscover`, `msoid`, `sip` | various Microsoft | Microsoft 365 / Teams |

> **Do not alter the email records** (MX, autodiscover, dkim, and the other Microsoft CNAMEs).
> Changing them breaks the business's email. Only the A records relate to the website/mail-host.

### ⚠️ Outstanding DNS item — SPF record

At handover, the domain had **no SPF (TXT) record**, and the registrar's interface refused to add
one (reporting a phantom "TXT already exists" conflict with no visible TXT record). This should be
resolved with the registrar. The record to add on the **root** domain is:

```
v=spf1 include:spf.protection.outlook.com ip4:43.250.142.67 ~all
```

This authorises **both** Microsoft 365 (normal email) **and** the cPanel server (contact form).
It is a single TXT record; never create two `v=spf1` records.

Note: contact-form emails currently pass authentication via **DKIM alignment** (which cleared the
"unverified sender" warning), so the form works without SPF — but adding SPF is correct practice
and strengthens the whole domain's email posture.

---

## 9. Contact form — how it works

### Overview

The contact form is on the contact page. It submits to a PHP handler that emails the enquiry to the
business. Enquiries are delivered to **bevan@entirefs.com.au** (a Microsoft 365 mailbox).

### Flow

```
Customer submits form → JSON POST to /contact.php
        │  honeypot check, server-side validation, header-injection sanitising
        │  reads SMTP settings from /home/entirefs/contact-config.php
        │  sends via authenticated SMTP (PHPMailer, implicit TLS / SMTPS, port 465)
        ▼
Enquiry email delivered
   From:     forms@entirefs.com.au
   To:       bevan@entirefs.com.au
   Reply-To: the customer's submitted email (reply goes straight to them)
```

### Pieces

| Piece | Location | Role |
|---|---|---|
| Contact form | `src/pages/contact.tsx` | The React form (fields, validation, states, honeypot) |
| `contact.php` | `public/` → `public_html/contact.php` | Receives submission, sends email |
| PHPMailer 7.1.1 | `public/lib/` → `public_html/lib/` | Bundled mail library (no Composer) |
| `contact-config.php` | `/home/entirefs/` (**server only**) | Private SMTP settings + destination |

### The private config file — ⚠️ exact key names matter

`contact.php` expects **specific config key names** (different from a plain `host`/`port`/etc.).
Using the wrong names causes an "Incomplete mail configuration" error and a 503. The correct file:

```php
<?php
return [
    'smtp_host'     => 'mail.entirefs.com.au',
    'smtp_port'     => 465,                        // integer, not string
    'smtp_username' => 'forms@entirefs.com.au',
    'smtp_password' => '__MAILBOX_PASSWORD__',
    'from_email'    => 'forms@entirefs.com.au',
    'from_name'     => 'Entire Financial Website',
    'to_email'      => 'bevan@entirefs.com.au',
    'to_name'       => 'Bevan',
];
```

- **Permissions:** `0600` (owner read/write only).
- `smtp_port` must be the integer `465` (handler checks `=== 465`).
- Sending host is `mail.entirefs.com.au` (has a valid cert; verification stays ON).
- **Sending mailbox** `forms@entirefs.com.au` is a real **cPanel** mailbox (own password), used only
  for sending — separate from the Microsoft 365 mailboxes. It won't receive external mail (MX points
  to M365), which is fine.

### Security features in the handler

Honeypot; server-side validation (including allowed values for enquiry-type/preferred-contact/best-time
fields); header-injection protection; 32 KB request cap; TLS cert verification enabled; generic JSON
errors (no credentials/diagnostics exposed); JSON responses with proper status codes (405/415/413/400/422/503).

---

## 10. Common maintenance tasks

**Update site content/design:** edit in Replit → push to `main` → pipeline builds & deploys (~2 min;
the prerender makes it a little slower than a plain build). Check Actions for green.

**Change where enquiries go:** edit `/home/entirefs/contact-config.php` → change `to_email` / `to_name`
→ save. Immediate, no redeploy.

**Rotate the sending mailbox password:** cPanel → Email Accounts → change `forms@entirefs.com.au`
password → update `smtp_password` in `contact-config.php` to match.

**Rotate deploy FTP password:** cPanel → FTP Accounts → change `deploy@entirefs.com.au` → update the
`FTP_PASSWORD` GitHub secret.

---

## 11. Troubleshooting

| Symptom | Cause / fix |
|---|---|
| Site changes not live | Check Actions tab; red = build/deploy failed. Build-step `ENOENT .../dist/public` means the `local-dir` path is wrong (must be repo-root `./dist/public/`). |
| Contact form 503, log says "Incomplete mail configuration" | Config **key names** don't match what `contact.php` expects — use the `smtp_*` / `from_*` / `to_*` keys in section 9, not `host`/`port`/etc. |
| Contact form 503, log shows an SMTP/cert error | Check `smtp_host` matches a hostname with a valid cert (`mail.entirefs.com.au`), mailbox password matches, port is `465`. |
| Enquiries land in Junk / "can't verify sender" | Email authentication — add the SPF record (section 8). (DKIM currently covers this.) |
| `/about` or other route 404s | `.htaccess` missing from `public_html` — redeploy. |

Diagnostics tip: the handler logs to `/home/entirefs/public_html/error_log`. Temporary verbose SMTP
logging can be re-enabled in `contact.php` if needed, but should be removed afterward.

---

## 12. Access & credentials inventory

Store actual values in a password manager, not here.

| Credential | Used for | Stored where |
|---|---|---|
| cPanel login (`entirefs`) | Hosting control | `Through Synergy Portal` |
| Deploy FTP (`deploy@entirefs.com.au`) | GitHub Actions deploy | GitHub secret + `__PASSWORD_MANAGER__` |
| Sending mailbox (`forms@entirefs.com.au`) | Contact-form SMTP | `contact-config.php` on server + `__PASSWORD_MANAGER__` |
| GitHub access / PAT | Source + pipeline + pushes | GitHub account / `__in S8 Github in Keeper__` |
| Crazy Domains login | DNS | `__PASSWORD_MANAGER__` |
| Microsoft 365 admin | Business email | `Not managed by S8` |

---

*End of as-built guide.*
