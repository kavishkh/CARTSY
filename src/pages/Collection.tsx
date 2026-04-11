import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lenis from "lenis";
import Header from "@/components/Header";
import EditorialFooter from "@/components/EditorialFooter";
import ProductCard from "@/components/ProductCard";
import ScrollReveal from "@/components/ScrollReveal";
import { products, fetchProducts } from "@/lib/products";
import { ChevronDown, SlidersHorizontal, X, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const departments = ["All", "Men", "Women", "Shoes"];
const categories = ["All", "Tops", "Basics", "Bottoms", "Accessories", "Dresses", "Outerwear"];
const sortOptions = [
  { label: "Newest First", value: "newest" },
  { label: "Price: Low to High", value: "price-low" },
  { label: "Price: High to Low", value: "price-high" },
];

const Collection = () => {
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { data: allProducts = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

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

  const filteredProducts = allProducts
    .filter((p) => {
      // Department filtering logic
      let deptMatch = true;
      if (selectedDept === "Men") deptMatch = p.gender === "men";
      else if (selectedDept === "Women") deptMatch = p.gender === "women";
      else if (selectedDept === "Shoes") deptMatch = p.category === "Shoes";

      // Category filtering logic
      const categoryMatch = selectedCategory === "All" ? true : p.category === selectedCategory;
      
      return deptMatch && categoryMatch;
    })
    .sort((a, b) => {
      const priceA = parseInt(a.price.replace(/[₹,]/g, ""));
      const priceB = parseInt(b.price.replace(/[₹,]/g, ""));
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
              Explore Our Catalog
            </p>
            <h1 className="font-display text-5xl md:text-8xl font-bold mb-8 leading-[0.9] uppercase tracking-tighter">
              Collection
            </h1>
            <p className="max-w-md font-mono text-xs text-muted-foreground leading-relaxed">
              Experience the convergence of architectural precision and tactile luxury. Each garment is a result of meticulous engineering and artistic intent.
            </p>
          </ScrollReveal>
        </section>

        {/* Filters Bar */}
        <section className="px-6 md:px-16 mb-16 border-y border-border py-8 space-y-8">
          {/* Departments */}
          <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12">
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground whitespace-nowrap">Department:</span>
            <div className="flex flex-wrap items-center gap-6">
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  className={`font-mono text-[10px] uppercase tracking-widest transition-colors relative pb-1 ${
                    selectedDept === dept ? "text-foreground font-bold" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {dept}
                  {selectedDept === dept && (
                    <motion.div layoutId="deptLine" className="absolute bottom-0 left-0 right-0 h-px bg-accent" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-border/50 w-full" />

          {/* Categories & Sort */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="flex flex-wrap items-center gap-6">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Category:</span>
              <div className="flex flex-wrap items-center gap-6">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`font-mono text-[10px] uppercase tracking-widest transition-colors relative pb-1 ${
                      selectedCategory === cat ? "text-foreground font-bold" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {cat}
                    {selectedCategory === cat && (
                      <motion.div layoutId="categoryLine" className="absolute bottom-0 left-0 right-0 h-px bg-accent" />
                    )}
                  </button>
                ))}
              </div>
            </div>

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
          </div>
        </section>

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
                onClick={() => {
                  setSelectedCategory("All");
                  setSelectedDept("All");
                }}
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
