import mlcLogo from "@/assets/logos/mlc.png";
import { useState } from "react";
import logoDimensions from "@/assets/logos/dimensions.json";
import nabLogo from "@/assets/logos/nab.png";
import neosLogo from "@/assets/logos/neos.png";
import netwealthLogo from "@/assets/logos/netwealth.png";
import stGeorgeLogo from "@/assets/logos/st-george.png";
import suncorpLogo from "@/assets/logos/suncorp-bank.png";
import talLogo from "@/assets/logos/tal.png";
import taxPractitionersLogo from "@/assets/logos/tax-practitioners-board.png";
import westpacLogo from "@/assets/logos/westpac.png";
import libertyLogo from "@/assets/logos/liberty.png";
import loanMarketLogo from "@/assets/logos/loan-market.png";
import macquarieLogo from "@/assets/logos/macquarie.png";
import meBankLogo from "@/assets/logos/me-bank.png";
import acendaLogo from "@/assets/logos/acenda.png";
import afcaLogo from "@/assets/logos/afca.png";
import aiaLogo from "@/assets/logos/aia.png";
import ampLogo from "@/assets/logos/amp.png";
import anzLogo from "@/assets/logos/anz.png";
import bankOfMelbourneLogo from "@/assets/logos/bank-of-melbourne.png";
import bankwestLogo from "@/assets/logos/bankwest.png";
import bendigoLogo from "@/assets/logos/bendigo-bank.png";
import beyondBankLogo from "@/assets/logos/beyond-bank.png";
import boqLogo from "@/assets/logos/boq.png";
import cbaLogo from "@/assets/logos/cba.png";
import colonialLogo from "@/assets/logos/colonial-first-state.png";
import encompassLogo from "@/assets/logos/encompass-protection.png";
import fbaaLogo from "@/assets/logos/fbaa.png";
import firstmacLogo from "@/assets/logos/firstmac.png";
import futuraLogo from "@/assets/logos/futura-protection.png";
import generationLifeLogo from "@/assets/logos/generation-life.png";
import hub24Logo from "@/assets/logos/hub24.png";
import ioofLogo from "@/assets/logos/ioof.png";
import laTrobeLogo from "@/assets/logos/la-trobe-financial.png";

const providers = [
  { name: "Acenda",              logo: acendaLogo },
  { name: "AFCA",                logo: afcaLogo },
  { name: "AIA",                 logo: aiaLogo },
  { name: "AMP",                 logo: ampLogo },
  { name: "ANZ",                 logo: anzLogo },
  { name: "Bank of Melbourne",   logo: bankOfMelbourneLogo },
  { name: "Bankwest",            logo: bankwestLogo },
  { name: "Bendigo Bank",        logo: bendigoLogo },
  { name: "Beyond Bank",         logo: beyondBankLogo },
  { name: "BOQ",                 logo: boqLogo },
  { name: "Commonwealth Bank",   logo: cbaLogo },
  { name: "Colonial First State",logo: colonialLogo },
  { name: "Encompass Protection",logo: encompassLogo },
  { name: "FBAA",                logo: fbaaLogo },
  { name: "Firstmac",            logo: firstmacLogo },
  { name: "Futura Protection",   logo: futuraLogo },
  { name: "Generation Life",     logo: generationLifeLogo },
  { name: "HUB24",               logo: hub24Logo },
  { name: "IOOF",                logo: ioofLogo },
  { name: "La Trobe Financial",  logo: laTrobeLogo },
  { name: "Liberty",             logo: libertyLogo },
  { name: "Loan Market",         logo: loanMarketLogo },
  { name: "Macquarie",           logo: macquarieLogo },
  { name: "ME Bank",             logo: meBankLogo },
  { name: "MLC",                 logo: mlcLogo },
  { name: "NAB",                 logo: nabLogo },
  { name: "NEOS",                logo: neosLogo },
  { name: "Netwealth",           logo: netwealthLogo },
  { name: "St. George",          logo: stGeorgeLogo },
  { name: "Suncorp Bank",        logo: suncorpLogo },
  { name: "TAL",                 logo: talLogo },
  { name: "Tax Practitioners Board", logo: taxPractitionersLogo },
  { name: "Westpac",             logo: westpacLogo },
];

const loop = [...providers, ...providers];

export function ProviderStrip() {
  const [paused, setPaused] = useState(false);
  return (
    <section className="py-12 bg-white border-y border-muted/50">
      <div className="container mx-auto px-6 md:px-10 max-w-7xl">
        <p className="text-center text-sm font-medium text-foreground/50 uppercase tracking-widest mb-8">
          Trusted platforms &amp; partners
        </p>
        <div
          className="relative overflow-hidden"
          style={{
            maskImage: "linear-gradient(to right, transparent 0, black 8%, black 92%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to right, transparent 0, black 8%, black 92%, transparent 100%)",
          }}
        >
          <div className="flex w-max animate-provider-marquee gap-[50px] md:gap-[72px] items-center"
            style={{ animationPlayState: paused ? "paused" : undefined }}>
            {loop.map(({ name, logo }, i) => (
              <div
                key={`${name}-${i}`}
                className="flex items-center justify-center h-10 shrink-0 opacity-90"
                title={name}
                aria-hidden={i >= providers.length}
              >
                <img
                  src={logo}
                  alt={i >= providers.length ? "" : name}
                  loading="lazy" decoding="async"
                  {...Object.entries(logoDimensions).find(([filename]) => {
                    const basename = logo.split("/").pop() ?? "";
                    return basename === filename || basename.startsWith(`${filename.slice(0, -4)}-`);
                  })?.[1]}
                  className="h-[46px] w-auto max-w-[172px] object-contain"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="text-center mt-3">
          <button type="button" aria-pressed={paused} onClick={() => setPaused(value => !value)}
            className="text-xs text-[#0D6851] underline px-3">
            {paused ? "Resume partner logos" : "Pause partner logos"}
          </button>
        </div>
      </div>
      <style>{`
        @keyframes provider-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-provider-marquee {
          animation: provider-marquee 96s linear infinite;
        }
        .animate-provider-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
