import { motion } from "framer-motion";
import { Plus, ShoppingBag } from "lucide-react";
import MagneticButton from "./MagneticButton";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

interface ProductCardProps {
  id: string;
  image: string;
  name: string;
  price: string;
  category: string;
  tall?: boolean;
}

const ProductCard = ({ id, image, name, price, category, tall }: ProductCardProps) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({ id, name, price, image, quantity: 1 });
    toast.success("Added to Bag", {
      description: `${name} has been added to your curated selection.`,
      duration: 3000,
    });
  };

  return (
    <motion.div
      className="group cursor-pointer"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`relative overflow-hidden bg-secondary mb-4 ${tall ? "aspect-[2/3]" : "aspect-square"}`}>
        <Link to={`/product/${id}`} className="block w-full h-full">
          <img
            src={image}
            alt={name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Link>
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center gap-4 pointer-events-none group-hover:pointer-events-auto">
          <MagneticButton 
            onClick={handleAddToCart}
            className="bg-accent text-accent-foreground w-12 h-12 flex items-center justify-center hover:scale-110 transition-transform pointer-events-auto shadow-2xl"
          >
            <ShoppingBag size={18} strokeWidth={1.5} />
          </MagneticButton>
          <Link to={`/product/${id}`} className="pointer-events-auto">
            <MagneticButton className="bg-foreground text-background w-12 h-12 flex items-center justify-center hover:scale-110 transition-transform shadow-2xl">
              <Plus size={18} strokeWidth={1.5} />
            </MagneticButton>
          </Link>
        </div>

        {/* Category tag */}
        <span className="absolute top-3 left-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground bg-background/80 backdrop-blur-sm px-2 py-1">
          {category}
        </span>
      </div>

      <Link to={`/product/${id}`}>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-display text-sm font-semibold text-foreground">{name}</h3>
            <p className="font-mono text-xs text-muted-foreground mt-0.5">{category}</p>
          </div>
          <span className="font-mono text-sm text-foreground">{price}</span>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
