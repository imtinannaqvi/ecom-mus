import React from 'react';
import { 
  FiShoppingBag, 
  FiDollarSign, 
  FiPercent, 
  FiUsers, 
  FiPlus, 
  FiAlertCircle, 
  FiCheckCircle, 
  FiChevronDown 
} from 'react-icons/fi';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts';

const Dashboard = () => {
  // 1. Mini-graphs data for Top Metrics
  const miniGraphData = [
    { value: 30 }, { value: 40 }, { value: 35 }, { value: 50 }, { value: 45 }, { value: 60 }
  ];

  // 2. Main Sales Performance Complex Area Graph Data
  const salesPerformanceData = [
    { name: 'Jan', sales: 2500 },
    { name: 'Feb', sales: 2100 },
    { name: 'Mar', sales: 2800 },
    { name: 'Apr', sales: 2400 },
    { name: 'May', sales: 4300 },
    { name: 'Jun', sales: 4000 },
    { name: 'Jul', sales: 4200 },
    { name: 'Aug', sales: 4100 },
    { name: 'Sep', sales: 3400 },
    { name: 'Oct', sales: 3100 },
    { name: 'Nov', sales: 4800 },
    { name: 'Dec', sales: 4200 },
  ];

  // 3. Right Sidebar Mock Activities Data
  const recentActivities = [
    { id: 1, type: "New Order #0901", desc: "Lucy James", time: "48m ago", tag: "Order", color: "text-blue-500 bg-blue-50", badge: "bg-[#E0F2FE] text-[#0369A1]" },
    { id: 2, type: "Low Product", desc: "Gucci Bag", time: "2hrs ago", tag: "Low Product", color: "text-red-500 bg-red-50", badge: "bg-[#FEE2E2] text-[#B91C1C]" },
    { id: 3, type: "New Vendor", desc: "Gloria's Fashion", time: "2hrs ago", tag: "Vendor", color: "text-purple-500 bg-purple-50", badge: "bg-[#F5F3FF] text-[#635BFF]" },
    { id: 4, type: "Support Ticket Opened", desc: "Vendor: TechHub", time: "5hrs ago", tag: "Support", color: "text-orange-500 bg-orange-50", badge: "bg-[#FFEDD5] text-[#C2410C]" },
    { id: 5, type: "Refund Processed", desc: "Order #3210", time: "10hrs ago", tag: "Refund", color: "text-emerald-500 bg-emerald-50", badge: "bg-[#DCFCE7] text-[#15803D]" },
  ];

  // 4. Lower Left Complete Top Products List
  const topProducts = [
    { name: "iPhone 15 Pro Max", stocks: 3900, orders: 390, price: "$253.82", sales: 3300, status: "In Stock", earnings: "$1,890.00" },
    { name: "Prada Perfume", stocks: 3900, orders: 390, price: "$253.82", sales: 3300, status: "In Stock", earnings: "$1,890.00" },
  ];

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen font-sans text-[#1E293B]">
      
      {/* Top Main CTA Banner Row */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-[#1E1B4B]">Maurish Overview</h1>
        <button className="bg-[#1E1B4B] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-opacity-95 shadow-sm transition">
          Generate Sales Report
        </button>
      </div>

      {/* Grid wrapper splits layout to Left main stream & Right updates stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ================= LEFT 8-COLUMNS COMPONENT SECTION ================= */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Top Row Quad Micro Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            
            {/* Card 1: Total Orders */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center h-28">
              <div className="flex flex-col justify-between h-full">
                <span className="text-xs text-gray-400 font-semibold flex items-center gap-1.5">
                  <FiShoppingBag className="text-cyan-500 text-sm" /> Total Orders
                </span>
                <span className="text-2xl font-bold text-[#1E1B4B] tracking-tight">59,000</span>
                <span className="text-[11px] text-emerald-600 font-bold">↑ 21.01% <span className="text-gray-400 font-medium">vs Last month</span></span>
              </div>
              <div className="w-20 h-12">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={miniGraphData}>
                    <Area type="monotone" dataKey="value" stroke="#0EA5E9" fill="transparent" strokeWidth={1.5} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Card 2: Total Revenue */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center h-28">
              <div className="flex flex-col justify-between h-full">
                <span className="text-xs text-gray-400 font-semibold flex items-center gap-1.5">
                  <FiDollarSign className="text-purple-500 text-sm" /> Total Revenue
                </span>
                <span className="text-2xl font-bold text-[#1E1B4B] tracking-tight">$350K</span>
                <span className="text-[11px] text-emerald-600 font-bold">↑ 11.04% <span className="text-gray-400 font-medium">vs Last month</span></span>
              </div>
              <div className="w-20 h-12">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={miniGraphData}>
                    <Area type="monotone" dataKey="value" stroke="#635BFF" fill="transparent" strokeWidth={1.5} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Card 3: Conversion Rate */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center h-28">
              <div className="flex flex-col justify-between h-full">
                <span className="text-xs text-gray-400 font-semibold flex items-center gap-1.5">
                  <FiPercent className="text-teal-500 text-sm" /> Conversion Rate
                </span>
                <span className="text-2xl font-bold text-[#1E1B4B] tracking-tight">12.4%</span>
                <span className="text-[11px] text-emerald-600 font-bold">↑ 2.1% <span className="text-gray-400 font-medium">vs Last month</span></span>
              </div>
              <div className="w-20 h-12">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={miniGraphData}>
                    <Area type="monotone" dataKey="value" stroke="#14B8A6" fill="transparent" strokeWidth={1.5} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Card 4: Active Vendors */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center h-28">
              <div className="flex flex-col justify-between h-full">
                <span className="text-xs text-gray-400 font-semibold flex items-center gap-1.5">
                  <FiUsers className="text-indigo-500 text-sm" /> Active Vendors
                </span>
                <span className="text-2xl font-bold text-[#1E1B4B] tracking-tight">1,240</span>
                <span className="text-[11px] text-red-600 font-bold">↓ 4.04% <span className="text-gray-400 font-medium">vs Last month</span></span>
              </div>
              <div className="w-20 h-12">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={miniGraphData}>
                    <Area type="monotone" dataKey="value" stroke="#4F46E5" fill="transparent" strokeWidth={1.5} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Central Complex Sales Performance Graph Block */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-base text-[#1E1B4B]">Sales Performance</h3>
              <div className="flex bg-gray-50 border border-gray-100 p-1 rounded-xl text-xs font-semibold text-gray-400">
                <span className="px-3 py-1.5 cursor-pointer">Daily</span>
                <span className="px-3 py-1.5 cursor-pointer">Weekly</span>
                <span className="px-3 py-1.5 bg-[#1E1B4B] text-white rounded-lg cursor-pointer shadow-sm">Annually</span>
              </div>
            </div>

            <div className="w-full h-60 text-xs text-gray-400">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesPerformanceData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#635BFF" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#635BFF" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" tickLine={false} axisLine={false} />
                  <YAxis tickFormatter={(v) => `${v / 1000}k`} ticks={[0, 1000, 2000, 3000, 4000, 5000]} tickLine={false} axisLine={false} />
                  
                  {/* Replicating the highlighted image tooltips exactly inside coordinates layout */}
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-black text-white p-2 rounded shadow-xl text-center text-[11px] font-bold">
                            <div>1,348 sales</div>
                            <div className="text-gray-300">$3,348</div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area type="monotone" dataKey="sales" stroke="#635BFF" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSales)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* ================= RIGHT 4-COLUMNS COMPONENT SECTION ================= */}
        <div className="lg:col-span-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col h-full justify-between">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-bold text-base text-[#1E1B4B]">Recent Activity</h3>
              <button className="border border-gray-100 px-3 py-1 rounded-lg text-xs font-semibold text-gray-500 hover:bg-gray-50 transition">
                See all
              </button>
            </div>

            <div className="space-y-4 flex-1 flex flex-col justify-between">
              {recentActivities.map((act) => (
                <div key={act.id} className="flex items-center justify-between group transition">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${act.color} text-base shrink-0`}>
                      {act.id % 2 === 0 ? <FiAlertCircle /> : <FiCheckCircle />}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#1E293B]">{act.type}</h4>
                      <p className="text-[11px] text-gray-400 mt-0.5">{act.desc} • {act.time}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${act.badge}`}>
                    {act.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* ================= LOWER WIDE GRID BLOCK: TOP PRODUCTS ================= */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mt-6 overflow-hidden">
        <div className="p-5 flex justify-between items-center border-b border-gray-50">
          <h3 className="font-bold text-base text-[#1E1B4B]">Top Selling Products</h3>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1 border border-gray-100 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-500 hover:bg-gray-50 transition">
              Sort by <FiChevronDown />
            </button>
            <button className="border border-gray-100 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-500 hover:bg-gray-50 transition">
              See all
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-50 text-gray-400 font-semibold bg-gray-50/30">
                <th className="p-4 pl-6 font-medium text-[11px]">Product Name</th>
                <th className="p-4 font-medium text-[11px]">Stocks</th>
                <th className="p-4 font-medium text-[11px]">Total Orders</th>
                <th className="p-4 font-medium text-[11px]">Price</th>
                <th className="p-4 font-medium text-[11px]">Sales</th>
                <th className="p-4 font-medium text-[11px]">Status</th>
                <th className="p-4 pr-6 font-medium text-[11px] text-right">Earnings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-[13px] font-medium text-gray-700">
              {topProducts.map((prod, index) => (
                <tr key={index} className="hover:bg-gray-50/40 transition-colors">
                  <td className="p-4 pl-6 font-semibold text-[#1E293B]">{prod.name}</td>
                  <td className="p-4 text-gray-400">{prod.stocks}</td>
                  <td className="p-4 text-gray-400">{prod.orders}</td>
                  <td className="p-4 text-gray-400">{prod.price}</td>
                  <td className="p-4 text-gray-400">{prod.sales}</td>
                  <td className="p-4">
                    <span className="bg-[#DCFCE7] text-[#15803D] text-[11px] font-bold px-2.5 py-0.5 rounded-md">
                      {prod.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right font-bold text-[#1E293B]">{prod.earnings}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;