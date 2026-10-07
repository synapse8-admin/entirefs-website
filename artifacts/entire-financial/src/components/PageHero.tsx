import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PageHeroProps {
  overline?: string;
  title: string;
  subtitle?: string;
  extra?: ReactNode;
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export function PageHero({ overline, title, subtitle, extra }: PageHeroProps) {
  const serviceEyebrow = [
    "Transition to retirement", "Retirement planning", "Aged care",
  ].includes(overline ?? "");
  return (
    <section className="relative overflow-hidden pt-32 pb-20" style={{ backgroundColor: "#D7DCC7" }}>
      {/* Lime accent line at top — mirrors home hero */}
      <div className="absolute top-0 left-0 right-0 h-0.5 z-10" style={{ backgroundColor: "#AED137" }} />

      <div className="relative z-10 container mx-auto px-4 md:px-10 max-w-4xl text-center">
        {overline && (
          <motion.div
            custom={0} variants={fadeUp} initial={false} animate="visible"
            className="inline-flex items-center gap-3 mb-6"
          >
            <span className={`text-xs font-semibold tracking-widest${serviceEyebrow ? "" : " uppercase"}`} style={{ color: "#0D6851" }}>
              {overline}
            </span>
          </motion.div>
        )}

        <motion.h1
          custom={1} variants={fadeUp} initial={false} animate="visible"
          className="font-sans text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
          style={{ color: "#022F35" }}
        >
          {title}
        </motion.h1>

        {subtitle && (
          <motion.p
            custom={2} variants={fadeUp} initial={false} animate="visible"
            className="text-lg md:text-xl leading-relaxed max-w-2xl mx-auto"
            style={{ color: "#022F35", opacity: 0.65 }}
          >
            {subtitle}
          </motion.p>
        )}

        {extra && (
          <motion.div
            custom={3} variants={fadeUp} initial={false} animate="visible"
            className="mt-8"
          >
            {extra}
          </motion.div>
        )}
      </div>

      {/* Bottom fade into white sections */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white/30 to-transparent pointer-events-none" />
    </section>
  );
}
