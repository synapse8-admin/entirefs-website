import { renderToPipeableStream } from "react-dom/server";
import { PassThrough } from "node:stream";
import App from "./App";

export function render(path: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const output = new PassThrough();
    const chunks: Buffer[] = [];
    output.on("data", (chunk: Buffer) => chunks.push(chunk));
    output.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    output.on("error", reject);
    const stream = renderToPipeableStream(<App ssrPath={path} />, {
      onAllReady() { stream.pipe(output); },
      onError(error) { reject(error); },
    });
  });
}