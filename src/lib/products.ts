import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";

export interface Product {
    id: string;
    image: string;
    name: string;
    price: string;
    category: string;
    description: string;
    details: string[];
    images: string[];
}

export const products: Product[] = [
    {
        id: "oversized-hoodie",
        image: product1,
        name: "Oversized Hoodie",
        price: "€120",
        category: "Tops",
        description: "A heavyweight hoodie crafted from premium brushed cotton. Designed for a comfortable, oversized fit that maintains its shape. Features dropped shoulders and a double-layered hood.",
        details: ["100% Organic Cotton", "450 GSM Heavyweight Fabric", "Reactive Dyed", "Oversized Fit"],
        images: [product1, product2, product3]
    },
    {
        id: "essential-tee",
        image: product2,
        name: "Essential Tee",
        price: "€55",
        category: "Basics",
        description: "The perfect everyday tee. Made from high-quality single jersey cotton with a soft, clean feel. A slightly relaxed fit that sits comfortably on the body.",
        details: ["100% Fine Jersey Cotton", "220 GSM Medium Weight", "Ribbed Collar", "Regular Fit"],
        images: [product2, product3, product1]
    },
    {
        id: "cargo-pants",
        image: product3,
        name: "Cargo Pants",
        price: "€145",
        category: "Bottoms",
        description: "Technical cargo pants with a modern silhouette. Featuring multiple utility pockets and adjustable ankle toggles for a versatile look.",
        details: ["Cotton Polyamide Blend", "Water Repellent Finish", "Six Pocket Construction", "Relaxed Tapered Fit"],
        images: [product3, product4, product5]
    },
    {
        id: "crossbody-bag",
        image: product4,
        name: "Crossbody Bag",
        price: "€95",
        category: "Accessories",
        description: "A minimal and functional bag for your daily essentials. Crafted from durable nylon with an adjustable strap and secure zip compartments.",
        details: ["High-Density Nylon", "YKK Zippers", "Adjustable Webbing Strap", "Internal Organizers"],
        images: [product4, product5, product6]
    },
    {
        id: "ribbed-beanie",
        image: product5,
        name: "Ribbed Beanie",
        price: "€35",
        category: "Accessories",
        description: "Classic ribbed beanie made from a soft wool blend. Provides warmth without being bulky. A winter essential that complements any outfit.",
        details: ["Merino Wool Blend", "Soft Ribbed Knit", "Folded Cuff", "One Size Fits All"],
        images: [product5, product6, product1]
    },
    {
        id: "crewneck-sweat",
        image: product6,
        name: "Crewneck Sweat",
        price: "€110",
        category: "Tops",
        description: "Minimalist crewneck sweatshirt with a structured fit. Features subtle tonal branding and ribbed trimmings. A versatile piece for layering.",
        details: ["Loopback Cotton Jersey", "380 GSM Midweight Fabric", "Regular Fit", "Pre-Shrunk"],
        images: [product6, product1, product2]
    },
];
