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
import { FiMoreVertical, FiTag } from 'react-icons/fi';

const Sidebar = ({ isOpen = true, onToggle }) => {
  const [isProductsOpen, setIsProductsOpen] = useState(true);
  const location = useLocation();

  const logoText = "Maurish";
  const isProductsActive = location.pathname.includes('/admin/products') || location.pathname.includes('/admin/product/new');

  return (
    <>
      {/* Mobile Backdrop Overlay - dims screen and closes sidebar when clicking outside */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-xs z-40 md:hidden transition-opacity"
          onClick={onToggle}
        />
      )}

      {/* Sidebar Container */}
      <div className={`w-64 h-screen bg-white border-r border-gray-100 text-[#5D6B82] p-6 fixed left-0 top-0 flex flex-col font-sans select-none z-50 transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>

        {/* Logo */}
        <div className="mb-8 px-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#635BFF]">
              <path d="M12 20C14.2091 20 16 18.2091 16 16C16 13.7909 14.2091 12 12 12C9.79086 12 8 13.7909 8 16C8 18.2091 9.79086 20 12 20Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M20 20C22.2091 20 24 18.2091 24 16C24 13.7909 22.2091 12 20 12C17.7909 12 16 13.7909 16 16C16 18.2091 17.7909 20 20 20Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-2xl font-bold text-[#1E1B4B] tracking-tight">{logoText}</span>
          </div>
          <button type="button" onClick={onToggle}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-[#1E1B4B] transition">
            <FiMoreVertical size={16} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar">

          <NavLink to="/admin/dashboard"
            onClick={() => window.innerWidth < 768 && onToggle()}
            className={({ isActive }) => `flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-150 ${isActive ? "text-[#635BFF] font-semibold" : "text-[#5D6B82] hover:text-[#1E1B4B]"}`}>
            <LuLayoutDashboard className="text-xl" />
            <span className="text-[15px]">Dashboard</span>
          </NavLink>

          {/* Products Dropdown */}
          <div>
            <button onClick={() => setIsProductsOpen(!isProductsOpen)}
              className={`w-full flex items-center justify-between px-3 py-3 rounded-xl transition-all duration-150 ${isProductsActive ? "text-[#635BFF] font-semibold" : "text-[#5D6B82] hover:text-[#1E1B4B]"}`}>
              <div className="flex items-center gap-4">
                <LuPackage className="text-xl" />
                <span className="text-[15px]">Products</span>
              </div>
              {isProductsOpen ? <LuChevronUp className="text-lg" /> : <LuChevronDown className="text-lg" />}
            </button>

            {isProductsOpen && (
              <div className="mt-1 space-y-1">
                <NavLink to="/admin/products"
                  onClick={() => window.innerWidth < 768 && onToggle()}
                  className={({ isActive }) => `flex items-center pl-12 pr-3 py-2.5 rounded-xl text-[14px] font-medium transition-all duration-150 ${isActive ? "bg-[#F5F3FF] text-[#635BFF]" : "text-[#5D6B82] hover:text-[#1E1B4B]"}`}>
                  Product List
                </NavLink>
                <NavLink to="/admin/category"
                  onClick={() => window.innerWidth < 768 && onToggle()}
                  className={({ isActive }) => `flex items-center pl-12 pr-3 py-2.5 rounded-xl text-[14px] font-medium transition-all duration-150 ${isActive ? "bg-[#F5F3FF] text-[#635BFF]" : "text-[#5D6B82] hover:text-[#1E1B4B]"}`}>
                  Category List
                </NavLink>
              </div>
            )}
          </div>

          <NavLink to="/admin/orders"
            onClick={() => window.innerWidth < 768 && onToggle()}
            className={({ isActive }) => `flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-150 ${isActive ? "text-[#635BFF] font-semibold" : "text-[#5D6B82] hover:text-[#1E1B4B]"}`}>
            <LuTag className="text-xl rotate-90" />
            <span className="text-[15px]">Sales</span>
          </NavLink>

          <NavLink to="/admin/users"
            onClick={() => window.innerWidth < 768 && onToggle()}
            className={({ isActive }) => `flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-150 ${isActive ? "text-[#635BFF] font-semibold" : "text-[#5D6B82] hover:text-[#1E1B4B]"}`}>
            <LuUsers className="text-xl" />
            <span className="text-[15px]">Customers</span>
          </NavLink>

          <NavLink to="/admin/report"
            onClick={() => window.innerWidth < 768 && onToggle()}
            className={({ isActive }) => `flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-150 ${isActive ? "text-[#635BFF] font-semibold" : "text-[#5D6B82] hover:text-[#1E1B4B]"}`}>
            <LuTrendingUp className="text-xl" />
            <span className="text-[15px]">Report</span>
          </NavLink>

          <NavLink to="/admin/notification"
            onClick={() => window.innerWidth < 768 && onToggle()}
            className={({ isActive }) => `flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-150 ${isActive ? "text-[#635BFF] font-semibold" : "text-[#5D6B82] hover:text-[#1E1B4B]"}`}>
            <LuBell className="text-xl" />
            <span className="text-[15px]">Notifications</span>
          </NavLink>

          <NavLink to="/admin/coupons"
            onClick={() => window.innerWidth < 768 && onToggle()}
            className={({ isActive }) => `flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-150 ${isActive ? "text-[#635BFF] font-semibold" : "text-[#5D6B82] hover:text-[#1E1B4B]"}`}>
            <FiTag className="text-xl" />
            <span className="text-[15px]">Coupons</span>
          </NavLink>

          <NavLink to="/admin/setting"
            onClick={() => window.innerWidth < 768 && onToggle()}
            className={({ isActive }) => `flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-150 ${isActive ? "text-[#635BFF] font-semibold" : "text-[#5D6B82] hover:text-[#1E1B4B]"}`}>
            <LuSettings className="text-xl" />
            <span className="text-[15px]">Setting</span>
          </NavLink>

        </nav>
      </div>
    </>
  );
};

export default Sidebar;