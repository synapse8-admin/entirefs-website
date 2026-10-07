import type { Plugin } from "vite";
import { renderHead } from "../src/lib/metadata";

export function seoPlugin(verification: Record<string, string | undefined>): Plugin {
  return {
    name: "site-metadata",
    transformIndexHtml: {
      order: "post",
      handler(html, context) {
        const pathname = (context.originalUrl ?? context.path).split("?")[0];
        return html.replace("<!--site-head-->", `<!--site-head:start-->\n${renderHead(context.server ? pathname : "/", !context.server, verification)}\n<!--site-head:end-->`);
      },
    },
  };
}