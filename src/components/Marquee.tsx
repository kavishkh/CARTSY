import { motion } from "framer-motion";

const Marquee = () => {
  const text = "CURATED ESSENTIALS • ZERO NOISE • SS26 COLLECTION • FREE SHIPPING WORLDWIDE • ";

  return (
    <div className="border-y border-border py-4 overflow-hidden">
      <motion.div
        animate={{ x: [0, -1920] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="flex whitespace-nowrap"
      >
        {[...Array(4)].map((_, i) => (
          <span key={i} className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground mx-0">
            {text}
          </span>
        ))}
      </motion.div>
    </div>
  );
};

export default Marquee;
