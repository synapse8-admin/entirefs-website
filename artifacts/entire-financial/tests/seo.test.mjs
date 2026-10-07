import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import sharp from "sharp";
import { DEFAULT_SITE_URL, PUBLIC_ROUTES } from "../src/lib/site.ts";
const root = new URL("../../../dist/public/", import.meta.url);
const titles = new Set(), descriptions = new Set();
for (const route of PUBLIC_ROUTES) {
  test(`${route} has complete initial HTML and unique production metadata`, async () => {
    const html = await readFile(new URL(route === "/" ? "index.html" : `${route.slice(1)}/index.html`, root), "utf8");
    assert.equal((html.match(/<h1\b/g) || []).length, 1);
    assert.equal((html.match(/<title>/g) || []).length, 1);
    assert.equal((html.match(/<meta name="description"/g) || []).length, 1);
    assert.equal((html.match(/rel="canonical"/g) || []).length, 1);
    const title = html.match(/<title>(.*?)<\/title>/)?.[1];
    const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1];
    assert.ok(title && !titles.has(title)); titles.add(title);
    assert.ok(description && !descriptions.has(description)); descriptions.add(description);
    assert.ok(html.includes(`<link rel="canonical" href="${DEFAULT_SITE_URL}${route}">`));
    assert.ok(html.includes('content="index, follow"'));
    assert.ok(html.includes('property="og:image"'));
    assert.ok(html.includes('name="twitter:card"'));
    assert.ok(html.includes('lang="en-AU"'));
    assert.ok(html.includes('id="main-content"'));
    assert.ok(!html.includes("Loading page…"));
    assert.ok(!html.includes("/src/assets/"));
    const body = html.match(/<main\b[\s\S]*?<\/main>/)?.[0];
    assert.ok(body && body.replace(/<[^>]+>/g, "").length > 100);
    if (!process.env.BING_SITE_VERIFICATION) assert.ok(!html.includes("msvalidate.01"));
    if (!process.env.GOOGLE_SITE_VERIFICATION) assert.ok(!html.includes("google-site-verification"));
  });
}
test("sitemap contains exactly the canonical public routes; 404 is excluded", async () => {
  const xml = await readFile(new URL("sitemap.xml", root), "utf8");
  const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
  assert.deepEqual(urls, PUBLIC_ROUTES.map(route => `${DEFAULT_SITE_URL}${route}`));
  const robots = await readFile(new URL("robots.txt", root), "utf8");
  assert.ok(robots.includes(`Sitemap: ${DEFAULT_SITE_URL}/sitemap.xml`));
  const missing = await readFile(new URL("404.html", root), "utf8");
  assert.ok(missing.includes("noindex, nofollow"));
  assert.ok(!missing.includes('rel="canonical"'));
});
test("brand icons are square at each expected size and sharing image is 1200×630", async () => {
  for (const size of [16, 32, 48, 180, 192, 512]) {
    const filename = size === 180 ? "apple-touch-icon.png" : size >= 192 ? `icon-${size}.png` : `favicon-${size}.png`;
    const metadata = await sharp(await readFile(new URL(filename, root))).metadata();
    assert.equal(metadata.width, size); assert.equal(metadata.height, size);
  }
  const social = await sharp(await readFile(new URL("opengraph.jpg", root))).metadata();
  assert.equal(social.width, 1200); assert.equal(social.height, 630);
});