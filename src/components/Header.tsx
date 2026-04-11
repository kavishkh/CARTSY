import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Search } from "lucide-react";
import MagneticButton from "./MagneticButton";
import FullScreenMenu from "./FullScreenMenu";
import { useCart } from "@/context/CartContext";

import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "lucide-react";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartCount } = useCart();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 px-6 md:px-10 py-4 flex items-center justify-between backdrop-blur-xl bg-background/60 border-b border-border/50"
      >
        <Link to="/">
          <MagneticButton
            className="font-display text-lg tracking-tight font-bold text-foreground"
          >
            Cartsy
          </MagneticButton>
        </Link>

        <nav className="hidden md:flex items-center gap-8 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          <Link
            to="/collection"
            className="relative cursor-pointer hover:text-foreground transition-colors duration-300"
          >
            Collection
          </Link>
          {["About", "Journal"].map((item) => (
            <motion.a
              key={item}
              href={`/#${item.toLowerCase()}`}
              className="relative cursor-pointer hover:text-foreground transition-colors duration-300"
              whileHover={{ y: -2 }}
            >
              {item}
            </motion.a>
          ))}
        </nav>


        <div className="flex items-center gap-4">
          {user ? (
            <Link to="/profile" className="hidden md:block">
              <MagneticButton className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-foreground hover:text-accent transition-colors">
                <User size={14} strokeWidth={1.5} />
                Profile
              </MagneticButton>
            </Link>
          ) : (
            <Link to="/login" className="hidden md:block">
              <MagneticButton className="font-mono text-[10px] uppercase tracking-widest text-foreground hover:text-accent transition-colors">
                Login
              </MagneticButton>
            </Link>
          )}
          <MagneticButton className="text-foreground hover:text-accent transition-colors">
            <Search size={18} strokeWidth={1.5} />
          </MagneticButton>
          <Link to="/cart">
            <MagneticButton className="text-foreground hover:text-accent transition-colors relative">
              <ShoppingBag size={18} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-accent text-accent-foreground text-[8px] font-mono flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </MagneticButton>
          </Link>
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
