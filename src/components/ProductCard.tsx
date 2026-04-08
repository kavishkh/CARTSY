import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import MagneticButton from "./MagneticButton";
import { Link } from "react-router-dom";

interface ProductCardProps {
  id: string;
  image: string;
  name: string;
  price: string;
  category: string;
  tall?: boolean;
}

const ProductCard = ({ id, image, name, price, category, tall }: ProductCardProps) => {
  return (
    <Link to={`/product/${id}`}>
      <motion.div
        className="group cursor-pointer"
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
      >
        <div className={`relative overflow-hidden bg-secondary mb-4 ${tall ? "aspect-[2/3]" : "aspect-square"}`}>
          <img
            src={image}
            alt={name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
            <MagneticButton className="bg-accent text-accent-foreground w-12 h-12 flex items-center justify-center">
              <Plus size={18} strokeWidth={1.5} />
            </MagneticButton>
          </div>

          {/* Category tag */}
          <span className="absolute top-3 left-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground bg-background/80 backdrop-blur-sm px-2 py-1">
            {category}
          </span>
        </div>

        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-display text-sm font-semibold text-foreground">{name}</h3>
            <p className="font-mono text-xs text-muted-foreground mt-0.5">{category}</p>
          </div>
          <span className="font-mono text-sm text-foreground">{price}</span>
        </div>
      </motion.div>
    </Link>
  );
};

export default ProductCard;

