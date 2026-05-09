import React from 'react';
import { FiBox, FiShoppingBag, FiUsers, FiDollarSign } from 'react-icons/fi';

const Dashboard = () => {
  // Ye stats baad mein API se ayenge
  const stats = [
    { title: "Total Sales", value: "Rs. 125,000", icon: <FiDollarSign />, color: "bg-green-500" },
    { title: "Total Orders", value: "45", icon: <FiShoppingBag />, color: "bg-blue-500" },
    { title: "Products", value: "120", icon: <FiBox />, color: "bg-purple-500" },
    { title: "Customers", value: "85", icon: <FiUsers />, color: "bg-orange-500" },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Maurish Overview</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((item, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">{item.title}</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{item.value}</h3>
            </div>
            <div className={`${item.color} p-3 rounded-lg text-white text-2xl`}>
              {item.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-400 border-b border-gray-100">
                <th className="pb-3 font-medium">Order ID</th>
                <th className="pb-3 font-medium">Customer</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Total</th>
              </tr>
            </thead>
            <tbody className="text-gray-600">
              <tr className="border-b border-gray-50 hover:bg-gray-50 transition">
                <td className="py-4 font-mono text-sm text-blue-600">#MAU-9921</td>
                <td className="py-4">Ali Khan</td>
                <td className="py-4">
                  <span className="bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full text-xs font-bold">Processing</span>
                </td>
                <td className="py-4 font-bold text-gray-800">Rs. 3,500</td>
              </tr>
              {/* More rows here */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;