import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const directory = path.resolve(import.meta.dirname, "../src/assets/fonts");
await mkdir(directory, { recursive: true });
const cssResponse = await fetch("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap", {
  headers: { "User-Agent": "Mozilla/5.0 AppleWebKit/537.36 Chrome/128.0.0.0 Safari/537.36" },
});
if (!cssResponse.ok) throw new Error("Font download failed.");
const css = await cssResponse.text();
const blocks = [...css.matchAll(/\/\* latin \*\/\s*@font-face\s*\{([\s\S]*?)\}/g)];
if (blocks.length !== 4) throw new Error("Expected four Latin WOFF2 font faces.");
let localCss = "";
for (const [, block] of blocks) {
  const weight = block.match(/font-weight:\s*(\d+)/)?.[1];
  const url = block.match(/url\(([^)]+)\)/)?.[1];
  if (!weight || !url || !block.includes("woff2")) throw new Error("Unexpected font response.");
  const response = await fetch(url);
  if (!response.ok) throw new Error("Font file download failed.");
  const filename = `poppins-${weight}-latin.woff2`;
  await writeFile(path.join(directory, filename), Buffer.from(await response.arrayBuffer()));
  localCss += `@font-face {${block.replace(url, `../assets/fonts/${filename}`)}}\n`;
}
await writeFile(path.resolve(import.meta.dirname, "../src/styles/fonts.css"), localCss);
const license = await fetch("https://raw.githubusercontent.com/google/fonts/main/ofl/poppins/OFL.txt");
if (!license.ok) throw new Error("Poppins licence download failed.");
await mkdir(path.resolve(import.meta.dirname, "../public/licenses"), { recursive: true });
await writeFile(path.resolve(import.meta.dirname, "../public/licenses/Poppins-OFL.txt"), await license.text());
process.stdout.write("Prepared licensed Poppins Latin weights 400, 500, 600 and 700 for local hosting.\n");