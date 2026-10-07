import { useEffect, useRef, useState } from "react";
import interactiveCursorStyles from "@/styles/interactive-cursors.css?raw";

const widgetSelector = ".sk-ww-google-reviews";
const widgetScript = "https://widgets.sociablekit.com/google-reviews/widget.js";
const googleReviewsUrl = "https://www.google.com/search?q=Entire+Financial+Services+Reviews";

type WidgetWindow = Window & {
  sk_widget_mounts?: Record<string, () => void>;
};

export function GoogleReviewsWidget() {
  const container = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"waiting" | "loading" | "ready" | "error">("waiting");

  useEffect(() => {
    const host = container.current;
    if (!host) return;

    let script: HTMLScriptElement | undefined;
    let cursorStyle: HTMLStyleElement | undefined;
    let checks = 0;
    let timer: number | undefined;
    let started = false;
    const start = () => {
    if (started) return;
    started = true;
    setStatus("loading");

    // The vendor scans the DOM only once. Run it after React commits the host,
    // and reuse its mount hook when Home is visited again through SPA navigation.
    const mount = (window as WidgetWindow).sk_widget_mounts?.[widgetSelector];
    if (mount) {
      try {
        mount();
      } catch (error) {
        console.error("Google reviews widget could not initialize", error);
        setStatus("error");
      }
    } else {
      script = document.createElement("script");
      script.src = widgetScript;
      script.async = true;
      script.onerror = () => setStatus("error");
      document.body.appendChild(script);
    }

    // The loader starts another async script and renders inside a shadow root.
    // Wait for real widget content rather than treating script.onload as ready.
    timer = window.setInterval(() => {
      const root = host.shadowRoot ?? host;
      if (root.querySelector(".sk-card, a[href]")) {
        // Site styles cannot cross the vendor's shadow-root boundary.
        if (host.shadowRoot && !cursorStyle) {
          cursorStyle = document.createElement("style");
          cursorStyle.textContent = interactiveCursorStyles;
          host.shadowRoot.appendChild(cursorStyle);
        }
        setStatus("ready");
        window.clearInterval(timer);
      } else if (++checks >= 40) {
        setStatus("error");
        window.clearInterval(timer);
      }
    }, 500);
    };
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        observer.disconnect();
        start();
      }
    }, { rootMargin: "300px" });
    observer.observe(host);

    return () => {
      observer.disconnect();
      window.clearInterval(timer);
      cursorStyle?.remove();
      if (script) {
        script.onerror = null;
        script.remove();
      }
      // Keep the shared vendor runtime: it manages existing mounts and cleans
      // up detached hosts when its mount hook runs on the next visit.
    };
  }, []);

  return (
    <div aria-busy={status === "loading"} className="min-h-[500px]">
      <div ref={container} className="sk-ww-google-reviews" data-embed-id="25704370" />
      {status !== "ready" && (
        <div className="text-center text-foreground/60 py-6">
          <p role="status" className="mb-3">
            {status === "waiting" ? "Google reviews will load when this section is in view." : status === "loading"
              ? "Loading Google reviews…"
              : "Google reviews are temporarily unavailable here."}
          </p>
          <a
            href={googleReviewsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[#0D6851] underline underline-offset-4"
          >
            Read our Google reviews
          </a>
        </div>
      )}
    </div>
  );
}