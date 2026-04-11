import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import EditorialFooter from "@/components/EditorialFooter";
import MagneticButton from "@/components/MagneticButton";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success("Login Successful", {
        description: `Welcome back, ${email.split('@')[0]}`,
      });
      navigate("/");
    } catch (error: any) {
      console.error("Login Error:", error);
      
      const errorMessage = error?.message || "";
      
      if (errorMessage.toLowerCase().includes("email not confirmed")) {
        toast.error("Email Not Confirmed", {
          description: "You need to verify your email before logging in. If you want to skip this, disable 'Confirm email' in your Supabase Auth settings.",
          duration: 8000,
        });
      } else if (errorMessage.toLowerCase().includes("invalid credentials") || errorMessage.toLowerCase().includes("invalid login credentials")) {
        toast.error("Invalid Credentials", {
          description: "The email or password you entered is incorrect. Please try again or create a new account.",
        });
      } else {
        toast.error("Login Failed", {
          description: errorMessage || "An unexpected error occurred during login.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      
      <main className="flex-grow flex items-center justify-center pt-32 pb-24 px-6">
        <div className="w-full max-w-[450px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="text-center mb-12">
              <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-accent mb-4">Account Access</p>
              <h1 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-tight leading-none mb-4">
                Sign In
              </h1>
              <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
                Return to your architectural wardrobe
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                <div className="group relative">
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2 group-focus-within:text-accent transition-colors">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent border-b border-border py-3 px-0 outline-none focus:border-accent transition-all font-mono text-sm placeholder:text-muted-foreground/30"
                    placeholder="architect@luxe.com"
                    required
                  />
                </div>

                <div className="group relative">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground group-focus-within:text-accent transition-colors">
                      Password
                    </label>
                    <button type="button" className="font-mono text-[10px] uppercase tracking-widest text-accent hover:text-foreground transition-colors">
                      Forgot?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-transparent border-b border-border py-3 px-0 outline-none focus:border-accent transition-all font-mono text-sm placeholder:text-muted-foreground/30"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-foreground text-background font-mono text-[11px] uppercase tracking-[0.3em] py-5 flex items-center justify-center gap-3 group hover:bg-accent hover:text-background transition-all disabled:opacity-50"
                >
                  {isLoading ? "Validating..." : "Enter Archive"}
                  <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform duration-500" />
                </button>
              </div>
            </form>

            <div className="mt-12 text-center space-y-4">
              <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
                Don't have an account?
              </p>
              <Link to="/signup">
                <span className="font-mono text-[10px] uppercase tracking-widest text-foreground border-b border-foreground pb-1 hover:text-accent hover:border-accent transition-all">
                  Create Membership
                </span>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>

      <EditorialFooter />
    </div>
  );
};

export default Login;
