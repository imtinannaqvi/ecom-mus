import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { AppContext } from "../context/AppContextProvider";

// Categories are now dynamically filtered from AppContext based on the category prop
// Previously: static array defined here - now fetched from context products

function HeroBanner({ category }) {
  const { products } = useContext(AppContext);
  const [showLayout, setShowLayout] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const categories = products
    .filter((item) => item.category.toLowerCase() === category.toLowerCase())
    .slice(0, 5);


  // Detect screen size to adjust UI elements responsively for mobile vs desktop
  useEffect(() => {
    const checkRes = () => setIsMobile(window.innerWidth < 768);
    checkRes();
    window.addEventListener("resize", checkRes);
    return () => window.removeEventListener("resize", checkRes);
  }, []);

  // Automatically toggle between different banner layouts every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setShowLayout((prev) => !prev);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full mt-2 md:mt-5 h-[500px] md:h-[600px] overflow-hidden bg-black">
      {/* Navigation buttons with high z-index to appear above content */}
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
            /* Primary banner section displaying main promotional image */  
            <motion.div
              key="banner-main"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 w-full h-full"
            >
              <img
                src="/images/banner.png"
                alt="Main"
                className="w-full h-full object-cover"
              />
              <Link className="absolute inset-0 flex items-center justify-center md:justify-start px-6 md:px-24 bg-black/10">
                <div className="flex flex-col gap-4 md:gap-6 max-w-2xl text-center md:text-left items-center md:items-start">
                  <button className="bg-[#F48120] text-white font-bold py-1 px-4 md:py-2 md:px-6 w-fit rounded-sm uppercase tracking-widest text-[10px] md:text-xs">
                    EXPRESS YOURSELF
                  </button>
                  <h1 className="text-white md:text-black text-3xl md:text-6xl font-light leading-tight">
                    Effortless <span className="font-bold">Glamour</span> for{" "}
                    <br className="hidden md:block" /> Every{" "}
                    <span className="font-bold">Occasion</span>
                  </h1>
                  <button className="bg-black text-white font-bold py-3 px-8 md:py-4 md:px-12 w-fit uppercase text-xs md:text-sm border border-white/20">
                    Shop Now
                  </button>
                </div>
              </Link>
            </motion.div>
          ) : (
            /* Secondary banner with slanted grid layout showing product categories */  
            <motion.div
              key="banner-slanted"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 flex flex-col md:flex-row w-full h-full bg-white overflow-hidden"
            >
              {categories.map((cat, index) => (
                <Link
                  to={`/shop/${category}/${cat.subCategory}`}
                  key={cat.id}
                  className="relative flex-1 h-full w-full overflow-hidden transition-all duration-500 hover:flex-[1.5] group cursor-pointer"
                  style={{
                    clipPath: getClipPath(index, categories.length, isMobile),
                    marginTop: isMobile && index !== 0 ? "-8%" : "0",
                    marginLeft: !isMobile && index !== 0 ? "-5.8%" : "0",
                    zIndex: index,
                  }}
                >
                  <img
                    src={cat.images}
                    alt={cat.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Semi-transparent overlay with category text label */}
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-all flex items-end md:items-end justify-center pb-8 ">
                    <h2
                      className="text-white text-2xl md:text-4xl font-black uppercase tracking-tighter"
                      style={{
                        color: "transparent",
                        WebkitTextStroke: isMobile
                          ? "0.8px white"
                          : "1.2px white",
                      }}
                    >
                      {cat.subCategory}
                    </h2>
                  </div>
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

/**
 * Generates responsive clip-path values for slanted grid layout
 * Creates different clipping patterns based on item position and device type
 * @param {number} index - Current product index in the array
 * @param {number} total - Total number of products in the grid
 * @param {boolean} isMobile - Flag indicating if viewport is mobile-sized
 * @returns {string} CSS clip-path polygon value
 */
function getClipPath(index, total, isMobile) {
  const slant = 12; // Slant percentage

  if (isMobile) {
    // Vertical Slant for Mobile
    if (index === 0)
      return `polygon(0% 0%, 100% 0%, 100% ${100 - slant}%, 0% 100%)`;
    if (index === total - 1)
      return `polygon(0% ${slant}%, 100% 0%, 100% 100%, 0% 100%)`;
    return `polygon(0% ${slant}%, 100% 0%, 100% ${100 - slant}%, 0% 100%)`;
  } else {
    // Horizontal Slant for Desktop
    if (index === 0)
      return `polygon(0% 0%, 100% 0%, ${100 - slant}% 100%, 0% 100%)`;
    if (index === total - 1)
      return `polygon(${slant}% 0%, 100% 0%, 100% 100%, 0% 100%)`;
    return `polygon(${slant}% 0%, 100% 0%, ${100 - slant}% 100%, 0% 100%)`;
  }
}

export default HeroBanner;
