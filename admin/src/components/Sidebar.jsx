import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiGrid, FiShoppingBag, FiPlusSquare, FiUsers, FiLayers } from 'react-icons/fi';

const Sidebar = () => {
  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <FiGrid /> },
    { name: "All Products", path: "/admin/products", icon: <FiShoppingBag /> },
    { name: "Create Product", path: "/admin/product/new", icon: <FiPlusSquare /> },
    { name: "Create Category", path: "/admin/category/new", icon: <FiPlusSquare /> },
    { name: "Orders", path: "/admin/orders", icon: <FiLayers /> },
    { name: "Users", path: "/admin/users", icon: <FiUsers /> },
  ];

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 text-gray-800 p-5 fixed left-0 top-0">
      <div className="mb-10 px-2">
        <h1 className="text-2xl font-bold text-black tracking-tighter italic">MAURISH ADMIN</h1>
      </div>
      
      <nav className="space-y-2">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                isActive 
                ? "bg-black text-white shadow-md" 
                : "text-gray-500 hover:bg-gray-100 hover:text-black"
              }`
            }
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;