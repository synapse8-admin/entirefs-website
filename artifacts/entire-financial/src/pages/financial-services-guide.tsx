import { Fragment, ReactNode, useRef } from "react";
import { PageHero } from "@/components/PageHero";
import { useFsgContentsPosition } from "@/components/useFsgContentsPosition";
import data from "@/data/public-fsg.json";

type Block = { type: string; text?: string; items?: string[] };
type Section = { id: string; title: string; navLabel: string; panel: boolean; blocks: Block[] };

const ASIC = "https://moneysmart.gov.au/financial-advice/financial-advisers-register";
const PATTERN =
  /(Financial Adviser Register|\b03 8592 0081\b|\b0\d{3} \d{3} \d{3}\b|\b1[38]00 \d{3} \d{3}\b|[A-Za-z0-9._+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+|www\.[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*[A-Za-z])/g;
const linkCls = "text-[#0D6851] underline underline-offset-2 hover:text-[#022F35] break-words";

function linkify(text: string): ReactNode {
  const parts = text.split(PATTERN);
  return parts.map((p, i) => {
    if (i % 2 === 0) return <Fragment key={i}>{p}</Fragment>;
    const ext = { target: "_blank", rel: "noopener noreferrer" };
    if (p === "Financial Adviser Register")
      return <a key={i} href={ASIC} className={linkCls} {...ext}>{p}</a>;
    if (p.includes("@")) return <a key={i} href={`mailto:${p}`} className={linkCls}>{p}</a>;
    if (p.startsWith("www.")) return <a key={i} href={`https://${p}`} className={linkCls} {...ext}>{p}</a>;
    return <a key={i} href={`tel:${p.replace(/\s/g, "")}`} className={linkCls}>{p}</a>;
  });
}

function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        if (b.type === "heading")
          return <h3 key={i} className="font-sans text-lg font-semibold text-[#022F35] mt-6 mb-2">{linkify(b.text ?? "")}</h3>;
        if (b.type === "paragraph")
          return <p key={i} className="text-base leading-relaxed text-[#022F35]/85 mb-4">{linkify(b.text ?? "")}</p>;
        if (b.type === "list")
          return (
            <ul key={i} className="list-disc pl-6 mb-4 space-y-1.5 text-base leading-relaxed text-[#022F35]/85">
              {b.items?.map((t, j) => <li key={j}>{linkify(t)}</li>)}
            </ul>
          );
        if (b.type === "ordered-list")
          return (
            <ol key={i} className="list-decimal pl-6 mb-4 space-y-2 text-base leading-relaxed text-[#022F35]/85">
              {b.items?.map((t, j) => <li key={j}>{linkify(t)}</li>)}
            </ol>
          );
        if (b.type === "contact")
          return (
            <address key={i} className="not-italic mb-4 rounded-lg border border-[#D7DCC7] bg-[#F4F5EF] p-5 space-y-1 text-base text-[#022F35]">
              {b.items?.map((t, j) => <div key={j}>{linkify(t)}</div>)}
            </address>
          );
        return null;
      })}
    </>
  );
}

export default function FinancialServicesGuide() {
  const sections = data.sections as Section[];
  const mobileNav = useRef<HTMLDetailsElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const desktopColumn = useRef<HTMLElement>(null);
  const desktopMenu = useRef<HTMLElement>(null);
  const mobileSlot = useRef<HTMLDivElement>(null);
  useFsgContentsPosition(content, desktopColumn, desktopMenu, mobileSlot, mobileNav);
  const close = () => { if (mobileNav.current) mobileNav.current.open = false; };

  const nav = (
    <ol className="space-y-1 text-sm">
      {sections.map((s, i) => (
        <li key={s.id}>
          <a href={`#${s.id}`} onClick={close} className="flex gap-2 py-1 text-[#022F35]/80 hover:text-[#0D6851]">
            <span className="text-[#0D6851] w-5 shrink-0">{i + 1}.</span>
            <span>{s.navLabel}</span>
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <PageHero overline="Regulatory Document" title={data.title} />

      <section className="py-12">
        <div className="container mx-auto px-4 md:px-10 max-w-6xl">
          <div ref={content} className="lg:grid lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-12">
            <div ref={mobileSlot} className="lg:hidden mb-8">
            <details
                ref={mobileNav}
                className="z-20 rounded-lg border border-[#D7DCC7] bg-white shadow-sm"
              >
                <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-[#022F35]">On this page</summary>
                <nav aria-label="On this page" className="max-h-[60vh] overflow-y-auto px-4 pb-4">{nav}</nav>
            </details>
            </div>
            <aside ref={desktopColumn} className="hidden lg:block">
              <nav
                ref={desktopMenu}
                aria-label="On this page"
                className="max-h-[calc(100vh-150px)] overflow-y-auto"
              >
                <p className="text-xs font-semibold uppercase tracking-widest text-[#0D6851] mb-3">On this page</p>
                {nav}
              </nav>
            </aside>

            <div className="max-w-3xl min-w-0">
              <div className="rounded-lg border border-[#D7DCC7] bg-[#F4F5EF] p-6 mb-8">
                {data.introduction.map((line, i) => (
                  <p key={i} className={`text-base leading-relaxed text-[#022F35] break-words ${i === 0 ? "font-semibold mb-2" : ""}`}>
                    {linkify(line)}
                  </p>
                ))}
              </div>

              <div className="rounded-lg border-l-4 border-[#0D6851] border-y border-r border-y-[#D7DCC7] border-r-[#D7DCC7] bg-[#F4F5EF] p-6 mb-12">
                <h2 className="font-sans text-xl font-bold text-[#022F35] mb-2">{data.disclosure.title}</h2>
                <p className="text-base leading-relaxed text-[#022F35]">{data.disclosure.text}</p>
              </div>

              {sections.map((s) => (
                <section
                  key={s.id}
                  id={s.id}
                  aria-labelledby={`${s.id}-h`}
                  className="scroll-mt-[190px] lg:scroll-mt-[130px] mb-12"
                >
                  <div className={s.panel ? "rounded-lg border border-[#D7DCC7] bg-[#F4F5EF] p-6" : ""}>
                    <h2 id={`${s.id}-h`} className="font-sans text-2xl font-bold text-[#022F35] mb-4">{s.title}</h2>
                    <Blocks blocks={s.blocks} />
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
