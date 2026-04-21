import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import Header from "@/components/Header";
import EditorialFooter from "@/components/EditorialFooter";
import MagneticButton from "@/components/MagneticButton";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ChevronRight, CreditCard, ShieldCheck, Truck, Loader2 } from "lucide-react";

const Checkout = () => {
  const { cart, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipPost: "",
    phone: ""
  });

  const tax = subtotal * 0.18;
  const shipping = subtotal > 15000 ? 0 : 500;
  const total = subtotal + tax + shipping;

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Authentication Required", {
          description: "Please sign in to proceed with checkout.",
        });
        navigate("/login");
        return;
      }
      if (cart.length === 0) {
        navigate("/cart");
      }
      
      setFormData(prev => ({
        ...prev,
        email: session.user.email || ""
      }));
    };
    checkAuth();
  }, [cart.length, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.fullName || !formData.address || !formData.city || !formData.phone) {
      toast.error("Incomplete Information", {
        description: "Please fill in all required shipping details."
      });
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    setIsProcessing(true);

    try {
      // 1. Create the order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: session.user.id,
          total_amount: total,
          status: 'processing', // Start as processing
          shipping_address: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.zipPost}`,
          full_name: formData.fullName,
          phone: formData.phone
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Create order items
      const orderItems = cart.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price_at_time: item.price,
        size: item.size || 'default'
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // 3. Clear cart and redirect
      await clearCart();
      
      toast.success("Order Placed Successfully", {
        description: "Your selection has been registered in our archives.",
      });
      
      navigate("/order-success", { state: { orderId: order.id } });
    } catch (error: any) {
      console.error("Checkout Error:", error);
      toast.error("Checkout Failed", {
        description: error.message || "An unexpected error occurred."
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="pt-24 sm:pt-32 pb-24 px-4 sm:px-10 lg:px-24">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <header className="mb-12 border-b border-border/50 pb-8">
            <div className="flex items-center gap-x-2 mb-4 font-mono text-[9px] uppercase tracking-[0.4em] text-accent">
               <ShieldCheck size={10} />
               <span>Secured Checkout Environment</span>
            </div>
            <h1 className="font-display text-4xl sm:text-6xl font-bold uppercase tracking-tighter">
              Checkout
            </h1>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Left Column: Forms */}
            <div className="lg:col-span-7 space-y-12">
              <section className="space-y-8">
                <div className="flex items-center gap-4">
                  <span className="w-8 h-8 rounded-none bg-foreground text-background flex items-center justify-center font-mono text-xs">01</span>
                  <h2 className="font-display text-2xl font-bold uppercase tracking-tight">Shipping Information</h2>
                </div>
                
                <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2 space-y-2">
                    <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                    <input 
                      type="text" 
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="w-full bg-secondary/30 border border-border/50 p-4 font-mono text-xs uppercase tracking-widest focus:outline-none focus:border-accent transition-colors"
                      required
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground ml-1">Shipping Address</label>
                    <input 
                      type="text" 
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Street address, suite, floor..."
                      className="w-full bg-secondary/30 border border-border/50 p-4 font-mono text-xs uppercase tracking-widest focus:outline-none focus:border-accent transition-colors"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground ml-1">City</label>
                    <input 
                      type="text" 
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="City Name"
                      className="w-full bg-secondary/30 border border-border/50 p-4 font-mono text-xs uppercase tracking-widest focus:outline-none focus:border-accent transition-colors"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground ml-1">State / Province</label>
                    <input 
                      type="text" 
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="State"
                      className="w-full bg-secondary/30 border border-border/50 p-4 font-mono text-xs uppercase tracking-widest focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground ml-1">ZIP / Postal Code</label>
                    <input 
                      type="text" 
                      name="zipPost"
                      value={formData.zipPost}
                      onChange={handleInputChange}
                      placeholder="Zip Code"
                      className="w-full bg-secondary/30 border border-border/50 p-4 font-mono text-xs uppercase tracking-widest focus:outline-none focus:border-accent transition-colors"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground ml-1">Phone Number</label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full bg-secondary/30 border border-border/50 p-4 font-mono text-xs uppercase tracking-widest focus:outline-none focus:border-accent transition-colors"
                      required
                    />
                  </div>
                </form>
              </section>

              <section className="space-y-8 pt-8 border-t border-border/30">
                <div className="flex items-center gap-4">
                  <span className="w-8 h-8 rounded-none bg-foreground text-background flex items-center justify-center font-mono text-xs">02</span>
                  <h2 className="font-display text-2xl font-bold uppercase tracking-tight">Payment Selection</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="border border-accent/50 bg-accent/5 p-6 flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-4 h-4 rounded-full border border-accent flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-accent" />
                      </div>
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-widest font-bold">Standard Billing</p>
                        <p className="font-mono text-[8px] uppercase tracking-widest text-muted-foreground">Credit / Debit Card / UPI</p>
                      </div>
                    </div>
                    <CreditCard size={20} className="text-accent" />
                  </div>
                  
                  <div className="border border-border/50 p-6 flex items-center justify-between opacity-50 cursor-not-allowed">
                    <div className="flex items-center gap-4">
                      <div className="w-4 h-4 rounded-full border border-border" />
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-widest font-bold">Cryptocurrency</p>
                        <p className="font-mono text-[8px] uppercase tracking-widest text-muted-foreground">BTC / ETH (Coming Soon)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-5">
              <div className="sticky top-32 bg-secondary/20 p-8 sm:p-10 border border-border/50">
                <header className="mb-10 flex justify-between items-baseline">
                   <h2 className="font-display text-2xl font-bold uppercase tracking-tight">Review Order</h2>
                   <Link to="/cart" className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground hover:text-accent underline underline-offset-4">Edit Bag</Link>
                </header>

                <div className="space-y-6 mb-10 max-h-[30vh] overflow-y-auto pr-2 scrollbar-hide">
                  {cart.map((item, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="w-16 h-20 bg-secondary flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover grayscale" />
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-display text-xs font-bold uppercase tracking-tight leading-tight mb-1">{item.name}</h4>
                        <p className="font-mono text-[8px] text-muted-foreground uppercase tracking-widest">
                          {item.size ? `Size: ${item.size}` : 'Standard Edition'} • Qty: {item.quantity}
                        </p>
                        <p className="font-mono text-[10px] mt-2">{item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-4 mb-10 font-mono text-[10px] uppercase tracking-widest border-t border-border/50 pt-10">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Inventory Value</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">GST Alignment (18%)</span>
                    <span>{formatCurrency(tax)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground flex items-center gap-1"><Truck size={10} /> Logistics</span>
                    <span className="text-accent">{shipping === 0 ? "Complimentary" : formatCurrency(shipping)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-end mb-10">
                   <div>
                     <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground mb-1">Total Investment</p>
                     <span className="font-display text-5xl font-bold tracking-tighter">{formatCurrency(total)}</span>
                   </div>
                </div>

                <button 
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="w-full bg-foreground text-background py-6 flex items-center justify-center gap-3 group overflow-hidden transition-all hover:bg-accent hover:text-white disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span className="font-mono text-sm uppercase tracking-[0.3em]">Processing Securely</span>
                    </>
                  ) : (
                    <>
                      <span className="font-mono text-sm uppercase tracking-[0.3em] font-bold">Process Payment</span>
                      <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
                
                <div className="mt-8 pt-8 border-t border-border/50">
                  <div className="flex items-center gap-3 text-muted-foreground opacity-60">
                     <ShieldCheck size={14} />
                     <p className="font-mono text-[8px] uppercase tracking-[0.2em] leading-relaxed">
                       Your data is encrypted with enterprise-grade SSL. Transaction archives are stored in decentralized vaulted servers.
                     </p>
                  </div>
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

export default Checkout;
