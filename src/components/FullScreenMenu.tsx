import { motion } from "framer-motion";
import { X } from "lucide-react";
import MagneticButton from "./MagneticButton";

interface FullScreenMenuProps {
  onClose: () => void;
}

import { Link } from "react-router-dom";

const menuItems = [
  { label: "Collection", to: "/collection" },
  { label: "About", to: "/#about" },
  { label: "Journal", to: "/#journal" },
  { label: "Contact", to: "/#contact" },
];

const socials = ["Instagram", "Twitter", "TikTok"];

const FullScreenMenu = ({ onClose }: FullScreenMenuProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[60] bg-background flex flex-col"
    >
      <div className="flex items-center justify-between px-6 md:px-10 py-4">
        <Link to="/" onClick={onClose} className="font-display text-lg font-bold text-foreground">CART$Y</Link>
        <MagneticButton onClick={onClose} className="text-foreground hover:text-accent transition-colors">
          <X size={24} strokeWidth={1.5} />
        </MagneticButton>
      </div>

      <div className="flex-1 flex flex-col justify-center px-6 md:px-16">
        <nav className="space-y-2">
          {menuItems.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                to={item.to}
                onClick={onClose}
                className="block font-display text-5xl md:text-8xl font-bold text-foreground hover:text-accent transition-colors duration-300 leading-tight"
              >
                {item.label}
              </Link>
            </motion.div>
          ))}
        </nav>
      </div>


      <div className="px-6 md:px-16 pb-8 flex items-center justify-between">
        <div className="flex gap-6">
          {socials.map((s, i) => (
            <motion.a
              key={s}
              href="#"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors"
            >
              {s}
            </motion.a>
          ))}
        </div>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="font-mono text-xs text-muted-foreground"
        >
          © 2026
        </motion.span>
      </div>
    </motion.div>
  );
};

export default FullScreenMenu;
