import ScrollReveal from "./ScrollReveal";
import ProductCard from "./ProductCard";
import { products, fetchProducts } from "@/lib/products";
import { Link } from "react-router-dom";
import MagneticButton from "./MagneticButton";
import { ArrowRight, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const ProductGrid = () => {
  const { data: allProducts = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  if (isLoading) {
    return (
      <div className="py-32 flex justify-center">
        <Loader2 className="animate-spin text-accent" size={32} />
      </div>
    );
  }

  // Use the fetched products or fall back to empty to avoid indexing errors
  const safeProducts = allProducts.length >= 6 ? allProducts : products;

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
          <ProductCard {...safeProducts[0]} tall />
        </ScrollReveal>
        <ScrollReveal className="col-span-1 md:col-span-5 md:mt-24" delay={0.15}>
          <ProductCard {...safeProducts[1]} />
        </ScrollReveal>

        {/* Row 2: small + large */}
        <ScrollReveal className="col-span-1 md:col-span-4" delay={0.1}>
          <ProductCard {...safeProducts[2]} tall />
        </ScrollReveal>
        <ScrollReveal className="col-span-1 md:col-span-4 md:mt-16" delay={0.2}>
          <ProductCard {...safeProducts[3]} />
        </ScrollReveal>
        <ScrollReveal className="col-span-2 md:col-span-4" delay={0.3}>
          <ProductCard {...safeProducts[4]} />
        </ScrollReveal>

        {/* Row 3: full width feature */}
        <ScrollReveal className="col-span-2 md:col-span-6 md:col-start-4" delay={0.1}>
          <ProductCard {...safeProducts[5]} tall />
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


