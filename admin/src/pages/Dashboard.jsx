import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  FiShoppingBag, FiDollarSign, FiBox, FiUsers,
  FiAlertCircle, FiShoppingCart, FiUserPlus,
  FiMessageSquare, FiRefreshCw
} from 'react-icons/fi';
import Chart from 'react-apexcharts';
import Api from "../api/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const REFRESH_INTERVAL_MS = 30000;

const STATUS_COLORS = {
  Pending: "#F59E0B", Processing: "#0EA5E9",
  Shipped: "#635BFF", Delivered: "#10B981", Cancelled: "#EF4444",
};

// Chart palette — matches the soft amber / indigo / emerald reference look
const CHART_COLORS = ["#F59E0B", "#635BFF"];

const timeAgo = (dateString) => {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

const ACTIVITY_CONFIG = {
  order:   { icon: <FiShoppingCart />,  color: "text-blue-500 bg-blue-50",    badge: "bg-[#E0F2FE] text-[#0369A1]",  tag: "Order"    },
  user:    { icon: <FiUserPlus />,      color: "text-purple-500 bg-purple-50", badge: "bg-[#F5F3FF] text-[#635BFF]",  tag: "Customer" },
  support: { icon: <FiMessageSquare />, color: "text-orange-500 bg-orange-50", badge: "bg-[#FFEDD5] text-[#C2410C]",  tag: "Support"  },
  system:  { icon: <FiAlertCircle />,   color: "text-emerald-500 bg-emerald-50",badge:"bg-[#DCFCE7] text-[#15803D]",  tag: "System"   },
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
  const fromRef  = useRef(0);
  useEffect(() => {
    fromRef.current  = value;
    startRef.current = null;
    let frameId;
    const step = (ts) => {
      if (startRef.current === null) startRef.current = ts;
      const progress = Math.min((ts - startRef.current) / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(fromRef.current + (target - fromRef.current) * eased));
      if (progress < 1) frameId = requestAnimationFrame(step);
    };
    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration]);
  return value;
};

// ── KPI Card ─────────────────────────────────────────────────
const KpiCard = ({ icon, iconColor, label, value, prefix = "", change, sub }) => {
  const animated = useCountUp(value);
  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between min-h-[100px]">
      <span className="text-[11px] text-gray-400 font-semibold flex items-center gap-1.5 truncate">
        <span className={iconColor}>{icon}</span>{label}
      </span>
      <span className="text-xl font-bold text-[#1E1B4B] tracking-tight truncate mt-1">
        {prefix}{animated.toLocaleString()}
      </span>
      {change !== null && change !== undefined ? (
        <span className={`text-[10px] font-bold mt-1 truncate ${Number(change) >= 0 ? "text-emerald-600" : "text-red-500"}`}>
          {Number(change) >= 0 ? "↑" : "↓"} {Math.abs(change)}%{" "}
          <span className="text-gray-400 font-medium">vs last month</span>
        </span>
      ) : (
        <span className="text-[10px] text-gray-400 font-medium mt-1 truncate">{sub}</span>
      )}
    </div>
  );
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

// ── Main Component ────────────────────────────────────────────
const Dashboard = () => {
  const [stats,         setStats]         = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [refreshing,    setRefreshing]    = useState(false);

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

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-[#F8FAFC]">
      <div className="w-8 h-8 border-2 border-gray-200 border-t-[#635BFF] rounded-full animate-spin" />
    </div>
  );

  if (!stats) return (
    <div className="p-6 bg-[#F8FAFC] min-h-screen flex items-center justify-center text-gray-400 text-sm font-semibold">
      <ToastContainer /> Unable to load dashboard data.
    </div>
  );

  const {
    totalUsers    = 0, totalProducts = 0,
    totalOrders   = 0, totalRevenue  = 0,
    statusBreakdown = {}, monthlySales = [], topProducts = [],
  } = stats;

  const monthLabels   = monthlySales.map(m => MONTH_NAMES[(m._id.month - 1 + 12) % 12]);
  const revenueSeries = monthlySales.map(m => m.total);
  const orderSeries   = monthlySales.map(m => m.orders);
  const revenueChange = monthOverMonthChange(revenueSeries);
  const orderChange   = monthOverMonthChange(orderSeries);
  const statusEntries = Object.entries(statusBreakdown);
  const totalStatusCount = statusEntries.reduce((s, [, v]) => s + v, 0);

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
    { name: "Orders",  data: orderSeries   },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-[#F8FAFC] min-h-screen font-sans text-[#1E293B]">
      <ToastContainer />

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg sm:text-xl font-bold text-[#1E1B4B] italic">Maurish Overview</h1>
        {refreshing && (
          <FiRefreshCw size={16} className="text-gray-400 animate-spin" />
        )}
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <KpiCard icon={<FiShoppingBag />} iconColor="text-cyan-500"   label="Total Orders"    value={totalOrders}   change={orderChange}   sub="all-time total" />
        <KpiCard icon={<FiDollarSign />}  iconColor="text-purple-500" label="Total Revenue"   value={totalRevenue}  prefix="Rs. " change={revenueChange} sub="non-cancelled" />
        <KpiCard icon={<FiBox />}         iconColor="text-teal-500"   label="Total Products"  value={totalProducts} change={null}          sub="live in catalog" />
        <KpiCard icon={<FiUsers />}       iconColor="text-indigo-500" label="Total Customers" value={totalUsers}    change={null}          sub="registered accounts" />
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">

        {/* Left — chart + pipeline */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">

          {/* Sales Chart — reference-styled header with summary counters */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-2">
              <div>
                <h3 className="font-bold text-base text-[#1E1B4B]">Sales Performance</h3>
                <p className="text-xs text-gray-400 mt-0.5">Revenue and orders per month</p>
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
              <div className="w-full overflow-hidden">
                <Chart options={chartOptions} series={chartSeries} type="area" height={280} />
              </div>
            ) : (
              <div className="h-56 flex items-center justify-center text-xs text-gray-400 font-medium">
                No sales recorded yet
              </div>
            )}
          </div>

          {/* Order Pipeline */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-base text-[#1E1B4B] mb-5">Order Pipeline</h3>
            {statusEntries.length > 0 ? (
              <div className="space-y-4">
                {statusEntries.map(([status, count]) => {
                  const pct   = totalStatusCount > 0 ? Math.round((count / totalStatusCount) * 100) : 0;
                  const color = STATUS_COLORS[status] || "#94A3B8";
                  return (
                    <div key={status}>
                      <div className="flex justify-between items-center mb-1.5 text-xs">
                        <span className="font-semibold text-gray-600">{status}</span>
                        <span className="font-bold text-gray-800">
                          {count} <span className="text-gray-400 font-medium">({pct}%)</span>
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700 ease-out"
                          style={{ width: `${pct}%`, backgroundColor: color }} />
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

        {/* Right — recent activity */}
        <div className="lg:col-span-1">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm h-full">
            <h3 className="font-bold text-base text-[#1E1B4B] mb-5">Recent Activity</h3>
            {notifications.length > 0 ? (
              <div className="space-y-4">
                {notifications.map(n => {
                  const config = ACTIVITY_CONFIG[n.type] || ACTIVITY_CONFIG.system;
                  return (
                    <div key={n._id} className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`p-2.5 rounded-xl ${config.color} text-base shrink-0`}>
                          {config.icon}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#1E293B] truncate max-w-[130px] sm:max-w-[160px]">
                            {n.title}
                          </p>
                          <p className="text-[11px] text-gray-400 mt-0.5">{timeAgo(n.createdAt)}</p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 ${config.badge}`}>
                        {config.tag}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center h-40 text-xs text-gray-400 font-medium">
                No recent activity
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Top Products Table ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mt-4 sm:mt-6 overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-gray-50">
          <h3 className="font-bold text-base text-[#1E1B4B]">Top Selling Products</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse" style={{ minWidth: '400px' }}>
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/30">
                <th className="p-4 pl-5 text-[11px] font-medium text-gray-400">Product Name</th>
                <th className="p-4 text-[11px] font-medium text-gray-400">Units Sold</th>
                <th className="p-4 pr-5 text-[11px] font-medium text-gray-400 text-right">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-[13px] font-medium text-gray-700">
              {topProducts.length > 0 ? (
                topProducts.map(prod => (
                  <tr key={prod._id} className="hover:bg-gray-50/40 transition-colors">
                    <td className="p-4 pl-5 font-semibold text-[#1E293B]">{prod.name || "Deleted Product"}</td>
                    <td className="p-4 text-gray-400">{prod.sold}</td>
                    <td className="p-4 pr-5 text-right font-bold text-[#1E293B]">
                      Rs. {prod.revenue?.toLocaleString()}
                    </td>
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