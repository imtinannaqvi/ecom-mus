import React, { useState, useRef, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom'; // ✅ Import Outlet for switching pages
import { FiMoreVertical } from 'react-icons/fi';
import Sidebar from './components/Sidebar';
import { useAdmin } from './context/AdminContext';

function DashboardLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
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

      {/* Small floating reopen button — appears only when the sidebar is collapsed */}
      {!sidebarOpen && (
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="fixed left-3 top-3 z-40 w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-gray-100 shadow-md text-gray-500 hover:text-[#1E1B4B] hover:bg-gray-50 transition"
          title="Expand sidebar"
        >
          <FiMoreVertical size={18} />
        </button>
      )}

      <main
        className={`flex-1 min-h-screen flex flex-col transition-[padding] duration-300 ease-in-out ${
          sidebarOpen ? "pl-64" : "pl-0"
        }`}
      >

        <header className="w-full h-16 bg-white border-b border-gray-100 sticky top-0 z-10 flex items-center px-8 justify-between">
          <div className="text-sm font-medium text-gray-400">
            Admin Panel / Control Desk
          </div>

          <div className="relative" ref={menuRef}>
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

        <div className="flex-1 p-6 lg:p-8">
          <Outlet />
        </div>

      </main>
    </div>
  );
}

export default DashboardLayout;