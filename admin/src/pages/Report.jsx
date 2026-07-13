import React, { useState, useEffect } from 'react';
import { FiMoreHorizontal, FiTrendingUp, FiDollarSign, FiShoppingBag } from 'react-icons/fi';
import {
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
} from 'recharts';
import Chart from 'react-apexcharts';
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

// Same palette as the Dashboard chart so both pages read as one system
const CHART_COLORS = ["#F59E0B", "#635BFF"];

const getProductImage = (img) => {
  if (!img) return "https://placehold.co/40x40/e2e8f0/64748b?text=Item";
  return img.startsWith("http") ? img : `${BACKEND_URL}${img}`;
};

// ── Chart summary counter (top-right of the chart card) ──────
const ChartStat = ({ icon, label, value, color }) => (
  <div className="flex flex-col items-center sm:items-end">
    <span className="text-xl font-bold tracking-tight" style={{ color }}>
      {value}
    </span>
    <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1 whitespace-nowrap">
      {icon} {label}
    </span>
  </div>
);

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
      <div className="min-h-screen flex justify-center items-center bg-[#F8FAFC]">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-[#635BFF] rounded-full animate-spin" />
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

  const monthLabels = monthlySales.map((m) => MONTH_NAMES[(m._id.month - 1 + 12) % 12]);
  const revenueSeries = monthlySales.map((m) => m.total);
  const orderSeries = monthlySales.map((m) => m.orders);

  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  const statusEntries = Object.entries(statusBreakdown);
  const totalStatusCount = statusEntries.reduce((sum, [, v]) => sum + v, 0);
  const maxStatusCount = Math.max(...statusEntries.map(([, v]) => v), 1);
  const radialData = statusEntries
    .map(([name, value]) => ({
      name, value,
      pct: Math.round((value / maxStatusCount) * 100),
      fill: STATUS_COLORS[name] || "#94A3B8",
    }))
    .sort((a, b) => b.value - a.value);

  // ── Reference-style chart: smooth spline areas, soft gradient fills,
  // light dashed grid, crosshair, bottom-centered legend, clean tooltip.
  const chartOptions = {
    chart: {
      type: "area",
      toolbar: { show: false },
      zoom: { enabled: false },
      animations: { easing: "easeinout", speed: 700 },
      fontFamily: "inherit",
    },
    stroke: { curve: "smooth", width: 2.5 },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.28,
        opacityTo: 0.02,
        stops: [0, 95, 100],
      },
    },
    colors: CHART_COLORS,
    dataLabels: { enabled: false },
    markers: { size: 0, hover: { size: 5 } },
    xaxis: {
      categories: monthLabels,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: "#94A3B8", fontSize: "11px", fontWeight: 500 } },
      crosshairs: {
        show: true,
        stroke: { color: "#CBD5E1", width: 1, dashArray: 0 },
      },
      tooltip: { enabled: false },
    },
    yaxis: [
      {
        labels: {
          style: { colors: "#CBD5E1", fontSize: "11px" },
          formatter: (val) => Math.round(val),
        },
      },
      {
        opposite: true,
        labels: {
          style: { colors: "#CBD5E1", fontSize: "11px" },
          formatter: (val) => Math.round(val),
        },
      },
    ],
    grid: {
      borderColor: "#F1F5F9",
      strokeDashArray: 4,
      xaxis: { lines: { show: false } },
      padding: { left: 8, right: 8 },
    },
    legend: {
      show: true,
      position: "bottom",
      horizontalAlign: "center",
      markers: { radius: 12, width: 8, height: 8 },
      itemMargin: { horizontal: 10 },
      fontSize: "12px",
      fontWeight: 500,
      labels: { colors: "#64748B" },
    },
    tooltip: {
      shared: true,
      intersect: false,
      theme: "light",
      style: { fontSize: "12px" },
      y: {
        formatter: (val, { seriesIndex }) =>
          seriesIndex === 0 ? `Rs. ${val?.toLocaleString()}` : `${val}`,
      },
    },
  };

  const chartSeries = [
    { name: "Revenue", data: revenueSeries },
    { name: "Orders", data: orderSeries },
  ];

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10 bg-[#F8FAFC] min-h-screen font-sans text-[#1E293B]">
      <ToastContainer />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 mb-6">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm min-w-0 flex flex-col justify-between">
          <div className="flex justify-between items-center text-gray-400 text-sm font-medium mb-2">
            <span className="truncate pr-2">Total Revenue</span>
            <FiMoreHorizontal className="cursor-pointer text-gray-500 shrink-0" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-[#1E1B4B] mb-2 truncate">Rs. {totalRevenue.toLocaleString()}</h2>
            <p className="text-gray-400 text-xs font-medium truncate">from non-cancelled orders</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm min-w-0 flex flex-col justify-between">
          <div className="flex justify-between items-center text-gray-400 text-sm font-medium mb-2">
            <span className="truncate pr-2">Total Orders</span>
            <FiMoreHorizontal className="cursor-pointer text-gray-500 shrink-0" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-[#1E1B4B] mb-2 truncate">{totalOrders.toLocaleString()}</h2>
            <p className="text-gray-400 text-xs font-medium truncate">all-time orders placed</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm min-w-0 flex flex-col justify-between">
          <div className="flex justify-between items-center text-gray-400 text-sm font-medium mb-2">
            <span className="truncate pr-2">Avg. Order Value</span>
            <FiTrendingUp className="text-gray-400 shrink-0" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-[#1E1B4B] mb-2 truncate">Rs. {avgOrderValue.toLocaleString()}</h2>
            <p className="text-gray-400 text-xs font-medium truncate">revenue &divide; orders</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm min-w-0 flex flex-col justify-between">
          <div className="flex justify-between items-center text-gray-400 text-sm font-medium mb-2">
            <span className="truncate pr-2">Total Products</span>
            <FiMoreHorizontal className="cursor-pointer text-gray-500 shrink-0" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-[#1E1B4B] mb-2 truncate">{totalProducts.toLocaleString()}</h2>
            <p className="text-gray-400 text-xs font-medium truncate">live in catalog</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm min-w-0 flex flex-col justify-between">
          <div className="flex justify-between items-center text-gray-400 text-sm font-medium mb-2">
            <span className="truncate pr-2">Total Customers</span>
            <FiMoreHorizontal className="cursor-pointer text-gray-500 shrink-0" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-[#1E1B4B] mb-2 truncate">{totalUsers.toLocaleString()}</h2>
            <p className="text-gray-400 text-xs font-medium truncate">registered accounts</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        <div className="bg-white p-5 md:p-6 rounded-2xl border border-gray-100 shadow-sm lg:col-span-8 flex flex-col min-w-0">
          {/* Reference-styled header: title + subtitle left, summary counters right */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 mb-2">
            <div>
              <h3 className="font-bold text-base text-[#1E1B4B]">Monthly Revenue vs Orders</h3>
              <p className="text-xs text-gray-400 mt-0.5">Revenue and orders placed per month</p>
            </div>
            <div className="flex items-center gap-5 sm:gap-6 shrink-0">
              <ChartStat
                icon={<FiDollarSign size={11} />}
                label="revenue"
                value={`Rs. ${totalRevenue.toLocaleString()}`}
                color={CHART_COLORS[0]}
              />
              <ChartStat
                icon={<FiShoppingBag size={11} />}
                label="orders"
                value={totalOrders.toLocaleString()}
                color={CHART_COLORS[1]}
              />
            </div>
          </div>

          {monthLabels.length > 0 ? (
            <div className="w-full min-w-0">
              <Chart options={chartOptions} series={chartSeries} type="area" height={300} />
            </div>
          ) : (
            <div className="h-72 flex items-center justify-center text-xs text-gray-400 font-medium">No sales recorded yet</div>
          )}
        </div>

        <div className="bg-white p-5 md:p-6 rounded-2xl border border-gray-100 shadow-sm lg:col-span-4 flex flex-col justify-between min-w-0">
          <h3 className="font-bold text-base text-[#1E1B4B] mb-3 lg:mb-1">Order Status</h3>

          {radialData.length > 0 ? (
            <>
              <div className="relative h-52 flex items-center justify-center min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart innerRadius="25%" outerRadius="100%" data={radialData} startAngle={90} endAngle={-270}>
                    <RadialBar background dataKey="pct" cornerRadius={8} />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute flex flex-col items-center">
                  <span className="text-xl font-bold text-[#1E293B]">{totalStatusCount}</span>
                  <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">Orders</span>
                </div>
              </div>
              <div className="space-y-2 mt-4 lg:mt-2">
                {radialData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-gray-500 font-medium truncate pr-2">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.fill }}></span>
                      {item.name}
                    </span>
                    <span className="font-semibold text-gray-800 shrink-0">{item.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-52 flex items-center justify-center text-xs text-gray-400 font-medium">No orders yet</div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm lg:col-span-7 overflow-hidden flex flex-col justify-between min-w-0">
          <div>
            <div className="p-5 pb-3 flex justify-between items-center">
              <h3 className="font-bold text-base text-[#1E1B4B]">Top Selling Products</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse min-w-[500px] md:min-w-0">
                <thead>
                  <tr className="border-b border-gray-50 text-gray-400 font-semibold bg-gray-50/40">
                    <th className="p-3 pl-5 font-medium">Product</th>
                    <th className="p-3 font-medium whitespace-nowrap">Units Sold</th>
                    <th className="p-3 font-medium whitespace-nowrap">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-[13px] font-medium text-gray-700">
                  {topProducts.length > 0 ? (
                    topProducts.map((p) => (
                      <tr key={p._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-3 pl-5 text-[#1E293B] min-w-0">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img src={getProductImage(p.image)} alt={p.name} className="w-7 h-7 rounded-lg object-cover border border-gray-100 bg-gray-50 shrink-0" />
                            <span className="truncate max-w-[180px] sm:max-w-[240px] md:max-w-[300px] lg:max-w-none">{p.name || "Deleted Product"}</span>
                          </div>
                        </td>
                        <td className="p-3 text-gray-800 whitespace-nowrap">{p.sold}</td>
                        <td className="p-3 text-[#1E293B] font-semibold whitespace-nowrap">Rs. {p.revenue?.toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="3" className="p-8 text-center text-gray-400 font-medium">No product sales yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 md:p-6 rounded-2xl border border-gray-100 shadow-sm lg:col-span-5 flex flex-col min-w-0">
          <h3 className="font-bold text-base text-[#1E1B4B] mb-4">Recent Orders</h3>
          {recentOrders.length > 0 ? (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order._id} className="flex items-center justify-between border-b border-gray-50 pb-3 last:border-0 last:pb-0 gap-3 min-w-0">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#1E293B] truncate max-w-[140px] sm:max-w-[200px] md:max-w-[320px] lg:max-w-[180px]">
                      {order.user?.name || order.user?.email || "Guest"}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5 truncate">
                      #{order._id.toString().slice(-6).toUpperCase()} &middot; {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-bold text-[#1E293B] whitespace-nowrap">Rs. {order.totalPrice?.toLocaleString()}</p>
                    <span
                      className="text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full inline-block mt-1 whitespace-nowrap"
                      style={{ backgroundColor: `${STATUS_COLORS[order.orderStatus] || "#94A3B8"}20`, color: STATUS_COLORS[order.orderStatus] || "#64748B" }}
                    >
                      {order.orderStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs text-gray-400 font-medium py-10">No orders yet</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Report;