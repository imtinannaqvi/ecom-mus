import React, { useContext, useState, useEffect, useMemo } from "react";
import { FaPhoneAlt, FaFacebookF, FaInstagram, FaTwitter, FaBars } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { AiOutlineClose } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { RiDeleteBin6Line } from "react-icons/ri";
import { GoPerson } from "react-icons/go";
import { CiHeart } from "react-icons/ci";
import { IoCartOutline } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import { CartContext } from "../context/CartContext";
import { AppContext } from "../context/AppContextProvider";
import useProduct from "../hooks/productService";
import API, { BACKEND_URL } from "../api/api";

// Builds a URL-safe slug from a category/item name. Handles slashes (e.g.
// "Pants / Trousers") as well as spaces — a raw "/" would otherwise be read
// by the router as an extra path segment and break the route entirely.
const slugify = (name) => (name || "")
  .toLowerCase()
  .replace(/\//g, "-")
  .replace(/\s+/g, "-");

// --- MEGA MENU COMPONENT ---
// mainCat.subCategories = menu groups (e.g. "Top Wear"), each with its own
// items[] (e.g. "Classic Fit T-Shirts") — a real two-level hierarchy.
const MegaMenu = ({ mainCat, closeMenu }) => {
  if (!mainCat || !mainCat.subCategories) return null;

  return (
    <>
      <div
        className="fixed inset-0 top-[104px] bg-black/20 backdrop-blur-sm z-40"
        onClick={closeMenu}
      />
      <div
        className="absolute left-0 top-full w-full bg-black text-white py-12 px-8 shadow-2xl z-50 border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-300"
        onMouseLeave={closeMenu}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-x-16 gap-y-8">
            {mainCat.subCategories.map((group) => (
              <div key={group._id} className="min-w-[180px]">
                <h4 className="text-[13px] font-bold uppercase tracking-[0.15em] mb-4 text-white">
                  {group.name}
                </h4>
                <div className="space-y-3">
                  {(group.items || []).map((item) => (
                    <div key={item._id} className="group">
                      <Link
                        to={`/shop/${mainCat.name.toLowerCase()}/${slugify(item.name)}`}
                        onClick={closeMenu}
                        className="inline-block"
                      >
                        <h3 className="text-[12px] text-gray-300 tracking-[0.1em] uppercase transition-all duration-300 group-hover:translate-x-2 group-hover:text-white cursor-pointer relative">
                          {item.name}
                          <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
                        </h3>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

const getProductImage = (item) => {
  const img = item?.images?.[0];
  if (!img) return "/images/placeholder.png";
  const path = typeof img === "string" ? img : img.url;
  if (!path) return "/images/placeholder.png";
  return path.startsWith("http") ? path : `${BACKEND_URL}${path}`;
};

function Header() {
  const [activeMenu, setActiveMenu] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("All");
  const [allProducts, setAllProducts] = useState([]);
  const [bagHovered, setBagHovered] = useState(false);
  const [profileHovered, setProfileHovered] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [allCategories, setAllCategories] = useState([]);

  const { cartItems, removeFromCart } = useContext(CartContext);
  const { user, setUser } = useContext(AppContext);
  const { fetchMainCategory } = useProduct();
  const navigate = useNavigate();

  useEffect(() => {
    const loadNavData = async () => {
      try {
        const res = await fetchMainCategory();
        setAllCategories((res.data || []).filter((cat) => cat.isActive !== false));
      } catch (err) {
        console.error("Failed to load nav categories", err);
      }
    };
    loadNavData();

    // Fetch the full product catalog once, used for client-side search.
    const loadAllProducts = async () => {
      try {
        const res = await API.get("/product/all");
        setAllProducts(res.data.products || []);
      } catch (err) {
        console.error("Failed to load products for search", err);
      }
    };
    loadAllProducts();
  }, []);

  // Live search results: filter by category scope + text match on name or subCategory.
  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];

    return allProducts
      .filter((p) => searchCategory === "All" || p.mainCategory === searchCategory)
      .filter((p) => {
        const name = (p.name || "").toLowerCase();
        const sub = (p.subCategory || "").toLowerCase();
        return name.includes(query) || sub.includes(query);
      })
      .slice(0, 12);
  }, [searchQuery, searchCategory, allProducts]);

  const handleResultClick = () => {
    setSearchOpen(false);
    setSearchQuery("");
  };

  const handleRemove = async (id) => {
    if (window.confirm("Are you sure?")) {
      await removeFromCart(id);
    }
  };

  const handleLogout = async () => {
    try {
      await API.post("/auth/logout");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
      setProfileHovered(false);
      navigate("/login");
    }
  };

  return (
    <header
      className="w-full font-[Inter] shadow-sm bg-white relative z-[100]"
      onMouseLeave={() => setActiveMenu(null)}
    >
      {/* TOP BAR */}
      <div className="hidden md:flex w-full h-10 items-center justify-between text-white px-8 bg-black relative z-[110]">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-2 text-[11px] tracking-widest font-light">
            <FaPhoneAlt size={10} /> 1-888-923-8044
          </span>
          <span className="flex items-center gap-2 text-[11px] tracking-widest font-light">
            <IoMdMail size={12} /> HELP@MAURISH.COM
          </span>
        </div>
        <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-[0.15em]">
<Link to="/profile/orders" className="hover:text-gray-400 transition-colors">Track Order</Link>
          <Link to="/profile/support" className="hover:text-gray-400 transition-colors">Support</Link>
        </div>
      </div>

      {/* MAIN NAV */}
      <div className="w-full h-16 flex items-center justify-between px-6 bg-white border-b border-gray-50 relative">
        {/* Mobile Toggle */}
        <div className="md:hidden">
          <FaBars size={22} className="cursor-pointer" onClick={() => setMobileMenuOpen(true)} />
        </div>

        {/* DYNAMIC CATEGORIES (Desktop) */}
        <div className="hidden md:flex gap-10 items-center h-full">
          {allCategories.map((cat) => (
            <div
              key={cat._id}
              className="h-full flex items-center"
              onMouseEnter={() => setActiveMenu(cat)}
            >
              <Link
                to={`/shop/${cat.name.toLowerCase()}`}
                className={`text-[12px] font-bold uppercase tracking-[0.2em] transition-all pb-1 border-b-2 ${activeMenu?._id === cat._id
                  ? "border-black text-black"
                  : "border-transparent text-gray-700 hover:text-black"
                  }`}
              >
                {cat.name}
              </Link>
            </div>
          ))}
        </div>

        {/* LOGO */}
        <Link to="/" className="absolute left-1/2 -translate-x-1/2">
          <img className="h-8 md:h-10 object-contain" src="/images/logo.png" alt="Logo" />
        </Link>

        {/* ICONS */}
        <div className="flex items-center gap-5">
          <button onClick={() => setSearchOpen((prev) => !prev)} className="hover:text-black text-gray-600">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
          {/* PROFILE ICON WITH LOGIN/LOGOUT DROPDOWN */}
          <div
            className="relative h-full flex items-center"
            onMouseEnter={() => setProfileHovered(true)}
            onMouseLeave={() => setProfileHovered(false)}
          >
            <Link to={user ? "/profile/orders" : "/login"}>
              <GoPerson size={22} className="text-gray-600 hover:text-black" />
            </Link>

            {profileHovered && (
              <div className="hidden md:flex flex-col absolute right-0 top-full w-48 bg-white shadow-2xl border border-gray-100 z-[110]">
                {user ? (
                  <>
                    <div className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 border-b truncate">
                      {user.name || user.email}
                    </div>
                    <Link
                      to="/profile/orders"
                      className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50"
                    >
                      My Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50 text-red-500"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50"
                  >
                    Login
                  </Link>
                )}
              </div>
            )}
          </div>

          <Link to="/profile/wishlist" className="relative">
            <CiHeart size={24} className="text-gray-600 hover:text-black" />
          </Link>

          <div
            className="relative h-full flex items-center cursor-pointer"
            onMouseEnter={() => setBagHovered(true)}
            onMouseLeave={() => setBagHovered(false)}
          >
            <Link to="/shopping-bag" className="relative px-2 py-5 ">
              <span className="absolute -right-1 top-2 flex items-center justify-center w-4 h-4 text-[9px] bg-black rounded-full text-white font-bold">
                {cartItems.length}
              </span>
              <IoCartOutline size={24} className="text-gray-600 hover:text-black" />
            </Link>

            {bagHovered && cartItems.length > 0 && (
              <div className="hidden md:flex fixed top-[104px] right-0 w-80 h-[400px] bg-white shadow-2xl border border-gray-100 z-[110] flex-col animate-in fade-in slide-in-from-right-5">
                <div className="p-4 border-b font-bold text-[11px] uppercase tracking-widest">Bag Items ({cartItems.length})</div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {cartItems.map((item, idx) => (
                    <div key={idx} className="flex gap-3 items-center">
                      <img
                        className="w-14 h-16 object-cover bg-gray-100"
                        src={getProductImage(item.productId)}
                        alt=""
                        onError={(e) => { e.target.src = "/images/placeholder.png"; }}
                      />
                      <div className="flex-1">
                        <h4 className="text-[10px] font-bold uppercase truncate w-40">{item.productId?.name}</h4>
                        <p className="text-[9px] text-gray-400 uppercase tracking-tighter">Size: {item.size} | Qty: {item.quantity}</p>
                        <p className="text-[10px] font-bold mt-1">Rs. {item.productId?.price}</p>
                      </div>
                      <RiDeleteBin6Line onClick={() => handleRemove(item._id)} className="text-gray-300 hover:text-red-500 cursor-pointer" size={14} />
                    </div>
                  ))}
                </div>
                <div className="p-4">
                  <Link to="/shopping-bag" className="block w-full py-3 bg-black text-white text-center text-[10px] font-bold uppercase tracking-[0.2em]">Checkout</Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE MENU SIDEBAR (Fixed Sidebar) */}
      <div
        className={`fixed inset-0 bg-black/50 z-[200] transition-opacity duration-300 md:hidden ${mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={() => setMobileMenuOpen(false)}
      >
        <div
          className={`absolute left-0 top-0 h-full w-[280px] bg-white shadow-2xl transition-transform duration-300 ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 border-b">
            <img className="h-6 object-contain" src="/images/logo.png" alt="Logo" />
            <AiOutlineClose size={20} className="cursor-pointer" onClick={() => setMobileMenuOpen(false)} />
          </div>
          <div className="overflow-y-auto h-full pb-20">
            {allCategories.map((cat) => (
              <div key={cat._id} className="border-b">
                <div className="p-4 flex justify-between items-center bg-gray-50/50">
                  <Link
                    to={`/shop/${cat.name.toLowerCase()}`}
                    className="text-[11px] font-bold uppercase tracking-widest"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {cat.name}
                  </Link>
                </div>
                <div className="px-6 py-2">
                  {cat.subCategories?.map((group) => (
                    <div key={group._id} className="py-2">
                      <p className="text-[10px] font-extrabold text-[#635BFF] uppercase tracking-widest mb-1.5">
                        {group.name}
                      </p>
                      <div className="pl-2 space-y-1">
                        {(group.items || []).map((item) => (
                          <Link
                            key={item._id}
                            to={`/shop/${cat.name.toLowerCase()}/${slugify(item.name)}`}
                            className="block py-2 text-[10px] text-gray-600 uppercase tracking-widest"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {item.name}
                          </Link>
                        ))}
                        {(!group.items || group.items.length === 0) && (
                          <p className="text-[9px] text-gray-300 italic py-1">No items yet</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className="p-6 space-y-4">
              {user ? (
                <button
                  onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                  className="block text-[10px] uppercase tracking-widest font-bold text-red-500"
                >
                  Logout
                </button>
              ) : (
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block text-[10px] uppercase tracking-widest font-bold">
                  Login
                </Link>
              )}
<Link to="/profile/orders" onClick={() => setMobileMenuOpen(false)} className="block text-[10px] uppercase tracking-widest font-bold">Track Order</Link>
              <Link to="/profile/support" onClick={() => setMobileMenuOpen(false)} className="block text-[10px] uppercase tracking-widest font-bold">Support</Link>
            </div>
          </div>
        </div>
      </div>

      {/* MEGA MENU RENDER (Desktop Only) */}
      <div className="hidden md:block">
        {activeMenu && <MegaMenu mainCat={activeMenu} closeMenu={() => setActiveMenu(null)} />}
      </div>

      {/* SEARCH PANEL — category scope + live text search */}
      {searchOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-b shadow-xl z-[120] animate-in slide-in-from-top duration-300">
          <div className="max-w-3xl mx-auto p-6">
            <div className="flex items-center gap-3">
              {/* Category scope dropdown: All / Men / Women / Kids */}
              <select
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                className="border-b-2 border-black py-4 pr-2 outline-none text-sm font-bold uppercase tracking-wider bg-white shrink-0"
              >
                <option value="All">All</option>
                {allCategories.map((cat) => (
                  <option key={cat._id} value={cat.name}>{cat.name}</option>
                ))}
              </select>

              <div className="relative flex-1">
                <FiSearch className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  autoFocus
                  type="text"
                  placeholder="SEARCH FOR PRODUCTS, E.G. T-SHIRTS, HOODIES..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border-b-2 border-black py-4 pl-8 outline-none text-lg font-light tracking-widest uppercase"
                />
              </div>

              <AiOutlineClose
                className="cursor-pointer text-gray-400 shrink-0"
                size={20}
                onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
              />
            </div>

            {/* Live Results */}
            {searchQuery.trim() && (
              <div className="mt-6 max-h-[60vh] overflow-y-auto">
                {searchResults.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {searchResults.map((item) => (
                      <Link
                        key={item._id}
                        to={`/product/${item._id}`}
                        onClick={handleResultClick}
                        className="group"
                      >
                        <div className="aspect-[3/4] bg-gray-100 overflow-hidden rounded-sm">
                          <img
                            src={getProductImage(item)}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => { e.target.src = "/images/placeholder.png"; }}
                          />
                        </div>
                        <p className="text-[9px] text-gray-400 uppercase mt-2">{item.mainCategory} &middot; {item.subCategory}</p>
                        <h4 className="text-xs font-bold uppercase truncate">{item.name}</h4>
                        <p className="text-xs font-semibold">${item.price}</p>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 text-center py-10">
                    No products found for "{searchQuery}"{searchCategory !== "All" ? ` in ${searchCategory}` : ""}.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;