import { useState, useEffect } from "react";
import { HeroSection } from "@/components/HeroSection";
import { StatsCounter } from "@/components/StatsCounter";
import { ProviderStrip } from "@/components/ProviderStrip";
import { CTABanner } from "@/components/CTABanner";
import { GoogleReviewsWidget } from "@/components/GoogleReviewsWidget";
import { counters } from "@/data/counters";
import { Link } from "wouter";
import { ArrowRight, TrendingUp, Shield, PiggyBank, Home as HomeIcon, BarChart3, Heart, FileText, Calculator, Users, Pause, Play } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { ResponsiveImage } from "@/components/ResponsiveImage";
const slideshowImages = ["elderly-3", "elderly-1", "elderly-2"] as const;

function ProcessSlideshow() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useReducedMotion();
  // Media preference differs between the server and browser. Change the icon
  // only after hydration; the timer still honours the preference immediately.
  const [reducedMotionEnabled, setReducedMotionEnabled] = useState(false);
  useEffect(() => setReducedMotionEnabled(!!reducedMotion), [reducedMotion]);
  useEffect(() => {
    if (paused || reducedMotion) return undefined;
    const t = setInterval(() => setActive(a => (a + 1) % slideshowImages.length), 4000);
    return () => clearInterval(t);
  }, [paused, reducedMotion]);
  return (
    <div className="relative overflow-hidden rounded-2xl" style={{ height: 420 }}>
      {slideshowImages.map((img, i) => (
        <ResponsiveImage
          key={i}
          image={img}
          alt="Client meeting"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: i === active ? 1 : 0, transition: "opacity 1.2s ease-in-out" }}
        />
      ))}
      <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{ boxShadow: "inset 0 0 40px rgba(2,47,53,0.5)" }} />
      <button type="button" onClick={() => setPaused(value => !value)}
        aria-label={paused ? "Play slideshow" : "Pause slideshow"} aria-pressed={paused}
        className="absolute bottom-3 right-3 z-10 rounded-full px-3 bg-[#022F35] text-white"
        disabled={reducedMotionEnabled}>
        {paused || reducedMotionEnabled ? <Play size={18} aria-hidden="true" /> : <Pause size={18} aria-hidden="true" />}
      </button>
    </div>
  );
}

// ── Testimonials section — SociableKit Google Reviews widget ─────────────────
function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 bg-white scroll-mt-28">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-sans text-4xl md:text-5xl font-bold text-secondary mb-6">
            Testimonials
          </h2>
          <p className="text-lg text-foreground/60 leading-relaxed">
            Hear from clients who have trusted Entire Financial Services to help
            them plan for their financial future.
          </p>
        </div>

        <GoogleReviewsWidget />
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      
      {/* Trust Block + Counters — 2 column */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left: heading + description */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#AED137" }}>Who We Are</p>
              <h2 className="font-sans text-4xl md:text-5xl font-bold text-secondary leading-tight mb-6">
                Confidence for the years ahead
              </h2>
              <p className="text-lg text-foreground/60 leading-relaxed mb-8 max-w-lg">
                Retirement comes with important financial decisions, and understanding your options is just as important as the advice itself.
                <br /><br />
                Having helped more than 500 clients prepare for and navigate retirement, we have the experience to guide you through the decisions that matter. We take the time to explain your options clearly, so you understand your financial position, feel confident in the decisions you make, and can enjoy retirement knowing your finances are in capable hands.
              </p>
            </div>

            {/* Right: counters 2×2 grid */}
            <div className="grid grid-cols-2 gap-6">
              {counters.map((counter) => (
                <div
                  key={counter.id}
                  className="rounded-2xl p-6 border border-muted-border/50 bg-muted/10 flex flex-col"
                >
                  <StatsCounter {...counter} />
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      <ProviderStrip />

      {/* Where We Thrive */}
      <section id="services" className="py-24 scroll-mt-28" style={{ backgroundColor: "#FAFBFA" }}>
        <div className="container mx-auto px-6 max-w-7xl">
          {/* Centred header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#0D6851" }}>Our Specialist Areas</p>
            <h2 className="font-sans text-4xl md:text-5xl font-bold leading-tight mb-6" style={{ color: "#022F35" }}>
              Where we thrive
            </h2>
            <p className="text-lg text-foreground/60 leading-relaxed">
              Retirement isn’t just a single milestone. From preparing for life after work, to making the most of your retirement and navigating the complexities of aged care, different stages bring different financial decisions.
              <br /><br />
              We provide specialist advice across the retirement journey, helping you understand your options and make informed decisions with confidence.
            </p>
          </div>

          {/* Three cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: TrendingUp,
                title: "Transition to retirement",
                desc: "Explore strategies that may help you gradually reduce your working hours, make the most of your superannuation and ease confidently into retirement.",
                href: "/transition-to-retirement",
              },
              {
                icon: BarChart3,
                title: "Retirement planning",
                desc: "Build a clear financial plan for the retirement you've worked towards, with advice tailored to your goals, lifestyle and future income needs.",
                href: "/retirement-planning",
              },
              {
                icon: Heart,
                title: "Aged care",
                desc: "Understand your financial options and make informed aged care decisions with compassionate guidance for you and your family.",
                href: "/aged-care",
              },
            ].map(({ icon: Icon, title, desc, href }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.55, delay: i * 0.13, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(2,47,53,0.12)" }}
                className="relative flex flex-col bg-white rounded-3xl p-8 shadow-md overflow-hidden group cursor-default"
                style={{ boxShadow: "0 4px 24px rgba(2,47,53,0.08)" }}
              >
                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" style={{ backgroundColor: "rgba(13,104,81,0.08)" }}>
                  <Icon className="w-7 h-7" style={{ color: "#0D6851" }} aria-hidden="true" />
                </div>

                {/* Content */}
                <h3 className="font-sans text-xl font-bold mb-3" style={{ color: "#022F35" }}>{title}</h3>
                <p className="text-base leading-relaxed mb-8 flex-1" style={{ color: "#022F35", opacity: 0.65 }}>{desc}</p>

                {/* Learn more */}
                <Link href={href}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0D6851] focus-visible:ring-offset-2 rounded group/btn"
                    style={{ color: "#0D6851" }}
                    aria-label={`Learn more about ${title}`}
                  >
                    Learn More<span className="sr-only"> about {title}</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-200" aria-hidden="true" />
                </Link>

                {/* Bottom accent bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-3xl transition-all duration-300 opacity-0 group-hover:opacity-100" style={{ backgroundColor: "#AED137" }} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Journey */}
      <section className="py-28 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <div className="mb-14 text-center max-w-2xl mx-auto">
            <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#AED137" }}>Help with Every Stage</p>
            <h2 className="font-sans text-4xl md:text-5xl font-bold" style={{ color: "#022F35" }}>
              Our services
            </h2>
            <p className="mt-4 text-lg text-foreground/60 leading-relaxed">
              Our comprehensive services ensure that you are ready for today's challenges and for the years ahead.
            </p>
          </div>

          {/* Services grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Users,      title: "Centrelink optimisation" },
              { icon: BarChart3,  title: "Retirement planning" },
              { icon: Heart,      title: "Aged care" },
              { icon: PiggyBank,  title: "Superannuation" },
              { icon: TrendingUp, title: "Investment advice" },
              { icon: Shield,     title: "Wealth protection" },
              { icon: HomeIcon,   title: "Mortgage broking" },
              { icon: FileText,   title: "Estate planning" },
              { icon: Calculator, title: "Tax minimisation" },
            ].map(({ icon: Icon, title }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="rounded-2xl p-6 border hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-4"
                style={{ borderColor: "rgba(2,47,53,0.1)", backgroundColor: "#FAFAFA" }}
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(13,104,81,0.08)" }}>
                  <Icon className="w-5 h-5" style={{ color: "#0D6851" }} />
                </div>
                <h3 className="font-sans text-lg font-semibold" style={{ color: "#022F35" }}>{title}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How we work with you */}
      <section className="py-24 relative overflow-hidden" style={{ backgroundColor: "#FAFBFA" }}>
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-start">

            {/* Left — heading block */}
            <div className="lg:sticky lg:top-24">
              <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#0D6851" }}>Our Process</p>
              <h2 className="font-sans text-4xl md:text-5xl font-bold mb-6" style={{ color: "#022F35" }}>
                How we work with you
              </h2>
              <p className="text-lg leading-relaxed mb-8" style={{ color: "#022F35", opacity: 0.7 }}>
                Our advice process is thorough, transparent, and built around your timeline. Every step is designed to keep you informed and confident.
              </p>

              {/* Crossfade photo slideshow */}
              <ProcessSlideshow />
            </div>

            {/* Right — step cards */}
            <div className="flex flex-col gap-4">
              {[
                { n: 1, title: "Initial consultation",      desc: "A complimentary meeting to discuss your current situation, goals, and determine how we can add value." },
                { n: 2, title: "Strategic formulation",     desc: "We conduct deep analysis of your position and develop a tailored Statement of Advice (SoA)." },
                { n: 3, title: "Presentation & refinement", desc: "We walk you through our recommendations in plain English, ensuring you are comfortable before proceeding." },
                { n: 4, title: "Implementation",            desc: "Our team handles the paperwork and administration to put your new strategy in place seamlessly." },
                { n: 5, title: "Ongoing review",            desc: "Regular check-ins to track progress, adjust for legislative changes, and adapt to your evolving life." },
              ].map(({ n, title, desc }, i) => (
                <motion.div
                  key={n}
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-start gap-5 rounded-2xl px-6 py-5"
                  style={{ backgroundColor: "#FFFFFF", border: "1px solid rgba(2,47,53,0.1)" }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 mt-0.5"
                    style={{ backgroundColor: "#AED137", color: "#022F35" }}
                  >
                    {n}
                  </div>
                  <div>
                    <h3 className="font-sans text-base font-bold mb-1" style={{ color: "#022F35" }}>{title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: "#022F35", opacity: 0.7 }}>{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

          </div>
        </div>
      </section>


      {/* Testimonials — live Google Reviews */}
      <TestimonialsSection />

      <CTABanner />
    </div>
  );
}
