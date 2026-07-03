import { useContext, useState, useMemo, useRef, useEffect } from "react";
import { IoIosClose } from "react-icons/io";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContextProvider";
import { BACKEND_URL } from "../api/api";

const FilterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 6h16M7 12h10M10 18h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const ChevronDown = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);



const getImageUrl = (images) => {
  if (!images || (Array.isArray(images) && images.length === 0)) return "/placeholder.jpg";
  let imgData = Array.isArray(images) ? images[0] : images;
  let imgPath = "";
  if (typeof imgData === "object" && imgData !== null) {
    imgPath = imgData.url || imgData.path || "";
  } else {
    imgPath = imgData;
  }
  if (!imgPath || typeof imgPath !== "string") return "/placeholder.jpg";
  if (imgPath.startsWith("http")) return imgPath;
  return `${BACKEND_URL}${imgPath}`;
};

// Safely normalize any field to a lowercase string array for comparison
const toStringArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value.map((v) => String(v).toLowerCase().trim());
  return [String(value).toLowerCase().trim()];
};

const SORT_OPTIONS = [
  { label: "Popularity", value: "popularity" },
  { label: "Price: Low to High", value: "lowHigh" },
  { label: "Price: High to Low", value: "highLow" },
];

const sizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
const colorOptions = [
  { name: "Red", hex: "#FF0000" },
  { name: "Black", hex: "#000000" },
  { name: "Grey", hex: "#D1D5DB" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Green", hex: "#008000" },
  { name: "Beige", hex: "#F5F5DC" },
];

const CategoriesProduct = () => {
  const { subCategory } = useParams();
  const { products } = useContext(AppContext);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef(null);

  // Close sort dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const [sortOrder, setSortOrder] = useState("popularity");

  const [appliedFilters, setAppliedFilters] = useState({
    size: "",
    colors: [],
    availability: null,
  });

  const [tempFilters, setTempFilters] = useState({ ...appliedFilters });

  // All products matching this subCategory
  const subCategoryProducts = useMemo(
    () =>
      products.filter(
        (p) => p.subCategory?.toLowerCase() === subCategory?.toLowerCase()
      ),
    [products, subCategory]
  );

  const outOfStockCount = subCategoryProducts.filter((p) => p.stock <= 0).length;

  console.log(products)
  // --- FIXED FILTER + SORT LOGIC ---
  const categoriesProduct = useMemo(() => {
    let result = [...subCategoryProducts];

    // SIZE FILTER — p.sizes can be array or string
    if (appliedFilters.size) {
      const selectedSize = appliedFilters.size.toLowerCase().trim();
      result = result.filter((p) => {
        const productSizes = toStringArray(p.sizes);
        return productSizes.includes(selectedSize);
      });
    }

    // COLOR FILTER — p.color can be array or string
    if (appliedFilters.colors.length > 0) {
      const selectedColors = appliedFilters.colors.map((c) =>
        c.toLowerCase().trim()
      );
      result = result.filter((p) => {
        const productColors = toStringArray(p.color);
        // At least one of the product's colors must match any selected color
        return productColors.some((pc) => selectedColors.includes(pc));
      });
    }

    // AVAILABILITY FILTER
    if (appliedFilters.availability === "inStock") {
      result = result.filter((p) => p.stock > 0);
    } else if (appliedFilters.availability === "outOfStock") {
      result = result.filter((p) => p.stock <= 0);
    }

    // SORT (separate from filters, controlled by sort dropdown)
    if (sortOrder === "lowHigh") {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortOrder === "highLow") {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    }
    // "popularity" — keep original order

    return result;
  }, [subCategoryProducts, appliedFilters, sortOrder]);

  const topFiveProducts = subCategoryProducts.slice(0, 5);
  const displayProducts = categoriesProduct;

  const handleConfirm = () => {
    setAppliedFilters({ ...tempFilters });
    setIsFilterOpen(false);
  };

  const handleReset = () => {
    const resetValue = { size: "", colors: [], availability: null };
    setTempFilters(resetValue);
    setAppliedFilters(resetValue);
    setIsFilterOpen(false);
  };

  const activeSortLabel =
    SORT_OPTIONS.find((o) => o.value === sortOrder)?.label || "Sort By";

  return (
    <section className="bg-white min-h-screen relative overflow-x-hidden">
      <Header />

      {/* --- Filter Drawer Overlay --- */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-md z-[100] transition-all ${
          isFilterOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsFilterOpen(false)}
      />

      {/* --- Filter Drawer --- */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-[360px] bg-white z-[101] shadow-2xl transition-transform duration-300 ${
          isFilterOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold uppercase">Filters</h2>
          <button onClick={() => setIsFilterOpen(false)} className="text-3xl">
            <IoIosClose />
          </button>
        </div>

        <div className="p-6 overflow-y-auto h-[calc(100vh-140px)] space-y-8">
          {/* SIZE */}
          <section>
            <h3 className="font-bold mb-4 text-sm uppercase">Size</h3>
            <div className="grid grid-cols-4 gap-2">
              {sizes.map((s) => (
                <button
                  key={s}
                  onClick={() =>
                    setTempFilters({
                      ...tempFilters,
                      size: tempFilters.size === s ? "" : s,
                    })
                  }
                  className={`h-10 border text-xs font-bold transition-all ${
                    tempFilters.size === s
                      ? "bg-black text-white border-black"
                      : "border-gray-200"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </section>

          {/* AVAILABILITY */}
          <section className="border-t pt-6">
            <h3 className="font-bold mb-4 text-sm uppercase">Availability</h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="stock"
                    checked={tempFilters.availability === "inStock"}
                    onChange={() =>
                      setTempFilters({ ...tempFilters, availability: "inStock" })
                    }
                    className="w-4 h-4 accent-black"
                  />
                  <span className="text-sm">In Stock</span>
                </div>
                <span className="text-gray-400 text-xs">
                  ({subCategoryProducts.length - outOfStockCount})
                </span>
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="stock"
                    checked={tempFilters.availability === "outOfStock"}
                    onChange={() =>
                      setTempFilters({
                        ...tempFilters,
                        availability: "outOfStock",
                      })
                    }
                    className="w-4 h-4 accent-black"
                  />
                  <span className="text-sm">Out Of Stock</span>
                </div>
                <span className="text-gray-400 text-xs">({outOfStockCount})</span>
              </label>
            </div>
          </section>

          {/* COLORS */}
          <section className="border-t pt-6">
            <h3 className="font-bold mb-4 text-sm uppercase">Colors</h3>
            <div className="space-y-4">
              {colorOptions.map((c) => (
                <div key={c.name} className="flex items-center justify-between">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={tempFilters.colors.includes(c.name)}
                      onChange={() => {
                        const colors = tempFilters.colors.includes(c.name)
                          ? tempFilters.colors.filter((x) => x !== c.name)
                          : [...tempFilters.colors, c.name];
                        setTempFilters({ ...tempFilters, colors });
                      }}
                      className="w-4 h-4 accent-black"
                    />
                    <span className="text-sm">{c.name}</span>
                  </label>
                  <div
                    className="w-5 h-5 rounded-full border"
                    style={{ backgroundColor: c.hex }}
                  />
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="absolute bottom-0 w-full p-6 bg-white border-t grid grid-cols-2 gap-4">
          <button
            onClick={handleReset}
            className="py-4 border border-black text-[10px] font-black uppercase"
          >
            Reset
          </button>
          <button
            onClick={handleConfirm}
            className="py-4 bg-black text-white text-[10px] font-black uppercase"
          >
            Confirm
          </button>
        </div>
      </div>

      {/* --- Main Content --- */}
      <div className="w-full px-4 md:px-6 pt-5">
        {/* PARALLELOGRAM SECTION */}
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
                to={`/product/${cat._id}`}
                key={cat._id}
                className={`relative w-full h-[150px] md:h-full md:flex-1 overflow-hidden transition-all duration-500 ease-in-out cursor-pointer group ${
                  index !== 0 ? "md:-ml-16" : ""
                } ${desktopClip}`}
                style={{ zIndex: topFiveProducts.length - index }}
              >
                <img
                  src={getImageUrl(cat.images)}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                />
              </Link>
            );
          })}
        </div>

        {/* Toolbar */}
        <div className="mt-8">
          <p className="text-[10px] text-gray-400 tracking-widest uppercase">
            home / {subCategory}
          </p>
          <div className="flex items-center justify-between mt-4">
            <h2 className="text-lg font-bold uppercase italic tracking-tighter">
              {subCategory}{" "}
              <span className="text-gray-400 font-normal text-xs ml-2 normal-case not-italic tracking-normal">
                ({displayProducts.length} items)
              </span>
            </h2>

            {/* RIGHT SIDE: Sort By + Filter */}
            <div className="flex items-center gap-3">
              {/* Sort By Dropdown */}
              <div className="relative" ref={sortRef}>
                <button
                  onClick={() => setIsSortOpen((prev) => !prev)}
                  className="flex items-center gap-2 border border-black px-5 py-2 text-[10px] font-black uppercase"
                >
                  {activeSortLabel}
                  <ChevronDown />
                </button>
                {isSortOpen && (
                  <div className="absolute right-0 top-[calc(100%+4px)] w-48 bg-white border border-gray-200 shadow-lg z-50">
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setSortOrder(opt.value);
                          setIsSortOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-wider transition-colors ${
                          sortOrder === opt.value
                            ? "bg-black text-white"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Filter Button */}
              <button
                onClick={() => setIsFilterOpen(true)}
                className="flex items-center gap-2 border border-black px-5 py-2 text-[10px] font-black uppercase"
              >
                <FilterIcon /> Filter
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 mt-8 pb-20">
          {displayProducts.length > 0 ? (
            displayProducts.map((item) => (
              <Link
                to={`/product/${item._id}`}
                key={item._id}
                className="group"
              >
                <div className="aspect-[3/4] overflow-hidden bg-gray-50 rounded-sm">
                  <img
                    src={getImageUrl(item.images)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    alt={item.name}
                  />
                </div>
                <h3 className="mt-3 text-[11px] font-bold uppercase">
                  {item.name}
                </h3>
                <p className="text-[10px] text-gray-500 font-medium">
                  Rs. {item.price}
                </p>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-100">
              <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">
                No items matched your filter
              </p>
              <button
                onClick={handleReset}
                className="mt-4 text-[10px] underline font-black uppercase"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </section>
  );
};

export default CategoriesProduct;