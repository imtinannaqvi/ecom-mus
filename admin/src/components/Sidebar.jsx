import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LuLayoutDashboard,
  LuPackage,
  LuTag,
  LuUsers,
  LuTrendingUp,
  LuBell,
  LuSettings,
  LuChevronUp,
  LuChevronDown
} from 'react-icons/lu';
import { FiMoreVertical, FiTag, FiMessageSquare, FiMail } from 'react-icons/fi';

const Sidebar = ({ isOpen = true, onToggle }) => {
  const [isProductsOpen, setIsProductsOpen] = useState(true);
  const location = useLocation();

  const logoText = "Maurish";
  const isProductsActive =
    location.pathname.includes('/admin/products') ||
    location.pathname.includes('/admin/product/new') ||
    location.pathname.includes('/admin/category');

  const closeOnMobile = () => {
    if (window.innerWidth < 768) onToggle();
  };

  // py-2.5 (was py-3) — across 10 items this reclaims enough vertical space
  // to stop the nav overflowing and showing a scrollbar.
  const linkClass = ({ isActive }) => `
    flex items-center gap-4 py-2.5 rounded-xl transition-all duration-150
    ${isOpen ? "px-3" : "px-3 md:px-0 md:justify-center"}
    ${isActive ? "text-[#635BFF] font-semibold" : "text-[#5D6B82] hover:text-[#1E1B4B]"}
  `;

  const labelClass = `text-[15px] whitespace-nowrap ${isOpen ? "" : "md:hidden"}`;

  // Contact now lives IN this array (it was hardcoded below before, which meant
  // it never got the collapsed icon-rail treatment and its label would still
  // render at 80px width, breaking the layout).
  const navItems = [
    { to: "/admin/dashboard",    icon: <LuLayoutDashboard className="text-xl shrink-0" />, label: "Dashboard" },
    { to: "/admin/orders",       icon: <LuTag className="text-xl rotate-90 shrink-0" />,   label: "Sales" },
    { to: "/admin/users",        icon: <LuUsers className="text-xl shrink-0" />,           label: "Customers" },
    { to: "/admin/report",       icon: <LuTrendingUp className="text-xl shrink-0" />,      label: "Report" },
    { to: "/admin/notification", icon: <LuBell className="text-xl shrink-0" />,            label: "Notifications" },
    { to: "/admin/coupons",      icon: <FiTag className="text-xl shrink-0" />,             label: "Coupons" },
    { to: "/admin/reviews",      icon: <FiMessageSquare className="text-xl shrink-0" />,   label: "Reviews" },
    { to: "/admin/contact",      icon: <FiMail className="text-xl shrink-0" />,            label: "Contact" },
    { to: "/admin/setting",      icon: <LuSettings className="text-xl shrink-0" />,        label: "Setting" },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay — dims screen and closes sidebar when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={onToggle}
        />
      )}

      <aside
        className={`
          h-screen bg-white border-r border-gray-100 text-[#5D6B82] py-5
          fixed left-0 top-0 flex flex-col font-sans select-none z-50
          transition-all duration-300 ease-in-out
          ${isOpen
            ? "w-64 px-6 translate-x-0"
            : "w-64 px-6 -translate-x-full md:translate-x-0 md:w-20 md:px-3"
          }
        `}
      >

        {/* Logo row — mb-6 (was mb-8) to reclaim vertical space */}
        <div className={`mb-6 flex items-center gap-2 shrink-0 ${isOpen ? "px-2 justify-between" : "px-2 justify-between md:px-0 md:justify-center"}`}>
          <div className="flex items-center gap-2 min-w-0">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#635BFF] shrink-0">
              <path d="M12 20C14.2091 20 16 18.2091 16 16C16 13.7909 14.2091 12 12 12C9.79086 12 8 13.7909 8 16C8 18.2091 9.79086 20 12 20Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M20 20C22.2091 20 24 18.2091 24 16C24 13.7909 22.2091 12 20 12C17.7909 12 16 13.7909 16 16C16 18.2091 17.7909 20 20 20Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className={`text-2xl font-bold text-[#1E1B4B] tracking-tight truncate ${isOpen ? "" : "md:hidden"}`}>
              {logoText}
            </span>
          </div>

          <button
            type="button"
            onClick={onToggle}
            title={isOpen ? "Collapse sidebar" : "Expand sidebar"}
            className={`w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-[#1E1B4B] transition shrink-0 ${isOpen ? "" : "md:hidden"}`}
          >
            <FiMoreVertical size={16} />
          </button>
        </div>

        {!isOpen && (
          <button
            type="button"
            onClick={onToggle}
            title="Expand sidebar"
            className="hidden md:flex w-full h-9 items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100 hover:text-[#1E1B4B] transition mb-2 shrink-0"
          >
            <FiMoreVertical size={16} />
          </button>
        )}

        {/* Nav */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto overflow-x-hidden no-scrollbar">

          {/* Dashboard */}
          <NavLink
            to={navItems[0].to}
            onClick={closeOnMobile}
            title={navItems[0].label}
            className={linkClass}
          >
            {navItems[0].icon}
            <span className={labelClass}>{navItems[0].label}</span>
          </NavLink>

          {/* Products — accordion when expanded, single icon when collapsed */}
          {isOpen ? (
            <div>
              <button
                onClick={() => setIsProductsOpen(!isProductsOpen)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-150 ${
                  isProductsActive ? "text-[#635BFF] font-semibold" : "text-[#5D6B82] hover:text-[#1E1B4B]"
                }`}
              >
                <div className="flex items-center gap-4">
                  <LuPackage className="text-xl shrink-0" />
                  <span className="text-[15px] whitespace-nowrap">Products</span>
                </div>
                {isProductsOpen ? <LuChevronUp className="text-lg" /> : <LuChevronDown className="text-lg" />}
              </button>

              {isProductsOpen && (
                <div className="mt-0.5 space-y-0.5">
                  <NavLink
                    to="/admin/products"
                    onClick={closeOnMobile}
                    className={({ isActive }) => `flex items-center pl-12 pr-3 py-2 rounded-xl text-[14px] font-medium transition-all duration-150 ${
                      isActive ? "bg-[#F5F3FF] text-[#635BFF]" : "text-[#5D6B82] hover:text-[#1E1B4B]"
                    }`}
                  >
                    Product List
                  </NavLink>
                  <NavLink
                    to="/admin/category"
                    onClick={closeOnMobile}
                    className={({ isActive }) => `flex items-center pl-12 pr-3 py-2 rounded-xl text-[14px] font-medium transition-all duration-150 ${
                      isActive ? "bg-[#F5F3FF] text-[#635BFF]" : "text-[#5D6B82] hover:text-[#1E1B4B]"
                    }`}
                  >
                    Category List
                  </NavLink>
                </div>
              )}
            </div>
          ) : (
            <NavLink
              to="/admin/products"
              onClick={closeOnMobile}
              title="Products"
              className={`flex items-center gap-4 py-2.5 rounded-xl transition-all duration-150 px-3 md:px-0 md:justify-center ${
                isProductsActive ? "text-[#635BFF] font-semibold" : "text-[#5D6B82] hover:text-[#1E1B4B]"
              }`}
            >
              <LuPackage className="text-xl shrink-0" />
              <span className="text-[15px] whitespace-nowrap md:hidden">Products</span>
            </NavLink>
          )}

          {/* Everything else — Contact included, so it collapses correctly */}
          {navItems.slice(1).map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={closeOnMobile}
              title={label}
              className={linkClass}
            >
              {icon}
              <span className={labelClass}>{label}</span>
            </NavLink>
          ))}

        </nav>
      </aside>
    </>
  );
};

export default Sidebar;