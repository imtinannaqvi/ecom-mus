import { createContext, useState } from "react";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
 const [products, setProducts] = useState([
    // ================= MEN CATEGORY =================
    {
      name: "Men's Snapback Cap",
      price: 800,
      category: "Men",
      subCategory: "Caps",
      images: [{ url: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=600&auto=format&fit=crop" }],
      description: "Premium cotton snapback with adjustable strap.",
      colors: ["Black"],
      sizes: ["Free"],
    },
    {
      name: "Cotton Formal Shirt",
      price: 2200,
      category: "Men",
      subCategory: "Dress",
      images: [{ url: "https://images.unsplash.com/photo-1598033129183-c4f50c717658?q=80&w=600&auto=format&fit=crop" }],
      description: "Slim fit formal shirt for office wear.",
      colors: ["White"],
      sizes: ["M", "L", "XL"],
    },
    {
      name: "Men's Mesh Running Shoes",
      price: 4500,
      category: "Men",
      subCategory: "Shoes",
      images: [{ url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop" }],
      description: "Breathable lightweight shoes for gym.",
      colors: ["Blue"],
      sizes: ["9", "10"],
    },
    {
      name: "Silver Analog Watch",
      price: 8000,
      category: "Men",
      subCategory: "Watches",
      images: [{ url: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=600&auto=format&fit=crop" }],
      description: "Stainless steel luxury watch for men.",
      colors: ["Silver"],
      sizes: ["Standard"],
    },
    {
      name: "Slim Fit Cargo Pants",
      price: 2800,
      category: "Men",
      subCategory: "Bottoms",
      images: [{ url: "https://images.unsplash.com/photo-1621072156002-e2fcced0b17d?q=80&w=600&auto=format&fit=crop" }],
      description: "Stylish cargo pants with multiple pockets.",
      colors: ["Olive Green"],
      sizes: ["32", "34"],
    },

    // ================= WOMEN CATEGORY =================
    {
      name: "Women's Sun Hat",
      price: 1200,
      category: "Women",
      subCategory: "Caps",
      images: [{ url: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=600&auto=format&fit=crop" }],
      description: "Wide brim straw hat for beach and travel.",
      colors: ["Beige"],
      sizes: ["Free Size"],
    },
    {
      name: "Floral Maxi Dress",
      price: 3500,
      category: "Women",
      subCategory: "Dress",
      images: [{ url: "https://images.unsplash.com/photo-1572804013307-a9a11198427e?q=80&w=600&auto=format&fit=crop" }],
      description: "Elegant long floral dress for summer.",
      colors: ["Pink"],
      sizes: ["S", "M", "L"],
    },
    {
      name: "Women's High Heels",
      price: 4000,
      category: "Women",
      subCategory: "Shoes",
      images: [{ url: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=600&auto=format&fit=crop" }],
      description: "Pointed toe stilettos for formal events.",
      colors: ["Black"],
      sizes: ["7", "8"],
    },
    {
      name: "Rose Gold Watch",
      price: 5500,
      category: "Women",
      subCategory: "Watches",
      images: [{ url: "https://images.unsplash.com/photo-1508685096489-7aac29bb7b26?q=80&w=600&auto=format&fit=crop" }],
      description: "Elegant rose gold plated analog watch.",
      colors: ["Rose Gold"],
      sizes: ["Standard"],
    },
    {
      name: "High Waist Leggings",
      price: 1500,
      category: "Women",
      subCategory: "Bottoms",
      images: [{ url: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?q=80&w=600&auto=format&fit=crop" }],
      description: "Stretchable yoga leggings for fitness.",
      colors: ["Black"],
      sizes: ["M", "L"],
    },

    // ================= KIDS CATEGORY =================
    {
      name: "Kids Cartoon Cap",
      price: 400,
      category: "Kids",
      subCategory: "Caps",
      images: [{ url: "https://images.unsplash.com/photo-1519235106638-30cc55b3f72e?q=80&w=600&auto=format&fit=crop" }],
      description: "Fun cap with favorite characters.",
      colors: ["Blue"],
      sizes: ["S"],
    },
    {
      name: "Baby Girl Party Frock",
      price: 2500,
      category: "Kids",
      subCategory: "Dress",
      images: [{ url: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=600&auto=format&fit=crop" }],
      description: "Layered net frock for birthdays.",
      colors: ["Red"],
      sizes: ["22", "26"],
    },
    {
      name: "Light-up LED Shoes",
      price: 2800,
      category: "Kids",
      subCategory: "Shoes",
      images: [{ url: "https://images.unsplash.com/photo-1514989940723-e8e51635b782?q=80&w=600&auto=format&fit=crop" }],
      description: "Fun sneakers that glow in the dark.",
      colors: ["White"],
      sizes: ["5", "6"],
    },
    {
      name: "Kids Digital Watch",
      price: 1200,
      category: "Kids",
      subCategory: "Watches",
      images: [{ url: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?q=80&w=600&auto=format&fit=crop" }],
      description: "Waterproof digital watch with alarm.",
      colors: ["Black"],
      sizes: ["S"],
    },
    {
      name: "Kids Denim Shorts",
      price: 1000,
      category: "Kids",
      subCategory: "Bottoms",
      images: [{ url: "https://images.unsplash.com/photo-1519457431-75514b723b69?q=80&w=600&auto=format&fit=crop" }],
      description: "Durable denim shorts for playtime.",
      colors: ["Blue"],
      sizes: ["24", "26"],
    },
  ]);
  const [cartItem, setCartItem] = useState(0);
  const value = {
    products,
    setProducts,
    cartItem,
    setCartItem,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
