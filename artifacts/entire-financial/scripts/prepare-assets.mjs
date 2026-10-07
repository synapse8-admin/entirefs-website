import sharp from "sharp";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const asset = path.resolve(import.meta.dirname, "../src/assets");
const publicDir = path.resolve(import.meta.dirname, "../public");
const optimized = path.join(asset, "optimized");
await mkdir(optimized, { recursive: true });
const photos = [
  "hero-advisory.png", "bevan-heneric.jpg", "about-meeting.jpg",
  "elderly-1.jpg", "elderly-2.jpg", "elderly-3.jpg", "elderly-4.jpg", "elderly-5.jpg",
  "aged-care-main.jpg", "retirement-main.jpg", "transition-main.jpg", "wealth-together.png",
];
const manifest = {};
for (const photo of photos) {
  const input = path.join(asset, photo);
  const metadata = await sharp(input).metadata();
  const name = path.parse(photo).name;
  const widths = [...new Set([360, 640, 960, 1280].map(width => Math.min(width, metadata.width)))];
  const variants = [];
  for (const width of widths) {
    const height = Math.round(metadata.height * width / metadata.width);
    const webp = `${name}-${width}.webp`;
    const jpeg = `${name}-${width}.jpg`;
    await sharp(input).rotate().resize({ width }).webp({ quality: 86, effort: 6 }).toFile(path.join(optimized, webp));
    await sharp(input).rotate().resize({ width }).jpeg({ quality: 88, mozjpeg: true }).toFile(path.join(optimized, jpeg));
    variants.push({ width, height, webp, jpeg });
  }
  manifest[name] = { width: metadata.width, height: metadata.height, variants };
}
await writeFile(path.join(optimized, "images.json"), JSON.stringify(manifest, null, 2));
const dimensions = {};
for (const filename of await readdir(path.join(asset, "logos"))) {
  if (!filename.endsWith(".png")) continue;
  const file = path.join(asset, "logos", filename);
  const info = await sharp(file).metadata();
  const width = Math.min(info.width, 344);
  const height = Math.round(info.height * width / info.width);
  // Lossless palette optimisation at no more than twice the displayed logo width.
  const buffer = await sharp(file).resize({ width }).png({ compressionLevel: 9, palette: false }).toBuffer();
  await writeFile(file, buffer);
  dimensions[filename] = { width, height };
}
await writeFile(path.join(asset, "logos/dimensions.json"), JSON.stringify(dimensions, null, 2));

const submark = await sharp(path.join(asset, "logo-submark.png")).trim().resize(440, 440, { fit: "inside" }).toBuffer();
const icon = await sharp({ create: { width: 512, height: 512, channels: 4, background: "#022F35" } })
  .composite([{ input: submark, gravity: "centre" }]).png().toBuffer();
const iconBuffers = [];
for (const size of [16, 32, 48, 180, 192, 512]) {
  const buffer = await sharp(icon).resize(size, size).png().toBuffer();
  const filename = size === 180 ? "apple-touch-icon.png" : size >= 192 ? `icon-${size}.png` : `favicon-${size}.png`;
  await writeFile(path.join(publicDir, filename), buffer);
  if (size <= 48) iconBuffers.push({ size, buffer });
}
await writeFile(path.join(publicDir, "favicon.png"), iconBuffers[2].buffer);
await writeFile(path.join(publicDir, "favicon.svg"),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><image width="512" height="512" href="data:image/png;base64,${icon.toString("base64")}"/></svg>`);
const header = Buffer.alloc(6 + iconBuffers.length * 16);
header.writeUInt16LE(1, 2); header.writeUInt16LE(iconBuffers.length, 4);
let offset = header.length;
iconBuffers.forEach(({ size, buffer }, index) => {
  const entry = 6 + index * 16;
  header[entry] = size; header[entry + 1] = size;
  header.writeUInt16LE(1, entry + 4); header.writeUInt16LE(32, entry + 6);
  header.writeUInt32LE(buffer.length, entry + 8); header.writeUInt32LE(offset, entry + 12);
  offset += buffer.length;
});
await writeFile(path.join(publicDir, "favicon.ico"), Buffer.concat([header, ...iconBuffers.map(item => item.buffer)]));
const lightLogo = await readFile(path.join(asset, "logo-nav-beige.svg"), "utf8");
const darkLogo = lightLogo.replace(/fill="rgb\(214, 220, 197\)"/g, 'fill="#022F35"');
await writeFile(path.join(asset, "logo-nav-dark.svg"), darkLogo);
await writeFile(path.join(publicDir, "logo-brand.svg"), darkLogo);
const logo = await sharp(path.join(asset, "logo-nav-beige.svg")).resize(800, 500).png().toBuffer();
await sharp({ create: { width: 1200, height: 630, channels: 3, background: "#022F35" } })
  .composite([{ input: logo, left: 200, top: 60 }])
  .jpeg({ quality: 90, mozjpeg: true }).toFile(path.join(publicDir, "opengraph.jpg"));
await writeFile(path.join(publicDir, "site.webmanifest"), JSON.stringify({
  name: "Entire Financial Services", short_name: "Entire FS", start_url: "/", display: "browser",
  theme_color: "#022F35", background_color: "#D7DCC7",
  icons: [192, 512].map(size => ({ src: `/icon-${size}.png`, sizes: `${size}x${size}`, type: "image/png", purpose: "any" })),
}, null, 2));
process.stdout.write("Prepared responsive photographs, logo dimensions, brand icons and sharing image.\n");