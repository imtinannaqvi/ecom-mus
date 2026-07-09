import { useState, useMemo, useRef, useEffect } from "react";
import { IoIosClose } from "react-icons/io";
import { FiChevronDown } from "react-icons/fi";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link, useParams } from "react-router-dom";
import Api, { BACKEND_URL } from "../api/api";
import useProduct from "../hooks/productService";

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

const AGE_GROUP_OPTIONS = ["0-2 Years", "3-5 Years", "6-8 Years", "9-12 Years", "13-16 Years"];
const RATING_OPTIONS = [4, 3, 2, 1];

const slugify = (name) => (name || "").toLowerCase().replace(/\s+/g, "-");

// A single collapsible filter section — name + chevron, only one open at a
// time across the whole drawer (accordion), so the drawer stays compact and
// doesn't require scrolling to see every filter type.
const FilterSection = ({ id, title, openSection, setOpenSection, children }) => {
  const isOpen = openSection === id;
  return (
    <section className="border-t pt-5 first:border-t-0 first:pt-0">
      <button
        type="button"
        onClick={() => setOpenSection(isOpen ? null : id)}
        className="w-full flex items-center justify-between"
      >
        <h3 className="font-bold text-sm uppercase">{title}</h3>
        <FiChevronDown className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && <div className="mt-4">{children}</div>}
    </section>
  );
};

const CategoriesProduct = () => {
  const { mainCategory, subCategory } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const { fetchMainCategory } = useProduct();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await Api.get(`/product/get-products/${mainCategory}`);
        if (res.data.success) setProducts(res.data.data);
      } catch (err) {
        console.error(err.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    if (mainCategory) load();
  }, [mainCategory]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetchMainCategory();
        setCategories(res.data || []);
      } catch (err) {
        console.error("Failed to load category structure", err.message);
      }
    };
    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const matchedMainCat = useMemo(
    () => categories.find((c) => c.name?.toLowerCase() === mainCategory?.toLowerCase()),
    [categories, mainCategory]
  );

  const matchedGroup = useMemo(
    () =>
      matchedMainCat?.subCategories?.find(
        (group) => slugify(group.name) === subCategory?.toLowerCase()
      ),
    [matchedMainCat, subCategory]
  );

  const targetItemNames = useMemo(() => {
    if (matchedGroup) {
      return (matchedGroup.items || []).map((item) => item.name.toLowerCase());
    }
    // Look up the real item across every group in this main category whose
    // slug matches the URL — do NOT try to reverse-guess the name from the
    // slug, since that breaks for any item name that already contains its
    // own hyphen (e.g. "T-Shirts" slugifies to "t-shirts", and blindly
    // replacing every hyphen with a space would turn it into "t shirts",
    // which no longer matches the real name).
    let foundItem = null;
    matchedMainCat?.subCategories?.forEach((group) => {
      group.items?.forEach((item) => {
        if (slugify(item.name) === subCategory?.toLowerCase()) {
          foundItem = item;
        }
      });
    });
    if (foundItem) return [foundItem.name.toLowerCase()];

    // Fallback for legacy products whose subCategory predates the current
    // item structure and doesn't match anything — best-effort guess only.
    return [subCategory?.toLowerCase().replace(/-/g, " ")];
  }, [matchedGroup, matchedMainCat, subCategory]);

  const matchedItem = useMemo(() => {
    if (matchedGroup) return null;
    let found = null;
    matchedMainCat?.subCategories?.forEach((group) => {
      group.items?.forEach((item) => {
        if (slugify(item.name) === subCategory?.toLowerCase()) found = item;
      });
    });
    return found;
  }, [matchedMainCat, matchedGroup, subCategory]);

  const displayTitle = matchedGroup
    ? matchedGroup.name
    : matchedItem
    ? matchedItem.name
    : (subCategory || "").replace(/-/g, " ");

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef(null);

  // Only one filter section open at a time — keeps the drawer short.
  const [openSection, setOpenSection] = useState("size");

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
    priceMin: "",
    priceMax: "",
    ageGroups: [],
    minRating: null,
  });

  const [tempFilters, setTempFilters] = useState({ ...appliedFilters });

  const subCategoryProducts = useMemo(
    () =>
      products.filter((p) =>
        targetItemNames.includes(p.subCategory?.toLowerCase())
      ),
    [products, targetItemNames]
  );

  const outOfStockCount = subCategoryProducts.filter((p) => p.stock <= 0).length;

  const categoriesProduct = useMemo(() => {
    let result = [...subCategoryProducts];

    if (appliedFilters.size) {
      const selectedSize = appliedFilters.size.toLowerCase().trim();
      result = result.filter((p) => {
        const productSizes = toStringArray(p.sizes);
        return productSizes.includes(selectedSize);
      });
    }

    if (appliedFilters.colors.length > 0) {
      const selectedColors = appliedFilters.colors.map((c) =>
        c.toLowerCase().trim()
      );
      result = result.filter((p) => {
        const productColors = toStringArray(p.color);
        return productColors.some((pc) => selectedColors.includes(pc));
      });
    }

    if (appliedFilters.availability === "inStock") {
      result = result.filter((p) => p.stock > 0);
    } else if (appliedFilters.availability === "outOfStock") {
      result = result.filter((p) => p.stock <= 0);
    }

    if (appliedFilters.priceMin !== "" && !isNaN(appliedFilters.priceMin)) {
      result = result.filter((p) => Number(p.price) >= Number(appliedFilters.priceMin));
    }
    if (appliedFilters.priceMax !== "" && !isNaN(appliedFilters.priceMax)) {
      result = result.filter((p) => Number(p.price) <= Number(appliedFilters.priceMax));
    }

    if (appliedFilters.ageGroups.length > 0) {
      result = result.filter((p) =>
        (p.ageGroups || []).some((ag) => appliedFilters.ageGroups.includes(ag))
      );
    }

    if (appliedFilters.minRating) {
      result = result.filter((p) => (p.ratings || 0) >= appliedFilters.minRating);
    }

    if (sortOrder === "lowHigh") {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortOrder === "highLow") {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    }

    return result;
  }, [subCategoryProducts, appliedFilters, sortOrder]);

  const topFiveProducts = subCategoryProducts.slice(0, 5);
  const displayProducts = categoriesProduct;

  const handleConfirm = () => {
    setAppliedFilters({ ...tempFilters });
    setIsFilterOpen(false);
  };

  const handleReset = () => {
    const resetValue = { size: "", colors: [], availability: null, priceMin: "", priceMax: "", ageGroups: [], minRating: null };
    setTempFilters(resetValue);
    setAppliedFilters(resetValue);
    setIsFilterOpen(false);
  };

  const toggleTempAgeGroup = (age) => {
    setTempFilters((prev) => ({
      ...prev,
      ageGroups: prev.ageGroups.includes(age)
        ? prev.ageGroups.filter((a) => a !== age)
        : [...prev.ageGroups, age],
    }));
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
        className={`fixed top-0 right-0 h-full w-full max-w-[360px] bg-white z-[101] shadow-2xl transition-transform duration-300 flex flex-col ${
          isFilterOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b shrink-0">
          <h2 className="text-xl font-bold uppercase">Filters</h2>
          <button onClick={() => setIsFilterOpen(false)} className="text-3xl">
            <IoIosClose />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-5">

          <FilterSection id="size" title="Size" openSection={openSection} setOpenSection={setOpenSection}>
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
          </FilterSection>

          <FilterSection id="availability" title="Availability" openSection={openSection} setOpenSection={setOpenSection}>
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
          </FilterSection>

          <FilterSection id="category" title="Category" openSection={openSection} setOpenSection={setOpenSection}>
            <div className="space-y-3">
              {matchedMainCat?.subCategories?.length > 0 ? (
                matchedMainCat.subCategories.map((group) => (
                  <Link
                    key={group._id}
                    to={`/shop/${mainCategory}/${slugify(group.name)}`}
                    onClick={() => setIsFilterOpen(false)}
                    className={`block text-sm ${
                      matchedGroup?._id === group._id ? "font-bold text-black" : "text-gray-500 hover:text-black"
                    }`}
                  >
                    {group.name}
                  </Link>
                ))
              ) : (
                <p className="text-xs text-gray-400">No categories found.</p>
              )}
            </div>
          </FilterSection>

          <FilterSection id="colors" title="Colors" openSection={openSection} setOpenSection={setOpenSection}>
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
          </FilterSection>

          <FilterSection id="price" title="Price Range" openSection={openSection} setOpenSection={setOpenSection}>
            <div className="flex items-center gap-3">
              <input
                type="number"
                placeholder="Min"
                value={tempFilters.priceMin}
                onChange={(e) => setTempFilters({ ...tempFilters, priceMin: e.target.value })}
                className="w-1/2 border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-black transition"
              />
              <span className="text-gray-400 text-sm">to</span>
              <input
                type="number"
                placeholder="Max"
                value={tempFilters.priceMax}
                onChange={(e) => setTempFilters({ ...tempFilters, priceMax: e.target.value })}
                className="w-1/2 border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-black transition"
              />
            </div>
          </FilterSection>

          <FilterSection id="age" title="Age" openSection={openSection} setOpenSection={setOpenSection}>
            <div className="space-y-3">
              {AGE_GROUP_OPTIONS.map((age) => (
                <label key={age} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tempFilters.ageGroups.includes(age)}
                    onChange={() => toggleTempAgeGroup(age)}
                    className="w-4 h-4 accent-black"
                  />
                  <span className="text-sm">{age}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          <FilterSection id="ratings" title="Ratings" openSection={openSection} setOpenSection={setOpenSection}>
            <div className="space-y-3">
              {RATING_OPTIONS.map((r) => (
                <label key={r} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="minRating"
                    checked={tempFilters.minRating === r}
                    onChange={() =>
                      setTempFilters({ ...tempFilters, minRating: tempFilters.minRating === r ? null : r })
                    }
                    className="w-4 h-4 accent-black"
                  />
                  <span className="text-sm flex items-center gap-1">
                    {"★".repeat(r)}{"☆".repeat(5 - r)} <span className="text-gray-400 ml-1">& up</span>
                  </span>
                </label>
              ))}
            </div>
          </FilterSection>

        </div>

        <div className="w-full p-6 bg-white border-t grid grid-cols-2 gap-4 shrink-0">
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
            home / {displayTitle}
          </p>
          <div className="flex items-center justify-between mt-4">
            <h2 className="text-lg font-bold uppercase italic tracking-tighter">
              {displayTitle}{" "}
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