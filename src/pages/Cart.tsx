import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import EditorialFooter from "@/components/EditorialFooter";
import MagneticButton from "@/components/MagneticButton";
import { useCart } from "@/context/CartContext";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, subtotal, clearCart } = useCart();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  
  const tax = subtotal * 0.18; // 18% GST for India
  const shipping = subtotal > 15000 ? 0 : 500;
  const total = subtotal + tax + shipping;

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticating(!!data.session);
    };
    checkUser();
  }, []);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleCheckout = async () => {
    setIsProcessing(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("Authentication Required", {
          description: "Please sign in to complete your purchase.",
        });
        navigate("/login");
        return;
      }

      navigate("/checkout");
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Header />
        <main className="flex-grow flex flex-col items-center justify-center pt-32 pb-24 px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-24 h-24 bg-secondary flex items-center justify-center mb-8 mx-auto">
              <ShoppingBag size={32} className="text-muted-foreground" />
            </div>
            <h1 className="font-display text-4xl font-bold uppercase tracking-tight mb-4">Your bag is empty</h1>
            <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-12 max-w-xs mx-auto leading-relaxed">
              Discover our latest editorial collections and architectural silhouettes.
            </p>
            <Link to="/collection">
              <MagneticButton className="bg-foreground text-background px-12 py-5 font-mono text-[10px] uppercase tracking-[0.3em]">
                Explore Collection
              </MagneticButton>
            </Link>
          </motion.div>
        </main>
        <EditorialFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="pt-24 sm:pt-32 pb-24 px-4 sm:px-10 lg:px-24">
        <div className="max-w-7xl mx-auto">
          {/* Elegant Page Header */}
          <header className="mb-12 border-b border-border/50 pb-8">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4">
              <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-accent">Vault Access</span>
              {isAuthenticating && (
                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-accent/10 border border-accent/20 rounded-none">
                  <RefreshCw size={8} className="text-accent animate-spin" />
                  <span className="font-mono text-[8px] uppercase tracking-widest text-accent">Cloud Sync Active</span>
                </div>
              )}
            </div>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              <h1 className="font-display text-4xl sm:text-6xl md:text-8xl font-bold uppercase tracking-tighter leading-[0.85]">
                Shopping<br />Bag
              </h1>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground border-l border-border pl-6 py-2 hidden sm:block">
                Curated Selection<br />
                {cart.length} Masterpieces
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
            {/* Bag Items */}
            <div className="lg:col-span-7 space-y-12">
              {cart.map((item, idx) => (
                <motion.div 
                  key={`${item.id}-${item.size || 'no-size'}-${idx}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="flex gap-4 sm:gap-8 group border-b border-border/30 pb-12"
                >
                  {/* Product Image */}
                  <Link to={`/product/${item.id}`} className="w-24 sm:w-40 md:w-48 aspect-[3/4] overflow-hidden bg-secondary flex-shrink-0">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000 group-hover:scale-110" 
                    />
                  </Link>
                  
                  {/* Product Details */}
                  <div className="flex-grow flex flex-col justify-between py-1">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <Link to={`/product/${item.id}`}>
                          <h3 className="font-display text-lg sm:text-2xl font-bold uppercase tracking-tight leading-tight group-hover:text-accent transition-colors">
                            {item.name}
                          </h3>
                        </Link>
                        <button 
                          onClick={() => removeFromCart(item.id, item.size)}
                          className="text-muted-foreground hover:text-red-500 transition-colors p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 size={16} strokeWidth={1} />
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center gap-4">
                        <span className="font-mono text-xs text-accent font-bold tracking-widest">{item.price}</span>
                        {item.size && (
                          <span className="font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 border border-border/50 text-muted-foreground">
                            Size: {item.size}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                      {/* Quantity Control */}
                      <div className="flex items-center border border-border/50 w-fit">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1, item.size)}
                          className="w-10 h-10 flex items-center justify-center hover:bg-secondary transition-colors disabled:opacity-20"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={12} strokeWidth={1.5} />
                        </button>
                        <span className="font-mono w-10 text-center text-xs font-bold border-x border-border/50 h-10 flex items-center justify-center">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1, item.size)}
                          className="w-10 h-10 flex items-center justify-center hover:bg-secondary transition-colors"
                        >
                          <Plus size={12} strokeWidth={1.5} />
                        </button>
                      </div>
                      
                      {/* Item Total */}
                      <div className="text-right">
                         <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground mb-1">Subtotal</p>
                         <p className="font-mono text-sm font-bold">
                           {formatCurrency((parseInt(item.price?.replace(/[₹,]/g, "") || "0")) * item.quantity)}
                         </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Summary Sticky Block */}
            <div className="lg:col-span-5">
              <div className="sticky top-32 bg-secondary/20 p-6 sm:p-10 border border-border/50">
                <header className="mb-10">
                   <p className="font-mono text-[9px] uppercase tracking-[0.4em] text-accent mb-2">Checkout Details</p>
                   <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight">Order Summary</h2>
                </header>
                
                <div className="space-y-6 mb-12 font-mono text-xs uppercase tracking-widest border-b border-border/50 pb-10">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Retail</span>
                    <span className="font-bold">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">GST Alignment (18%)</span>
                    <span className="font-bold">{formatCurrency(tax)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Logistics</span>
                    <span className="font-bold text-accent">{shipping === 0 ? "Complimentary" : formatCurrency(shipping)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-end mb-12">
                   <div>
                     <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground mb-1">Final Investment</p>
                     <span className="font-display text-4xl sm:text-5xl font-bold tracking-tighter">{formatCurrency(total)}</span>
                   </div>
                </div>

                <div className="space-y-4">
                  <button 
                    onClick={handleCheckout}
                    disabled={isProcessing}
                    className="w-full bg-accent text-accent-foreground py-6 flex items-center justify-center gap-3 group overflow-hidden transition-all hover:scale-[1.01] hover:shadow-[0_0_30px_rgba(var(--accent),0.3)] disabled:opacity-50"
                  >
                    <span className="font-mono text-sm uppercase tracking-[0.3em] font-bold">
                      Buy Now
                    </span>
                    <ShoppingBag size={18} className="group-hover:-translate-y-1 transition-transform duration-500" />
                  </button>

                  <button 
                    onClick={handleCheckout}
                    disabled={isProcessing}
                    className="w-full bg-foreground text-background py-6 flex items-center justify-center gap-3 group overflow-hidden border border-foreground hover:bg-transparent hover:text-foreground transition-all disabled:opacity-50"
                  >
                    <span className="font-mono text-sm uppercase tracking-[0.3em]">
                      Standard Checkout
                    </span>
                    <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-500" />
                  </button>
                </div>

                <div className="mt-10 flex items-center justify-center gap-4 border-t border-border/50 pt-8 opacity-40 grayscale group-hover:grayscale-0 transition-all">
                  {["Visa", "Mastercard", "Amex", "UPI"].map(method => (
                    <span key={method} className="font-mono text-[8px] uppercase tracking-widest border border-border px-1.5 py-0.5">{method}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <EditorialFooter />
    </div>
  );
};

export default Cart;
