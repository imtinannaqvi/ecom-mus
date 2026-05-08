import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react"; // Ya lucide-react

const categories = [
  { id: 1, title: "Caps", img: "/images/caps.jpg" },
  { id: 2, title: "T-Shirts", img: "/images/t-shirts.jpg" },
  { id: 3, title: "Hoodies", img: "/images/hoodies.jpg" },
  { id: 4, title: "Pants", img: "/images/pants.jpg" },
  { id: 5, title: "Lower", img: "/images/lower.jpg" },
];

function HeroBanner() {
  const [showLayout, setShowLayout] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Screen size check for responsive clip-path
  useEffect(() => {
    const checkRes = () => setIsMobile(window.innerWidth < 768);
    checkRes();
    window.addEventListener("resize", checkRes);
    return () => window.removeEventListener("resize", checkRes);
  }, []);

  // Auto Loop Logic
  useEffect(() => {
    const interval = setInterval(() => {
      setShowLayout((prev) => !prev);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full mt-2 md:mt-5 h-[500px] md:h-[600px] overflow-hidden bg-black">
      
      {/* SIDE BUTTONS - Z-index high for visibility */}
      <div className="absolute inset-y-0 left-2 md:left-5 flex items-center z-50">
        <button 
          onClick={() => setShowLayout(false)}
          className="p-2 md:p-4 rounded-full bg-black/40 backdrop-blur-sm border border-white/30 text-white hover:bg-white hover:text-black transition-all"
        >
          <ChevronLeft size={isMobile ? 18 : 24} />
        </button>
      </div>

      <div className="absolute inset-y-0 right-2 md:right-5 flex items-center z-50">
        <button 
          onClick={() => setShowLayout(true)}
          className="p-2 md:p-4 rounded-full bg-black/40 backdrop-blur-sm border border-white/30 text-white hover:bg-white hover:text-black transition-all"
        >
          <ChevronRight size={isMobile ? 18 : 24} />
        </button>
      </div>

      <div className="relative w-full h-full">
        <AnimatePresence initial={false} mode="wait">
          {!showLayout ? (
            /* BANNER 1: MAIN HERO */
            <motion.div
              key="banner-main"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 w-full h-full"
            >
              <img src="/images/banner.png" alt="Main" className="w-full h-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center md:justify-start px-6 md:px-24 bg-black/10">
                <div className="flex flex-col gap-4 md:gap-6 max-w-2xl text-center md:text-left items-center md:items-start">
                  <button className="bg-[#F48120] text-white font-bold py-1 px-4 md:py-2 md:px-6 w-fit rounded-sm uppercase tracking-widest text-[10px] md:text-xs">
                    EXPRESS YOURSELF
                  </button>
                  <h1 className="text-white md:text-black text-3xl md:text-6xl font-light leading-tight">
                    Effortless <span className="font-bold">Glamour</span> for <br className="hidden md:block" /> Every <span className="font-bold">Occasion</span>
                  </h1>
                  <button className="bg-black text-white font-bold py-3 px-8 md:py-4 md:px-12 w-fit uppercase text-xs md:text-sm border border-white/20">
                    Shop Now
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            /* BANNER 2: SLANTED GRID (Fully Responsive) */
            <motion.div
              key="banner-slanted"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 flex flex-col md:flex-row w-full h-full bg-white overflow-hidden"
            >
              {categories.map((cat, index) => (
                <div
                  key={cat.id}
                  className="relative flex-1 h-full w-full overflow-hidden transition-all duration-500 hover:flex-[1.5] group cursor-pointer"
                  style={{
                    clipPath: getClipPath(index, categories.length, isMobile),
                    // Mobile par margin top, desktop par margin left
                    marginTop: isMobile && index !== 0 ? "-8%" : "0",
                    marginLeft: !isMobile && index !== 0 ? "-5.8%" : "0",
                    zIndex: index,
                  }}
                >
                  <img
                    src={cat.img}
                    alt={cat.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Overlay and Text */}
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-all flex items-end md:items-center justify-center pb-8 md:pb-0">
                    <h2
                      className="text-white text-2xl md:text-4xl font-black uppercase tracking-tighter"
                      style={{
                        color: "transparent",
                        WebkitTextStroke: isMobile ? "0.8px white" : "1.2px white",
                      }}
                    >
                      {cat.title}
                    </h2>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

/**
 * Responsive ClipPath Logic
 * @param {number} index - Current item index
 * @param {number} total - Total items
 * @param {boolean} isMobile - Is screen mobile?
 */
function getClipPath(index, total, isMobile) {
  const slant = 12; // Slant percentage
  
  if (isMobile) {
    // Vertical Slant for Mobile
    if (index === 0) return `polygon(0% 0%, 100% 0%, 100% ${100 - slant}%, 0% 100%)`;
    if (index === total - 1) return `polygon(0% ${slant}%, 100% 0%, 100% 100%, 0% 100%)`;
    return `polygon(0% ${slant}%, 100% 0%, 100% ${100 - slant}%, 0% 100%)`;
  } else {
    // Horizontal Slant for Desktop
    if (index === 0) return `polygon(0% 0%, 100% 0%, ${100 - slant}% 100%, 0% 100%)`;
    if (index === total - 1) return `polygon(${slant}% 0%, 100% 0%, 100% 100%, 0% 100%)`;
    return `polygon(${slant}% 0%, 100% 0%, ${100 - slant}% 100%, 0% 100%)`;
  }
}

export default HeroBanner;