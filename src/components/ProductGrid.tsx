import ScrollReveal from "./ScrollReveal";
import ProductCard from "./ProductCard";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";

const products = [
  { image: product1, name: "Oversized Hoodie", price: "€120", category: "Tops" },
  { image: product2, name: "Essential Tee", price: "€55", category: "Basics" },
  { image: product3, name: "Cargo Pants", price: "€145", category: "Bottoms" },
  { image: product4, name: "Crossbody Bag", price: "€95", category: "Accessories" },
  { image: product5, name: "Ribbed Beanie", price: "€35", category: "Accessories" },
  { image: product6, name: "Crewneck Sweat", price: "€110", category: "Tops" },
];

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
    </section>
  );
};

export default ProductGrid;
