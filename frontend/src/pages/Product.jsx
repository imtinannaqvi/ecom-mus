import Button from "../components/Button";
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CiHeart } from "react-icons/ci";
import { Link } from "react-router-dom";

// 1. Reusable Product Card
const ProductCard = ({ item, itemsToShow }) => (
  <Link 
    to={`/product/${item.id}`}
    className="shrink-0 relative group mb-4"
    style={{ width: `calc(${100 / itemsToShow}% - 16px)` }}
  >
    <div className="h-8 w-8 text-xl flex items-center justify-center bg-white/80 backdrop-blur-sm right-2 top-2 rounded-full absolute z-10 hover:bg-red-500 hover:text-white transition-colors">
      <CiHeart />
    </div>
    <div className="w-full aspect-[3/4] bg-gray-100 overflow-hidden rounded-md">
      <img
        src={item.img}
        alt={item.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
    </div>
    <div className="mt-3 md:mt-4">
      <p className="text-[10px] md:text-xs text-gray-400 capitalize">{item.type}</p>
      <h3 className="font-bold text-xs md:text-sm truncate uppercase">
        {item.title}
      </h3>
      <div className="flex justify-between items-center mt-1 md:mt-2">
        <p className="text-gray-500 text-[10px] md:text-xs truncate max-w-[60%]">{item.brand}</p>
        <p className="text-sm md:text-lg font-semibold">${item.price}</p>
      </div>
    </div>
  </Link>
);

// 2. Reusable Slider Section (Exported so you can use it)
export const ProductSliderSection = ({ title, products }) => {
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

  const totalItems = products.length;
  const nextSlide = () => currentIndex < totalItems - itemsToShow && setCurrentIndex(currentIndex + 1);
  const prevSlide = () => currentIndex > 0 && setCurrentIndex(currentIndex - 1);

  return (
    <section className="w-full p-4 md:p-10">
      <div className="flex w-full justify-center items-center mb-8 md:mb-10">
        <Button text={title} />
      </div>
      <div className="w-full relative overflow-hidden">
        <div className="flex z-10 top-[35%] md:top-1/2 -translate-y-1/2 justify-between w-full absolute px-1 pointer-events-none">
          <button
            onClick={prevSlide}
            className={`p-1.5 md:p-2 pointer-events-auto bg-white shadow-md text-black rounded-full transition ${currentIndex === 0 ? "opacity-0 invisible" : "opacity-100"}`}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={nextSlide}
            className={`p-1.5 md:p-2 pointer-events-auto bg-white shadow-md text-black rounded-full transition ${currentIndex >= totalItems - itemsToShow ? "opacity-0 invisible" : "opacity-100"}`}
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

// 3. Named Export for Single Product Page
export const NewArrivals = () => {
  return <ProductSliderSection title="NEW ARRIVALS" products={mockProducts} />;
};

// 4. Categories Section
const TopCategories = () => {
  const categories = [
    { id: 1, title: "Hoodies", img: "/images/catImg/hoodie.jpg" },
    { id: 2, title: "Caps", img: "/images/catImg/cap.jpg" },
    { id: 3, title: "Bags", img: "/images/catImg/bag.jpg" },
    { id: 4, title: "Pants", img: "/images/catImg/pant.jpg" },
    { id: 5, title: "T-Shirt", img: "/images/catImg/t-shirt.jpg" },
    { id: 6, title: "Bottoms", img: "/images/catImg/bottoms.jpg" },
    { id: 7, title: "Belts", img: "/images/catImg/belts.jpg" },
    { id: 8, title: "T-Shirts", img: "/images/catImg/t-shirts.jpg" },
  ];

  return (
    <section className="w-full flex items-center justify-center flex-col p-4 md:p-10">
      <Button text={"Top Categories"} />
      <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5 mt-8 md:mt-10">
        {categories.map((elem) => (
          <Link to={`/category/${elem.title.toLowerCase()}`} key={elem.id} className="relative h-60 md:h-80 rounded-lg overflow-hidden group">
            <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src={elem.img} alt={elem.title} />
            <div className="w-full px-4 py-2 absolute left-0 top-0 bg-black/60">
              <p className="text-xl md:text-2xl font-extrabold capitalize tracking-tighter" style={{ color: "transparent", WebkitTextStroke: "1px white" }}>
                {elem.title}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

// Mock Data
const mockProducts = [
  { id: 1, title: "samsoe", brand: "Women's Yellow All Over", price: "2,500", img: "/images/pdImg/1.jpg", type: "dress" },
  { id: 2, title: "samsoe", brand: "Women's Yellow All Over", price: "2,500", img: "/images/pdImg/2.jpg", type: "dress" },
  { id: 3, title: "samsoe", brand: "Women's Yellow All Over", price: "2,500", img: "/images/pdImg/3.jpg", type: "dress" },
  { id: 4, title: "samsoe", brand: "Women's Yellow All Over", price: "2,500", img: "/images/pdImg/4.jpg", type: "dress" },
  { id: 5, title: "samsoe", brand: "Women's Yellow All Over", price: "2,500", img: "/images/pdImg/1.jpg", type: "dress" },
  { id: 6, title: "samsoe", brand: "Women's Yellow All Over", price: "2,500", img: "/images/pdImg/2.jpg", type: "dress" },
  { id: 7, title: "samsoe", brand: "Women's Yellow All Over", price: "2,500", img: "/images/pdImg/3.jpg", type: "dress" },
  { id: 8, title: "samsoe", brand: "Women's Yellow All Over", price: "2,500", img: "/images/pdImg/4.jpg", type: "dress" },
];

// 5. MAIN PRODUCT PAGE (Home Page Pe Jo Show Hota Hai)
function Product() {
  return (
    <div className="max-w-[1440px] mx-auto overflow-x-hidden">
      <TopCategories />
      {/* Ab saare sections wapis aa gaye hain */}
      <ProductSliderSection title="NEW ARRIVALS" products={mockProducts} />
      <ProductSliderSection title="TOP TRENDING" products={mockProducts} />
      <ProductSliderSection title="TOP DISCOUNT" products={mockProducts} />
      <ProductSliderSection title="BUY 2 GET 1 FREE" products={mockProducts} />
    </div>
  );
}

export default Product;