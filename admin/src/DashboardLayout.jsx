import React, { useState, useRef, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import { useAdmin } from './context/AdminContext';

function DashboardLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Default: open on desktop (md+), closed (overlay) on mobile.
  const [sidebarOpen, setSidebarOpen] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth >= 768 : true
  );

  const menuRef = useRef(null);
  const { admin, logout } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/login');
  };

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen((prev) => !prev)} />

      {/*
        Content padding must match the sidebar's ACTUAL width at each state:
          - expanded  → sidebar is 16rem (w-64)  → pl-64
          - collapsed → sidebar is 5rem  (w-20)  → pl-20   ← was pl-0, which let
            the content slide underneath the icon rail and get clipped.
        On mobile the sidebar is an overlay drawer, so no padding at any state.
      */}
      <main
        className={`flex-1 min-w-0 min-h-screen flex flex-col transition-[padding] duration-300 ease-in-out ${
          sidebarOpen ? "md:pl-64" : "md:pl-20"
        }`}
      >
        <header className="w-full h-16 bg-white border-b border-gray-100 sticky top-0 z-10 flex items-center px-4 sm:px-8 justify-between">
          <div className="text-sm font-medium text-gray-400 truncate">
            Admin Panel / Control Desk
          </div>

          <div className="relative shrink-0" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="w-8 h-8 rounded-full bg-[#635BFF] text-white flex items-center justify-center font-bold text-xs shadow-sm hover:opacity-90 transition"
            >
              {admin?.name ? admin.name.charAt(0).toUpperCase() : "M"}
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full mt-2 w-44 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden z-20">
                {admin?.email && (
                  <div className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 border-b truncate">
                    {admin.email}
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-red-500 hover:bg-red-50 transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout;