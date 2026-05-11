import React, { useContext, useState } from "react";
import {
  FaPhoneAlt,
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaBars,
} from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { AiOutlineClose } from "react-icons/ai";
import { Link } from "react-router-dom";
import { RiDeleteBin6Line } from "react-icons/ri";
import { GoPerson } from "react-icons/go";
import { CiHeart } from "react-icons/ci";
import { IoCartOutline } from "react-icons/io5";
import { AppContext } from "../context/AppContextProvider";

// --- REUSABLE MEGA MENU (Desktop) ---
const MegaMenu = ({ data, closeMenu, category }) => {
  return (
    <>
      <div
        className="fixed inset-0 top-[104px] bg-black/20 backdrop-blur-sm z-40"
        onClick={closeMenu}
      />
      <div
        className="absolute left-0 top-full w-full bg-black text-gray-800 py-10 px-8 shadow-2xl z-50 border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-300"
        onMouseLeave={closeMenu}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-5 gap-8">
          {data.map((section, index) => (
            <div
              key={index}
              className="px-4 border-r last:border-none border-gray-100"
            >
              <h3 className="text-sm font-bold mb-5 tracking-widest uppercase text-black">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <Link
                      to={`/shop/${category}/-${link.toLowerCase().replace(/\s+/g, "-")}`}
                      onClick={closeMenu}
                      className="text-[14px] text-gray-500 hover:text-white transition-all inline-block hover:translate-x-1"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

function Header({category}) {
  const [activeMenu, setActiveMenu] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [bagHovered, setBagHovered] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cartItem, setCartItem } = useContext(AppContext); // Cart items array

  const menuContent = {
    men: [
      {
        title: "Top Wear",
        links: [
          "All Top wear",
          "All T-Shirts",
          "Classic Fit T-Shirts",
          "Oversized T-Shirts",
          "All Shirts",
        ],
      },
      {
        title: "Bottom wear",
        links: [
          "All Bottom wear",
          "Joggers",
          "Trousers & Pants",
          "Jeans",
          "Shorts",
        ],
      },
      {
        title: "Plus Size",
        links: [
          "All Plus-Size",
          "All Top wear",
          "All Bottom wear",
          "All T-Shirts",
        ],
      },
      {
        title: "Footwear",
        links: ["Maurish Sneakers", "Slider", "Casual Shoes"],
      },
      {
        title: "Accessories",
        links: ["Mobile Covers", "Backpacks", "Sunglasses", "Caps"],
      },
    ],
    women: [
      {
        title: "Ethnic Wear",
        links: ["Kurtas & Suits", "Sarees", "Ethnic Dresses", "Lehenga Cholis"],
      },
      {
        title: "Western Wear",
        links: ["Tops", "Dresses", "T-shirts", "Jeans", "Trousers"],
      },
      { title: "Footwear", links: ["Flats", "Heels", "Casual Shoes", "Boots"] },
      { title: "Lingerie", links: ["Bra", "Briefs", "Nightwear", "Shapewear"] },
      {
        title: "Beauty",
        links: ["Makeup", "Skincare", "Haircare", "Fragrances"],
      },
    ],
    kids: [
      {
        title: "Boys Clothing",
        links: ["T-Shirts", "Shirts", "Shorts", "Jeans", "Trousers"],
      },
      {
        title: "Girls Clothing",
        links: ["Dresses", "Tops", "T-shirts", "Lehenga Choli", "Kurta Sets"],
      },
      {
        title: "Footwear",
        links: ["Casual Shoes", "Flipflops", "Sandals", "Heels"],
      },
      {
        title: "Infants",
        links: ["Bodysuits", "Rompers", "Clothing Sets", "Sleepwear"],
      },
      {
        title: "Toys",
        links: ["Soft Toys", "Action Figures", "Learning & Education"],
      },
    ],
  };

  return (
    <header
      className="w-full font-[Inter] shadow-md bg-white relative z-[100]"
      onMouseLeave={() => setActiveMenu(null)}
    >
      {/* 1. TOP BLACK BAR (Hidden on mobile) */}
      <div className="hidden md:flex w-full h-10 items-center justify-between text-white px-6 bg-black relative z-[110]">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-2 text-[11px] tracking-wider">
            <FaPhoneAlt size={10} /> 1-888-923-8044
          </span>
          <span className="flex items-center gap-2 text-[11px] tracking-wider">
            <IoMdMail size={12} /> HELP@MAURISH.COM
          </span>
        </div>
        <div className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-widest">
          <div className="flex gap-3 items-center">
            <FaFacebookF className="hover:text-blue-500 cursor-pointer" />
            <FaInstagram className="hover:text-pink-500 cursor-pointer" />
            <FaTwitter className="hover:text-blue-400 cursor-pointer" />
          </div>
          <span className="h-3 w-[1px] bg-gray-700 mx-2"></span>
          <Link
            to="/profile/track"
            className="hover:text-red-500 transition-colors"
          >
            Track Order
          </Link>
          <Link
            to="/profile/support"
            className="hover:text-red-500 transition-colors"
          >
            Contact us
          </Link>
        </div>
      </div>

      {/* 2. MAIN NAVBAR */}
      <div className="w-full h-16 flex items-center justify-between px-4 md:px-6 bg-white relative">
        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <FaBars
            size={22}
            className="cursor-pointer"
            onClick={() => setMobileMenuOpen(true)}
          />
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-8 items-center h-full">
          {["men", "women", "kids"].map((cat) => (
            <div
              key={cat}
              className="h-full flex items-center"
              onMouseEnter={() => setActiveMenu(cat)}
            >
              <Link
                to={`/shop/${category}/${cat.links}`}
                className={`text-[14px] font-bold uppercase transition-all pb-1 border-b-2 ${
                  activeMenu === cat
                    ? "border-black text-black"
                    : "border-transparent text-gray-500 hover:text-black"
                }`}
              >
                {cat}
              </Link>
            </div>
          ))}
        </div>

        {/* LOGO */}
        <Link to="/" className="absolute left-1/2 -translate-x-1/2">
          <img
            className="h-7 md:h-9 object-contain"
            src="/images/logo.png"
            alt="Maurish Logo"
          />
        </Link>

        {/* ACTION ICONS */}
        <div className="flex items-center gap-4 md:gap-6">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="hover:text-red-600 transition-colors"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>

          <Link to="/profile/orders" className="hidden sm:block">
            <GoPerson size={22} className="hover:text-red-600" />
          </Link>
          <Link to="/profile/wishlist">
            <CiHeart size={24} className="hover:text-red-600" />
          </Link>

          {/* SHOPPING BAG WRAPPER */}
          <div
            className="relative  h-full py-5 px-4"
            onMouseEnter={() => setBagHovered(true)}
            onMouseLeave={() => setBagHovered(false)}
          >
            <Link to="/shopping-bag" className="relative">
              <span className="absolute -right-2 -top-2 flex items-center justify-center w-4 h-4 text-[9px] bg-black rounded-full text-white font-bold">
                {cartItem.length}
              </span>
              <IoCartOutline size={24} />
            </Link>

            {/* Shopping Bag Sidebar (Desktop Hover UI) */}
            {bagHovered && (
              <div className="hidden md:flex fixed top-[104px] right-0 w-80 h-[calc(100vh-104px)] bg-white shadow-2xl border-l border-gray-100 z-[110] flex-col animate-in slide-in-from-right duration-300">
                <div className="p-5 border-b flex justify-between items-center text-black">
                  <h2 className="font-bold text-sm uppercase tracking-widest">
                    Your Bag ({cartItem.length})
                  </h2>
                  <AiOutlineClose
                    className="cursor-pointer"
                    onClick={() => setBagHovered(false)}
                  />
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                  {cartItem.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center gap-4">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                        <IoCartOutline size={30} className="text-gray-300" />
                      </div>
                      <p className="text-gray-400 text-xs">
                        Your shopping bag is empty.
                      </p>
                      <Link
                        to="/"
                        className="text-xs font-bold underline uppercase tracking-widest text-black"
                      >
                        Start Shopping
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cartItem.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex gap-3 pb-4 border-b border-gray-50"
                        >
                          <img
                            className="w-20 h-24 object-cover rounded"
                            src={item.images}
                            alt=""
                          />
                          <div className="flex-1 flex flex-col justify-between py-1">
                            <div>
                              <h4 className="text-[11px] font-bold uppercase text-black leading-tight">
                                {item.name}
                              </h4>
                              <p className="text-[11px] text-gray-500 mt-1">
                                Size: {item.size} | Color: {item.color}
                              </p>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold text-black">
                                ${item.price}
                              </span>
                              <RiDeleteBin6Line
                                className="text-red-400 cursor-pointer hover:text-red-600"
                                size={14}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {cartItem.length > 0 && (
                  <div className="p-5 bg-gray-50 border-t">
                    <Link
                      to="/shopping-bag"
                      className="block w-full py-3 bg-black text-white text-center text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
                    >
                      Proceed to Shopping bag
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. MOBILE SIDEBAR MENU (Drawer) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[200] md:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="absolute left-0 top-0 w-[80%] max-w-[300px] h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
            <div className="p-5 border-b flex justify-between items-center">
              <img className="h-6" src="/images/logo.png" alt="Logo" />
              <AiOutlineClose
                size={20}
                className="text-black"
                onClick={() => setMobileMenuOpen(false)}
              />
            </div>

            <div className="flex-1 overflow-y-auto">
              {Object.keys(menuContent).map((cat) => (
                <div key={cat} className="border-b">
                  <details className="group">
                    <summary className="flex items-center justify-between p-4 font-bold uppercase text-sm cursor-pointer list-none text-black">
                      {cat}
                      <span className="transition group-open:rotate-180">
                        ▼
                      </span>
                    </summary>
                    <div className="bg-gray-50 p-4 pt-0 space-y-3">
                      {menuContent[cat].map((section, sIdx) => (
                        <div key={sIdx}>
                          <p className="text-[12px] font-bold text-black uppercase mb-1">
                            {section.title}
                          </p>
                          <div className="flex flex-col gap-2 pl-2">
                            {section.links.slice(0, 3).map((link, lIdx) => (
                              <Link
                                key={lIdx}
                                to={`/shop/${category}/${cat}`}
                                className="text-sm text-gray-600"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                {link}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </details>
                </div>
              ))}
              <div className="p-4 space-y-4">
                <Link
                  to="/profile/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-medium text-black"
                >
                  My Account
                </Link>
                <Link
                  to="/profile/track"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-medium text-black"
                >
                  Track Order
                </Link>
                <Link
                  to="/profile/support"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-medium text-black"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MEGA MENU COMPONENT (Desktop) */}
      <div className="hidden md:block">
        {activeMenu && (
          <MegaMenu
            category={activeMenu}
            data={menuContent[activeMenu]}
            closeMenu={() => setActiveMenu(null)}
          />
        )}
      </div>

      {/* SEARCH OVERLAY */}
      {searchOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-t p-4 shadow-xl z-[120] animate-in slide-in-from-top duration-200">
          <div className="max-w-3xl mx-auto flex items-center border rounded-full px-4 py-2 bg-gray-50">
            <input
              autoFocus
              type="text"
              placeholder="Search for products..."
              className="flex-1 bg-transparent outline-none text-sm p-1 text-black"
            />
            <AiOutlineClose
              className="cursor-pointer text-gray-400"
              onClick={() => setSearchOpen(false)}
            />
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
