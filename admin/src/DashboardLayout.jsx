import React from 'react';
import { Outlet } from 'react-router-dom'; // ✅ Import Outlet for switching pages
import Sidebar from './components/Sidebar';

function DashboardLayout() {
  return (
    <div className="flex bg-[#F8FAFC] min-h-screen">
      <Sidebar />

\      <main className="flex-1 pl-64 min-h-screen flex flex-col">
        
        <header className="w-full h-16 bg-white border-b border-gray-100 sticky top-0 z-10 flex items-center px-8 justify-between">
          <div className="text-sm font-medium text-gray-400">
            Admin Panel / Control Desk
          </div>
          <div className="w-8 h-8 rounded-full bg-[#635BFF] text-white flex items-center justify-center font-bold text-xs shadow-sm">
            M
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