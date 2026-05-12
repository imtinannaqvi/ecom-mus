import { useContext, useState, useMemo } from "react";
import { IoIosArrowDown, IoIosClose, IoIosArrowForward } from "react-icons/io";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContextProvider";

const FilterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 6h16M7 12h10M10 18h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const CategoriesProduct = () => {
  const { subCategory } = useParams();
  const { products } = useContext(AppContext);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // --- States ---
  const [appliedFilters, setAppliedFilters] = useState({ 
    size: "", 
    colors: [], 
    availability: null, 
    sortOrder: "" 
  });
  
  const [tempFilters, setTempFilters] = useState({ ...appliedFilters });

  const sizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
  const colorOptions = [
    { name: "Red", hex: "#FF0000" },
    { name: "Black", hex: "#000000" },
    { name: "Grey", hex: "#D1D5DB" },
    { name: "White", hex: "#FFFFFF" },
    { name: "Green", hex: "#008000" },
    { name: "Beige", hex: "#F5F5DC" },
  ];

  // Logic for Dynamic Counts (Always based on subCategory)
  const subCategoryProducts = useMemo(() => 
    products.filter(p => p.subCategory === subCategory), 
  [products, subCategory]);

  const inStockCount = subCategoryProducts.filter(p => p.stock > 0).length;
  const outOfStockCount = subCategoryProducts.filter(p => p.stock <= 0).length;

  // --- FIXED FILTER & SORT LOGIC ---
  const categoriesProduct = useMemo(() => {
    let result = [...subCategoryProducts];

    // 1. Filter by Size
    if (appliedFilters.size) {
      result = result.filter(p => p.sizes?.includes(appliedFilters.size));
    }
    // 2. Filter by Color
    if (appliedFilters.colors.length > 0) {
      result = result.filter(p => appliedFilters.colors.includes(p.color));
    }
    // 3. Filter by Availability
    if (appliedFilters.availability === 'inStock') {
      result = result.filter(p => p.stock > 0);
    } else if (appliedFilters.availability === 'outOfStock') {
      result = result.filter(p => p.stock <= 0);
    }

    // 4. Sort by Price (Corrected Logic)
    if (appliedFilters.sortOrder === 'lowHigh') {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (appliedFilters.sortOrder === 'highLow') {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    }

    return result;
  }, [subCategoryProducts, appliedFilters]);

  // Parallelogram Section (Fixed to original subCategory data)
  const topFiveProducts = subCategoryProducts.slice(0, 5);
  const displayProducts = categoriesProduct; 

  const handleConfirm = () => {
    setAppliedFilters({ ...tempFilters });
    setIsFilterOpen(false);
  };

  const handleReset = () => {
    const resetValue = { size: "", colors: [], availability: null, sortOrder: "" };
    setTempFilters(resetValue);
    setAppliedFilters(resetValue);
    setIsFilterOpen(false);
  };

  return (
    <section className="bg-white min-h-screen relative overflow-x-hidden">
      <Header />

      {/* --- Filter Drawer --- */}
      <div className={`fixed inset-0 bg-black/40 backdrop-blur-md z-[100] transition-all ${isFilterOpen ? "opacity-100 visible" : "opacity-0 invisible"}`} onClick={() => setIsFilterOpen(false)} />
      
      <div className={`fixed top-0 right-0 h-full w-full max-w-[360px] bg-white z-[101] shadow-2xl transition-transform duration-300 ${isFilterOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold uppercase">Filters</h2>
          <button onClick={() => setIsFilterOpen(false)} className="text-3xl"><IoIosClose /></button>
        </div>

        <div className="p-6 overflow-y-auto h-[calc(100vh-140px)] space-y-8">
          {/* Size */}
          <section>
            <h3 className="font-bold mb-4 text-sm uppercase">Size</h3>
            <div className="grid grid-cols-4 gap-2">
              {sizes.map(s => (
                <button key={s} onClick={() => setTempFilters({...tempFilters, size: s})} className={`h-10 border text-xs font-bold transition-all ${tempFilters.size === s ? "bg-black text-white border-black" : "border-gray-200"}`}>{s}</button>
              ))}
            </div>
          </section>

          {/* Availability */}
          <section className="border-t pt-6">
            <h3 className="font-bold mb-4 text-sm uppercase">Availability</h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-3">
                  <input type="radio" name="stock" checked={tempFilters.availability === 'inStock'} onChange={() => setTempFilters({...tempFilters, availability: 'inStock'})} className="w-4 h-4 accent-black" />
                  <span className="text-sm">Availability</span>
                </div>
                <span className="text-gray-400 text-xs">({subCategoryProducts.length})</span>
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-3">
                  <input type="radio" name="stock" checked={tempFilters.availability === 'outOfStock'} onChange={() => setTempFilters({...tempFilters, availability: 'outOfStock'})} className="w-4 h-4 accent-black" />
                  <span className="text-sm">Out Of Stock</span>
                </div>
                <span className="text-gray-400 text-xs">({outOfStockCount})</span>
              </label>
            </div>
          </section>

          {/* Price Sort (Fixed Buttons) */}
          <section className="border-t pt-6">
            <h3 className="font-bold mb-4 text-sm uppercase">Price Range</h3>
            <div className="flex flex-col gap-2">
              <button onClick={() => setTempFilters({...tempFilters, sortOrder: 'lowHigh'})} className={`w-full py-3 border text-[10px] font-black tracking-widest ${tempFilters.sortOrder === 'lowHigh' ? 'bg-black text-white' : 'border-gray-200'}`}>LOW TO HIGH</button>
              <button onClick={() => setTempFilters({...tempFilters, sortOrder: 'highLow'})} className={`w-full py-3 border text-[10px] font-black tracking-widest ${tempFilters.sortOrder === 'highLow' ? 'bg-black text-white' : 'border-gray-200'}`}>HIGH TO LOW</button>
            </div>
          </section>

          {/* Colors */}
          <section className="border-t pt-6">
            <h3 className="font-bold mb-4 text-sm uppercase">Colors</h3>
            <div className="space-y-4">
              {colorOptions.map(c => (
                <div key={c.name} className="flex items-center justify-between">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={tempFilters.colors.includes(c.name)} onChange={() => {
                      const colors = tempFilters.colors.includes(c.name) ? tempFilters.colors.filter(x => x !== c.name) : [...tempFilters.colors, c.name];
                      setTempFilters({...tempFilters, colors});
                    }} className="w-4 h-4 accent-black" />
                    <span className="text-sm">{c.name}</span>
                  </label>
                  <div className="w-5 h-5 rounded-full border" style={{ backgroundColor: c.hex }} />
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Action Buttons */}
        <div className="absolute bottom-0 w-full p-6 bg-white border-t grid grid-cols-2 gap-4">
          <button onClick={handleReset} className="py-4 border border-black text-[10px] font-black uppercase">Reset</button>
          <button onClick={handleConfirm} className="py-4 bg-black text-white text-[10px] font-black uppercase">Confirm</button>
        </div>
      </div>

      <div className="w-full px-4 md:px-6 pt-5">
        {/* PARALLELOGRAM SECTION (DO NOT TOUCH) */}
        <div className="flex flex-col md:flex-row h-auto md:h-[450px] gap-2 md:gap-0 w-full overflow-hidden">
          {topFiveProducts.map((cat, index) => {
            let desktopClip = "md:[clip-path:polygon(20%_0%,100%_0%,80%_100%,0%_100%)]";
            if (index === 0) desktopClip = "md:[clip-path:polygon(0%_0%,100%_0%,80%_100%,0%_100%)]";
            else if (index === topFiveProducts.length - 1) desktopClip = "md:[clip-path:polygon(20%_0%,100%_0%,100%_100%,0%_100%)]";
            return (
              <Link to={`/product/${cat.id}`} key={cat.id || index} className={`relative w-full h-[150px] md:h-full md:flex-1 overflow-hidden transition-all duration-500 ease-in-out cursor-pointer group ${index !== 0 ? "md:-ml-16" : ""} ${desktopClip}`} style={{ zIndex: topFiveProducts.length - index }}>
                <img src={Array.isArray(cat.images) ? cat.images[0] : cat.images} alt={cat.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110" />
              </Link>
            );
          })}
        </div>

        {/* Toolbar */}
        <div className="mt-8">
          <p className="text-[10px] text-gray-400 tracking-widest uppercase">home / {subCategory}</p>
          <div className="flex items-center justify-between mt-4">
            <h2 className="text-lg font-bold uppercase italic tracking-tighter">
              {subCategory} <span className="text-gray-400 font-normal text-xs ml-2 normal-case not-italic tracking-normal">({displayProducts.length} items)</span>
            </h2>
            <button onClick={() => setIsFilterOpen(true)} className="flex items-center gap-2 border border-black px-5 py-2 text-[10px] font-black uppercase">
              <FilterIcon /> Filter
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 mt-8 pb-20">
          {displayProducts.length > 0 ? (
            displayProducts.map((item, idx) => (
              <Link to={`/product/${item.id}`} key={item.id || idx} className="group">
                <div className="aspect-[3/4] overflow-hidden bg-gray-50 rounded-sm">
                  <img src={Array.isArray(item.images) ? item.images[0] : item.images} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <h3 className="mt-3 text-[11px] font-bold uppercase">{item.name}</h3>
                <p className="text-[10px] text-gray-500 font-medium">${item.price}</p>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-100">
              <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">No items matched your filter</p>
              <button onClick={handleReset} className="mt-4 text-[10px] underline font-black uppercase">Clear All Filters</button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </section>
  );
};

export default CategoriesProduct;