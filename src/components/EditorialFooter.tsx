import ScrollReveal from "./ScrollReveal";
import { ArrowUpRight } from "lucide-react";

const EditorialFooter = () => {
  return (
    <footer className="border-t border-border">
      <div className="px-6 md:px-16 py-16 md:py-24">
        <ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-24">
            <div>
              <h4 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4">Navigation</h4>
              <nav className="space-y-2">
                {["Collection", "About", "Journal", "Contact", "Stockists"].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="block font-display text-lg text-foreground hover:text-accent transition-colors duration-300"
                  >
                    {item}
                  </a>
                ))}
              </nav>
            </div>
            <div>
              <h4 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4">Connect</h4>
              <nav className="space-y-2">
                {["Instagram", "Twitter", "TikTok", "Pinterest"].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="flex items-center gap-2 font-display text-lg text-foreground hover:text-accent transition-colors duration-300 group"
                  >
                    {item}
                    <ArrowUpRight size={14} strokeWidth={1.5} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                ))}
              </nav>
            </div>
            <div>
              <h4 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4">Newsletter</h4>
              <p className="font-mono text-sm text-muted-foreground mb-4">
                First access to drops. No spam. Unsubscribe anytime.
              </p>
              <div className="flex border-b border-border">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 bg-transparent font-mono text-sm text-foreground py-3 outline-none placeholder:text-muted-foreground"
                />
                <button className="text-accent font-mono text-xs uppercase tracking-widest px-2 hover:opacity-70 transition-opacity">
                  Join
                </button>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Giant brand name */}
        <ScrollReveal>
          <h2 className="font-display text-[15vw] md:text-[12vw] font-bold text-foreground leading-[0.85] -tracking-[0.04em] select-none">
            FRXSH
          </h2>
        </ScrollReveal>

        <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
          <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
            © 2026 Frxsh. All rights reserved.
          </span>
          <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
            Designed with precision
          </span>
        </div>
      </div>
    </footer>
  );
};

export default EditorialFooter;
