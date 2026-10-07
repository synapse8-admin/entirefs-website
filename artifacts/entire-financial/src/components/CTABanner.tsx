import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface CTABannerProps {
  title?: string;
  subtitle?: string;
  primaryText?: string;
  primaryHref?: string;
}

export function CTABanner({
  title = "Ready to create a clear path to retirement?",
  subtitle = "Schedule a consultation with our experienced advisers today.",
  primaryText = "Book a Consultation",
  primaryHref = "/contact"
}: CTABannerProps) {
  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: "#D7DCC7" }}>
      <div className="container mx-auto px-4 md:px-8 max-w-5xl py-24 relative z-10">
        <div className="text-center">
          {/* Overline label */}
          <div className="inline-flex items-center mb-6">
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#0D6851" }}>Get Started Today</span>
          </div>

          <h2 className="font-sans text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight max-w-3xl mx-auto" style={{ color: "#022F35" }}>
            {title}
          </h2>

          <p className="text-lg md:text-xl mb-12 max-w-xl mx-auto leading-relaxed" style={{ color: "#022F35", opacity: 0.75 }}>
            {subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href={primaryHref} className="inline-block">
              <Button size="lg"
                className="rounded-full px-10 text-base h-14 font-semibold transition-all duration-200 hover:opacity-90 hover:scale-105"
                style={{ backgroundColor: "#0D6851", color: "#ffffff" }}>
                {primaryText} <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
