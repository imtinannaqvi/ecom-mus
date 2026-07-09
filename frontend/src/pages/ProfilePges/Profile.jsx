import React, { useContext, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Outlet, Link, useLocation } from "react-router-dom";
import { FaEdit, FaRoute, FaAsymmetrik, FaRegHeart, FaAward, FaPhoneAlt, FaLock, FaBars } from "react-icons/fa";
import { GoPackage } from "react-icons/go";
import { SlLocationPin } from "react-icons/sl";
import { MdOutlinePayment, MdNotificationsNone } from "react-icons/md";
import { LiaLanguageSolid } from "react-icons/lia";
import { GrLanguage } from "react-icons/gr";
import { FaAngleRight, FaXmark } from "react-icons/fa6";
import { AppContext } from "../../context/AppContextProvider";
import { IoPersonCircleOutline } from "react-icons/io5";


function Profile() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile toggle ke liye
  const{user} = useContext(AppContext)

 

  const menuSections = [
    {
      title: "Quick Links",
      links: [
        { name: "My Orders", path: "/profile/orders", icon: <GoPackage /> },
{ name: "Track Orders", path: "/profile/orders", icon: <FaRoute /> },
        { name: "Maurish Touchpoints", path: "/profile/touchpoints", icon: <FaAsymmetrik /> },
        { name: "My Wishlist", path: "/profile/wishlist", icon: <FaRegHeart /> },
      ],
    },
    {
      title: "My Account",
      links: [
        { name: "Address", path: "/profile/address", icon: <SlLocationPin /> },
        { name: "Payment", path: "/profile/payment", icon: <MdOutlinePayment /> },
{ name: "Return Policy", path: "/profile/orders", icon: <GoPackage /> },
      ],
    },
    {
      title: "Settings",
      links: [
        { name: "Country", path: "/profile/country", icon: <GrLanguage />, extra: "Pakistan" },
        { name: "Language", path: "/profile/language", icon: <LiaLanguageSolid />, extra: "English" },
        { name: "Security", path: "/profile/security", icon: <FaLock /> },
        { name: "Notification", path: "/profile/notifications", icon: <MdNotificationsNone /> },
        { name: "24/7 support", path: "/profile/support", icon: <FaPhoneAlt /> },
      ],
    },
  ];

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <section className="w-full max-w-[1440px] mx-auto p-4 md:p-10 flex-grow">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">My Profile</h1>
          {/* Mobile Menu Toggle Button */}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-2 border rounded-md"
          >
            {isSidebarOpen ? <FaXmark size={20} /> : <FaBars size={20} />}
          </button>
        </div>

        <div className="w-full flex flex-col lg:flex-row items-start gap-6">
          
          {/* Sidebar */}
          <aside className={`
            w-full lg:w-[25%] border border-gray-300 rounded-lg overflow-hidden bg-white transition-all duration-300
            ${isSidebarOpen ? "block" : "hidden lg:block"}
          `}>
            {/* Profile Info */}
            <div className="w-full border-b px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
              <IoPersonCircleOutline size={40} />

                <div>
                  <p className="text-xs text-gray-500">hello👋</p>
                  <h1 className="text-lg md:text-xl font-bold">{user.name}</h1>
                </div>
              </div>
              <FaEdit className="cursor-pointer text-gray-600 hover:text-black" />
            </div>

            {/* Render Sections */}
            <div className="max-h-[60vh] lg:max-h-none overflow-y-auto">
              {menuSections.map((section, idx) => (
                <div key={idx} className="w-full flex flex-col pt-4">
                  <h3 className="text-[10px] md:text-xs ml-4 font-bold text-gray-400 uppercase tracking-wider mb-2">
                    {section.title}
                  </h3>
                  {section.links.map((link) => {
                    const isActive = location.pathname === link.path;
                    return (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setIsSidebarOpen(false)} // Mobile pe link click hote hi menu band ho jaye
                        className={`w-full p-3 flex justify-between items-center transition-all ${
                          isActive ? "bg-black text-white" : "bg-transparent text-black hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-base md:text-lg">{link.icon}</span>
                          <span className="text-xs md:text-sm font-medium">{link.name}</span>
                        </div>
                        
                        {link.extra && (
                          <div className="flex items-center gap-1 text-[10px] md:text-xs opacity-70">
                            {link.extra} <FaAngleRight />
                          </div>
                        )}
                      </Link>
                    );
                  })}
                </div>
              ))}
            </div>
          </aside>

          {/* Dynamic Content Area */}
          <div className="w-full lg:w-[75%] min-h-[400px]">
            <Outlet />
          </div>

        </div>
      </section>


    </main>
  );
}

export default Profile;