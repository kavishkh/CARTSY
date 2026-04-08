import ScrollReveal from "./ScrollReveal";
import ProductCard from "./ProductCard";
import { products } from "@/lib/products";
import { Link } from "react-router-dom";
import MagneticButton from "./MagneticButton";
import { ArrowRight } from "lucide-react";

const ProductGrid = () => {
  return (
    <section id="collection" className="px-6 md:px-16 py-24 md:py-32">
      <ScrollReveal>
        <div className="flex items-end justify-between mb-16">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent mb-3">
              01 — Collection
            </p>
            <h2 className="font-display text-4xl md:text-6xl font-bold text-foreground leading-[0.95]">
              Selected
              <br />
              Pieces
            </h2>
          </div>
          <p className="hidden md:block font-mono text-xs text-muted-foreground max-w-xs text-right">
            Each piece is designed with intention. No filler. No fast fashion. Just essentials that last.
          </p>
        </div>
      </ScrollReveal>

      {/* Asymmetric broken grid */}
      <div className="grid grid-cols-2 md:grid-cols-12 gap-4 md:gap-6">
        {/* Row 1: large + small */}
        <ScrollReveal className="col-span-2 md:col-span-7" delay={0}>
          <ProductCard {...products[0]} tall />
        </ScrollReveal>
        <ScrollReveal className="col-span-1 md:col-span-5 md:mt-24" delay={0.15}>
          <ProductCard {...products[1]} />
        </ScrollReveal>

        {/* Row 2: small + large */}
        <ScrollReveal className="col-span-1 md:col-span-4" delay={0.1}>
          <ProductCard {...products[2]} tall />
        </ScrollReveal>
        <ScrollReveal className="col-span-1 md:col-span-4 md:mt-16" delay={0.2}>
          <ProductCard {...products[3]} />
        </ScrollReveal>
        <ScrollReveal className="col-span-2 md:col-span-4" delay={0.3}>
          <ProductCard {...products[4]} />
        </ScrollReveal>

        {/* Row 3: full width feature */}
        <ScrollReveal className="col-span-2 md:col-span-6 md:col-start-4" delay={0.1}>
          <ProductCard {...products[5]} tall />
        </ScrollReveal>
      </div>

      <ScrollReveal className="mt-20 flex justify-center">
        <Link to="/collection">
          <MagneticButton className="group flex items-center space-x-4 border border-border px-8 py-4 hover:bg-foreground hover:text-background transition-colors duration-500">
            <span className="font-mono text-[10px] uppercase tracking-widest">Explore Full Collection</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </MagneticButton>
        </Link>
      </ScrollReveal>
    </section>
  );
};

export default ProductGrid;


