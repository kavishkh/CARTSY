import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

export interface CartItem {
  id: string;
  name: string;
  price: string;
  image: string;
  quantity: number;
  size?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string, size?: string) => void;
  updateQuantity: (id: string, quantity: number, size?: string) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // 1. Listen for Auth State Changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 2. Load Cart Data
  useEffect(() => {
    const loadCart = async () => {
      if (user) {
        // Fetch from Supabase
        const { data, error } = await supabase
          .from('cart_items')
          .select(`
            product_id,
            quantity,
            size,
            products (
              name,
              price,
              image
            )
          `)
          .eq('user_id', user.id);

        if (error) {
          console.error("Error fetching cart from Supabase:", error);
          const savedCart = localStorage.getItem("cart");
          if (savedCart) setCart(JSON.parse(savedCart));
        } else {
          const fetchedCart: CartItem[] = (data as any[]).map((item) => ({
            id: item.product_id,
            name: item.products.name,
            price: item.products.price,
            image: item.products.image,
            quantity: item.quantity,
            size: item.size === 'default' ? undefined : item.size
          }));
          
          // Merge local guest cart if it exists
          const localCartStr = localStorage.getItem("cart");
          if (localCartStr) {
            const localCart: CartItem[] = JSON.parse(localCartStr);
            if (localCart.length > 0) {
              toast.info("Syncing your local bag to your account...");
              await syncLocalCartToDB(localCart, user.id);
              localStorage.removeItem("cart");
              return; // syncLocalCartToDB will refresh the state
            }
          }
          
          setCart(fetchedCart);
        }
      } else {
        // Load from Local Storage for guests
        const savedCart = localStorage.getItem("cart");
        if (savedCart) setCart(JSON.parse(savedCart));
      }
      setIsInitialLoad(false);
    };

    loadCart();
  }, [user]);

  // Persist guest cart to local storage
  useEffect(() => {
    if (!user && !isInitialLoad) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, user, isInitialLoad]);

  const syncLocalCartToDB = async (localItems: CartItem[], userId: string) => {
    for (const item of localItems) {
      await supabase.from('cart_items').upsert({
        user_id: userId,
        product_id: item.id,
        quantity: item.quantity,
        size: item.size || 'default'
      }, { onConflict: 'user_id,product_id,size' });
    }
    
    // Refresh the final state from DB
    const { data } = await supabase
      .from('cart_items')
      .select('product_id, quantity, size, products(name, price, image)')
      .eq('user_id', userId);

    if (data) {
      setCart((data as any[]).map((i) => ({
        id: i.product_id,
        name: i.products.name,
        price: i.products.price,
        image: i.products.image,
        quantity: i.quantity,
        size: i.size === 'default' ? undefined : i.size
      })));
    }
    setIsInitialLoad(false);
  };

  const addToCart = async (item: CartItem) => {
    if (user) {
      const { error } = await supabase.from('cart_items').upsert({
        user_id: user.id,
        product_id: item.id,
        quantity: item.quantity,
        size: item.size || 'default'
      }, { onConflict: 'user_id,product_id,size' });
      
      if (error) {
        console.error("Supabase cart error:", error);
        toast.error("Could not sync bag to your account");
      }
    }

    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id && i.size === item.size);
      if (existing) {
        toast.success(`Increased quantity of ${item.name}`);
        return prev.map((i) => 
          (i.id === item.id && i.size === item.size) 
            ? { ...i, quantity: i.quantity + item.quantity } 
            : i
        );
      }
      toast.success(`${item.name} added to bag`);
      return [...prev, item];
    });
  };

  const removeFromCart = async (id: string, size?: string) => {
    if (user) {
      let query = supabase.from('cart_items').delete().eq('user_id', user.id).eq('product_id', id);
      if (size) query = query.eq('size', size);
      else query = query.eq('size', 'default');
      
      const { error } = await query;
      if (error) console.error("Error removing from Supabase cart:", error);
    }

    setCart((prev) => prev.filter((i) => !(i.id === id && i.size === size)));
    toast.info("Item removed from bag");
  };

  const updateQuantity = async (id: string, quantity: number, size?: string) => {
    if (quantity < 1) return;
    
    if (user) {
      let query = supabase.from('cart_items').update({ quantity }).eq('user_id', user.id).eq('product_id', id);
      if (size) query = query.eq('size', size);
      else query = query.eq('size', 'default');
      
      const { error } = await query;
      if (error) console.error("Error updating Supabase cart quantity:", error);
    }

    setCart((prev) => prev.map((i) => (i.id === id && i.size === size ? { ...i, quantity } : i)));
  };

  const clearCart = async () => {
    if (user) {
      await supabase.from('cart_items').delete().eq('user_id', user.id);
    }
    setCart([]);
    localStorage.removeItem("cart");
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  
  const subtotal = cart.reduce((acc, item) => {
    const priceString = typeof item.price === 'string' ? item.price : "0";
    const price = parseInt(priceString.replace(/[₹,]/g, "")) || 0;
    return acc + price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, subtotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
