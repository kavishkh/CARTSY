import { motion } from "framer-motion";
import heroImage from "@/assets/hero-editorial.jpg";
import MagneticButton from "./MagneticButton";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      <motion.div
        initial={{ scale: 1.15 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0"
      >
        <img
          src={heroImage}
          alt="Editorial fashion photography"
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-background/40" />
      </motion.div>

      <div className="relative z-10 h-full flex flex-col justify-end px-6 md:px-16 pb-16 md:pb-24">
        <div className="overflow-hidden">
          <motion.p
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="font-mono text-xs uppercase tracking-[0.3em] text-accent mb-4"
          >
            SS26 Collection
          </motion.p>
        </div>

        <div className="overflow-hidden">
          <motion.h1
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-5xl md:text-8xl lg:text-9xl font-bold text-foreground leading-[0.9] max-w-4xl"
          >
            Curated
            <br />
            Essentials.
          </motion.h1>
        </div>

        <div className="overflow-hidden mt-4">
          <motion.p
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="font-mono text-sm text-muted-foreground max-w-md"
          >
            Zero noise. Intentional design for those who value precision over excess.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-8"
        >
          <Link to="/collection">
            <MagneticButton className="bg-accent text-accent-foreground px-8 py-3 font-mono text-xs uppercase tracking-widest hover:opacity-90 transition-opacity">
              Explore Collection
            </MagneticButton>
          </Link>
        </motion.div>
      </div>


      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 right-6 md:right-16 font-mono text-xs text-muted-foreground"
        style={{ writingMode: "vertical-rl" }}
      >
        Scroll to explore ↓
      </motion.div>
    </section>
  );
};

export default Hero;
