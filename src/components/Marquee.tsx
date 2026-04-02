import { motion } from "framer-motion";

const Marquee = () => {
  const text = "CURATED ESSENTIALS • ZERO NOISE • SS26 COLLECTION • FREE SHIPPING WORLDWIDE • ";

  return (
    <div className="border-y border-border py-4 overflow-hidden">
      <div className="flex">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="flex shrink-0"
        >
          {[...Array(8)].map((_, i) => (
            <span key={i} className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground whitespace-nowrap">
              {text}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Marquee;
