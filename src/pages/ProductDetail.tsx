import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronRight, Minus, Plus, ShoppingBag } from "lucide-react";
import Lenis from "lenis";
import Header from "@/components/Header";
import EditorialFooter from "@/components/EditorialFooter";
import MagneticButton from "@/components/MagneticButton";
import ProductCard from "@/components/ProductCard";
import { products, Product, fetchProductById } from "@/lib/products";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id as string),
    enabled: !!id,
  });

  useEffect(() => {
    if (product) {
      setSelectedImage(product.image);
    }
  }, [product]);

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
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin text-accent" size={32} />
      </div>
    );
  }

  if (!product) {
    return (
       <div className="min-h-screen bg-background flex flex-col items-center justify-center pt-32">
         <Header />
         <p className="font-mono text-sm uppercase tracking-widest text-muted-foreground mb-8 text-center px-6">The architectural piece you seek does not exist.</p>
         <Link to="/collection">
           <MagneticButton className="bg-foreground text-background px-12 py-5 font-mono text-[10px] uppercase tracking-[0.3em]">
             Return to Collection
           </MagneticButton>
         </Link>
       </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity
    });
  };

  const handleBuyNow = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity
    });
    navigate("/cart");
  };

  const relatedProducts = products.filter((p) => p.id !== id).slice(0, 3);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="pt-32 pb-24 px-6 md:px-16">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-12">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight size={10} />
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          {/* Image Gallery */}
          <div className="lg:col-span-7 flex flex-col md:flex-row gap-6">
            <div className="flex flex-row md:flex-col gap-4 order-2 md:order-1 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(img)}
                  className={`w-16 sm:w-20 aspect-square overflow-hidden bg-secondary transition-opacity flex-shrink-0 ${
                    selectedImage === img ? "opacity-100" : "opacity-40"
                  }`}
                >
                  <img src={img} alt={`${product.name} ${index}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            <div className="flex-1 order-1 md:order-2 bg-secondary aspect-[4/5] overflow-hidden">
              <motion.img
                key={selectedImage}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:col-span-5">
            <div className="sticky top-32">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent mb-4">
                {product.category}
              </p>
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-6 leading-tight">
                {product.name}
              </h1>
              <p className="text-2xl font-mono mb-8">{product.price}</p>
              
              <p className="text-muted-foreground leading-relaxed mb-10 text-lg">
                {product.description}
              </p>

              <div className="space-y-8 mb-12">
                {/* Quantity Selector */}
                <div className="flex items-center space-x-6">
                  <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Quantity</span>
                  <div className="flex items-center border border-border px-4 py-2 space-x-6">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="hover:text-accent transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="font-mono w-4 text-center">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="hover:text-accent transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <MagneticButton 
                    onClick={handleBuyNow}
                    className="flex-1 bg-accent text-accent-foreground py-6 flex items-center justify-center space-x-3 group overflow-hidden"
                  >
                    <span className="font-mono text-sm uppercase tracking-widest font-bold">
                      Buy Now
                    </span>
                  </MagneticButton>

                  <MagneticButton 
                    onClick={handleAddToCart}
                    className="flex-1 bg-foreground text-background py-6 flex items-center justify-center space-x-3 group overflow-hidden border border-foreground hover:bg-transparent hover:text-foreground transition-all duration-300"
                  >
                     <ShoppingBag size={18} className="group-hover:-translate-y-1 transition-transform" />
                     <span className="font-mono text-sm uppercase tracking-widest">
                      Add to Bag
                    </span>
                  </MagneticButton>
                </div>

              </div>

              {/* Product Details Accordion */}
              <Accordion type="single" collapsible className="w-full border-t border-border">
                <AccordionItem value="details" className="border-b border-border">
                  <AccordionTrigger className="font-mono text-[10px] uppercase tracking-widest py-6 hover:no-underline">
                    Product Details
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-3 pb-6">
                      {product.details.map((detail, index) => (
                        <li key={index} className="flex items-center text-sm text-muted-foreground">
                          <span className="w-1.5 h-1.5 bg-accent rounded-full mr-3" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="shipping" className="border-b border-border">
                  <AccordionTrigger className="font-mono text-[10px] uppercase tracking-widest py-6 hover:no-underline">
                    Shipping & Returns
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground pb-6 leading-relaxed">
                    Complimentary express shipping on all orders over ₹15,000. Returns accepted within 14 days of delivery.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <section className="mt-32">
          <div className="flex items-center justify-between mb-12 border-b border-border pb-6">
            <h2 className="font-display text-2xl font-bold uppercase tracking-tight">You May Also Like</h2>
            <Link to="/collection" className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground flex items-center group">
              View All <ChevronRight size={12} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>

          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedProducts.map((relProduct) => (
              <ProductCard key={relProduct.id} {...relProduct} />
            ))}
          </div>
        </section>
      </main>

      <EditorialFooter />
    </div>
  );
};

export default ProductDetail;
