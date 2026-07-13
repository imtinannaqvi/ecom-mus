import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { AppContext } from "../context/AppContextProvider";
import { BACKEND_URL } from "../api/api";


const BANNER_IMAGE_PATH = "/images/hero-banner.jpg";

const AUTO_ROTATE_MS = 5000;

function HeroBanner({ subCategories, mainCategory }) {
  const { products } = useContext(AppContext);
  const [isMobile, setIsMobile] = useState(false);
  const [slide, setSlide] = useState(0);

  
  const hasCategories = Array.isArray(subCategories) && subCategories.length > 0;

  useEffect(() => {
    const checkRes = () => setIsMobile(window.innerWidth < 768);
    checkRes();
    window.addEventListener("resize", checkRes);
    return () => window.removeEventListener("resize", checkRes);
  }, []);

  
  useEffect(() => {
    if (!hasCategories) return; 
    const interval = setInterval(() => {
      setSlide((prev) => (prev === 0 ? 1 : 0));
    }, AUTO_ROTATE_MS);
    return () => clearInterval(interval);
  }, [hasCategories]);

  const goPrev = () => setSlide((prev) => (prev === 0 ? 1 : 0));
  const goNext = () => setSlide((prev) => (prev === 0 ? 1 : 0));

  return (
    
<section className="relative w-full mt-2 md:mt-5 h-auto md:h-[600px] overflow-hidden bg-black">
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

<div className="relative w-full h-auto md:h-full">
          <AnimatePresence initial={false} mode="wait">
          {slide === 0 ? (
           <motion.div
  key="banner-image"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.6 }}
  className="relative md:absolute md:inset-0 w-full h-auto md:h-full"
>
  <img
    src="/images/banner.png"
    alt="Promotional banner"
    className="w-full h-auto md:h-full object-contain md:object-cover block"
  />
</motion.div>
          ) : hasCategories ? (
            <motion.div
              key="banner-slanted"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
className="relative md:absolute md:inset-0 flex flex-col md:flex-row w-full h-[500px] md:h-full bg-white overflow-hidden"            >
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
          ) : (
            <motion.div
              key="banner-loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
className="relative md:absolute md:inset-0 w-full h-[500px] md:h-full bg-gray-100 animate-pulse"            />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

/**
 
 * @param {number} index 
 * @param {number} total 
 * @param {boolean} isMobile
 * @returns {string}
 */
function getClipPath(index, total, isMobile) {
  const slant = 12;

  if (isMobile) {
    if (index === 0)
      return `polygon(0% 0%, 100% 0%, 100% ${100 - slant}%, 0% 100%)`;
    if (index === total - 1)
      return `polygon(0% ${slant}%, 100% 0%, 100% 100%, 0% 100%)`;
    return `polygon(0% ${slant}%, 100% 0%, 100% ${100 - slant}%, 0% 100%)`;
  } else {
    if (index === 0)
      return `polygon(0% 0%, 100% 0%, ${100 - slant}% 100%, 0% 100%)`;
    if (index === total - 1)
      return `polygon(${slant}% 0%, 100% 0%, 100% 100%, 0% 100%)`;
    return `polygon(${slant}% 0%, 100% 0%, ${100 - slant}% 100%, 0% 100%)`;
  }
}

export default HeroBanner;