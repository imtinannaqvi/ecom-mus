import React, { useState, useEffect } from "react";
import {
  FiEye,
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiSearch,
  FiInbox,
  FiRefreshCw
} from "react-icons/fi";
import { Link } from "react-router-dom";
import Api from "../api/api";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading handler state

  const getOrder = async () => {
    try {
      setLoading(true);
      const res = await Api.get('/admin/get-order');
      if (res.data.success) {
        setOrders(res.data.orders || []);
      }
    } catch (err) {
      console.log("Error pulling data stream:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrder();
  }, []);

  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    let result = orders;

    // Search by Order ID or User Name Layer
    if (searchTerm) {
      result = result.filter(
        (order) =>
          order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          // ✅ FIX: Accessing object's name safely using optional chaining
          order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by Status
    if (statusFilter !== "All") {
      result = result.filter((order) => order.orderStatus === statusFilter);
    }

    setFilteredOrders(result);
  }, [searchTerm, statusFilter, orders]);

  // Premium Custom Dynamic Badges Mapping
  const getStatusConfig = (status) => {
    switch (status) {
      case "Processing":
        return {
          style: "bg-amber-50 text-amber-700 border-amber-200/60",
          icon: <FiClock className="animate-pulse" size={12} />,
        };
      case "Shipped":
        return {
          style: "bg-indigo-50 text-indigo-700 border-indigo-200/60",
          icon: <FiTruck size={12} />,
        };
      case "Delivered":
        return {
          style: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
          icon: <FiCheckCircle size={12} />,
        };
      default:
        return {
          style: "bg-slate-50 text-slate-700 border-slate-200/60",
          icon: null,
        };
    }
  };

  // Helper function to count tabs items dynamically
  const getCount = (status) => {
    if (status === "All") return orders.length;
    return orders.filter((o) => o.orderStatus === status).length;
  };

  // Safe UI layout for data synchronization loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-3">
          <FiRefreshCw className="animate-spin text-[#635BFF]" size={26} />
          <p className="text-xs font-bold text-gray-400 tracking-wider uppercase">Fetching Active Order Feeds...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen font-sans text-[#1E293B] p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Modern Unified Header Layout */}
        <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#1E1B4B]">Maurish Orders</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Fulfillment pipeline. Monitor customer checkouts, invoices, and shipping statuses.
            </p>
          </div>

          {/* Premium Rounded Search Bar */}
          <div className="relative w-full sm:w-80">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
            <input
              type="text"
              placeholder="Search by ID or customer name..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-[#635BFF] focus:ring-1 focus:ring-[#635BFF] outline-none text-xs font-medium transition-all shadow-sm placeholder:text-gray-400"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        {/* Clean Pill Layout Tabs Control Bar */}
        <div className="flex flex-wrap gap-2 mb-6 bg-slate-200/50 p-1 rounded-xl w-fit border border-gray-100 shadow-inner">
          {["All", "Processing", "Shipped", "Delivered"].map((status) => {
            const isActive = statusFilter === status;
            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wide flex items-center gap-2 transition-all ${
                  isActive
                    ? "bg-white text-[#1E1B4B] shadow-sm border border-slate-100"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {status}
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-md font-extrabold ${
                    isActive ? "bg-[#1E1B4B] text-white" : "bg-slate-200 text-gray-500"
                  }`}
                >
                  {getCount(status)}
                </span>
              </button>
            );
          })}
        </div>

        {/* Orders Data Table Sheet Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="p-4 pl-6">Order Reference</th>
                  <th className="p-4">Customer Name</th>
                  <th className="p-4">Purchase Date</th>
                  <th className="p-4">Gross Amount</th>
                  <th className="p-4">Logistics Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs font-medium">
                {filteredOrders.map((order) => {
                  const badge = getStatusConfig(order.orderStatus);

                  return (
                    <tr key={order._id} className="hover:bg-slate-50/50 transition-all group">
                      {/* Order Code Reference */}
                      <td className="p-4 pl-6 font-mono font-bold text-[#635BFF] tracking-wide">
                        #{order._id?.substring(0, 8).toUpperCase()}...
                      </td>
                      
                      {/* Customer Name and Sub-Email Payload */}
                      <td className="p-4">
                        <div className="flex flex-col">
                          {/* ✅ FIX: Render name property safely */}
                          <span className="text-gray-700 font-semibold">{order.user?.name || "Guest User"}</span>
                          {/* Optional details addition */}
                          <span className="text-[10px] text-gray-400 font-normal mt-0.5">{order.user?.email || "No email profile"}</span>
                        </div>
                      </td>
                      
                      {/* Formatted Creation Date */}
                      <td className="p-4 text-gray-400 font-normal">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        }) : "N/A"}
                      </td>
                      
                      {/* Gross Pricing Counter */}
                      <td className="p-4 text-[#1E1B4B] font-bold text-sm">
                        Rs. {order.totalPrice?.toLocaleString() || "0"}
                      </td>
                      
                      {/* Dynamic Tracking Status Badge */}
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${badge.style}`}
                        >
                          {badge.icon}
                          {order.orderStatus || "Processing"}
                        </span>
                      </td>
                      
                      {/* Navigation Detail Trigger Link */}
                      <td className="p-4 pr-6 text-right">
                        <Link
                          to={`/admin/order/${order._id}`}
                          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 border border-gray-200 hover:border-[#1E1B4B] rounded-lg text-gray-600 hover:text-[#1E1B4B] font-bold transition-colors bg-white shadow-sm"
                        >
                          <FiEye size={13} />
                          <span>Review</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Fallback Screen Context Empty Matrix Grid */}
          {filteredOrders.length === 0 && (
            <div className="py-20 flex flex-col items-center justify-center text-center text-gray-400">
              <div className="p-3 bg-slate-50 border border-gray-100 text-gray-300 rounded-xl mb-3">
                <FiInbox size={22} />
              </div>
              <p className="text-xs font-semibold text-gray-500">No records dispatch found</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Try altering keywords or active status nodes</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default OrderList;