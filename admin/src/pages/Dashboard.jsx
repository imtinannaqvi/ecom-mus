import React, { useState, useEffect } from 'react';
import {
  FiShoppingBag,
  FiDollarSign,
  FiBox,
  FiUsers,
  FiAlertCircle,
  FiCheckCircle,
  FiShoppingCart,
  FiUserPlus,
  FiMessageSquare
} from 'react-icons/fi';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';
import Api from "../api/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const timeAgo = (dateString) => {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const ACTIVITY_CONFIG = {
  order: { icon: <FiShoppingCart />, color: "text-blue-500 bg-blue-50", badge: "bg-[#E0F2FE] text-[#0369A1]", tag: "Order" },
  user: { icon: <FiUserPlus />, color: "text-purple-500 bg-purple-50", badge: "bg-[#F5F3FF] text-[#635BFF]", tag: "Customer" },
  support: { icon: <FiMessageSquare />, color: "text-orange-500 bg-orange-50", badge: "bg-[#FFEDD5] text-[#C2410C]", tag: "Support" },
  system: { icon: <FiAlertCircle />, color: "text-emerald-500 bg-emerald-50", badge: "bg-[#DCFCE7] text-[#15803D]", tag: "System" },
};

// Percentage change between the last two entries of a monthly series.
const monthOverMonthChange = (series) => {
  if (series.length < 2) return null;
  const prev = series[series.length - 2];
  const curr = series[series.length - 1];
  if (!prev) return null;
  return (((curr - prev) / prev) * 100).toFixed(1);
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [statsRes, notifRes] = await Promise.all([
          Api.get("/admin/stats"),
          Api.get("/notifications"),
        ]);
        setStats(statsRes.data.stats);
        setNotifications((notifRes.data.notifications || []).slice(0, 5));
      } catch (err) {
        toast.error("Failed to load dashboard: " + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="p-8 bg-[#F8FAFC] min-h-screen flex items-center justify-center font-sans text-gray-400 font-semibold text-sm">
        Loading dashboard...
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-8 bg-[#F8FAFC] min-h-screen flex items-center justify-center font-sans text-gray-400 font-semibold text-sm">
        <ToastContainer />
        Unable to load dashboard data.
      </div>
    );
  }

  const {
    totalUsers = 0,
    totalProducts = 0,
    totalOrders = 0,
    totalRevenue = 0,
    monthlySales = [],
    topProducts = [],
  } = stats;

  const salesPerformanceData = monthlySales.map((m) => ({
    name: MONTH_NAMES[(m._id.month - 1 + 12) % 12],
    revenue: m.total,
    orders: m.orders,
  }));

  const revenueSeries = monthlySales.map((m) => m.total);
  const orderSeries = monthlySales.map((m) => m.orders);
  const revenueChange = monthOverMonthChange(revenueSeries);
  const orderChange = monthOverMonthChange(orderSeries);

  // Recharts needs an array of { value } objects for the mini sparklines.
  const toSparkline = (arr) => arr.map((v) => ({ value: v }));

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen font-sans text-[#1E293B]">
      <ToastContainer />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-[#1E1B4B]">Maurish Overview</h1>
      </div>

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
                <span className="text-2xl font-bold text-[#1E1B4B] tracking-tight">{totalOrders.toLocaleString()}</span>
                {orderChange !== null ? (
                  <span className={`text-[11px] font-bold ${orderChange >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                    {orderChange >= 0 ? "↑" : "↓"} {Math.abs(orderChange)}% <span className="text-gray-400 font-medium">vs last month</span>
                  </span>
                ) : (
                  <span className="text-[11px] text-gray-400 font-medium">all-time total</span>
                )}
              </div>
              {orderSeries.length > 1 && (
                <div className="w-20 h-12">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={toSparkline(orderSeries)}>
                      <Area type="monotone" dataKey="value" stroke="#0EA5E9" fill="transparent" strokeWidth={1.5} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Card 2: Total Revenue */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center h-28">
              <div className="flex flex-col justify-between h-full">
                <span className="text-xs text-gray-400 font-semibold flex items-center gap-1.5">
                  <FiDollarSign className="text-purple-500 text-sm" /> Total Revenue
                </span>
                <span className="text-2xl font-bold text-[#1E1B4B] tracking-tight">Rs. {totalRevenue.toLocaleString()}</span>
                {revenueChange !== null ? (
                  <span className={`text-[11px] font-bold ${revenueChange >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                    {revenueChange >= 0 ? "↑" : "↓"} {Math.abs(revenueChange)}% <span className="text-gray-400 font-medium">vs last month</span>
                  </span>
                ) : (
                  <span className="text-[11px] text-gray-400 font-medium">from non-cancelled orders</span>
                )}
              </div>
              {revenueSeries.length > 1 && (
                <div className="w-20 h-12">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={toSparkline(revenueSeries)}>
                      <Area type="monotone" dataKey="value" stroke="#635BFF" fill="transparent" strokeWidth={1.5} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Card 3: Total Products */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center h-28">
              <div className="flex flex-col justify-between h-full">
                <span className="text-xs text-gray-400 font-semibold flex items-center gap-1.5">
                  <FiBox className="text-teal-500 text-sm" /> Total Products
                </span>
                <span className="text-2xl font-bold text-[#1E1B4B] tracking-tight">{totalProducts.toLocaleString()}</span>
                <span className="text-[11px] text-gray-400 font-medium">live in catalog</span>
              </div>
            </div>

            {/* Card 4: Total Customers */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center h-28">
              <div className="flex flex-col justify-between h-full">
                <span className="text-xs text-gray-400 font-semibold flex items-center gap-1.5">
                  <FiUsers className="text-indigo-500 text-sm" /> Total Customers
                </span>
                <span className="text-2xl font-bold text-[#1E1B4B] tracking-tight">{totalUsers.toLocaleString()}</span>
                <span className="text-[11px] text-gray-400 font-medium">registered accounts</span>
              </div>
            </div>

          </div>

          {/* Central Sales Performance Graph Block */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-base text-[#1E1B4B]">Sales Performance</h3>
            </div>

            {salesPerformanceData.length > 0 ? (
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
                    <YAxis tickLine={false} axisLine={false} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const p = payload[0].payload;
                          return (
                            <div className="bg-black text-white p-2 rounded shadow-xl text-center text-[11px] font-bold">
                              <div>{p.orders} orders</div>
                              <div className="text-gray-300">Rs. {p.revenue.toLocaleString()}</div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#635BFF" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSales)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-60 flex items-center justify-center text-xs text-gray-400 font-medium">
                No sales recorded yet
              </div>
            )}
          </div>

        </div>

        {/* ================= RIGHT 4-COLUMNS COMPONENT SECTION ================= */}
        <div className="lg:col-span-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col h-full justify-between">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-bold text-base text-[#1E1B4B]">Recent Activity</h3>
            </div>

            {notifications.length > 0 ? (
              <div className="space-y-4 flex-1 flex flex-col justify-between">
                {notifications.map((n) => {
                  const config = ACTIVITY_CONFIG[n.type] || ACTIVITY_CONFIG.system;
                  return (
                    <div key={n._id} className="flex items-center justify-between group transition">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl ${config.color} text-base shrink-0`}>
                          {config.icon}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-[#1E293B] truncate max-w-[180px]">{n.title}</h4>
                          <p className="text-[11px] text-gray-400 mt-0.5">{timeAgo(n.createdAt)}</p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${config.badge}`}>
                        {config.tag}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-xs text-gray-400 font-medium">
                No recent activity
              </div>
            )}
          </div>
        </div>

      </div>

      {/* ================= LOWER WIDE GRID BLOCK: TOP PRODUCTS ================= */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mt-6 overflow-hidden">
        <div className="p-5 flex justify-between items-center border-b border-gray-50">
          <h3 className="font-bold text-base text-[#1E1B4B]">Top Selling Products</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-50 text-gray-400 font-semibold bg-gray-50/30">
                <th className="p-4 pl-6 font-medium text-[11px]">Product Name</th>
                <th className="p-4 font-medium text-[11px]">Units Sold</th>
                <th className="p-4 pr-6 font-medium text-[11px] text-right">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-[13px] font-medium text-gray-700">
              {topProducts.length > 0 ? (
                topProducts.map((prod) => (
                  <tr key={prod._id} className="hover:bg-gray-50/40 transition-colors">
                    <td className="p-4 pl-6 font-semibold text-[#1E293B]">{prod.name || "Deleted Product"}</td>
                    <td className="p-4 text-gray-400">{prod.sold}</td>
                    <td className="p-4 pr-6 text-right font-bold text-[#1E293B]">Rs. {prod.revenue?.toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="p-8 text-center text-gray-400 font-medium">
                    No product sales yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;