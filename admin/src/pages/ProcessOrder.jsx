import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FiPackage, FiUser, FiMapPin, FiCreditCard } from 'react-icons/fi';

const ProcessOrder = () => {
  const { id } = useParams(); // URL se ID nikalne ke liye
  const [status, setStatus] = useState("");

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 italic">Manage Order: <span className="text-blue-600">#{id}</span></h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 1. Order Details (View Part) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Shipping & User Info */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="flex items-center gap-2 font-bold text-gray-800 mb-4 border-b pb-2">
              <FiUser className="text-blue-500" /> Customer & Shipping Info
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <p><b>Name:</b> Hamza Ahmed</p>
              <p><b>Email:</b> hamza@example.com</p>
              <p><b>Phone:</b> 0300-1234567</p>
              <p className="md:col-span-2"><b>Address:</b> H#45, Street 2, Barkatpura, Faisalabad</p>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="flex items-center gap-2 font-bold text-gray-800 mb-4 border-b pb-2">
              <FiCreditCard className="text-green-500" /> Payment Info
            </h3>
            <div className="flex justify-between items-center text-sm">
              <p className="text-green-600 font-bold">PAID (via Stripe)</p>
              <p className="font-black text-lg">Total: Rs. 4,500</p>
            </div>
          </div>

          {/* Cart Items */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="flex items-center gap-2 font-bold text-gray-800 mb-4 border-b pb-2">
              <FiPackage className="text-orange-500" /> Order Items
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded"></div>
                  <div>
                    <p className="font-bold text-gray-800">Maurish Oversized Tee</p>
                    <p className="text-xs text-gray-500 font-mono">Product ID: 64f123...</p>
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-600">2 x Rs. 1500 = <span className="text-black font-bold">Rs. 3000</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Process Section (Action Part) */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-6">
            <h3 className="font-bold text-gray-800 mb-4 italic uppercase text-sm tracking-widest text-center">Process Order</h3>
            
            <div className="mb-6 text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-gray-500 uppercase font-bold">Current Status</p>
              <p className="text-blue-700 font-black tracking-widest uppercase">Processing</p>
            </div>

            <form className="space-y-4">
              <select 
                className="w-full p-3 rounded-lg border border-gray-200 bg-gray-50 outline-none focus:ring-2 focus:ring-black"
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">Update Status</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
              </select>

              <button className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition shadow-lg active:scale-95">
                Update Status
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProcessOrder;