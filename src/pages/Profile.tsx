import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import EditorialFooter from "@/components/EditorialFooter";
import MagneticButton from "@/components/MagneticButton";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User, LogOut, Package, Settings, ChevronRight, Calendar, CreditCard } from "lucide-react";

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getSessionAndData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }
      
      setUser(session.user);
      
      // Fetch profile data
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
        
      if (profileData) {
        setProfile(profileData);
      }

      // Fetch orders
      const { data: orderData } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (*)
          )
        `)
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (orderData) {
        setOrders(orderData);
      }
      
      setLoading(false);
    };

    getSessionAndData();
  }, [navigate]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Logout failed", { description: error.message });
    } else {
      toast.success("Logged out successfully");
      navigate("/");
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center font-mono text-[10px] uppercase tracking-[0.4em]">
        Accessing Archive...
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      
      <main className="flex-grow pt-32 pb-24 px-6 md:px-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-12"
          >
            {/* Sidebar */}
            <div className="lg:col-span-4 space-y-8">
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <div className="w-24 h-24 mb-6 rounded-none bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                   <User size={40} strokeWidth={1} />
                </div>
                <h1 className="font-display text-3xl font-bold uppercase tracking-tight mb-2">
                  {profile?.full_name || user.email?.split('@')[0]}
                </h1>
                <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-6">
                  {user.email}
                </p>
                
                <div className="w-full h-px bg-border/50 mb-8" />
                
                <nav className="w-full space-y-2">
                  {[
                    { icon: Package, label: "Order History", active: true },
                    { icon: Settings, label: "Account Details" },
                    { icon: LogOut, label: "Sign Out", onClick: handleLogout, danger: true },
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      onClick={item.onClick}
                      className={`w-full flex items-center justify-between p-4 transition-all duration-300 border ${
                        item.active 
                        ? "bg-foreground text-background border-foreground" 
                        : "bg-transparent text-foreground border-transparent hover:border-border/50"
                      } ${item.danger ? "hover:text-red-500" : ""}`}
                    >
                      <div className="flex items-center gap-4">
                        <item.icon size={16} strokeWidth={1.5} />
                        <span className="font-mono text-[10px] uppercase tracking-widest">{item.label}</span>
                      </div>
                      <ChevronRight size={14} />
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Content Area */}
            <div className="lg:col-span-8">
              <div className="mb-8">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent mb-2">Transaction History</p>
                <h2 className="font-display text-4xl font-bold uppercase tracking-tight">Your Archive</h2>
              </div>
              
              {orders.length > 0 ? (
                <div className="space-y-8">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-border/50 overflow-hidden">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 bg-secondary/30 p-4 sm:p-6">
                        <div className="flex flex-wrap items-center gap-4 sm:gap-8">
                          <div>
                            <p className="font-mono text-[8px] uppercase tracking-widest text-muted-foreground mb-1">Order ID</p>
                            <p className="font-mono text-[10px] uppercase tracking-widest font-bold">#{order.id.slice(0, 8)}</p>
                          </div>
                          <div>
                            <p className="font-mono text-[8px] uppercase tracking-widest text-muted-foreground mb-1 flex items-center gap-1">
                              <Calendar size={8} /> Date
                            </p>
                            <p className="font-mono text-[10px] uppercase tracking-widest font-bold">
                              {new Date(order.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="font-mono text-[8px] uppercase tracking-widest text-muted-foreground mb-1 flex items-center gap-1">
                              <CreditCard size={8} /> Total
                            </p>
                            <p className="font-mono text-[10px] uppercase tracking-widest font-bold">
                              {formatCurrency(order.total_amount)}
                            </p>
                          </div>
                        </div>
                        <span className="w-fit px-3 py-1 bg-accent/10 border border-accent/20 text-accent font-mono text-[8px] uppercase tracking-[0.2em]">
                          {order.status}
                        </span>
                      </div>
                      
                      <div className="p-6 space-y-6">
                        {order.order_items.map((item: any) => (
                          <div key={item.id} className="flex gap-4">
                            <div className="w-16 h-16 bg-secondary flex-shrink-0">
                               <img 
                                src={item.products.image} 
                                alt={item.products.name} 
                                className="w-full h-full object-cover grayscale" 
                               />
                            </div>
                            <div className="flex-grow">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-display text-sm font-bold uppercase tracking-tight">{item.products.name}</h4>
                                  <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest mt-1">
                                    Size: {item.size} • Qty: {item.quantity}
                                  </p>
                                </div>
                                <p className="font-mono text-[10px] font-bold">{item.price_at_time}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border border-border/50 p-12 text-center space-y-6">
                  <div className="w-12 h-12 mx-auto rounded-none bg-muted flex items-center justify-center text-muted-foreground">
                    <Package size={20} strokeWidth={1} />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold uppercase tracking-tight mb-2">No active orders</h3>
                    <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest leading-relaxed max-w-xs mx-auto">
                      Your archive is currently empty. Begin your collection to see them here.
                    </p>
                  </div>
                  <Link to="/collection" className="inline-block">
                    <MagneticButton className="bg-foreground text-background px-8 py-4 font-mono text-[10px] uppercase tracking-widest hover:bg-accent hover:text-background transition-colors">
                      Explore Collection
                    </MagneticButton>
                  </Link>
                </div>
              )}

              {/* Account Security (Sub-section) */}
              <div className="mt-16 space-y-8">
                <h2 className="font-display text-2xl font-bold uppercase tracking-tight">Security & Privacy</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-border/50 p-6 space-y-4">
                    <h3 className="font-mono text-[10px] uppercase tracking-widest font-bold">Password Management</h3>
                    <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest leading-relaxed">
                      Update your passphrase regularly to ensure your vault remains secure.
                    </p>
                    <button className="font-mono text-[10px] uppercase tracking-widest border-b border-foreground pb-0.5 hover:text-accent hover:border-accent transition-all">
                      Change Password
                    </button>
                  </div>
                  <div className="border border-border/50 p-6 space-y-4">
                    <h3 className="font-mono text-[10px] uppercase tracking-widest font-bold">Newsletter</h3>
                    <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest leading-relaxed">
                      Receive updates on new archival drops and limited collections.
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 border border-foreground flex items-center justify-center">
                        <div className="w-2 h-2 bg-foreground" />
                      </div>
                      <span className="font-mono text-[10px] uppercase tracking-widest">Subscribed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <EditorialFooter />
    </div>
  );
};

export default Profile;
