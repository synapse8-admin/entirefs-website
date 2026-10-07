import { Link, useLocation } from "wouter";
import { Menu, X, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { navigationLinks } from "../data/navigation";
import { Button } from "@/components/ui/button";
import logoImg from "@/assets/logo-nav-beige.svg";
import drawerLogo from "@/assets/logo-nav-dark.svg";

export function Header() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const menuTrigger = useRef<HTMLButtonElement>(null);
  const servicesTrigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const drawer = drawerRef.current;
    if (!drawer) return;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const background = [...document.querySelectorAll<HTMLElement>("#main-content, footer, header")];
    background.forEach(element => { element.inert = true; });
    const focusable = () => [...drawer.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), [tabindex='0']")]
      .filter(element => element.getClientRects().length > 0);
    focusable()[0]?.focus();
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); setMobileMenuOpen(false); return; }
      if (event.key !== "Tab") return;
      const elements = focusable();
      const first = elements[0], last = elements[elements.length - 1];
      if (!first) { event.preventDefault(); return; }
      if (event.shiftKey && (document.activeElement === first || !drawer.contains(document.activeElement))) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !drawer.contains(document.activeElement))) {
        event.preventDefault(); first.focus();
      }
    };
    const resize = () => { if (window.innerWidth >= 1024) setMobileMenuOpen(false); };
    document.addEventListener("keydown", keyboard);
    window.addEventListener("resize", resize);
    return () => {
      document.body.style.overflow = overflow;
      background.forEach(element => { element.inert = false; });
      document.removeEventListener("keydown", keyboard);
      window.removeEventListener("resize", resize);
      if (previous?.isConnected) previous.focus();
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!servicesOpen) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setServicesOpen(false); servicesTrigger.current?.focus(); }
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [servicesOpen]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setServicesOpen(false);
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, [location]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
    <header
      style={{
        backgroundColor: isScrolled ? 'rgba(2, 47, 53, 0.95)' : '#022F35',
        borderColor: 'rgba(2, 47, 53, 0.1)',
      }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        isScrolled ? "backdrop-blur-md shadow-md py-2" : "shadow-sm py-2"
      }`}
    >
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between px-6 md:px-10">
        <Link href="/" className="flex items-center group shrink-0">
          <img src={logoImg} width={400} height={250} alt="Entire Financial Services" className="w-auto transition-opacity group-hover:opacity-80" style={{ height: '5.25rem' }} />
        </Link>

        {/* Desktop Nav */}
        <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-1">
          {navigationLinks.map((link) => {
            const isAnchor = link.href.startsWith("/#");
            const isActive = location === link.href;
            const baseCls = `text-sm font-medium px-4 py-2 rounded-xl transition-colors hover:bg-white/10 hover:text-white ${
              isActive ? "text-white bg-white/10" : "text-white/70"
            }`;

            if (link.children) {
              return (
                <div key={link.href} className="relative" ref={dropdownRef}>
                  <button
                    ref={servicesTrigger}
                    aria-expanded={servicesOpen}
                    aria-controls="desktop-services"
                    onClick={() => setServicesOpen((o) => !o)}
                    className={`${baseCls} flex items-center gap-1`}
                  >
                    {link.name}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${servicesOpen ? "rotate-180" : ""}`} />
                  </button>
                  {servicesOpen && (
                    <div
                      id="desktop-services"
                      className="absolute top-full left-0 mt-2 w-56 rounded-2xl shadow-xl overflow-hidden z-50"
                      style={{ backgroundColor: "#022F35", border: "1px solid rgba(255,255,255,0.1)" }}
                    >
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setServicesOpen(false)}
                          className="block px-5 py-3 text-sm font-medium transition-colors hover:bg-white/10 text-white/75 hover:text-white"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return isAnchor ? (
              <a key={link.href} href={link.href} className={baseCls}>
                {link.name}
              </a>
            ) : (
              <Link key={link.href} href={link.href} className={baseCls}>
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:block shrink-0">
            <Button asChild className="bg-[#AED137] hover:bg-[#AED137]/90 text-[#022F35] font-semibold rounded-full px-5 py-2 text-sm">
              <Link href="/contact">
              Book a Consultation
              </Link>
            </Button>
        </div>

        {/* Mobile Toggle */}
        <button
          ref={menuTrigger}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation"
          className="lg:hidden p-2 text-white rounded-xl hover:bg-white/10 transition-colors"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

    </header>

      {/* Mobile Drawer — rendered outside <header> to avoid backdrop-blur stacking context clipping */}
      <div
        aria-hidden={!mobileMenuOpen}
        inert={!mobileMenuOpen}
        className={`fixed inset-0 z-[100] flex justify-end transition-opacity duration-300 lg:hidden ${
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <button
          type="button"
          aria-label="Close navigation menu"
          tabIndex={-1}
          className="absolute inset-0 bg-black/20 backdrop-blur-sm cursor-pointer"
          onClick={() => setMobileMenuOpen(false)}
        />
        <div
          ref={drawerRef}
          id="mobile-navigation"
          role="dialog"
          aria-modal={mobileMenuOpen ? true : undefined}
          aria-label="Navigation menu"
          style={{ backgroundColor: '#D7DCC7' }}
          className={`relative w-4/5 max-w-sm h-full shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between p-6 border-b border-secondary/10">
            <img src={drawerLogo} width={400} height={250} alt="Entire Financial Services" className="h-16 w-auto" />
            <button
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
              className="p-2 text-foreground/60 hover:text-foreground rounded-xl hover:bg-secondary/10 transition-colors"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
          <nav aria-label="Mobile navigation" className="flex-1 overflow-y-auto py-6 px-6 flex flex-col gap-1">
            {navigationLinks.map((link) => {
              const isAnchor = link.href.startsWith("/#");
              const cls = `text-base font-medium px-4 py-3 rounded-xl transition-colors ${
                location === link.href
                  ? "text-secondary bg-secondary/10"
                  : "text-foreground/80 hover:bg-secondary/10"
              }`;

              if (link.children) {
                return (
                  <div key={link.href}>
                    <button
                      aria-expanded={mobileServicesOpen}
                      aria-controls="mobile-services"
                      onClick={() => setMobileServicesOpen((o) => !o)}
                      className={`${cls} w-full text-left flex items-center justify-between`}
                    >
                      {link.name}
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileServicesOpen ? "rotate-180" : ""}`} />
                    </button>
                    {mobileServicesOpen && (
                      <div id="mobile-services" className="ml-4 mt-1 flex flex-col gap-1">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="text-sm font-medium px-4 py-2.5 rounded-xl transition-colors text-foreground/70 hover:bg-secondary/10"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return isAnchor ? (
                <a key={link.href} href={link.href} className={cls} onClick={() => setMobileMenuOpen(false)}>
                  {link.name}
                </a>
              ) : (
                <Link key={link.href} href={link.href} className={cls}>
                  {link.name}
                </Link>
              );
            })}
            <div className="mt-8 pt-8 border-t border-secondary/10">
                <Button asChild className="w-full bg-secondary hover:bg-secondary/90 text-white rounded-full">
                  <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                  Book a Consultation
                  </Link>
                </Button>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
