CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price TEXT NOT NULL,
    category TEXT NOT NULL,
    gender TEXT,
    description TEXT,
    details TEXT[],
    image TEXT NOT NULL,
    images TEXT[],
    vendor_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: Create a profiles table for user information
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 3: Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Step 4: Create performance indexes for filtering
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_gender ON products(gender);

-- Step 5: Create policies for products
CREATE POLICY "Allow public read access" ON products
    FOR SELECT USING (true);

CREATE POLICY "Vendors can insert their own products" ON products
    FOR INSERT WITH CHECK (auth.uid() = vendor_id);

CREATE POLICY "Vendors can update their own products" ON products
    FOR UPDATE USING (auth.uid() = vendor_id);

CREATE POLICY "Vendors can delete their own products" ON products
    FOR DELETE USING (auth.uid() = vendor_id);

-- Step 6: Create policies for profiles
CREATE POLICY "Users can view their own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Step 7: Create a function and trigger to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 8: Insert the existing catalog data
INSERT INTO products (id, name, price, category, gender, description, details, image, images)
VALUES 
    ('oversized-hoodie', 'Oversized Hoodie', '₹10,999', 'Tops', 'unisex', 'A heavyweight hoodie crafted from premium brushed cotton.', ARRAY['100% Organic Cotton', '450 GSM Heavyweight Fabric', 'Reactive Dyed', 'Oversized Fit'], '/assets/product-1.jpg', ARRAY['/assets/product-1.jpg', '/assets/product-2.jpg', '/assets/product-3.jpg']),
    ('essential-tee', 'Essential Tee', '₹4,499', 'Basics', 'unisex', 'The perfect everyday tee.', ARRAY['100% Fine Jersey Cotton', '220 GSM Medium Weight', 'Ribbed Collar', 'Regular Fit'], '/assets/product-2.jpg', ARRAY['/assets/product-2.jpg', '/assets/product-3.jpg', '/assets/product-1.jpg']),
    ('cargo-pants', 'Cargo Pants', '₹12,499', 'Bottoms', 'men', 'Technical cargo pants with a modern silhouette.', ARRAY['Cotton Polyamide Blend', 'Water Repellent Finish', 'Six Pocket Construction', 'Relaxed Tapered Fit'], '/assets/product-3.jpg', ARRAY['/assets/product-3.jpg', '/assets/product-4.jpg', '/assets/product-5.jpg']),
    ('crossbody-bag', 'Crossbody Bag', '₹8,999', 'Accessories', 'unisex', 'A minimal and functional bag for your daily essentials.', ARRAY['High-Density Nylon', 'YKK Zippers', 'Adjustable Webbing Strap', 'Internal Organizers'], '/assets/product-4.jpg', ARRAY['/assets/product-4.jpg', '/assets/product-5.jpg', '/assets/product-6.jpg']),
    ('ribbed-beanie', 'Ribbed Beanie', '₹2,999', 'Accessories', 'unisex', 'Classic ribbed beanie made from a soft wool blend.', ARRAY['Merino Wool Blend', 'Soft Ribbed Knit', 'Folded Cuff', 'One Size Fits All'], '/assets/product-5.jpg', ARRAY['/assets/product-5.jpg', '/assets/product-6.jpg', '/assets/product-1.jpg']),
    ('crewneck-sweat', 'Crewneck Sweat', '₹9,999', 'Tops', 'men', 'Minimalist crewneck sweatshirt with a structured fit.', ARRAY['Loopback Cotton Jersey', '380 GSM Midweight Fabric', 'Regular Fit', 'Pre-Shrunk'], '/assets/product-6.jpg', ARRAY['/assets/product-6.jpg', '/assets/product-1.jpg', '/assets/product-2.jpg']),
    ('silk-slip-dress', 'Silk Slip Dress', '₹18,999', 'Dresses', 'women', 'A luxurious silk slip dress with a fluid silhouette.', ARRAY['100% Mulberry Silk', 'Bias Cut', 'Adjustable Straps', 'Midi Length'], 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800', ARRAY['https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800']),
    ('tailored-blazer', 'Tailored Blazer', '₹28,999', 'Outerwear', 'women', 'A sharp, double-breasted blazer in a structured wool blend.', ARRAY['Wool Blend', 'Peak Lapels', 'Fully Lined', 'Structured Shoulders'], 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800', ARRAY['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800']),
    ('minimalist-sneaker', 'Minimalist Sneaker', '₹15,999', 'Shoes', 'unisex', 'Clean, low-top sneakers crafted from premium Italian leather.', ARRAY['100% Calfskin Leather', 'Rubber Margom Sole', 'Handmade in Italy', 'Leather Lining'], 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=800', ARRAY['https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=800']),
    ('chelsea-boots', 'Chelsea Boots', '₹21,999', 'Shoes', 'men', 'Classic Chelsea boots with a slim silhouette.', ARRAY['Suede Upper', 'Leather Outsole', 'Cushioned Insole', 'Expertly Crafted'], 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&q=80&w=800', ARRAY['https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&q=80&w=800']),
    ('high-heel-sandal', 'High-Heel Sandal', '₹18,499', 'Shoes', 'women', 'Elegant high-heel sandals with a minimalist strap design.', ARRAY['Satin Finish', 'Stiletto Heel', 'Square Toe', 'Buckle Fastening'], 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=800', ARRAY['https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=800']),
    ('linen-shirt', 'Linen Shirt', '₹7,999', 'Tops', 'men', 'Breathable linen shirt for warm weather.', ARRAY['100% Pure Linen', 'Garment Washed', 'Soft Feel', 'Relaxed Fit'], 'https://images.unsplash.com/photo-1594932224010-74f43a18562c?auto=format&fit=crop&q=80&w=800', ARRAY['https://images.unsplash.com/photo-1594932224010-74f43a18562c?auto=format&fit=crop&q=80&w=800']),
    ('leather-tote', 'Leather Tote', '₹24,999', 'Accessories', 'women', 'A spacious tote bag in premium grained leather.', ARRAY['Full Grain Leather', 'Hand-Painted Edges', 'Gold-Tone Hardware', 'Spacious Interior'], 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800', ARRAY['https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800']),
    ('wool-trousers', 'Wool Trousers', '₹14,999', 'Bottoms', 'men', 'Elegant wool trousers with a relaxed tapered leg.', ARRAY['Super 100s Wool', 'Pleated Front', 'Concealed Zip Fly', 'Tapered Cut'], 'https://images.unsplash.com/photo-1624371414361-e6e8ea01c1e6?auto=format&fit=crop&q=80&w=800', ARRAY['https://images.unsplash.com/photo-1624371414361-e6e8ea01c1e6?auto=format&fit=crop&q=80&w=800']),
    ('cashmere-sweater', 'Cashmere Sweater', '₹16,499', 'Tops', 'women', 'An incredibly soft cashmere sweater.', ARRAY['100% Mongolian Cashmere', 'Ribbed Trims', 'Relaxed Fit', 'Sustainably Sourced'], 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=800', ARRAY['https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=800']),
    ('pleated-skirt', 'Pleated Skirt', '₹11,999', 'Bottoms', 'women', 'A mid-length pleated skirt.', ARRAY['Recycled Polyester', 'Elasticated Waistband', 'Knife Pleats', 'Midi Length'], 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=800', ARRAY['https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=800']),
    ('oversized-sunglasses', 'Oversized Sunglasses', '₹9,499', 'Accessories', 'women', 'Statement oversized sunglasses.', ARRAY['Premium Acetate', '100% UV Protection', 'Hand-Polished', 'Branded Case Included'], 'https://images.unsplash.com/photo-1513073024634-866c59b91173?auto=format&fit=crop&q=80&w=800', ARRAY['https://images.unsplash.com/photo-1513073024634-866c59b91173?auto=format&fit=crop&q=80&w=800']);

ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  category = EXCLUDED.category,
  gender = EXCLUDED.gender,
  description = EXCLUDED.description,
  details = EXCLUDED.details,
  image = EXCLUDED.image,
  images = EXCLUDED.images;

-- Step 9: Create cart_items table for persistence across devices
CREATE TABLE IF NOT EXISTS cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    size TEXT DEFAULT 'default',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id, size)
);

-- Enable Row Level Security
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Policies for cart_items
CREATE POLICY "Users can manage their own cart" ON cart_items
    FOR ALL USING (auth.uid() = user_id);

-- Step 10: Create orders and order_items tables for transaction history
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    total_amount NUMERIC NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    price_at_time TEXT NOT NULL,
    size TEXT DEFAULT 'default',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own orders" ON orders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders" ON orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own order items" ON order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orders
            WHERE orders.id = order_items.order_id
            AND orders.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create their own order items" ON order_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM orders
            WHERE orders.id = order_items.order_id
            AND orders.user_id = auth.uid()
        )
    );
