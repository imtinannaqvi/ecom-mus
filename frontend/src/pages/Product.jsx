import React, { useState, useEffect, useContext } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CiHeart } from "react-icons/ci";
import { Link } from "react-router-dom";
import { AppContext } from "../context/AppContextProvider";
import Button from "../components/Button";

// 1. Reusable Product Card
const ProductCard = ({ item, itemsToShow }) => (
  <Link
    to={`/product/${item.id}`}
    className="shrink-0 relative group mb-4"
    style={{ width: `calc(${100 / itemsToShow}% - 16px)` }}
  >
    <div className="h-8 w-8 text-xl flex items-center justify-center bg-white/80 backdrop-blur-sm right-2 top-2 rounded-full absolute z-10 hover:bg-black hover:text-white transition-colors">
      <CiHeart />
    </div>
    <div className="w-full aspect-[3/4] bg-gray-100 overflow-hidden rounded-md">
      <img
        src={item.images || item.images?.[0]}
        alt={item.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
        <p className="text-sm md:text-lg font-semibold">${item.price}</p>
      </div>
    </div>
  </Link>
);

// 2. Reusable Slider Section
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

// 3. NEW ARRIVALS (Alag Export - Fixed)
export const NewArrivals = ({ products }) => {
  return <ProductSliderSection title="NEW ARRIVALS" products={products} />;
};

// 4. TOP CATEGORIES
const TopCategories = ({ category, products = [] }) => {
  const uniqueSubCategories = [];
  const seen = new Set();
  products.forEach((item) => {
    if (
      item.category?.toLowerCase() === category?.toLowerCase() &&
      !seen.has(item.subCategory)
    ) {
      seen.add(item.subCategory);
      uniqueSubCategories.push(item);
    }
  });

  return (
    <section className="w-full flex items-center justify-center flex-col p-4 md:p-10">
      <Button text={"TOP CATEGORIES"} />
      <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5 mt-8 md:mt-10">
        {uniqueSubCategories.map((elem) => (
          <Link
            to={`/shop/${category}/${elem.subCategory}`}
            key={elem.id}
            className="relative h-60 md:h-80 rounded-lg overflow-hidden group"
          >
            <img
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              src={elem.img || elem.images}
              alt={elem.subCategory}
            />
            <div className="w-full px-4 py-2 absolute left-0 top-0 bg-black/60">
              <p
                className="text-xl md:text-2xl font-extrabold capitalize tracking-tighter"
                style={{
                  color: "rgba(0,0,0,0.6)",
                  WebkitTextStroke: "1px white",
                  paintOrder: "stroke fill",
                }}
              >
                {elem.subCategory}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

// 5. MAIN PRODUCT PAGE
function Product({ category }) {
  const { products } = useContext(AppContext);

  if (!products || products.length === 0) {
    return (
      <div className="w-full h-screen flex items-center justify-center font-bold uppercase tracking-widest">
        Loading...
      </div>
    );
  }

  const filtered = products.filter(
    (item) => item.category?.toLowerCase() === category?.toLowerCase(),
  );

  return (
    <div className="max-w-[1440px] mx-auto overflow-x-hidden">
      <TopCategories category={category} products={filtered} />
      <NewArrivals products={filtered} />
      <ProductSliderSection title="TOP TRENDING" products={filtered} />
      <ProductSliderSection title="TOP DISCOUNT" products={filtered} />
      <ProductSliderSection title="BUY 2 GET 1 FREE" products={filtered} />
    </div>
  );
}

export default Product;
