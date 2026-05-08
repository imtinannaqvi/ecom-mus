import { useState } from "react";
import { FaChevronRight } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import Header from "../components/Header";
import Footer from "../components/Footer";

/* ── Inline Icons ── */
const FilterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 6h16M7 12h10M10 18h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

/* ── Data ── */
const CATEGORIES = [
  { title: "HOODIES", image: "/images/listImg/1.jpg" },
  { title: "Caps",    image: "/images/listImg/2.jpg" },
  { title: "Bags",    image: "/images/listImg/3.jpg" },
  { title: "Pants",   image: "/images/listImg/4.jpg" },
  { title: "Shoes",   image: "/images/listImg/5.jpg" },
];

const ITEMS = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  title: "Samsoe Samsoe",
  brand: "Women's yellow all over",
  price: 230,
  img: `/images/listImg/${["1","5","6","7","8"][i % 5]}.jpg`,
}));

const CategoriesProduct = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <section className="bg-white min-h-screen">
      <Header />

      <div className="w-full px-4 md:px-6 pt-5">
        
        {/* ── BANNER SECTION ── */}
        {/* Mobile: Vertical Stack | Desktop: Parallelogram row */}
        {/* ── BANNER SECTION ── */}
<div className="flex flex-col md:flex-row h-auto md:h-[450px] gap-2 md:gap-0 w-full overflow-hidden">
  {CATEGORIES.map((cat, index) => {
    // Desktop logic for parallelogram (only for md and up)
    let desktopClip = "md:[clip-path:polygon(20%_0%,100%_0%,80%_100%,0%_100%)]";
    if (index === 0) desktopClip = "md:[clip-path:polygon(0%_0%,100%_0%,80%_100%,0%_100%)]";
    else if (index === CATEGORIES.length - 1) desktopClip = "md:[clip-path:polygon(20%_0%,100%_0%,100%_100%,0%_100%)]";

    return (
      <div
        key={index}
        className={`relative w-full h-[150px] md:h-full md:flex-1 overflow-hidden transition-all duration-500 ease-in-out cursor-pointer group 
          ${index !== 0 ? "md:-ml-16" : ""} 
          ${desktopClip}`}
        style={{ zIndex: CATEGORIES.length - index }}
      >
        {/* Image - scale class is here */}
        <img
          src={cat.image}
          alt={cat.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
        />
        
        {/* Overlay & Text */}
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center md:items-end md:pb-8 md:justify-start md:pl-20">
          <span className="text-white text-xs md:text-sm font-black tracking-[0.2em] uppercase">
            {cat.title}
          </span>
        </div>
      </div>
    );
  })}
</div>

        {/* ── TOOLBAR ── */}
        <div className="mt-8">
          <p className="text-[10px] text-gray-400 tracking-widest uppercase">home / hoodie</p>
          <div className="flex items-center justify-between mt-4">
            <h2 className="text-lg font-bold">Hoodies <span className="text-gray-400 font-normal text-xs ml-2">8,612 items</span></h2>
            <div className="flex items-center gap-4">
               <button className="hidden md:flex items-center gap-1 text-sm text-gray-600">Sort <IoIosArrowDown /></button>
               <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-xs font-bold">
                 <FilterIcon /> Filter
               </button>
            </div>
          </div>
        </div>

        {/* ── PRODUCT GRID ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 mt-8 pb-20">
          {ITEMS.map((item) => (
            <div key={item.id} className="group">
              <div className="aspect-[3/4] overflow-hidden bg-gray-100 rounded-lg">
                <img src={item.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </div>
              <h3 className="mt-2 text-sm font-bold">{item.title}</h3>
              <p className="text-xs text-gray-500">${item.price}</p>
            </div>
          ))}
        </div>

      </div>
      <Footer />
    </section>
  );
};

export default CategoriesProduct;