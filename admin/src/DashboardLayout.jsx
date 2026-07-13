import React, { useState, useRef, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { FiMenu } from 'react-icons/fi';
import Sidebar from './components/Sidebar';
import { useAdmin } from './context/AdminContext';

function DashboardLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Default: open on desktop (md+), closed (overlay drawer) on mobile.
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
          - expanded  → sidebar is 16rem (w-64) → pl-64
          - collapsed → sidebar is 5rem  (w-20) → pl-20
        On mobile the sidebar is an overlay drawer, so no padding at any state.
      */}
      <main
        className={`flex-1 min-w-0 min-h-screen flex flex-col transition-[padding] duration-300 ease-in-out ${
          sidebarOpen ? "md:pl-64" : "md:pl-20"
        }`}
      >
        <header className="w-full h-16 bg-white border-b border-gray-100 sticky top-0 z-10 flex items-center px-4 sm:px-8 justify-between gap-3">

          <div className="flex items-center gap-3 min-w-0">
            {/*
              Mobile-only hamburger. Below md the sidebar is a drawer that slides
              fully off-screen, so this is the ONLY way back in. Hidden at md+
              because the collapsed icon rail has its own expand button.
            */}
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
              className="md:hidden w-9 h-9 shrink-0 flex items-center justify-center rounded-xl border border-gray-100 text-gray-500 hover:text-[#1E1B4B] hover:bg-gray-50 transition"
            >
              <FiMenu size={18} />
            </button>

            <div className="text-sm font-medium text-gray-400 truncate">
              Admin Panel / Control Desk
            </div>
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