import { PageHero } from "@/components/PageHero";
import { CTABanner } from "@/components/CTABanner";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Home, Receipt, Shield, Banknote, Users, ArrowRight } from "lucide-react";
import { ResponsiveImage } from "@/components/ResponsiveImage";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const helpCards = [
  {
    icon: Home,
    title: "Aged care accommodation costs",
    copy: "Understand the different ways residential aged care accommodation may be funded and what those choices could mean for your overall financial position.",
  },
  {
    icon: Receipt,
    title: "Ongoing care fees",
    copy: "Gain a clearer understanding of the different fees that may apply and how they could affect income and cash flow.",
  },
  {
    icon: Shield,
    title: "Centrelink & government support",
    copy: "Understand how income, assets and the family home may affect government assessments and available support.",
  },
  {
    icon: Banknote,
    title: "Cash flow & assets",
    copy: "Explore how pensions, investments, savings and other assets may be structured to help meet ongoing care costs.",
  },
  {
    icon: Users,
    title: "Your family & estate",
    copy: "Consider how aged care decisions may affect the family home, your estate and the people you want to provide for.",
  },
];

const priorityCards = [
  {
    title: "Affordability",
    copy: "Manage ongoing care costs and understand the effect on cash flow.",
  },
  {
    title: "Income",
    copy: "Make sure sufficient income is available to support care and everyday expenses.",
  },
  {
    title: "Access to capital",
    copy: "Consider how much money should remain readily available for future needs.",
  },
  {
    title: "Estate & family",
    copy: "Understand how aged care decisions may affect assets and the legacy you wish to leave.",
  },
];

const processSteps = [
  { num: "01", title: "Initial conversation", copy: "We learn about your family's situation, what decisions need to be made and what matters most." },
  { num: "02", title: "Understand the financial position", copy: "We review relevant income, assets, care costs, Centrelink considerations and cash-flow requirements." },
  { num: "03", title: "Develop your strategy", copy: "Where personal advice is appropriate, we develop recommendations designed around your circumstances and priorities." },
  { num: "04", title: "Help put the plan in place", copy: "We assist with implementing the agreed financial strategy and can provide ongoing support as circumstances change." },
];

export default function AgedCare() {
  return (
    <div className="flex flex-col min-h-screen">
      <PageHero
        overline="Aged care"
        title="Clear financial guidance when your family needs it most"
        subtitle="Moving into aged care can involve difficult decisions at an emotional time. We help individuals and families understand the financial side of aged care so they can make informed decisions with greater clarity and confidence."
      />

      {/* Intro */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <motion.p custom={0} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#AED137" }}>
            Making aged care easier to understand
          </motion.p>
          <motion.h2 custom={1} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="font-sans text-4xl md:text-5xl font-bold mb-8" style={{ color: "#022F35" }}>
            Support through a complex financial decision
          </motion.h2>
          <motion.div custom={2} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="space-y-4 text-lg text-foreground/60 leading-relaxed">
            <p>When someone you care about needs aged care, families are often required to make significant financial decisions quickly.</p>
            <p>There may be accommodation costs, ongoing care fees, Centrelink considerations, cash-flow needs, investments, the family home and estate planning implications to think about at the same time.</p>
            <p>Our role is to help you understand the financial choices in front of you so you and your family can make decisions that suit your circumstances and priorities.</p>
          </motion.div>
        </div>
      </section>

      {/* 5 icon cards */}
      <section className="py-24" style={{ backgroundColor: "#FAFBFA" }}>
        <div className="container mx-auto px-6 max-w-7xl">
          <motion.p custom={0} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-xs font-semibold uppercase tracking-widest mb-4 text-center" style={{ color: "#AED137" }}>
            What we can help you understand
          </motion.p>
          <motion.h2 custom={1} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="font-sans text-4xl md:text-5xl font-bold text-center mb-14" style={{ color: "#022F35" }}>
            Areas we can guide you through
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {helpCards.map(({ icon: Icon, title, copy }, i) => (
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
            <motion.div initial={{ opacity: 0, x: -32 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }} className="relative">
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
                <ResponsiveImage image="aged-care-main" alt="Family supporting an elderly loved one" className="w-full h-full object-cover" />
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 32 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#AED137" }}>
                Making sense of aged care costs
              </p>
              <h2 className="font-sans text-4xl md:text-5xl font-bold mb-6" style={{ color: "#022F35" }}>
                Understand what you may need to pay
              </h2>
              <div className="space-y-4 text-lg text-foreground/60 leading-relaxed mb-8">
                <p>Aged care fees can be difficult to understand when you first encounter them.</p>
                <p>Different accommodation and ongoing care costs can apply depending on the facility and a person's financial circumstances.</p>
                <p>We help you understand the types of costs involved, how assessments may work and the potential financial impact of the different options available to you.</p>
                <p>The goal is to give your family a clearer picture before important decisions are made.</p>
              </div>
              <Link href="/contact">
                <Button className="rounded-full px-8 h-12 font-semibold" style={{ backgroundColor: "#0D6851", color: "#FFFFFF" }}>
                  Talk to Us About Aged Care <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Family home — dark green */}
      <section className="py-24" style={{ backgroundColor: "#FAFBFA" }}>
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <motion.p custom={0} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#AED137" }}>
            The family home
          </motion.p>
          <motion.h2 custom={1} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="font-sans text-4xl md:text-5xl font-bold mb-8" style={{ color: "#022F35" }}>
            What happens to the family home?
          </motion.h2>
          <motion.div custom={2} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="space-y-4 text-lg leading-relaxed" style={{ color: "#344A4B" }}>
            <p>One of the biggest questions families often face is what to do with the family home.</p>
            <p>Should it be retained, sold or potentially rented? How might each choice affect cash flow, Centrelink assessments, aged care fees and your wider financial position?</p>
            <p>There is no single answer that suits every family.</p>
            <p>We can help you understand the financial implications of the available choices so you can make a decision based on what matters most to you.</p>
          </motion.div>
        </div>
      </section>

      {/* Priority cards */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-5xl">
          <motion.p custom={0} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-xs font-semibold uppercase tracking-widest mb-4 text-center" style={{ color: "#AED137" }}>
            What matters most to your family?
          </motion.p>
          <motion.h2 custom={1} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="font-sans text-4xl md:text-5xl font-bold text-center mb-4" style={{ color: "#022F35" }}>
            Aged care planning is about more than minimising fees
          </motion.h2>
          <motion.p custom={2} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-lg text-foreground/60 leading-relaxed text-center mb-12">
            The right strategy depends on your priorities.
          </motion.p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
            {priorityCards.map(({ title, copy }, i) => (
              <motion.div key={title} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="rounded-2xl p-8 shadow-sm" style={{ backgroundColor: "#FAFBFA" }}>
                <h3 className="font-sans text-lg font-bold mb-3 uppercase tracking-wide" style={{ color: "#0D6851" }}>{title}</h3>
                <p className="text-base text-foreground/60 leading-relaxed">{copy}</p>
              </motion.div>
            ))}
          </div>
          <motion.p custom={4} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-lg text-foreground/60 leading-relaxed text-center">
            We take the time to understand which of these priorities matter most to you before considering any financial strategy.
          </motion.p>
        </div>
      </section>

      {/* Estate planning */}
      <section className="py-24" style={{ backgroundColor: "#FAFBFA" }}>
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <motion.p custom={0} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#AED137" }}>
            Estate planning & professional support
          </motion.p>
          <motion.h2 custom={1} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="font-sans text-4xl md:text-5xl font-bold mb-8" style={{ color: "#022F35" }}>
            Consider the wider picture
          </motion.h2>
          <motion.div custom={2} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="space-y-4 text-lg text-foreground/60 leading-relaxed">
            <p>A move into aged care may also have implications for estate planning, powers of attorney and the way assets are held.</p>
            <p>Where legal or taxation advice is required, we can work alongside or refer you to appropriately qualified solicitors and accountants.</p>
            <p>This helps ensure financial advice forms part of a broader plan rather than being considered in isolation.</p>
          </motion.div>
        </div>
      </section>

      {/* Process steps */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-5xl">
          <motion.p custom={0} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-xs font-semibold uppercase tracking-widest mb-4 text-center" style={{ color: "#AED137" }}>
            How we help
          </motion.p>
          <motion.h2 custom={1} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="font-sans text-4xl md:text-5xl font-bold text-center mb-14" style={{ color: "#022F35" }}>
            A clearer process during a difficult time
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {processSteps.map(({ num, title, copy }, i) => (
              <motion.div key={num} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="flex gap-6">
                <span className="font-sans text-4xl font-bold leading-none shrink-0 mt-1" style={{ color: "#AED137" }}>{num}</span>
                <div>
                  <h3 className="font-sans text-xl font-bold mb-2" style={{ color: "#022F35" }}>{title}</h3>
                  <p className="text-lg leading-relaxed" style={{ color: "#344A4B" }}>{copy}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CTABanner
        title="You do not have to navigate aged care alone"
        subtitle="If you are considering aged care for yourself, a parent or another family member, we can help you understand the financial decisions ahead."
      />
    </div>
  );
}
