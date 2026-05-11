import { useContext, useState } from "react";
import { FaChevronRight } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContextProvider";

/* ── Inline Icons ── */
const FilterIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4 6h16M7 12h10M10 18h4"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const CategoriesProduct = () => {
  const { subCategory } = useParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { products } = useContext(AppContext);

  // 1. Filter products based on subCategory from context
  const categoriesProduct = products.filter(
    (item) => item.subCategory === subCategory
  );
  console.log(categoriesProduct)

  // 2. Parallelogram ke liye pehle 5 products nikaale
  const topFiveProducts = categoriesProduct.slice(0, 5);
  
  // 3. Grid ke liye baaki bache hue products
  const remainingProducts = categoriesProduct.slice(5);

  return (
    <section className="bg-white min-h-screen">
      <Header />

      <div className="w-full px-4 md:px-6 pt-5">
        {/* ── PARALLELOGRAM SECTION (Top 5 Products) ── */}
        <div className="flex flex-col md:flex-row h-auto md:h-[450px] gap-2 md:gap-0 w-full overflow-hidden">
          {topFiveProducts.map((cat, index) => {
            let desktopClip =
              "md:[clip-path:polygon(20%_0%,100%_0%,80%_100%,0%_100%)]";
            if (index === 0)
              desktopClip =
                "md:[clip-path:polygon(0%_0%,100%_0%,80%_100%,0%_100%)]";
            else if (index === topFiveProducts.length - 1)
              desktopClip =
                "md:[clip-path:polygon(20%_0%,100%_0%,100%_100%,0%_100%)]";

            return (
              <Link
                to={`/product/${cat.id}`} // Clickable link for banner products
                key={cat.id || index}
                className={`relative w-full h-[150px] md:h-full md:flex-1 overflow-hidden transition-all duration-500 ease-in-out cursor-pointer group 
          ${index !== 0 ? "md:-ml-16" : ""} 
          ${desktopClip}`}
                style={{ zIndex: topFiveProducts.length - index }}
              >
                {/* Image updated with product data */}
                <img
                  src={cat.images} // Handle array or single string
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                />

                
              </Link>
            );
          })}
        </div>

        {/* ── TOOLBAR ── */}
        <div className="mt-8">
          <p className="text-[10px] text-gray-400 tracking-widest uppercase">
            home / {subCategory}
          </p>
          <div className="flex items-center justify-between mt-4">
            <h2 className="text-lg font-bold">
              {subCategory}{" "}
              <span className="text-gray-400 font-normal text-xs ml-2">
                {categoriesProduct.length} items
              </span>
            </h2>
            <div className="flex items-center gap-4">
              <button className="hidden md:flex items-center gap-1 text-sm text-gray-600">
                Sort <IoIosArrowDown />
              </button>
              <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-xs font-bold">
                <FilterIcon /> Filter
              </button>
            </div>
          </div>
        </div>

        {/* ── PRODUCT GRID (Remaining Products) ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 mt-8 pb-20">
          {remainingProducts.map((item, idx) => (
            <Link to={`/product/${item.id}`} key={item.id || idx} className="group">
              <div className="aspect-[3/4] overflow-hidden bg-gray-100 rounded-lg">
                <img
                  src={Array.isArray(item.images) ? item.images[0] : item.images}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <h3 className="mt-2 text-sm font-bold">{item.name}</h3>
              <p className="text-xs text-gray-500">${item.price}</p>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </section>
  );
};

export default CategoriesProduct;