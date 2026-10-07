import { RefObject, useEffect } from "react";

/**
 * The site's overflow-hidden wrappers create non-scrolling sticky containers.
 * Position only the FSG controls against the viewport, bounded by its content.
 */
export function useFsgContentsPosition(
  content: RefObject<HTMLDivElement | null>,
  desktopColumn: RefObject<HTMLElement | null>,
  desktopMenu: RefObject<HTMLElement | null>,
  mobileSlot: RefObject<HTMLDivElement | null>,
  mobileMenu: RefObject<HTMLDetailsElement | null>,
) {
  useEffect(() => {
    let frame = 0;
    let disposed = false;
    const reset = (element: HTMLElement) => {
      for (const key of ["position", "top", "left", "width"] as const) element.style[key] = "";
    };
    const update = () => {
      frame = 0;
      if (disposed || !content.current) return;
      const end = content.current.getBoundingClientRect().bottom;
      const desktop = window.matchMedia("(min-width: 1024px)").matches;
      const column = desktopColumn.current;
      const menu = desktopMenu.current;
      if (column && menu) {
        const bounds = column.getBoundingClientRect();
        if (desktop && bounds.top < 125) {
          Object.assign(menu.style, {
            position: "fixed",
            top: `${Math.min(125, end - menu.offsetHeight - 24)}px`,
            left: `${bounds.left}px`,
            width: `${bounds.width}px`,
          });
        } else reset(menu);
      }
      const slot = mobileSlot.current;
      const mobile = mobileMenu.current;
      if (slot && mobile) {
        const bounds = slot.getBoundingClientRect();
        if (!desktop && bounds.top < 101) {
          const height = (mobile.querySelector("summary")?.getBoundingClientRect().height ?? 44) + 2;
          slot.style.minHeight = `${height}px`;
          Object.assign(mobile.style, {
            position: "fixed",
            top: `${Math.min(101, end - height - 24)}px`,
            left: `${bounds.left}px`,
            width: `${bounds.width}px`,
          });
        } else {
          reset(mobile);
          slot.style.minHeight = "";
        }
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const observer = new ResizeObserver(schedule);
    if (content.current) observer.observe(content.current);
    document.fonts.ready.then(() => { if (!disposed) schedule(); });
    update();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [content, desktopColumn, desktopMenu, mobileSlot, mobileMenu]);
}