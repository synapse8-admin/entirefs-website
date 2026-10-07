# Contact email on cPanel (PHP 8)

The existing form sends JSON to **`/contact.php`**, with all seven original fields
and a hidden `website` honeypot. No Vite endpoint variable, Composer or Node
process is needed on the cPanel host. Build locally/Replit with:

```sh
pnpm --filter @workspace/entire-financial run build
```

## Build output → server

Upload the **contents** of repo-root `dist/public/` to the site's actual document
root (usually `public_html/`), not a nested `dist/public/` folder:

| Repository/build file | Server location (usual document root) |
|---|---|
| `dist/public/contact.php` | `public_html/contact.php` |
| `dist/public/lib/PHPMailer.php` | `public_html/lib/PHPMailer.php` |
| `dist/public/lib/SMTP.php` | `public_html/lib/SMTP.php` |
| `dist/public/lib/Exception.php` | `public_html/lib/Exception.php` |
| `dist/public/lib/.htaccess` | `public_html/lib/.htaccess` |
| `dist/public/lib/LICENSE` and `README.md` | `public_html/lib/` |
| All remaining `dist/public/` HTML/assets | Same relative paths in `public_html/` |

Show hidden files in cPanel File Manager/FTP and upload `lib/.htaccess` too.
It denies direct HTTP access to library files, while local PHP includes work.
The config sample is **not** copied into the public build.

## Private configuration — upload manually

Copy `artifacts/entire-financial/contact-config.sample.php`, rename the copy
**`contact-config.php`**, edit it privately on the server and place it **one
directory ABOVE the actual document root**:

```text
/home/CPANEL_USER/
├── contact-config.php         ← private SMTP settings
└── public_html/
    ├── contact.php
    ├── lib/
    │   ├── .htaccess
    │   ├── PHPMailer.php
    │   ├── SMTP.php
    │   └── Exception.php
    └── ...built website files
```

For an addon-domain root such as `/home/CPANEL_USER/sites/entirefs/`, put the
config in `/home/CPANEL_USER/sites/contact-config.php` instead. The handler uses
`dirname(__DIR__) . '/contact-config.php'`; it does not search other locations.

The template includes the requested placeholder host `entirefs.com.au`, port
`465`, SMTP username and From address `forms@entirefs.com.au`, and To address
`admin@synapse8.com.au`. Replace `REPLACE_WITH_SMTP_PASSWORD` with the real mailbox
password **on the server**. Confirm the hostname against cPanel's mail-client
settings: its certificate must match; use the correct certificate-covered SMTP
hostname if different. Never disable certificate verification.

Keep port as the integer `465`, not a quoted string. Restrict config permissions
to the PHP account (typically `0600` with PHP-FPM; follow the host's ownership
requirements). Never upload this config or the sample inside the web root.
`contact-config.php` is gitignored at any depth. No credentials are bundled.

Enable PHP **8.0+**, OpenSSL and outbound authenticated SMTPS on port 465.
Ensure `open_basedir`, if enabled, permits reading this private parent-directory
config. Keep the site's existing Apache route/HTTPS/security configuration;
this change does not translate the earlier Node server's redirect/header/indexing
policies to Apache. Do not upload the Node server or run it on cPanel.

## Response contract and checks

- Only POST with `Content-Type: application/json` is accepted.
- 405: unsupported method (`Allow: POST`); 415: wrong content type.
- 400: malformed/non-object JSON; 413: body over 32 KiB.
- 422: missing/invalid fields, with field errors.
- 200 `{ "success": true }`: authenticated SMTP accepted the message.
- A filled honeypot returns the same 200 response **without sending email**.
- 503: absent/invalid configuration or SMTP failure; no diagnostic/secret is exposed.

The From/To addresses come only from the private config. The validated customer
email is Reply-To. Messages are plain text; TLS peer and hostname checks remain
enabled. The submit button disables while sending; failures retain all entries;
success resets the form. Honeypot protection is basic, not a full rate limiter.

Vite/Replit's Node preview does **not execute PHP**; an unmocked submission there
will show the friendly failure message. PHP acceptance and mocked SMTP tests
can run with `node --test artifacts/entire-financial/tests/contact-php.test.mjs`
when PHP 8 is available. Browser mocks confirm the UI contract, not real delivery.

After uploading, verify `/contact.php` GET returns JSON/405 (never PHP source),
`/lib/PHPMailer.php` returns 403, and the private config is not HTTP-accessible.
Then submit a clearly labelled test **with permission** and confirm inbox receipt,
Reply-To and spam placement. SMTP acceptance does not guarantee inbox delivery.
No real email has been sent during implementation.
