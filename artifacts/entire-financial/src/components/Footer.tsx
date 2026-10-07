import { Link } from "wouter";
import { footerLinks } from "../data/footerLinks";
import { Mail, MapPin, Phone } from "lucide-react";
import submarkImg from "@/assets/logo-submark.png";

export function Footer() {
  return (
    <footer style={{ backgroundColor: "#022F35" }} className="text-white">

      {/* Main footer body */}
      <div className="container mx-auto px-6 md:px-10 max-w-7xl py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">

          {/* Column 1 — Brand */}
          <div>
            <div className="mb-5">
              <img src={submarkImg} width={673} height={448} loading="lazy" decoding="async" alt="Entire Financial Services" className="h-14 w-auto" />
            </div>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "#D7DCC7" }}>
              Helping individuals and families make informed decisions about their wealth, protection, and long-term planning.
            </p>
            {/* Accent rule */}
            <div className="w-12 h-0.5 rounded-full" style={{ backgroundColor: "#AED137" }} />
          </div>

          {/* Column 2 — Contact */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-6" style={{ color: "#AED137" }}>Contact</h2>
            <ul className="space-y-4">
              <li>
                <a href="tel:0421833372" className="flex items-center gap-3 text-sm transition-colors hover:text-white" style={{ color: "#D7DCC7" }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "#0D685120" }}>
                    <Phone className="w-3.5 h-3.5" style={{ color: "#AED137" }} />
                  </div>
                  0421 833 372
                </a>
              </li>
              <li>
                <a href="mailto:bevan@entirefs.com.au" className="flex items-center gap-3 text-sm transition-colors hover:text-white" style={{ color: "#D7DCC7" }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "#0D685120" }}>
                    <Mail className="w-3.5 h-3.5" style={{ color: "#AED137" }} />
                  </div>
                  <span className="min-w-0 break-words">bevan@<wbr />entirefs.com.au</span>
                </a>
              </li>
              <li>
                <div className="flex items-center gap-3 text-sm" style={{ color: "#D7DCC7" }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "#0D685120" }}>
                    <MapPin className="w-3.5 h-3.5" style={{ color: "#AED137" }} />
                  </div>
                  <span className="min-w-0 break-words">Suite 42/ 195 Wellington Road, Clayton, VIC, 3168 (Building 4)</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Column 3 — Navigation */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-6" style={{ color: "#AED137" }}>Navigation</h2>
            <ul className="space-y-3">
              {footerLinks.quickLinks.map((link) => {
                const isAnchor = link.href.startsWith("/#");
                const cls = "text-sm transition-colors hover:text-white flex items-center gap-2 group";
                const inner = (
                  <>
                    <span className="w-0 group-hover:w-3 h-px transition-all duration-200 inline-block" style={{ backgroundColor: "#AED137" }} />
                    {link.name}
                  </>
                );
                return (
                  <li key={link.href}>
                    {isAnchor ? (
                      <a href={link.href} className={cls} style={{ color: "#D7DCC7" }}>{inner}</a>
                    ) : (
                      <Link href={link.href} className={cls} style={{ color: "#D7DCC7" }}>{inner}</Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="h-px mb-8" style={{ backgroundColor: "#ffffff12" }} />

        {/* Legal links row */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-8">
          {footerLinks.legal.map((link, i) => (
            <span key={link.href} className="flex items-center gap-6">
              <Link href={link.href}
                className="text-xs transition-colors hover:text-white"
                style={{ color: "#D7DCC7" }}>
                {link.name}
              </Link>
              {i < footerLinks.legal.length - 1 && (
                <span className="w-px h-3 inline-block" style={{ backgroundColor: "#ffffff20" }} />
              )}
            </span>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center gap-3 text-center">
          <p className="text-xs" style={{ color: "#D7DCC7" }}>
            &copy; {new Date().getFullYear()} Entire Financial Services. All rights reserved.
          </p>
          <p className="text-xs max-w-2xl leading-relaxed" style={{ color: "#D7DCC7" }}>
            Entire Financial Services is a corporate authorized representative of Apex Macro Financial Group. The information on this website is general in nature and does not consider your personal circumstances.
          </p>
          <p className="text-xs max-w-2xl leading-relaxed text-[#D7DCC7]/85">
            Website designed, built, and managed by{" "}
            <a
              href="https://synapse8.com.au/"
              target="_blank"
              rel="noopener noreferrer"
              className="whitespace-nowrap cursor-pointer underline decoration-[#D7DCC7]/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#AED137]"
            >
              Synapse8 Pty Ltd
            </a>.
          </p>
        </div>
      </div>

    </footer>
  );
}
