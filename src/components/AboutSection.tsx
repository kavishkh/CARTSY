import { motion } from "framer-motion";
import ScrollReveal from "./ScrollReveal";
import aboutImage from "@/assets/about-editorial.jpg";

const AboutSection = () => {
  return (
    <section id="about" className="px-6 md:px-16 py-24 md:py-40">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center">
        {/* Text side */}
        <div className="md:col-span-5 order-2 md:order-1">
          <ScrollReveal>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent mb-4">
              02 — About
            </p>
            <h2 className="font-display text-4xl md:text-6xl font-bold text-foreground leading-[0.95] mb-8">
              Built on
              <br />
              Intention.
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <p className="font-mono text-sm text-muted-foreground leading-relaxed mb-6">
              FRXSH was born from a rejection of disposable fashion. Every piece in our collection 
              exists because it solves a problem — not because a trend demanded it.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.25}>
            <p className="font-mono text-sm text-muted-foreground leading-relaxed mb-10">
              We work with small-batch manufacturers in Portugal and Japan, using materials 
              that age with character. No seasonal drops. No artificial urgency. Just permanent 
              essentials released when they're ready.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <div className="grid grid-cols-3 gap-8 border-t border-border pt-8">
              {[
                { number: "47", label: "Pieces" },
                { number: "03", label: "Countries" },
                { number: "∞", label: "Wears" },
              ].map((stat) => (
                <div key={stat.label}>
                  <span className="font-display text-3xl md:text-4xl font-bold text-foreground">
                    {stat.number}
                  </span>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>

        {/* Image side */}
        <ScrollReveal className="md:col-span-7 order-1 md:order-2" delay={0.1}>
          <motion.div
            className="relative overflow-hidden aspect-[4/5]"
            whileHover={{ scale: 0.98 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <img
              src={aboutImage}
              alt="Editorial fashion — person sitting on concrete steps"
              loading="lazy"
              width={1280}
              height={1600}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-background/10" />
          </motion.div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default AboutSection;
