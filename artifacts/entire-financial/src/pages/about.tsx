import { CTABanner } from "@/components/CTABanner";
import { AdviserBio } from "@/components/AdviserBio";
import { PageHero } from "@/components/PageHero";
import { motion } from "framer-motion";
import { ResponsiveImage } from "@/components/ResponsiveImage";

export default function About() {
  return (
    <div className="flex flex-col min-h-screen">
      <PageHero
        overline="Our Firm"
        title="About Us"
        subtitle="A dedicated team of professionals committed to providing structured, strategic, and deeply personalised financial advice."
      />
      {/* Our Story — two-column image + text */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Image column */}
            <motion.div
              initial={{ opacity: 0, x: -32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
                <ResponsiveImage
                  image="about-meeting"
                  alt="Financial adviser meeting with client"
                  className="w-full h-full object-cover"
                />
                {/* Subtle overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#022F35]/20 via-transparent to-transparent" />
              </div>
            </motion.div>

            {/* Text column */}
            <motion.div
              initial={{ opacity: 0, x: 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#AED137" }}>Our Story</p>
              <h2 className="font-sans text-4xl md:text-5xl font-bold mb-6" style={{ color: "#022F35" }}>
                Built on purpose.<br />Driven by your goals.
              </h2>
              <div className="space-y-4 text-lg leading-relaxed text-foreground/60">
                <p>
                  At Entire Financial Services, we believe that true wealth management goes beyond numbers. It's about understanding the nuances of your life, anticipating your future needs, and building a robust framework that supports your aspirations.
                </p>
                <p>
                  Our firm was founded on the principle that premium financial advice should be clear, strategic, and aligned with our clients' best interests. We work closely with professionals, business owners, and retirees who require sophisticated planning and a steady hand to guide them through complex financial landscapes.
                </p>
              </div>
            </motion.div>

          </div>
        </div>
      </section>
      {/* Adviser Bio */}
      <section className="py-24 border-y border-muted/30" style={{ backgroundColor: "#FAFBFA" }}>
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="font-sans text-4xl md:text-5xl font-bold text-secondary text-center mb-12">Meet your principal adviser</h2>
          
          <AdviserBio 
            name="Bevan Heneric"
            role="Principal Financial Adviser"
            experience="20+ Years Experience"
            image="bevan-heneric"
            description={
              <>
                <p>Bevan Heneric is the Principal Financial Adviser at Entire Financial Services, with more than 20 years of experience across the financial services industry.</p>
                <p>Throughout his career, Bevan has developed a deep understanding of the financial decisions people face as they approach and move through retirement. He specialises in helping clients navigate superannuation, retirement income, investments, Centrelink and Aged care, bringing these areas together to create strategies tailored to each client’s circumstances and the retirement they want to achieve.</p>
                <p>Bevan believes good financial advice should never leave you feeling overwhelmed or uncertain. He takes the time to understand what matters to each client, explain complex strategies in plain language and ensure they understand not only what is being recommended, but why.</p>
                <p>His approach is simple: financial strategies need to work in the real world. Every recommendation is considered against a client’s lifestyle, priorities and long-term objectives, so the advice remains focused on what ultimately matters - helping clients enjoy their retirement with greater clarity and confidence.</p>
              </>
            }
          />
        </div>
      </section>
      {/* Philosophy */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="font-sans text-4xl md:text-5xl font-bold text-secondary text-center mb-16">
            Our approach
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                <span className="font-sans text-2xl font-bold">1</span>
              </div>
              <h3 className="font-sans text-xl font-bold text-secondary mb-4">Discovery</h3>
              <p className="text-lg text-foreground/60 leading-relaxed">
                We start by listening. Before we look at numbers, we understand your values, your family dynamics, your fears, and what you ultimately want your wealth to achieve.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                <span className="font-sans text-2xl font-bold">2</span>
              </div>
              <h3 className="font-sans text-xl font-bold text-secondary mb-4">Strategy</h3>
              <p className="text-lg text-foreground/60 leading-relaxed">
                We engineer a bespoke roadmap. This involves stress-testing scenarios, optimizing tax structures, selecting appropriate vehicles like SMSFs, and mitigating risks.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                <span className="font-sans text-2xl font-bold">3</span>
              </div>
              <h3 className="font-sans text-xl font-bold text-secondary mb-4">Partnership</h3>
              <p className="text-lg text-foreground/60 leading-relaxed">
                Financial planning is not a one-off event. We provide ongoing, proactive management, adjusting your strategy as legislation changes, markets shift, and your life evolves.
              </p>
            </div>
          </div>
        </div>
      </section>
      <CTABanner />
    </div>
  );
}
