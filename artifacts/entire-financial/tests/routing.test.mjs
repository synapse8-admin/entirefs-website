import assert from "node:assert/strict";
import { test } from "node:test";
import { containedFile, previewHtml, routeDecision } from "../server/routing.mjs";
import { DEFAULT_SITE_URL, PUBLIC_ROUTES } from "../src/lib/site.ts";
const canonical = "www.entirefs.com.au";
for (const [host, protocol] of [[canonical, "http"], ["entirefs.com.au", "http"], ["entirefs.com.au", "https"]]) {
  test(`${protocol} ${host} redirects in one hop, preserving route/query`, () => {
    assert.deepEqual(routeDecision("/ABOUT/?campaign=one%20two", host, protocol, DEFAULT_SITE_URL, PUBLIC_ROUTES),
      { status: 308, location: `${DEFAULT_SITE_URL}/about?campaign=one%20two` });
  });
}
test("canonical routes and previews are distinguished without open redirects", () => {
  assert.equal(routeDecision("/about", canonical, "https", DEFAULT_SITE_URL, PUBLIC_ROUTES).canonical, true);
  assert.equal(routeDecision("/about", "preview.invalid", "https", DEFAULT_SITE_URL, PUBLIC_ROUTES).canonical, false);
  assert.deepEqual(routeDecision("/ABOUT/", "preview.invalid", "https", DEFAULT_SITE_URL, PUBLIC_ROUTES), { status: 308, location: "/about" });
});
test("path traversal, dotfiles, NULs and invalid encodings are rejected", () => {
  for (const route of ["/%2e%2e%2fsecret", "/.env", "/%00", "/a%5csecret"]) {
    assert.equal(routeDecision(route, canonical, "https", DEFAULT_SITE_URL, PUBLIC_ROUTES).status, 404);
  }
  assert.equal(routeDecision("/%zz", canonical, "https", DEFAULT_SITE_URL, PUBLIC_ROUTES).status, 400);
  assert.equal(containedFile("/public", "/../secret"), null);
});
test("preview HTML removes production identity and verification", () => {
  const html = '<html lang="en-AU"><meta name="robots" content="index, follow"><link rel="canonical" href="x"><meta property="og:url" content="x"><meta name="google-site-verification" content="x"><script id="business-structured-data">{"x":1}</script><main>Approved content</main>';
  const preview = previewHtml(html);
  assert.ok(preview.includes("data-noindex"));
  assert.ok(preview.includes("noindex, nofollow"));
  assert.ok(!preview.includes("canonical"));
  assert.ok(!preview.includes("verification"));
  assert.ok(!preview.includes("structured-data"));
  assert.ok(preview.includes("Approved content"));
});