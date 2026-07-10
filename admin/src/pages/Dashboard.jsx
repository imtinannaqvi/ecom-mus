import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  FiShoppingBag,
  FiDollarSign,
  FiBox,
  FiUsers,
  FiAlertCircle,
  FiShoppingCart,
  FiUserPlus,
  FiMessageSquare,
  FiRefreshCw
} from 'react-icons/fi';
import Chart from 'react-apexcharts';
import Api from "../api/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const REFRESH_INTERVAL_MS = 30000;

const STATUS_COLORS = {
  Pending: "#F59E0B",
  Processing: "#0EA5E9",
  Shipped: "#635BFF",
  Delivered: "#10B981",
  Cancelled: "#EF4444",
};

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

const monthOverMonthChange = (series) => {
  if (series.length < 2) return null;
  const prev = series[series.length - 2];
  const curr = series[series.length - 1];
  if (!prev) return null;
  return (((curr - prev) / prev) * 100).toFixed(1);
};

const useCountUp = (target, duration = 800) => {
  const [value, setValue] = useState(0);
  const startRef = useRef(null);
  const fromRef = useRef(0);

  useEffect(() => {
    fromRef.current = value;
    startRef.current = null;
    let frameId;
    const step = (timestamp) => {
      if (startRef.current === null) startRef.current = timestamp;
      const progress = Math.min((timestamp - startRef.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(fromRef.current + (target - fromRef.current) * eased));
      if (progress < 1) frameId = requestAnimationFrame(step);
    };
    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration]);

  return value;
};

const KpiCard = ({ icon, iconColor, label, value, prefix = "", change, sub }) => {
  const animated = useCountUp(value);
  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-28">
      <span className="text-xs text-gray-400 font-semibold flex items-center gap-1.5 truncate">
        <span className={iconColor}>{icon}</span> {label}
      </span>
      <span className="text-xl sm:text-2xl font-bold text-[#1E1B4B] tracking-tight truncate">
        {prefix}{animated.toLocaleString()}
      </span>
      {change !== null && change !== undefined ? (
        <span className={`text-[10px] sm:text-[11px] font-bold truncate ${change >= 0 ? "text-emerald-600" : "text-red-500"}`}>
          {change >= 0 ? "↑" : "↓"} {Math.abs(change)}% <span className="text-gray-400 font-medium">vs last month</span>
        </span>
      ) : (
        <span className="text-[10px] sm:text-[11px] text-gray-400 font-medium truncate">{sub}</span>
      )}
    </div>
  );
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadData = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      else setRefreshing(true);
      const [statsRes, notifRes] = await Promise.all([
        Api.get("/admin/stats"),
        Api.get("/notifications"),
      ]);
      setStats(statsRes.data.stats);
      setNotifications((notifRes.data.notifications || []).slice(0, 5));
      setLastUpdated(new Date());
    } catch (err) {
      if (!silent) toast.error("Failed to load dashboard: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData(false);
    const interval = setInterval(() => loadData(true), REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [loadData]);

  if (loading) {
    return (
     <div className="flex justify-center"><div className="w-8 h-8 border-2 border-gray-200 border-t-[#635BFF] rounded-full animate-spin" /></div>
    );
  }

  if (!stats) {
    return (
      <div className="p-4 sm:p-8 bg-[#F8FAFC] min-h-screen flex items-center justify-center font-sans text-gray-400 font-semibold text-sm">
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
    statusBreakdown = {},
    monthlySales = [],
    topProducts = [],
  } = stats;

  const monthLabels = monthlySales.map((m) => MONTH_NAMES[(m._id.month - 1 + 12) % 12]);
  const revenueSeries = monthlySales.map((m) => m.total);
  const orderSeries = monthlySales.map((m) => m.orders);
  const revenueChange = monthOverMonthChange(revenueSeries);
  const orderChange = monthOverMonthChange(orderSeries);

  const statusEntries = Object.entries(statusBreakdown);
  const totalStatusCount = statusEntries.reduce((sum, [, v]) => sum + v, 0);

  // ApexCharts config: smooth curved area for revenue + slim column for orders,
  // gradient fill and soft animation give it a "live flow" feel.
  const chartOptions = {
    chart: {
      toolbar: { show: false },
      animations: { easing: "easeinout", speed: 600 },
      fontFamily: "inherit",
    },
    stroke: { curve: "smooth", width: [0, 3] },
    fill: {
      type: ["gradient", "solid"],
      gradient: { shadeIntensity: 1, opacityFrom: 0.35, opacityTo: 0.02, stops: [0, 90, 100] },
    },
    colors: ["#0EA5E9", "#635BFF"],
    dataLabels: { enabled: false },
    xaxis: { categories: monthLabels, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: [
      { title: { text: "" }, labels: { style: { colors: "#94A3B8", fontSize: "11px" } } },
      { opposite: true, labels: { style: { colors: "#94A3B8", fontSize: "11px" } } },
    ],
    grid: { borderColor: "#F1F5F9", strokeDashArray: 4 },
    legend: { show: false },
    tooltip: {
      shared: true,
      y: {
        formatter: (val, { seriesIndex }) => seriesIndex === 1 ? `Rs. ${val.toLocaleString()}` : `${val} orders`,
      },
    },
    plotOptions: { bar: { columnWidth: "35%", borderRadius: 4 } },
  };

  const chartSeries = [
    { name: "Orders", type: "column", data: orderSeries },
    { name: "Revenue", type: "area", data: revenueSeries },
  ];

  return (
    <div className="p-4 sm:p-8 bg-[#F8FAFC] min-h-screen font-sans text-[#1E293B]">
      <ToastContainer />

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-6">
        <h1 className="text-xl font-bold text-[#1E1B4B]">Maurish Overview</h1>
        <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Live
          {lastUpdated && <span className="ml-1">&middot; updated {timeAgo(lastUpdated)}</span>}
          <FiRefreshCw className={`ml-1 ${refreshing ? "animate-spin" : ""}`} size={12} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">

        <div className="md:col-span-8 space-y-6 min-w-0">

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-2 gap-4">
            <KpiCard icon={<FiShoppingBag className="text-sm" />} iconColor="text-cyan-500" label="Total Orders" value={totalOrders} change={orderChange} sub="all-time total" />
            <KpiCard icon={<FiDollarSign className="text-sm" />} iconColor="text-purple-500" label="Total Revenue" value={totalRevenue} prefix="Rs. " change={revenueChange} sub="from non-cancelled orders" />
            <KpiCard icon={<FiBox className="text-sm" />} iconColor="text-teal-500" label="Total Products" value={totalProducts} change={null} sub="live in catalog" />
            <KpiCard icon={<FiUsers className="text-sm" />} iconColor="text-indigo-500" label="Total Customers" value={totalUsers} change={null} sub="registered accounts" />
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm min-w-0">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
              <h3 className="font-bold text-base text-[#1E1B4B]">Sales Performance</h3>
              <div className="flex items-center gap-4 text-[11px] font-semibold text-gray-500">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#635BFF]"></span> Revenue</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-[#0EA5E9]"></span> Orders</span>
              </div>
            </div>

            {monthLabels.length > 0 ? (
              <div className="w-full min-w-0">
                <Chart options={chartOptions} series={chartSeries} type="line" height={260} />
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-xs text-gray-400 font-medium">
                No sales recorded yet
              </div>
            )}
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-base text-[#1E1B4B] mb-5">Order Pipeline</h3>
            {statusEntries.length > 0 ? (
              <div className="space-y-4">
                {statusEntries.map(([status, count]) => {
                  const pct = totalStatusCount > 0 ? Math.round((count / totalStatusCount) * 100) : 0;
                  const color = STATUS_COLORS[status] || "#94A3B8";
                  return (
                    <div key={status}>
                      <div className="flex justify-between items-center mb-1.5 text-xs">
                        <span className="font-semibold text-gray-600">{status}</span>
                        <span className="font-bold text-gray-800">{count} <span className="text-gray-400 font-medium">({pct}%)</span></span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${pct}%`, backgroundColor: color }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-xs text-gray-400 font-medium text-center py-6">No orders yet</div>
            )}
          </div>

        </div>

        <div className="md:col-span-4 w-full min-w-0">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col h-full justify-between">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-bold text-base text-[#1E1B4B]">Recent Activity</h3>
            </div>

            {notifications.length > 0 ? (
              <div className="space-y-4 flex-1 flex flex-col justify-between">
                {notifications.map((n) => {
                  const config = ACTIVITY_CONFIG[n.type] || ACTIVITY_CONFIG.system;
                  return (
                    <div key={n._id} className="flex items-center justify-between gap-2 group transition">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`p-2.5 rounded-xl ${config.color} text-base shrink-0`}>{config.icon}</div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-[#1E293B] truncate max-w-[140px] sm:max-w-[180px]">{n.title}</h4>
                          <p className="text-[11px] text-gray-400 mt-0.5 whitespace-nowrap">{timeAgo(n.createdAt)}</p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 ${config.badge}`}>{config.tag}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-xs text-gray-400 font-medium py-6">No recent activity</div>
            )}
          </div>
        </div>

      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mt-6 overflow-hidden">
        <div className="p-4 sm:p-5 flex justify-between items-center border-b border-gray-50">
          <h3 className="font-bold text-base text-[#1E1B4B]">Top Selling Products</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[500px] sm:min-w-0">
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
                <tr><td colSpan="3" className="p-8 text-center text-gray-400 font-medium">No product sales yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;