import React, { useState, useEffect } from "react";
import {
  FiEye,
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiSearch,
  FiInbox,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import Api from "../api/api";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true); 

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

   
    if (searchTerm) {
      result = result.filter(
        (order) =>
          order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          
          order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

   
    if (statusFilter !== "All") {
      result = result.filter((order) => order.orderStatus === statusFilter);
    }

    setFilteredOrders(result);
  }, [searchTerm, statusFilter, orders]);


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

 
  const getCount = (status) => {
    if (status === "All") return orders.length;
    return orders.filter((o) => o.orderStatus === status).length;
  };

  const formatDate = (dateStr) =>
    dateStr
      ? new Date(dateStr).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "N/A";

 
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#F8FAFC]">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-[#635BFF] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen font-sans text-[#1E293B] p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto min-w-0">

       
        <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold italic tracking-tight text-[#1E1B4B]">
              Maurish Orders
            </h1>
          </div>

         
          <div className="relative w-full sm:w-72 md:w-80 shrink-0">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
            <input
              type="text"
              placeholder="Search by ID or customer name..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-[#635BFF] focus:ring-1 focus:ring-[#635BFF] outline-none text-xs font-medium transition-all shadow-sm placeholder:text-gray-400"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

       
        <div className="overflow-x-auto no-scrollbar mb-6 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex gap-1 bg-slate-200/50 p-1 rounded-xl w-max border border-gray-100 shadow-inner">
            {["All", "Processing", "Shipped", "Delivered"].map((status) => {
              const isActive = statusFilter === status;
              return (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 sm:px-4 py-2 rounded-lg text-[11px] sm:text-xs font-bold tracking-wide flex items-center gap-1.5 sm:gap-2 transition-all whitespace-nowrap ${
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
        </div>

      
        <div className="lg:hidden space-y-3">
          {filteredOrders.map((order) => {
            const badge = getStatusConfig(order.orderStatus);
            return (
              <div
                key={order._id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col gap-3"
              >
               
                <div className="flex items-start justify-between gap-3">
                  <span className="font-mono font-bold text-[#635BFF] text-xs tracking-wide truncate">
                    #{order._id?.substring(0, 8).toUpperCase()}...
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border shrink-0 ${badge.style}`}
                  >
                    {badge.icon}
                    {order.orderStatus || "Processing"}
                  </span>
                </div>

               
                <div className="min-w-0">
                  <p className="text-sm text-gray-700 font-semibold truncate">
                    {order.user?.name || "Guest User"}
                  </p>
                  <p className="text-[11px] text-gray-400 font-normal truncate">
                    {order.user?.email || "No email profile"}
                  </p>
                </div>

               
                <div className="flex items-center justify-between gap-3 pt-2 border-t border-gray-50">
                  <div className="min-w-0">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Date</p>
                    <p className="text-[11px] text-gray-500 font-medium truncate">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Amount</p>
                    <p className="text-sm font-bold text-[#1E1B4B]">
                      Rs. {order.totalPrice?.toLocaleString() || "0"}
                    </p>
                  </div>
                </div>

              
                <Link
                  to={`/admin/order/${order._id}`}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 border border-gray-200 hover:border-[#1E1B4B] rounded-lg text-gray-600 hover:text-[#1E1B4B] text-xs font-bold transition-colors bg-white shadow-sm"
                >
                  <FiEye size={13} />
                  <span>Review</span>
                </Link>
              </div>
            );
          })}

          {filteredOrders.length === 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 flex flex-col items-center justify-center text-center text-gray-400">
              <div className="p-3 bg-slate-50 border border-gray-100 text-gray-300 rounded-xl mb-3">
                <FiInbox size={22} />
              </div>
              <p className="text-xs font-semibold text-gray-500">No records dispatch found</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Try altering keywords or active status nodes</p>
            </div>
          )}
        </div>

      
        <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-w-0">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="p-4 pl-6 whitespace-nowrap">Order Reference</th>
                  <th className="p-4 whitespace-nowrap">Customer Name</th>
                  <th className="p-4 whitespace-nowrap">Purchase Date</th>
                  <th className="p-4 whitespace-nowrap">Gross Amount</th>
                  <th className="p-4 whitespace-nowrap">Logistics Status</th>
                  <th className="p-4 pr-6 text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs font-medium">
                {filteredOrders.map((order) => {
                  const badge = getStatusConfig(order.orderStatus);

                  return (
                    <tr key={order._id} className="hover:bg-slate-50/50 transition-all group">
                   
                      <td className="p-4 pl-6 font-mono font-bold text-[#635BFF] tracking-wide whitespace-nowrap">
                        #{order._id?.substring(0, 8).toUpperCase()}...
                      </td>

                      
                      <td className="p-4 max-w-[220px]">
                        <div className="flex flex-col min-w-0">
                          <span className="text-gray-700 font-semibold truncate">
                            {order.user?.name || "Guest User"}
                          </span>
                          <span className="text-[10px] text-gray-400 font-normal mt-0.5 truncate">
                            {order.user?.email || "No email profile"}
                          </span>
                        </div>
                      </td>

                    
                      <td className="p-4 text-gray-400 font-normal whitespace-nowrap">
                        {formatDate(order.createdAt)}
                      </td>

                    
                      <td className="p-4 text-[#1E1B4B] font-bold text-sm whitespace-nowrap">
                        Rs. {order.totalPrice?.toLocaleString() || "0"}
                      </td>

                     
                      <td className="p-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${badge.style}`}
                        >
                          {badge.icon}
                          {order.orderStatus || "Processing"}
                        </span>
                      </td>

                   
                      <td className="p-4 pr-6 text-right whitespace-nowrap">
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