import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Search } from "lucide-react";
import MagneticButton from "./MagneticButton";
import FullScreenMenu from "./FullScreenMenu";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 px-6 md:px-10 py-4 flex items-center justify-between backdrop-blur-xl bg-background/60 border-b border-border/50"
      >
        <MagneticButton
          className="font-display text-lg tracking-tight font-bold text-foreground"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          FRXSH
        </MagneticButton>

        <nav className="hidden md:flex items-center gap-8 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          {["Collection", "About", "Journal"].map((item) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="relative cursor-pointer hover:text-foreground transition-colors duration-300"
              whileHover={{ y: -2 }}
            >
              {item}
            </motion.a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <MagneticButton className="text-foreground hover:text-accent transition-colors">
            <Search size={18} strokeWidth={1.5} />
          </MagneticButton>
          <MagneticButton className="text-foreground hover:text-accent transition-colors relative">
            <ShoppingBag size={18} strokeWidth={1.5} />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-accent text-accent-foreground text-[8px] font-mono flex items-center justify-center">
              0
            </span>
          </MagneticButton>
          <MagneticButton
            className="md:hidden text-foreground"
            onClick={() => setMenuOpen(true)}
          >
            <div className="flex flex-col gap-1.5">
              <span className="w-5 h-px bg-foreground" />
              <span className="w-3 h-px bg-foreground" />
            </div>
          </MagneticButton>
          <MagneticButton
            className="hidden md:block font-mono text-xs uppercase tracking-widest text-foreground hover:text-accent transition-colors"
            onClick={() => setMenuOpen(true)}
          >
            Menu
          </MagneticButton>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && <FullScreenMenu onClose={() => setMenuOpen(false)} />}
      </AnimatePresence>
    </>
  );
};

export default Header;
