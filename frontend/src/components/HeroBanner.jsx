import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { AppContext } from "../context/AppContextProvider";
import { BACKEND_URL } from "../api/api";

function HeroBanner({ subCategories, mainCategory }) {
  const { products } = useContext(AppContext);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkRes = () => setIsMobile(window.innerWidth < 768);
    checkRes();
    window.addEventListener("resize", checkRes);
    return () => window.removeEventListener("resize", checkRes);
  }, []);

  return (
    <section className="relative w-full mt-2 md:mt-5 h-[500px] md:h-[600px] overflow-hidden bg-black">
      <div className="relative w-full h-full">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key="banner-slanted"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 flex flex-col md:flex-row w-full h-full bg-white overflow-hidden"
          >
            {subCategories.map((cat, index) => (
              <Link
                to={`/shop/${mainCategory}/${cat.name}`}
                key={cat._id}
                className="relative flex-1 h-full w-full overflow-hidden transition-all duration-500 hover:flex-[1.5] group cursor-pointer"
                style={{
                  clipPath: getClipPath(
                    index,
                    subCategories.length,
                    isMobile,
                  ),
                  marginTop: isMobile && index !== 0 ? "-8%" : "0",
                  marginLeft: !isMobile && index !== 0 ? "-5.8%" : "0",
                  zIndex: index,
                }}
              >
                <img
                  src={`${BACKEND_URL}${cat.image}`}
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
                    {cat.name}
                  </h2>
                </div>
              </Link>
            ))}
          </motion.div>
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