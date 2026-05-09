import React, { useState, useEffect } from "react";
import {
  FiEye,
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiSearch,
} from "react-icons/fi";
import { Link } from "react-router-dom";

const OrderList = () => {
  // 1. Backend sa aya hua data (Dummy)
  const [orders, setOrders] = useState([
    {
      _id: "MAU-8801",
      user: "Hamza Ahmed",
      createdAt: "2024-03-20",
      totalPrice: 4500,
      orderStatus: "Processing",
    },
    {
      _id: "MAU-8802",
      user: "Zeeshan Khan",
      createdAt: "2024-03-21",
      totalPrice: 2200,
      orderStatus: "Shipped",
    },
    {
      _id: "MAU-8803",
      user: "Bilal Raza",
      createdAt: "2024-03-19",
      totalPrice: 8900,
      orderStatus: "Delivered",
    },
    {
      _id: "MAU-8804",
      user: "Saad Ali",
      createdAt: "2024-03-22",
      totalPrice: 3000,
      orderStatus: "Processing",
    },
  ]);

  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    let result = orders;

    // Search by Order ID or User Name
    if (searchTerm) {
      result = result.filter(
        (order) =>
          order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.user.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Filter by Status
    if (statusFilter !== "All") {
      result = result.filter((order) => order.orderStatus === statusFilter);
    }

    setFilteredOrders(result);
  }, [searchTerm, statusFilter, orders]);

  // Status Badge Helper
  const getStatusStyle = (status) => {
    switch (status) {
      case "Processing":
        return "bg-yellow-100 text-yellow-700";
      case "Shipped":
        return "bg-blue-100 text-blue-700";
      case "Delivered":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-2xl font-bold text-gray-800 italic">
          Maurish Orders
        </h1>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search Order ID or Name..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-black"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 mb-6 bg-white p-1 rounded-xl w-fit border shadow-sm">
        {["All", "Processing", "Shipped", "Delivered"].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition ${statusFilter === status ? "bg-black text-white" : "text-gray-500 hover:bg-gray-50"}`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-400 text-xs uppercase font-black">
            <tr>
              <th className="p-4">Order ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Date</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredOrders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50 transition">
                <td className="p-4 font-mono text-sm font-bold text-blue-600">
                  {order._id}
                </td>
                <td className="p-4 font-medium text-gray-800">{order.user}</td>
                <td className="p-4 text-gray-500 text-sm">{order.createdAt}</td>
                <td className="p-4 font-black text-gray-900">
                  Rs. {order.totalPrice}
                </td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(order.orderStatus)}`}
                  >
                    {order.orderStatus}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <Link
                    to={`/admin/order/${order._id}`}
                    className="inline-flex items-center gap-1 text-black font-bold text-sm hover:underline"
                  >
                    <FiEye /> View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredOrders.length === 0 && (
          <div className="p-20 text-center text-gray-400">
            No orders found in this category.
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderList;
