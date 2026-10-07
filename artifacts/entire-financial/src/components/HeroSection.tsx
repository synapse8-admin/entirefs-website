import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import { ResponsiveImage } from "@/components/ResponsiveImage";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const floatIn = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.55, delay: 0.5 + i * 0.15, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export function HeroSection() {
  return (
    <section className="relative flex items-center overflow-hidden" style={{ backgroundColor: "#D7DCC7" }}>
      {/* Lime accent top line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 z-10" style={{ backgroundColor: "#AED137" }} />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-10 pt-36 pb-14 lg:pt-40 lg:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* LEFT: Copy */}
          <div>
            {/* Trust badge */}
            {/* Headline */}
            <motion.h1
              custom={1} variants={fadeUp} initial={false} animate="visible"
              className="font-sans text-4xl md:text-5xl lg:text-[3.5rem] xl:text-[4rem] font-bold leading-[1.1] text-[#022F35] mb-6"
            >
              Purpose driven<br />financial advice
            </motion.h1>

            {/* Subheading */}
            <motion.p
              custom={2} variants={fadeUp} initial={false} animate="visible"
              className="text-lg md:text-xl leading-relaxed mb-10 max-w-lg"
              style={{ color: "#022F35", opacity: 0.65 }}
            >
              You’ve spent a lifetime building your wealth. We help you make the most of it.
              <br /><br />
              Entire Financial Services specialises in retirement advice, helping you navigate <Link href="/services/superannuation" className="hover:underline focus-visible:underline">superannuation</Link>, investments, retirement income, Centrelink, and the financial decisions that come with this next stage of life.
            </motion.p>

            {/* CTAs */}
            <motion.div
              custom={3} variants={fadeUp} initial="hidden" animate="visible"
              className="flex flex-col sm:flex-row gap-4 mb-10"
            >
              <Link href="/contact">
                <Button size="lg" className="group bg-[#0D6851] hover:bg-[#0D6851]/90 text-white rounded-full px-8 h-14 text-base font-medium transition-all duration-200 shadow-lg shadow-[#0D6851]/20">
                  Book a Consultation
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                </Button>
              </Link>
            </motion.div>

            <motion.a
              href="https://www.google.com/search?sca_esv=9f038c2127115fe6&si=AL3DRZHrmvnFAVQPOO2Bzhf8AX9KZZ6raUI_dT7DG_z0kV2_xxJ7boT8GWFsOd-y1DVsjG3d68B-dLyjpk8IS8FS7BDjOy2Vsdi0amgJ7JwsowxoNI_P-Xl1iBKv3bdHNsmXcoTqi9piy-T1lbjuIbMu6yv6YVa_DA%3D%3D&q=Entire+Financial+Services+Reviews&sa=X&ved=2ahUKEwjz84aXjf6TAxU6R2cHHafmJTcQ0bkNegQISxAF&biw=2552&bih=1308&dpr=1.5"
              target="_blank"
              rel="noopener noreferrer"
              custom={4} variants={fadeUp} initial="hidden" animate="visible"
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 hover:opacity-80 transition-opacity cursor-pointer"
              style={{ border: "1px solid rgba(13,104,81,0.2)", backgroundColor: "rgba(13,104,81,0.06)" }}
            >
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#AED137] text-[#AED137]" />
                ))}
              </div>
              <span className="text-[#0D6851] text-xs font-medium">80+ Five-Star Reviews</span>
            </motion.a>
          </div>

          {/* RIGHT: Visual panel */}
          <div className="relative hidden lg:flex items-start justify-center h-[460px] -mt-16">

            {/* Main image */}
            <motion.div
              custom={0} variants={floatIn} initial={false} animate="visible"
              className="absolute inset-[14%] rounded-full overflow-hidden shadow-2xl"
              style={{ border: "3px solid rgba(13,104,81,0.2)", aspectRatio: "1" }}
            >
              <ResponsiveImage
                image="hero-advisory" priority sizes="400px"
                alt="Financial adviser meeting with client in a modern office"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#022F35]/30 via-transparent to-transparent pointer-events-none" />
            </motion.div>


          </div>
        </div>
      </div>

      {/* Bottom fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white/30 to-transparent pointer-events-none" />
    </section>
  );
}
