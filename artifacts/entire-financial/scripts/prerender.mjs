import { createServer } from "vite";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const directory = path.resolve(import.meta.dirname, "../../../dist/public");
const template = await readFile(path.join(directory, "index.html"), "utf8");
const manifest = JSON.parse(await readFile(path.join(directory, ".vite/manifest.json"), "utf8"));
const base = (process.env.BASE_PATH || "/").replace(/\/$/, "");
const assetPaths = Object.entries(manifest)
  .filter(([source]) => source.startsWith("src/assets/"))
  .map(([source, asset]) => [`${base}/${source}`, `${base}/${asset.file}`]);
const vite = await createServer({
  configFile: path.resolve(import.meta.dirname, "../vite.config.ts"),
  mode: "production", server: { middlewareMode: true }, appType: "custom",
});
try {
  const { render } = await vite.ssrLoadModule("/src/entry-server.tsx");
  const { PUBLIC_ROUTES } = await vite.ssrLoadModule("/src/lib/site.ts");
  const { renderHead } = await vite.ssrLoadModule("/src/lib/metadata.ts");
  const verification = {
    "google-site-verification": process.env.GOOGLE_SITE_VERIFICATION,
    "msvalidate.01": process.env.BING_SITE_VERIFICATION,
  };
  const inventory = [];
  for (const route of [...PUBLIC_ROUTES, "/404"]) {
    const markup = await render(route);
    let html = template
      .replace(/<!--site-head:start-->[\s\S]*?<!--site-head:end-->/,
        `<!--site-head:start-->\n${renderHead(route, route !== "/404", verification)}\n<!--site-head:end-->`)
      .replace('<div id="root"></div>', `<div id="root">${markup}</div>`);
    // Vite's development SSR loader returns source asset URLs. Resolve them to
    // the client build's hashed files so hydration and first-paint requests agree.
    for (const [source, emitted] of assetPaths) html = html.replaceAll(source, emitted);
    if (html.includes("/src/assets/")) throw new Error(`Unresolved pre-rendered asset in ${route}`);
    const output = route === "/" ? path.join(directory, "index.html") :
      route === "/404" ? path.join(directory, "404.html") : path.join(directory, route.slice(1), "index.html");
    await mkdir(path.dirname(output), { recursive: true });
    await writeFile(output, html);
    inventory.push({ route, bytes: Buffer.byteLength(html) });
  }
  const { SITE_URL } = await vite.ssrLoadModule("/src/lib/site.ts");
  await writeFile(path.join(directory, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${PUBLIC_ROUTES.map(route => `  <url><loc>${SITE_URL}${route}</loc></url>`).join("\n")}\n</urlset>\n`);
  await writeFile(path.join(directory, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
  await writeFile(path.join(directory, "routes.json"), JSON.stringify(PUBLIC_ROUTES));
  process.stdout.write(`Pre-rendered ${inventory.length} complete pages, sitemap and robots.txt.\n`);
} finally {
  await vite.close();
}