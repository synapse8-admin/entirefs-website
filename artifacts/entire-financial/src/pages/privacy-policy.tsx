import { Fragment, ReactNode } from "react";
import { ContentBlock } from "@/components/ContentBlock";
import { PageHero } from "@/components/PageHero";
import data from "@/data/privacy-policy.json";

type Block = { type: string; text?: string; items?: string[] };

const PATTERN =
  /(Office of the Australian Information Commissioner|\b0\d{3} \d{3} \d{3}\b|[A-Za-z0-9._+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+|www\.[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*[A-Za-z])/g;
const ext = { target: "_blank", rel: "noopener noreferrer" };
const cls = "text-[#0D6851] underline underline-offset-2 hover:text-[#022F35] break-words";

function linkify(text: string): ReactNode {
  return text.split(PATTERN).map((p, i) => {
    if (i % 2 === 0) return <Fragment key={i}>{p}</Fragment>;
    if (p.startsWith("Office of"))
      return <a key={i} href="https://www.oaic.gov.au/" className={cls} {...ext}>{p}</a>;
    if (p.includes("@")) return <a key={i} href={`mailto:${p}`} className={cls}>{p}</a>;
    if (p.startsWith("www.")) return <a key={i} href={`https://${p}`} className={cls} {...ext}>{p}</a>;
    return <a key={i} href={`tel:${p.replace(/\s/g, "")}`} className={cls}>{p}</a>;
  });
}

export default function PrivacyPolicy() {
  const renderBlock = (b: Block, i: number) => {
    if (b.type === "list")
      return (
        <ul key={i}>
          {b.items?.map((t, j) => <li key={j}>{linkify(t)}</li>)}
        </ul>
      );
    if (b.type === "contact")
      return (
        <address key={i} className="not-italic my-5 space-y-1 border-l-2 border-[#AED137] pl-4">
          {b.items?.map((t, j) => <div key={j}>{linkify(t)}</div>)}
        </address>
      );
    return <p key={i}>{linkify(b.text ?? "")}</p>;
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="[&>section]:pt-32 [&>section]:pb-10 [&_h1]:text-3xl md:[&_h1]:text-4xl lg:[&_h1]:text-4xl [&_h1]:mb-4 [&_p.text-lg]:text-base">
        <PageHero overline={data.eyebrow} title={data.title} subtitle={data.intro} />
      </div>

      <section className="py-12">
        <div className="container mx-auto px-4 max-w-[850px]">
          <div className="mb-10 rounded-lg border border-[#D7DCC7] bg-[#F4F5EF] p-6 text-[#022F35]">
            {data.introduction.map((line, i) => (
              <p key={i} className={`leading-relaxed break-words ${i === 0 ? "font-semibold" : ""} ${i === data.introduction.length - 1 ? "mt-3 text-sm" : ""}`}>
                {linkify(line)}
              </p>
            ))}
          </div>

          <nav aria-label="Contents" className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#0D6851] mb-3">Contents</p>
            <ol className="grid sm:grid-cols-2 gap-x-8 gap-y-1 text-sm">
              {data.sections.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="flex gap-2 py-1 text-[#022F35]/80 hover:text-[#0D6851]">
                    <span className="text-[#0D6851] w-6 shrink-0">{i + 1}.</span>
                    <span>{s.title}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {data.sections.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-[125px] mb-10">
              <ContentBlock className="text-[#022F35] leading-relaxed prose-p:text-[#022F35]/85 prose-li:text-[#022F35]/85 prose-p:my-4 prose-ul:my-4 prose-a:break-words prose-h2:text-2xl prose-h2:font-bold prose-h2:mb-4 prose-h2:mt-0">
                <h2>{s.title}</h2>
                {(s.blocks as Block[]).map(renderBlock)}
              </ContentBlock>
            </section>
          ))}

          <div className="mt-14 rounded-lg border border-[#D7DCC7] bg-[#F4F5EF] p-6 space-y-2 text-sm leading-relaxed text-[#022F35]/80">
            {data.legal.map((l, i) => <p key={i}>{linkify(l)}</p>)}
          </div>
        </div>
      </section>
    </div>
  );
}
