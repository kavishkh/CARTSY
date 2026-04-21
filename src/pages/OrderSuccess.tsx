import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import EditorialFooter from "@/components/EditorialFooter";
import MagneticButton from "@/components/MagneticButton";
import { Check, Package, ArrowRight, Share2 } from "lucide-react";

const OrderSuccess = () => {
  const location = useLocation();
  const orderId = location.state?.orderId || "ARCHIVE-UNKNOWN";

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      
      <main className="flex-grow flex flex-col items-center justify-center pt-32 pb-24 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl"
        >
          <div className="w-24 h-24 bg-accent/10 border border-accent/20 flex items-center justify-center mb-12 mx-auto rounded-none text-accent relative">
             <motion.div
               initial={{ scale: 0 }}
               animate={{ scale: 1 }}
               transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
             >
               <Check size={40} strokeWidth={1.5} />
             </motion.div>
             <motion.div 
               className="absolute -inset-4 border border-accent/10 pointer-events-none"
               animate={{ rotate: 360 }}
               transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
             />
          </div>

          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-accent mb-4">Transaction Confirmed</p>
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold uppercase tracking-tighter mb-8 italic">
            Acquisition<br />Archived
          </h1>
          
          <div className="font-mono text-[11px] uppercase tracking-[0.2em] space-y-4 mb-12 text-muted-foreground">
            <p>Your selection has been registered in the global ledger.</p>
            <div className="py-3 px-6 bg-secondary/30 border border-border/50 inline-block">
               Ref ID: <span className="text-foreground font-bold">{orderId.slice(0, 12)}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
            <Link to="/profile">
               <MagneticButton className="w-full bg-foreground text-background py-5 font-mono text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                 <Package size={14} /> View Registry
               </MagneticButton>
            </Link>
            <Link to="/collection">
               <MagneticButton className="w-full bg-transparent text-foreground border border-border py-5 font-mono text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 group">
                 Continue Exploring <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
               </MagneticButton>
            </Link>
          </div>

          <div className="mt-24 pt-12 border-t border-border/30 opacity-40 hover:opacity-100 transition-opacity">
             <div className="flex flex-col items-center gap-6">
                <p className="font-mono text-[8px] uppercase tracking-widest">Share Private Acquisition</p>
                <div className="flex gap-8">
                   {['Instagram', 'Twitter', 'Pinterest'].map(social => (
                     <button key={social} className="font-mono text-[9px] uppercase tracking-widest border-b border-muted hover:text-accent hover:border-accent transition-all">
                       {social}
                     </button>
                   ))}
                </div>
             </div>
          </div>
        </motion.div>
      </main>
      
      <EditorialFooter />
    </div>
  );
};

export default OrderSuccess;
