import React, { useState, useEffect, useContext } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CiHeart } from "react-icons/ci";
import { Link } from "react-router-dom";
import { AppContext } from "../context/AppContextProvider";
import Button from "../components/Button";
import { BACKEND_URL } from "../api/api";

// 1. Reusable Product Card
const ProductCard = ({ item, itemsToShow }) => {


  // Logic to get the image URL correctly
  // Agar images array hai to pehli image ka url lo, warna check karo fallback
  const getImageUrl = () => {
    if (Array.isArray(item.images) && item.images.length > 0) {
      return item.images[0].url; // Pehli image ka URL
    } else if (item.image && Array.isArray(item.image) && item.image.length > 0) {
      return item.image[0].url;
    } else if (item.images?.url) {
      return item.images.url;
    }
    return "/images/placeholder.png"; // Default image
  };

  const imagePath = getImageUrl();
  const finalSrc = imagePath.startsWith("http") 
    ? imagePath 
    : `${BACKEND_URL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;

  const hasDiscount = item.oldPrice && item.oldPrice > item.price;

  return (
    <Link
      to={`/product/${item._id}`}
      className="shrink-0 relative group mb-4"
      style={{ width: `calc(${100 / itemsToShow}% - 16px)` }}
    >
      <div className="h-8 w-8 text-xl flex items-center justify-center bg-white/80 backdrop-blur-sm right-2 top-2 rounded-full absolute z-10 hover:bg-black hover:text-white transition-colors">
        <CiHeart />
      </div>
      {hasDiscount && (
        <div className="absolute left-2 top-2 z-10 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">
          {Math.round(((item.oldPrice - item.price) / item.oldPrice) * 100)}% OFF
        </div>
      )}
      <div className="w-full aspect-[3/4] bg-gray-100 overflow-hidden rounded-md">
        <img
          src={finalSrc}
          alt={item.title || item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.src = "/images/placeholder.png"; }} // Image load na ho to handle kare
        />
      </div>
      <div className="mt-3 md:mt-4">
        <p className="text-[10px] md:text-xs text-gray-400 capitalize">
          {item.subCategory}
        </p>
        <h3 className="font-bold text-xs md:text-sm truncate uppercase">
          {item.name}
        </h3>
        <div className="flex justify-between items-center mt-1 md:mt-2">
          <p className="text-gray-500 text-[10px] md:text-xs truncate max-w-[60%]">
            {item.brand}
          </p>
          <div className="flex items-center gap-1.5">
            {hasDiscount && (
              <p className="text-gray-400 text-[10px] md:text-xs line-through">${item.oldPrice}</p>
            )}
            <p className="text-sm md:text-lg font-semibold">${item.price}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};
export const ProductSliderSection = ({ title, products = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(5);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsToShow(2);
      else if (window.innerWidth < 1024) setItemsToShow(3);
      else setItemsToShow(5);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalItems = products?.length || 0;
  const nextSlide = () =>
    currentIndex < totalItems - itemsToShow &&
    setCurrentIndex(currentIndex + 1);
  const prevSlide = () => currentIndex > 0 && setCurrentIndex(currentIndex - 1);

  if (totalItems === 0) return null;

  return (
    <section className="w-full p-4 md:p-10">
      <div className="flex w-full justify-center items-center mb-8 md:mb-10">
        <Button text={title} />
      </div>
      <div className="w-full relative overflow-hidden">
        <div className="flex z-10 top-[35%] md:top-1/2 -translate-y-1/2 justify-between w-full absolute px-1 pointer-events-none">
          <button
            onClick={prevSlide}
            className={`p-1.5 md:p-2 pointer-events-auto bg-white shadow-md rounded-full transition ${currentIndex === 0 ? "opacity-0" : "opacity-100"}`}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={nextSlide}
            className={`p-1.5 md:p-2 pointer-events-auto bg-white shadow-md rounded-full transition ${currentIndex >= totalItems - itemsToShow ? "opacity-0" : "opacity-100"}`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)`,
            gap: "16px",
          }}
        >
          {products.map((item, index) => (
            <ProductCard key={index} item={item} itemsToShow={itemsToShow} />
          ))}
        </div>
      </div>
    </section>
  );
};

export const NewArrivals = ({ products }) => {
  return <ProductSliderSection title="NEW ARRIVALS" products={products} />;
};

// 5. MAIN PRODUCT PAGE — buckets real products into real sections instead
// of showing the same full list four times.
function Product({ category, products }) {

  if (!products || products.length === 0) {
    return (
      <div className="w-full h-screen flex items-center justify-center font-bold uppercase tracking-widest">
        Loading...
      </div>
    );
  }

  // New Arrivals: most recently added products first.
  const newArrivals = [...products]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 10);

  // Top Trending: admin-flagged via isTopTrend toggle.
  const topTrending = products.filter((p) => p.isTopTrend);

  // Top Discount: admin set an oldPrice higher than the current price.
  const topDiscount = products.filter((p) => p.oldPrice && p.oldPrice > p.price);

  // Buy 2 Get 1 Free: admin-flagged via isBuy2Get1 toggle.
  const buy2Get1 = products.filter((p) => p.isBuy2Get1);

  return (
    <div className="max-w-[1440px] mx-auto overflow-x-hidden">
      <ProductSliderSection title="NEW ARRIVALS" products={newArrivals} />
      <ProductSliderSection title="TOP TRENDING" products={topTrending} />
      <ProductSliderSection title="TOP DISCOUNT" products={topDiscount} />
      <ProductSliderSection title="BUY 2 GET 1 FREE" products={buy2Get1} />
    </div>
  );
}

export default Product;