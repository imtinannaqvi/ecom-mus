import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiMapPin, FiMail, FiUser, FiPackage } from "react-icons/fi";
import Api from "../api/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await Api.get(`/admin/users/${id}`);
        if (res.data.success) {
          setUser(res.data.user);
          setAddresses(res.data.addresses || []);
        }
      } catch (err) {
        toast.error("Failed to load customer: " + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchUser();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#F8FAFC]">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-[#635BFF] rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] p-4 text-center">
        <p className="text-sm font-bold text-gray-700 mb-4">Customer not found.</p>
        <button onClick={() => navigate("/admin/users")} className="text-xs font-bold text-[#635BFF] underline">
          Back to Customers
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen font-sans text-[#1E293B] p-4 sm:p-6 md:p-8">
      <ToastContainer />
      <div className="max-w-4xl mx-auto">

        <button
          onClick={() => navigate("/admin/users")}
          className="inline-flex items-center gap-2 px-3 py-1.5 border border-gray-200 text-gray-500 hover:text-[#1E1B4B] hover:border-[#1E1B4B] rounded-lg text-xs font-bold transition bg-white shadow-sm mb-6"
        >
          <FiArrowLeft size={13} /> Back to Customers
        </button>

        {/* Profile Card */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-[#635BFF] flex items-center justify-center font-bold text-xl shadow-sm shrink-0">
              {(user.name || "?").charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-bold text-[#1E1B4B] truncate">{user.name || "Unnamed Customer"}</h1>
              <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-0.5">
                <FiMail size={12} /> {user.email}
              </p>
            </div>
            <span className={`ml-auto shrink-0 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full ${
              user.isVerified ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-gray-500"
            }`}>
              {user.isVerified ? "Verified" : "Unverified"}
            </span>
          </div>
        </div>

        {/* Saved Addresses */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
          <div className="p-5 border-b border-gray-50 flex items-center gap-2">
            <FiMapPin className="text-[#635BFF]" size={16} />
            <h3 className="font-bold text-sm text-[#1E1B4B]">Saved Addresses ({addresses.length})</h3>
          </div>

          {addresses.length > 0 ? (
            <div className="divide-y divide-gray-50">
              {addresses.map((addr) => (
                <div key={addr._id} className="p-5 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-800">
                      {addr.firstName} {addr.lastName}
                      {addr.isDefault && (
                        <span className="ml-2 text-[9px] font-bold uppercase tracking-wide bg-indigo-50 text-[#635BFF] px-2 py-0.5 rounded-full">
                          Default
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      {addr.flatColony}, {addr.city}, {addr.state} {addr.zipCode}, {addr.country}
                    </p>
                    {addr.mobileNumber?.number && (
                      <p className="text-xs text-gray-500 mt-1">
                        {addr.mobileNumber.countryCode} {addr.mobileNumber.number}
                      </p>
                    )}
                  </div>
                  <p className="text-[10px] text-gray-400 shrink-0 whitespace-nowrap">
                    Added {new Date(addr.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-10 text-center text-gray-400 text-sm font-medium">
              This customer hasn't saved any addresses yet.
            </div>
          )}
        </div>

        {/* Order History (uses the orders already populated on the user doc) */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-50 flex items-center gap-2">
            <FiPackage className="text-[#635BFF]" size={16} />
            <h3 className="font-bold text-sm text-[#1E1B4B]">Order History ({user.orders?.length || 0})</h3>
          </div>
          {user.orders && user.orders.length > 0 ? (
            <div className="divide-y divide-gray-50">
              {user.orders.map((order) => (
                <div key={order._id} className="p-5 flex items-center justify-between gap-4">
                  <p className="text-xs font-mono text-gray-500">#{order._id?.toString().slice(-8).toUpperCase()}</p>
                  <p className="text-xs font-bold text-gray-800">{order.orderStatus}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-10 text-center text-gray-400 text-sm font-medium">
              No orders placed yet.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default UserDetail;