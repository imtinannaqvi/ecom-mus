import React, { useState, useEffect } from 'react';
import {
  FiMoreHorizontal,
  FiTrendingUp,
} from 'react-icons/fi';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  RadialBarChart,
  RadialBar,
  Legend,
} from 'recharts';
import Api, { BACKEND_URL } from "../api/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const STATUS_COLORS = {
  Pending: "#F59E0B",
  Processing: "#0EA5E9",
  Shipped: "#635BFF",
  Delivered: "#10B981",
  Cancelled: "#EF4444",
};

const getProductImage = (img) => {
  if (!img) return "https://placehold.co/40x40/e2e8f0/64748b?text=Item";
  return img.startsWith("http") ? img : `${BACKEND_URL}${img}`;
};

function Report() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await Api.get("/admin/stats");
        setStats(res.data.stats);
      } catch (err) {
        toast.error("Failed to load report data: " + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="p-6 bg-[#F8FAFC] min-h-screen flex items-center justify-center font-sans text-gray-400 font-semibold text-sm">
        Loading report...
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-6 bg-[#F8FAFC] min-h-screen flex items-center justify-center font-sans text-gray-400 font-semibold text-sm">
        <ToastContainer />
        Unable to load report data.
      </div>
    );
  }

  const {
    totalUsers = 0,
    totalProducts = 0,
    totalOrders = 0,
    totalRevenue = 0,
    statusBreakdown = {},
    monthlySales = [],
    topProducts = [],
    recentOrders = [],
  } = stats;

  // Map monthlySales ({_id:{year,month}, total, orders}) into chart-friendly rows.
  const revenueData = monthlySales.map((m) => ({
    name: MONTH_NAMES[(m._id.month - 1 + 12) % 12],
    revenue: m.total,
    orders: m.orders,
  }));

  // Real, calculated insight: average value per order.
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  // Build radial-bar-friendly rows: each status becomes its own ring,
  // sized as a percentage of the largest status count so rings are comparable.
  const statusEntries = Object.entries(statusBreakdown);
  const totalStatusCount = statusEntries.reduce((sum, [, v]) => sum + v, 0);
  const maxStatusCount = Math.max(...statusEntries.map(([, v]) => v), 1);
  const radialData = statusEntries
    .map(([name, value], idx) => ({
      name,
      value,
      pct: Math.round((value / maxStatusCount) * 100),
      fill: STATUS_COLORS[name] || "#94A3B8",
    }))
    .sort((a, b) => b.value - a.value);

  return (
    <div className="p-6 bg-[#F8FAFC] min-h-screen font-sans text-[#1E293B]">
      <ToastContainer />

      {/* ================= TOP METRIC CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-6">

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative">
          <div className="flex justify-between items-center text-gray-400 text-sm font-medium mb-2">
            <span>Total Revenue</span>
            <FiMoreHorizontal className="cursor-pointer text-gray-500" />
          </div>
          <h2 className="text-2xl font-bold text-[#1E1B4B] mb-3">Rs. {totalRevenue.toLocaleString()}</h2>
          <span className="text-gray-400 text-xs font-medium">from non-cancelled orders</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative">
          <div className="flex justify-between items-center text-gray-400 text-sm font-medium mb-2">
            <span>Total Orders</span>
            <FiMoreHorizontal className="cursor-pointer text-gray-500" />
          </div>
          <h2 className="text-2xl font-bold text-[#1E1B4B] mb-3">{totalOrders.toLocaleString()}</h2>
          <span className="text-gray-400 text-xs font-medium">all-time orders placed</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative">
          <div className="flex justify-between items-center text-gray-400 text-sm font-medium mb-2">
            <span>Avg. Order Value</span>
            <FiTrendingUp className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-[#1E1B4B] mb-3">Rs. {avgOrderValue.toLocaleString()}</h2>
          <span className="text-gray-400 text-xs font-medium">revenue &divide; orders</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative">
          <div className="flex justify-between items-center text-gray-400 text-sm font-medium mb-2">
            <span>Total Products</span>
            <FiMoreHorizontal className="cursor-pointer text-gray-500" />
          </div>
          <h2 className="text-2xl font-bold text-[#1E1B4B] mb-3">{totalProducts.toLocaleString()}</h2>
          <span className="text-gray-400 text-xs font-medium">live in catalog</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative">
          <div className="flex justify-between items-center text-gray-400 text-sm font-medium mb-2">
            <span>Total Customers</span>
            <FiMoreHorizontal className="cursor-pointer text-gray-500" />
          </div>
          <h2 className="text-2xl font-bold text-[#1E1B4B] mb-3">{totalUsers.toLocaleString()}</h2>
          <span className="text-gray-400 text-xs font-medium">registered accounts</span>
        </div>

      </div>

      {/* ================= MIDDLE SECTION: CHARTS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">

        {/* Revenue + Orders Combo Bar/Line Chart */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm lg:col-span-8 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-base text-[#1E1B4B]">Monthly Revenue vs Orders</h3>
            <div className="flex items-center gap-4 text-[11px] font-semibold text-gray-500">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-[#635BFF]"></span> Revenue</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]"></span> Orders</span>
            </div>
          </div>

          {revenueData.length > 0 ? (
            <div className="w-full h-72 text-xs text-gray-400">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={revenueData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <XAxis dataKey="name" tickLine={false} axisLine={false} />
                  <YAxis yAxisId="left" tickLine={false} axisLine={false} />
                  <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const p = payload[0].payload;
                        return (
                          <div className="bg-black text-white p-2.5 rounded-lg shadow-xl text-center text-[11px] font-bold space-y-0.5">
                            <div>Rs. {p.revenue.toLocaleString()}</div>
                            <div className="text-gray-300">{p.orders} orders</div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar yAxisId="left" dataKey="revenue" fill="#635BFF" radius={[6, 6, 0, 0]} barSize={22} />
                  <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#F59E0B" strokeWidth={2.5} dot={{ r: 4, fill: "#F59E0B" }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-72 flex items-center justify-center text-xs text-gray-400 font-medium">
              No sales recorded yet
            </div>
          )}
        </div>

        {/* Order Status — Radial Ring Chart */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm lg:col-span-4 flex flex-col justify-between">
          <h3 className="font-bold text-base text-[#1E1B4B] mb-1">Order Status</h3>

          {radialData.length > 0 ? (
            <>
              <div className="relative h-52 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    innerRadius="25%"
                    outerRadius="100%"
                    data={radialData}
                    startAngle={90}
                    endAngle={-270}
                  >
                    <RadialBar background dataKey="pct" cornerRadius={8} />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute flex flex-col items-center">
                  <span className="text-xl font-bold text-[#1E293B]">{totalStatusCount}</span>
                  <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">Orders</span>
                </div>
              </div>

              <div className="space-y-2 mt-2">
                {radialData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-gray-500 font-medium">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.fill }}></span>
                      {item.name}
                    </span>
                    <span className="font-semibold text-gray-800">{item.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-52 flex items-center justify-center text-xs text-gray-400 font-medium">
              No orders yet
            </div>
          )}
        </div>

      </div>

      {/* ================= BOTTOM SECTION: TOP PRODUCTS & RECENT ORDERS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Top Selling Products List */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm lg:col-span-7 overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-5 pb-3 flex justify-between items-center">
              <h3 className="font-bold text-base text-[#1E1B4B]">Top Selling Products</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-gray-50 text-gray-400 font-semibold bg-gray-50/40">
                    <th className="p-3 pl-5 font-medium">Product</th>
                    <th className="p-3 font-medium">Units Sold</th>
                    <th className="p-3 font-medium">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-[13px] font-medium text-gray-700">
                  {topProducts.length > 0 ? (
                    topProducts.map((p) => (
                      <tr key={p._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-3 pl-5 text-[#1E293B]">
                          <div className="flex items-center gap-2.5">
                            <img src={getProductImage(p.image)} alt={p.name} className="w-7 h-7 rounded-lg object-cover border border-gray-100 bg-gray-50" />
                            <span>{p.name || "Deleted Product"}</span>
                          </div>
                        </td>
                        <td className="p-3 text-gray-800">{p.sold}</td>
                        <td className="p-3 text-[#1E293B] font-semibold">Rs. {p.revenue?.toLocaleString()}</td>
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

        {/* Recent Orders */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm lg:col-span-5 flex flex-col">
          <h3 className="font-bold text-base text-[#1E1B4B] mb-4">Recent Orders</h3>

          {recentOrders.length > 0 ? (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order._id} className="flex items-center justify-between border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="text-xs font-bold text-[#1E293B]">
                      {order.user?.name || order.user?.email || "Guest"}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      #{order._id.toString().slice(-6).toUpperCase()} &middot; {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-[#1E293B]">Rs. {order.totalPrice?.toLocaleString()}</p>
                    <span
                      className="text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full inline-block mt-1"
                      style={{
                        backgroundColor: `${STATUS_COLORS[order.orderStatus] || "#94A3B8"}20`,
                        color: STATUS_COLORS[order.orderStatus] || "#64748B",
                      }}
                    >
                      {order.orderStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs text-gray-400 font-medium">
              No orders yet
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

export default Report;