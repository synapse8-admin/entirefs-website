import { CTABanner } from "@/components/CTABanner";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  ShieldCheck, TrendingUp, FileText, Users, CheckCircle2,
  ArrowRight, ChevronDown, Lightbulb, BarChart3, Clock
} from "lucide-react";
import { useState } from "react";
import { ResponsiveImage } from "@/components/ResponsiveImage";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const faqs = [
  {
    q: "How do I know if my super fund is right for me?",
    a: "Many Australians are in a default fund that may not suit their investment profile, risk tolerance, or retirement timeline. We review your current fund's fees, investment options, insurance cover, and performance — then recommend whether to stay, switch, or consolidate."
  },
  {
    q: "Should I make extra contributions to my super?",
    a: "Depending on your income, age, and financial goals, additional concessional (pre-tax) or non-concessional (after-tax) contributions can dramatically improve your retirement outcome. We model different scenarios to find the optimal contribution strategy for your situation."
  },
  {
    q: "What happens to my super if I change jobs?",
    a: "Each new employer may enrol you in a different fund, leading to multiple accounts with duplicate fees and fragmented insurance cover. We help you consolidate your super into one high-performing fund, saving you money and simplifying your retirement savings."
  },
  {
    q: "Can I access my super early?",
    a: "Early access is generally restricted to specific circumstances such as severe financial hardship, terminal illness, or compassionate grounds. We can advise whether you qualify and help you navigate the application process properly."
  },
  {
    q: "How is superannuation taxed?",
    a: "Super is one of Australia's most tax-effective structures — contributions are generally taxed at 15%, and earnings within the fund at 15% (or 0% in pension phase). We help you use these concessions strategically to minimise your overall tax burden."
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-muted-border/50 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left group"
      >
        <span className="font-sans text-base md:text-lg font-semibold text-secondary group-hover:text-primary transition-colors">{q}</span>
        <ChevronDown
          className={`w-5 h-5 text-primary shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <p className="text-foreground/65 text-sm md:text-base leading-relaxed pb-5">{a}</p>
      )}
    </div>
  );
}

export default function Superannuation() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ backgroundColor: "#0D6851" }}>
        {/* Lime accent line */}
        <div className="absolute top-0 left-0 right-0 h-0.5 z-10" style={{ backgroundColor: "#AED137" }} />
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0D6851] via-[#0D6851] to-[#022F35]" />
        <div className="absolute top-0 right-0 w-[60%] h-full opacity-[0.06]"
          style={{ background: "radial-gradient(ellipse at top right, #AED137 0%, transparent 60%)" }} />
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "linear-gradient(#D7DCC7 1px, transparent 1px), linear-gradient(90deg, #D7DCC7 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

        <div className="relative z-10 container mx-auto px-6 md:px-10 max-w-7xl pt-36 pb-20 lg:pt-40 lg:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

            {/* Left: copy */}
            <div>
              <motion.div
                custom={0} variants={fadeUp} initial={false} animate="visible"
                className="inline-flex items-center gap-3 mb-6"
              >
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#AED137" }}>Superannuation</span>
              </motion.div>

              <motion.h1
                custom={1} variants={fadeUp} initial={false} animate="visible"
                className="font-sans text-4xl md:text-5xl lg:text-[3.2rem] font-bold text-white leading-tight mb-6"
              >
                Make your super work harder for you.
              </motion.h1>

              <motion.p
                custom={2} variants={fadeUp} initial={false} animate="visible"
                className="text-lg md:text-xl leading-relaxed mb-10 max-w-lg"
                style={{ color: "#D7DCC7", opacity: 0.85 }}
              >
                Most Australians are leaving significant retirement wealth on the table. We build personalised superannuation strategies that maximise growth, minimise tax, and align with your lifestyle goals.
              </motion.p>

              <motion.div
                custom={3} variants={fadeUp} initial="hidden" animate="visible"
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link href="/contact">
                  <Button size="lg" className="rounded-full px-8 h-13 text-base font-semibold"
                    style={{ backgroundColor: "#AED137", color: "#022F35" }}>
                    Book a Free Super Review <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/#services">
                  <Button size="lg" variant="outline"
                    className="rounded-full px-8 h-13 text-base font-medium border-white/30 text-white hover:bg-white/10">
                    All Services
                  </Button>
                </Link>
              </motion.div>
            </div>

            {/* Right: image */}
            <motion.div
              custom={1} variants={fadeUp} initial="hidden" animate="visible"
              className="relative hidden lg:block"
            >
              {/* Lime accent block */}
              <div className="absolute -bottom-5 -right-5 w-40 h-40 rounded-2xl z-0" style={{ backgroundColor: "#AED137", opacity: 0.25 }} />
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl"
                style={{ border: "1px solid rgba(215,220,199,0.15)" }}>
                <ResponsiveImage
                  image="wealth-together" priority sizes="420px"
                  alt="Superannuation adviser meeting with client"
                  className="w-full h-[420px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#022F35]/50 via-transparent to-transparent pointer-events-none" />
              </div>
            </motion.div>

          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white/5 to-transparent pointer-events-none" />
      </section>

      {/* Intro — 2 col */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6 }}
            >
              <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#AED137" }}>Why It Matters</p>
              <h2 className="font-sans text-3xl md:text-4xl font-bold text-secondary mb-6 leading-tight">
                Super is your single biggest financial asset — treat it that way.
              </h2>
              <p className="text-foreground/65 text-lg leading-relaxed mb-6">
                For most Australians, superannuation will surpass the family home as their largest lifetime asset. Yet the majority never review it until retirement is close — by which point, years of compounding growth have already been lost.
              </p>
              <p className="text-foreground/65 text-lg leading-relaxed mb-8">
                At Entire Financial Services, we take a proactive, strategic approach to superannuation — analysing your fund, investment mix, contribution levels, insurance, and tax position to ensure every dollar is working at maximum efficiency.
              </p>
              <Link href="/contact">
                <Button className="bg-secondary hover:bg-secondary/90 text-white rounded-full px-8">
                  Book a Super Review <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </motion.div>

            {/* Right — stat cards */}
            <div className="grid grid-cols-2 gap-5">
              {[
                { icon: TrendingUp, stat: "15+ yrs", label: "Superannuation expertise", color: "#0D6851" },
                { icon: Users, stat: "500+", label: "Clients with optimised super", color: "#022F35" },
                { icon: BarChart3, stat: "$80M+", label: "Funds under management", color: "#0D6851" },
                { icon: ShieldCheck, stat: "100%", label: "Tailored, independent advice", color: "#022F35" },
              ].map(({ icon: Icon, stat, label, color }, i) => (
                <motion.div
                  key={label}
                  custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  className="rounded-2xl p-6 border border-muted-border/40 bg-muted/10"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${color}15` }}>
                    <Icon className="w-5 h-5" style={{ color }} />
                  </div>
                  <p className="font-sans text-2xl font-bold text-secondary mb-1">{stat}</p>
                  <p className="text-sm text-foreground/60 leading-snug">{label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-24" style={{ backgroundColor: "#FFFFFF" }}>
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#0D6851" }}>Our Services</p>
            <h2 className="font-sans text-3xl md:text-4xl font-bold text-secondary">
              Comprehensive superannuation advice
            </h2>
            <p className="text-foreground/60 mt-4 text-lg">
              Every aspect of your super — reviewed, optimised, and actively managed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: FileText,
                title: "Fund Review & Selection",
                desc: "We benchmark your current fund against the market for fees, investment performance, and insurance value — then recommend the best fit for your goals.",
                color: "#0D6851"
              },
              {
                icon: TrendingUp,
                title: "Contribution Strategy",
                desc: "We identify the optimal mix of concessional and non-concessional contributions to maximise your retirement balance while minimising tax.",
                color: "#022F35"
              },
              {
                icon: ShieldCheck,
                title: "Insurance Inside Super",
                desc: "Your super often holds life, TPD, and income protection cover. We ensure it's appropriately structured, cost-effective, and won't erode your balance.",
                color: "#0D6851"
              },
              {
                icon: BarChart3,
                title: "Investment Mix Optimisation",
                desc: "We align your super's investment options with your risk profile, age, and retirement timeline — moving beyond the default 'balanced' setting.",
                color: "#022F35"
              },
              {
                icon: Users,
                title: "Consolidation & Rollovers",
                desc: "Multiple super accounts mean multiple fees and fragmented cover. We consolidate your accounts into a single, high-performing fund.",
                color: "#0D6851"
              },
              {
                icon: Clock,
                title: "Pre-Retirement Planning",
                desc: "As you approach retirement, we transition your super strategy toward capital preservation and sustainable income generation.",
                color: "#022F35"
              },
            ].map(({ icon: Icon, title, desc, color }, i) => (
              <motion.div
                key={title}
                custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }}
                className="bg-white rounded-2xl p-7 border border-black/5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ backgroundColor: `${color}12` }}>
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <h3 className="font-sans text-xl font-bold text-secondary mb-3">{title}</h3>
                <p className="text-foreground/60 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#AED137" }}>Who This Is For</p>
              <h2 className="font-sans text-3xl md:text-4xl font-bold text-secondary mb-6">
                You're a good fit if you…
              </h2>
              <p className="text-foreground/60 text-lg leading-relaxed mb-10">
                Our superannuation advice is suited to anyone who wants to be intentional about their retirement savings — regardless of age or balance.
              </p>
              <div className="space-y-4">
                {[
                  "Haven't reviewed your super fund in the last 2 years",
                  "Have multiple super accounts from different employers",
                  "Want to make additional contributions but aren't sure how",
                  "Are approaching retirement and need a drawdown strategy",
                  "Want to reduce the tax you pay on your super contributions",
                  "Are unsure whether your super's insurance cover is appropriate",
                  "Want your super aligned with a broader financial plan",
                ].map((point, i) => (
                  <motion.div
                    key={i}
                    custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" style={{ color: "#AED137" }} />
                    <p className="text-foreground/70 text-base">{point}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Process */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#AED137" }}>Our Process</p>
              <h2 className="font-sans text-3xl md:text-4xl font-bold text-secondary mb-8">
                How we approach your super
              </h2>
              <div className="space-y-6">
                {[
                  { step: "01", title: "Discovery Meeting", desc: "We learn about your goals, current super, income, and timeline — at no cost to you." },
                  { step: "02", title: "Deep Analysis", desc: "We review your fund's performance, fees, investment options, tax position, and insurance." },
                  { step: "03", title: "Strategy Presentation", desc: "We present clear, actionable recommendations in plain English — no jargon." },
                  { step: "04", title: "Implementation", desc: "We manage all paperwork, fund communications, and rollovers on your behalf." },
                  { step: "05", title: "Ongoing Monitoring", desc: "We review your super annually and update the strategy as your life changes." },
                ].map(({ step, title, desc }, i) => (
                  <motion.div
                    key={step}
                    custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                    className="flex gap-5 items-start"
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-bold"
                      style={{ backgroundColor: "#0D6851" }}
                    >
                      {step}
                    </div>
                    <div>
                      <h3 className="font-sans text-lg font-bold text-secondary mb-1">{title}</h3>
                      <p className="text-foreground/60 text-sm leading-relaxed">{desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Insight Banner */}
      <section className="py-20" style={{ backgroundColor: "#D7DCC7" }}>
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: "#0D685115" }}>
            <Lightbulb className="w-6 h-6" style={{ color: "#0D6851" }} />
          </div>
          <h2 className="font-sans text-2xl md:text-3xl font-bold text-secondary mb-4">
            Did you know?
          </h2>
          <p className="text-secondary/70 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
            The average Australian retires with around <strong className="text-secondary">$170,000</strong> in super — well below what's needed for a comfortable retirement. With the right strategy applied early, that number can more than double. The best time to start is today.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#AED137" }}>Common Questions</p>
            <h2 className="font-sans text-3xl md:text-4xl font-bold text-secondary">
              Frequently asked questions
            </h2>
          </div>
          <div className="divide-y divide-muted-border/40 border-t border-muted-border/40">
            {faqs.map((faq) => (
              <FAQItem key={faq.q} {...faq} />
            ))}
          </div>
        </div>
      </section>

      <CTABanner
        title="Ready to get more from your super?"
        subtitle="Book a complimentary review and discover exactly how much more your superannuation could be doing for you."
        primaryText="Book a Free Super Review"
      />
    </div>
  );
}
