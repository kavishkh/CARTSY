import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lenis from "lenis";
import Header from "@/components/Header";
import EditorialFooter from "@/components/EditorialFooter";
import ProductCard from "@/components/ProductCard";
import ScrollReveal from "@/components/ScrollReveal";
import { products } from "@/lib/products";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";

const categories = ["All", "Tops", "Basics", "Bottoms", "Accessories"];
const sortOptions = [
  { label: "Newest First", value: "newest" },
  { label: "Price: Low to High", value: "price-low" },
  { label: "Price: High to Low", value: "price-high" },
];

const Collection = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    window.scrollTo(0, 0);

    return () => lenis.destroy();
  }, []);

  const filteredProducts = products
    .filter((p) => (selectedCategory === "All" ? true : p.category === selectedCategory))
    .sort((a, b) => {
      const priceA = parseInt(a.price.replace("€", ""));
      const priceB = parseInt(b.price.replace("€", ""));
      if (sortBy === "price-low") return priceA - priceB;
      if (sortBy === "price-high") return priceB - priceA;
      return 0; // Default: as defined in data
    });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="pt-32 pb-24">
        {/* Hero Section */}
        <section className="px-6 md:px-16 mb-24">
          <ScrollReveal>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent mb-4">
              Explore OurCatalog
            </p>
            <h1 className="font-display text-5xl md:text-8xl font-bold mb-8 leading-[0.9]">
              The Full
              <br />
              Collection
            </h1>
            <p className="max-w-md font-mono text-xs text-muted-foreground leading-relaxed">
              Experience the convergence of architectural precision and tactile luxury. Each garment is a result of meticulous engineering and artistic intent.
            </p>
          </ScrollReveal>
        </section>

        {/* Filters/Sort Bar */}
        <section className="px-6 md:px-16 mb-16 border-y border-border py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Categories Desktop */}
          <div className="hidden md:flex items-center gap-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`font-mono text-[10px] uppercase tracking-widest transition-colors relative pb-1 ${
                  selectedCategory === cat ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
                {selectedCategory === cat && (
                  <motion.div
                    layoutId="categoryLine"
                    className="absolute bottom-0 left-0 right-0 h-px bg-accent"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Filters Mobile Trigger */}
          <button 
            className="md:hidden flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <SlidersHorizontal size={14} />
            Filters {selectedCategory !== "All" && `(${selectedCategory})`}
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Sort By:</span>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent font-mono text-[10px] uppercase tracking-widest text-foreground outline-none cursor-pointer focus:text-accent transition-colors"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-background">{opt.label}</option>
              ))}
            </select>
          </div>
        </section>

        {/* Mobile Filters Side Panel */}
        <AnimatePresence>
          {isFilterOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[70] bg-background/80 backdrop-blur-sm md:hidden"
                onClick={() => setIsFilterOpen(false)}
              />
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed top-0 right-0 bottom-0 z-[80] w-[80%] bg-background border-l border-border p-8 md:hidden shadow-2xl"
              >
                <div className="flex items-center justify-between mb-12">
                  <h2 className="font-display text-2xl font-bold uppercase tracking-tight">Category</h2>
                  <button onClick={() => setIsFilterOpen(false)} className="text-foreground">
                    <X size={24} strokeWidth={1.5} />
                  </button>
                </div>
                <div className="flex flex-col gap-8">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setIsFilterOpen(false);
                      }}
                      className={`text-left font-mono text-xs uppercase tracking-[0.2em] transition-all ${
                        selectedCategory === cat ? "text-accent text-lg" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Product Grid */}
        <section className="px-6 md:px-16 min-h-[400px]">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
              {filteredProducts.map((p, idx) => (
                <ScrollReveal key={p.id} delay={idx % 4 * 0.1}>
                  <ProductCard {...p} />
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <p className="font-mono text-sm text-muted-foreground mb-4 uppercase tracking-widest">No pieces found</p>
              <button 
                onClick={() => setSelectedCategory("All")}
                className="font-mono text-[10px] uppercase tracking-widest text-accent border-b border-accent"
              >
                Reset Filters
              </button>
            </div>
          )}
        </section>
      </main>

      <EditorialFooter />
    </div>
  );
};

export default Collection;
