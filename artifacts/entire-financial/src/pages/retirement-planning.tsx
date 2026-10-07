import { PageHero } from "@/components/PageHero";
import { CTABanner } from "@/components/CTABanner";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Calendar, PiggyBank, Wallet, Building2, ArrowRight, CheckCircle2 } from "lucide-react";
import { ResponsiveImage } from "@/components/ResponsiveImage";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const planCards = [
  {
    icon: Calendar,
    title: "Your retirement timeline",
    copy: "Understand when you may be able to retire and what financial steps could help you prepare. We can model different scenarios and help you see how decisions made today may affect your future lifestyle.",
  },
  {
    icon: PiggyBank,
    title: "Superannuation strategy",
    copy: "Review how your super is structured, how much you are contributing and whether there are opportunities to strengthen your retirement position as you approach retirement.",
  },
  {
    icon: Wallet,
    title: "Retirement income",
    copy: "Plan how your superannuation, investments and other assets may work together to provide an income once your regular salary stops.",
  },
  {
    icon: Building2,
    title: "Government entitlements",
    copy: "Understand how Centrelink Age Pension rules and other government benefits may apply to your circumstances and how they could form part of your broader retirement strategy.",
  },
];

const incomeFeatures = [
  "Understand how much income you may need",
  "Explore tax-effective retirement income strategies",
  "Plan for both regular spending and larger future expenses",
];

const processSteps = [
  { num: "01", title: "Discover", copy: "We begin by understanding your current financial position, retirement goals, priorities and concerns." },
  { num: "02", title: "Explore", copy: "We review your superannuation, investments, income, expenses and other relevant circumstances and identify strategies worth considering." },
  { num: "03", title: "Plan", copy: "Where personal advice is appropriate, we develop recommendations tailored to your circumstances and explain them clearly." },
  { num: "04", title: "Support", copy: "We help you put your strategy into action and can continue working with you as your retirement needs evolve." },
];

export default function RetirementPlanning() {
  return (
    <div className="flex flex-col min-h-screen">
      <PageHero
        overline="Retirement planning"
        title="Plan for the retirement you want to live"
        subtitle="Retirement is about more than finishing work. It is about having the confidence to enjoy the years ahead knowing your finances have been carefully considered. We help you understand where you are today, where you want to be and the steps that may help you get there."
      />

      {/* Intro */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <motion.p custom={0} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#AED137" }}>
            Your retirement, your way
          </motion.p>
          <motion.h2 custom={1} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="font-sans text-4xl md:text-5xl font-bold mb-8" style={{ color: "#022F35" }}>
            Turn your retirement goals into a clear financial plan
          </motion.h2>
          <motion.div custom={2} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="space-y-4 text-lg text-foreground/60 leading-relaxed">
            <p>Everyone has a different idea of what retirement should look like. You may want to travel, spend more time with family, pursue hobbies, help your children or simply enjoy greater freedom over how you spend your time.</p>
            <p>A well-considered retirement strategy brings your superannuation, investments, income needs and future expenses together so you can make informed decisions before and during retirement.</p>
            <p>At Entire Financial Services, we help you understand your options and build a strategy around the lifestyle that matters to you.</p>
          </motion.div>
        </div>
      </section>

      {/* 4 icon cards */}
      <section className="py-24" style={{ backgroundColor: "#FAFBFA" }}>
        <div className="container mx-auto px-6 max-w-7xl">
          <motion.p custom={0} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-xs font-semibold uppercase tracking-widest mb-4 text-center" style={{ color: "#AED137" }}>
            What we can help you plan for
          </motion.p>
          <motion.h2 custom={1} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="font-sans text-4xl md:text-5xl font-bold text-center mb-14" style={{ color: "#022F35" }}>
            Areas we cover together
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {planCards.map(({ icon: Icon, title, copy }, i) => (
              <motion.div key={title} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-sm flex flex-col gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(13,104,81,0.1)" }}>
                  <Icon className="w-6 h-6" style={{ color: "#0D6851" }} />
                </div>
                <h3 className="font-sans text-lg font-bold" style={{ color: "#022F35" }}>{title}</h3>
                <p className="text-base text-foreground/60 leading-relaxed">{copy}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Two-column — image left, text right */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -32 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }} className="relative">
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
                <ResponsiveImage image="retirement-main" alt="Couple planning retirement" className="w-full h-full object-cover" />
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 32 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#AED137" }}>A clearer path to retirement</p>
              <h2 className="font-sans text-4xl md:text-5xl font-bold mb-6" style={{ color: "#022F35" }}>
                Know where you stand before retirement arrives
              </h2>
              <div className="space-y-4 text-lg text-foreground/60 leading-relaxed mb-8">
                <p>The years leading into retirement can be some of the most important financially.</p>
                <p>Decisions about super contributions, investments, debt, when to stop working and how to structure your assets can all influence the options available to you later.</p>
                <p>Rather than waiting until retirement is just around the corner, we help you start planning earlier so you can understand your position, identify potential opportunities and make decisions with greater clarity.</p>
              </div>
              <Link href="/contact">
                <Button className="rounded-full px-8 h-12 font-semibold" style={{ backgroundColor: "#0D6851", color: "#FFFFFF" }}>
                  Book a Consultation <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Building retirement income — dark green */}
      <section className="py-24" style={{ backgroundColor: "#FAFBFA" }}>
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.p custom={0} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-xs font-semibold uppercase tracking-widest mb-4 text-center" style={{ color: "#AED137" }}>
            Building your retirement income
          </motion.p>
          <motion.h2 custom={1} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="font-sans text-4xl md:text-5xl font-bold text-center mb-8" style={{ color: "#022F35" }}>
            Turning your savings into an income
          </motion.h2>
          <motion.div custom={2} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="space-y-4 text-lg leading-relaxed mb-12 text-center" style={{ color: "#344A4B" }}>
            <p>Moving from receiving a regular salary to drawing income from your savings can feel like a significant change.</p>
            <p>We can help you understand different ways of creating retirement income, including how superannuation pensions, investments, cash reserves and other assets may work together.</p>
            <p>The objective is to create a strategy that considers both your day-to-day income needs and your longer-term financial security.</p>
          </motion.div>
          <motion.div custom={3} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {incomeFeatures.map((f) => (
              <div key={f} className="flex items-start gap-3 rounded-xl p-5"
                style={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E9E7" }}>
                <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" style={{ color: "#AED137" }} />
                <span className="text-base leading-relaxed" style={{ color: "#243B3D" }}>{f}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Centrelink & Age Pension */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <motion.p custom={0} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#AED137" }}>
            Centrelink & Age Pension
          </motion.p>
          <motion.h2 custom={1} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="font-sans text-4xl md:text-5xl font-bold mb-8" style={{ color: "#022F35" }}>
            Understand the role Centrelink may play
          </motion.h2>
          <motion.div custom={2} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="space-y-4 text-lg text-foreground/60 leading-relaxed mb-10">
            <p>For eligible retirees, the Age Pension and other government benefits can become an important part of retirement income.</p>
            <p>The rules around assets, income and eligibility can be complex. We can help you understand how Centrelink may assess your circumstances, what entitlements may be available and how this fits within your overall retirement plan.</p>
          </motion.div>
          <motion.div custom={3} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <Link href="/contact">
              <Button className="rounded-full px-8 h-12 font-semibold" style={{ backgroundColor: "#0D6851", color: "#FFFFFF" }}>
                Talk to Us About Retirement Planning <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Legacy & estate */}
      <section className="py-24" style={{ backgroundColor: "#FAFBFA" }}>
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <motion.p custom={0} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#AED137" }}>
            Planning beyond your own retirement
          </motion.p>
          <motion.h2 custom={1} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="font-sans text-4xl md:text-5xl font-bold mb-8" style={{ color: "#022F35" }}>
            Consider the people and legacy that matter to you
          </motion.h2>
          <motion.div custom={2} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="space-y-4 text-lg text-foreground/60 leading-relaxed">
            <p>Retirement planning is also an opportunity to think about how you would like your wealth to support the people you care about.</p>
            <p>We can work alongside your solicitor and accountant where appropriate to ensure your financial strategy considers estate planning, beneficiary arrangements and the way your assets are structured.</p>
            <p className="text-base italic" style={{ color: "#022F35", opacity: 0.5 }}>
              Legal estate planning advice should be obtained from an appropriately qualified legal professional.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Process steps */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-5xl">
          <motion.p custom={0} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-xs font-semibold uppercase tracking-widest mb-4 text-center" style={{ color: "#AED137" }}>
            How we work
          </motion.p>
          <motion.h2 custom={1} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="font-sans text-4xl md:text-5xl font-bold text-center mb-14" style={{ color: "#022F35" }}>
            A straightforward approach to retirement planning
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {processSteps.map(({ num, title, copy }, i) => (
              <motion.div key={num} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="flex gap-6">
                <span className="font-sans text-4xl font-bold leading-none shrink-0 mt-1" style={{ color: "#AED137" }}>{num}</span>
                <div>
                  <h3 className="font-sans text-xl font-bold mb-2" style={{ color: "#022F35" }}>{title}</h3>
                  <p className="text-lg text-foreground/60 leading-relaxed">{copy}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CTABanner
        title="Start planning for retirement with confidence"
        subtitle="Whether retirement is several years away or just around the corner, having a clear plan can help you understand your options and make more informed decisions."
      />
    </div>
  );
}
