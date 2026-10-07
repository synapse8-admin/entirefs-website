import { PageHero } from "@/components/PageHero";
import { CTABanner } from "@/components/CTABanner";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Clock, TrendingUp, Layers, ArrowRight, CheckCircle2 } from "lucide-react";
import { ResponsiveImage } from "@/components/ResponsiveImage";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const ttrCards = [
  {
    icon: Clock,
    title: "Reduce your working hours",
    copy: "A transition-to-retirement income stream may help supplement your employment income, giving you the flexibility to reduce your hours while maintaining the lifestyle you have worked hard to build.",
  },
  {
    icon: TrendingUp,
    title: "Strengthen your super",
    copy: "Depending on your circumstances, there may be strategies that allow you to contribute more of your salary to super while drawing an income from your retirement savings.",
  },
  {
    icon: Layers,
    title: "Create extra flexibility",
    copy: "Accessing a regular income stream from super may provide additional cash flow as you approach retirement, helping you manage changing work and lifestyle needs.",
  },
];

const considerations = [
  "Your preferred retirement date",
  "How many hours you want to continue working",
  "Your current salary and cash flow",
  "Your superannuation balance",
  "Contributions going into super",
  "Your household expenses",
  "Tax considerations",
  "Your longer-term retirement income needs",
];

const processSteps = [
  { num: "01", title: "Understand your goals", copy: "We discuss when you want to retire, how much you want to work and what lifestyle you would like to maintain." },
  { num: "02", title: "Review your position", copy: "We look at your income, superannuation, expenses and broader financial circumstances." },
  { num: "03", title: "Compare strategies", copy: "We consider different transition-to-retirement scenarios and explain the potential benefits, trade-offs and risks." },
  { num: "04", title: "Put your plan into action", copy: "If a strategy is appropriate, we help you implement the agreed recommendations and review your progress over time." },
];

export default function TransitionToRetirement() {
  return (
    <div className="flex flex-col min-h-screen">
      <PageHero
        overline="Transition to retirement"
        title="Ease into retirement on your terms"
        subtitle="Retirement does not always have to happen overnight. A transition-to-retirement strategy may help eligible Australians reduce their working hours, supplement their income or make more effective use of their super while they prepare for the next stage of life."
      />

      {/* Intro */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <motion.p custom={0} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#AED137" }}>
            A more flexible way to retire
          </motion.p>
          <motion.h2 custom={1} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="font-sans text-4xl md:text-5xl font-bold mb-8" style={{ color: "#022F35" }}>
            You may not have to choose between working and retiring
          </motion.h2>
          <motion.div custom={2} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="space-y-4 text-lg text-foreground/60 leading-relaxed">
            <p>For many people, retirement is a gradual transition rather than a single date.</p>
            <p>You might want to work fewer days, spend more time travelling, care for family or simply start enjoying more flexibility before finishing work completely.</p>
            <p>Depending on your age, superannuation arrangements and personal circumstances, a Transition to Retirement strategy may provide another way to structure your income while you continue working.</p>
            <p>We can help you understand how these strategies work and whether they are appropriate for your circumstances.</p>
          </motion.div>
        </div>
      </section>

      {/* 3 TTR cards */}
      <section className="py-24" style={{ backgroundColor: "#FAFBFA" }}>
        <div className="container mx-auto px-6 max-w-7xl">
          <motion.p custom={0} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-xs font-semibold uppercase tracking-widest mb-4 text-center" style={{ color: "#AED137" }}>
            How a transition to retirement strategy may help
          </motion.p>
          <motion.h2 custom={1} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="font-sans text-4xl md:text-5xl font-bold text-center mb-14" style={{ color: "#022F35" }}>
            Ways this strategy could support you
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ttrCards.map(({ icon: Icon, title, copy }, i) => (
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

      {/* Two-column */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: 32 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }} className="order-2 lg:order-1">
              <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#AED137" }}>
                Is transition to retirement right for you?
              </p>
              <h2 className="font-sans text-4xl md:text-5xl font-bold mb-6" style={{ color: "#022F35" }}>
                A strategy that needs to fit your circumstances
              </h2>
              <div className="space-y-4 text-lg text-foreground/60 leading-relaxed mb-8">
                <p>Transition-to-retirement strategies are not suitable for everyone.</p>
                <p>There are eligibility requirements, superannuation rules, tax considerations and limits around how much you can access.</p>
                <p>Before making changes, it is important to consider how a strategy may affect your current income as well as your long-term retirement savings.</p>
                <p>At Entire Financial Services, we look at the full picture rather than a strategy in isolation.</p>
              </div>
              <Link href="/contact">
                <Button className="rounded-full px-8 h-12 font-semibold" style={{ backgroundColor: "#0D6851", color: "#FFFFFF" }}>
                  Discuss Your Options <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: -32 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }} className="relative order-1 lg:order-2">
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
                <ResponsiveImage image="transition-main" alt="Person in gradual transition to retirement" className="w-full h-full object-cover" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What we consider — dark green */}
      <section className="py-24" style={{ backgroundColor: "#FAFBFA" }}>
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.p custom={0} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-xs font-semibold uppercase tracking-widest mb-4 text-center" style={{ color: "#AED137" }}>
            What we consider
          </motion.p>
          <motion.h2 custom={1} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="font-sans text-4xl md:text-5xl font-bold text-center mb-12" style={{ color: "#022F35" }}>
            The full picture, not just part of it
          </motion.h2>
          <motion.div custom={2} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
            {considerations.map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-xl px-5 py-4"
                style={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E9E7" }}>
                <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: "#AED137" }} />
                <span className="text-base" style={{ color: "#243B3D" }}>{item}</span>
              </div>
            ))}
          </motion.div>
          <motion.p custom={3} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-lg leading-relaxed text-center" style={{ color: "#344A4B" }}>
            The aim is to determine whether a transition-to-retirement strategy supports both the lifestyle you want today and the retirement you are building for tomorrow.
          </motion.p>
        </div>
      </section>

      {/* From working life to retirement */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <motion.p custom={0} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#AED137" }}>
            From working life to retirement
          </motion.p>
          <motion.h2 custom={1} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="font-sans text-4xl md:text-5xl font-bold mb-8" style={{ color: "#022F35" }}>
            Create a smoother financial transition
          </motion.h2>
          <motion.div custom={2} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="space-y-4 text-lg text-foreground/60 leading-relaxed">
            <p>Reducing work can change both your income and the way you think about your finances.</p>
            <p>We can help you compare different scenarios so you can understand what working three or four days a week, retiring at different ages or changing your super contributions could mean for your overall retirement plan.</p>
            <p>Rather than focusing only on today's income, we consider how each decision may affect the years ahead.</p>
          </motion.div>
        </div>
      </section>

      {/* Process steps */}
      <section className="py-24" style={{ backgroundColor: "#FAFBFA" }}>
        <div className="container mx-auto px-6 max-w-5xl">
          <motion.p custom={0} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-xs font-semibold uppercase tracking-widest mb-4 text-center" style={{ color: "#AED137" }}>
            How we help
          </motion.p>
          <motion.h2 custom={1} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="font-sans text-4xl md:text-5xl font-bold text-center mb-14" style={{ color: "#022F35" }}>
            Understand the strategy before making the change
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
        title="Thinking about working less?"
        subtitle="Talk to us about what a gradual transition into retirement could look like for you."
      />
    </div>
  );
}
