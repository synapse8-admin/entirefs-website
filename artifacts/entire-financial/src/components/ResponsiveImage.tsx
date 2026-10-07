import type { ImgHTMLAttributes } from "react";
import images from "@/assets/optimized/images.json";

const files = import.meta.glob("/src/assets/optimized/*.{webp,jpg}", {
  eager: true, query: "?url", import: "default",
}) as Record<string, string>;
export type ImageName = keyof typeof images;

export function ResponsiveImage({
  image, priority = false, sizes = "(min-width:1280px) 600px, (min-width:1024px) 48vw, 100vw", ...props
}: Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet"> & {
  image: keyof typeof images; priority?: boolean;
}) {
  const entry = images[image];
  const variants = entry.variants;
  const url = (filename: string) => files[`/src/assets/optimized/${filename}`];
  const srcSet = (format: "webp" | "jpeg") => variants.map(variant => `${url(variant[format])} ${variant.width}w`).join(", ");
  return (
    <picture className="contents">
      <source type="image/webp" srcSet={srcSet("webp")} sizes={sizes} />
      <img src={url(variants[variants.length - 1].jpeg)} srcSet={srcSet("jpeg")} sizes={sizes}
        width={entry.width} height={entry.height} loading={priority ? "eager" : "lazy"}
        decoding="async" fetchPriority={priority ? "high" : "auto"} {...props} />
    </picture>
  );
}