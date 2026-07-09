import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { AppContext } from "../context/AppContextProvider";
import { BACKEND_URL } from "../api/api";

// Drop your own banner image at this path (frontend/public/images/hero-banner.jpg)
// to change what shows on the first slide — no code change needed.
const BANNER_IMAGE_PATH = "/images/hero-banner.jpg";

const AUTO_ROTATE_MS = 5000;

function HeroBanner({ subCategories, mainCategory }) {
  const { products } = useContext(AppContext);
  const [isMobile, setIsMobile] = useState(false);
  const [slide, setSlide] = useState(0); // 0 = image banner, 1 = categories grid

  useEffect(() => {
    const checkRes = () => setIsMobile(window.innerWidth < 768);
    checkRes();
    window.addEventListener("resize", checkRes);
    return () => window.removeEventListener("resize", checkRes);
  }, []);

  // Auto-rotate between the two slides every few seconds.
  useEffect(() => {
    const interval = setInterval(() => {
      setSlide((prev) => (prev === 0 ? 1 : 0));
    }, AUTO_ROTATE_MS);
    return () => clearInterval(interval);
  }, []);

  const goPrev = () => setSlide((prev) => (prev === 0 ? 1 : 0));
  const goNext = () => setSlide((prev) => (prev === 0 ? 1 : 0));

  return (
    <section className="relative w-full mt-2 md:mt-5 h-[500px] md:h-[600px] overflow-hidden bg-black">

      {/* Navigation Arrows */}
      <div className="absolute inset-y-0 left-2 md:left-5 flex items-center z-50">
        <button
          onClick={goPrev}
          className="p-2 md:p-4 rounded-full bg-black/40 backdrop-blur-sm border border-white/30 text-white hover:bg-white hover:text-black transition-all"
        >
          <ChevronLeft size={isMobile ? 18 : 24} />
        </button>
      </div>
      <div className="absolute inset-y-0 right-2 md:right-5 flex items-center z-50">
        <button
          onClick={goNext}
          className="p-2 md:p-4 rounded-full bg-black/40 backdrop-blur-sm border border-white/30 text-white hover:bg-white hover:text-black transition-all"
        >
          <ChevronRight size={isMobile ? 18 : 24} />
        </button>
      </div>

      {/* Slide Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-50">
        {[0, 1].map((i) => (
          <button
            key={i}
            onClick={() => setSlide(i)}
            className={`w-2 h-2 rounded-full transition-all ${
              slide === i ? "bg-white w-6" : "bg-white/40"
            }`}
          />
        ))}
      </div>

      <div className="relative w-full h-full">
        <AnimatePresence initial={false} mode="wait">
          {slide === 0 ? (
            // ---- SLIDE 1: Static Banner Image ----
            <motion.div
              key="banner-image"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 w-full h-full"
            >
             <img
  src="/images/banner.png"
  alt="Promotional banner"
  className="w-full h-full object-cover"
  onError={(e) => { e.target.style.display = "none"; }}
/>
            </motion.div>
          ) : (
            // ---- SLIDE 2: Category Slanted Grid ----
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