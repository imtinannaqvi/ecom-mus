import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiMapPin, FiMail, FiPackage, FiCopy, FiCheck, FiHome } from "react-icons/fi";
import Api from "../api/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const STATUS_STYLES = {
  delivered: "bg-emerald-50 text-emerald-600 border-emerald-100",
  shipped: "bg-indigo-50 text-[#635BFF] border-indigo-100",
  processing: "bg-amber-50 text-amber-600 border-amber-100",
  pending: "bg-amber-50 text-amber-600 border-amber-100",
  cancelled: "bg-rose-50 text-rose-600 border-rose-100",
  refunded: "bg-slate-50 text-gray-500 border-gray-200/60",
};

const statusStyle = (status) =>
  STATUS_STYLES[(status || "").toLowerCase()] || "bg-slate-50 text-gray-500 border-gray-200/60";

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

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

  const copyEmail = async () => {
    if (!user?.email) return;
    try {
      await navigator.clipboard.writeText(user.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Couldn't copy email");
    }
  };

  const BackButton = () => (
    <button
      onClick={() => navigate("/admin/users")}
      className="inline-flex items-center gap-2 px-3 py-1.5 border border-gray-200 text-gray-500 hover:text-[#1E1B4B] hover:border-[#1E1B4B] rounded-lg text-xs font-bold transition bg-white shadow-sm mb-6"
    >
      <FiArrowLeft size={13} /> Back to Customers
    </button>
  );

  if (loading) {
    return (
      <div className="bg-[#F8FAFC] min-h-screen font-sans p-4 sm:p-6 md:p-8">
        <div className="max-w-4xl mx-auto animate-pulse">
          <div className="h-8 w-40 bg-white border border-gray-100 rounded-lg mb-6" />
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gray-100 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-40 bg-gray-100 rounded" />
                <div className="h-3 w-52 bg-gray-100 rounded" />
              </div>
              <div className="h-6 w-20 bg-gray-100 rounded-full" />
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm h-40 mb-6" />
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm h-40" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] p-4 text-center">
        <div className="p-3 bg-white border border-gray-100 text-gray-300 rounded-xl mb-4 shadow-sm">
          <FiPackage size={22} />
        </div>
        <p className="text-sm font-bold text-gray-700 mb-1">Customer not found</p>
        <p className="text-xs text-gray-400 mb-4">This account may have been deleted or the link is incorrect.</p>
        <button
          onClick={() => navigate("/admin/users")}
          className="text-xs font-bold text-white bg-[#635BFF] hover:bg-[#5347e8] px-4 py-2 rounded-xl transition-colors"
        >
          Back to Customers
        </button>
      </div>
    );
  }

  const defaultAddress = addresses.find((a) => a.isDefault) || addresses[0];
  const orderCount = user.orders?.length || 0;

  return (
    <div className="bg-[#F8FAFC] min-h-screen font-sans text-[#1E293B] p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">

        <BackButton />

        {/* Profile header */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-6">
          <div className="flex items-start sm:items-center gap-4 flex-wrap sm:flex-nowrap">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-[#635BFF] flex items-center justify-center font-bold text-xl shadow-sm shrink-0">
              {(user.name || "?").charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg font-bold text-[#1E1B4B] truncate">{user.name || "Unnamed Customer"}</h1>
              <button
                onClick={copyEmail}
                className="text-xs text-gray-400 flex items-center gap-1.5 mt-0.5 hover:text-[#635BFF] transition-colors group"
                title="Copy email"
              >
                <FiMail size={12} />
                <span className="truncate max-w-[220px]">{user.email}</span>
                {copied ? (
                  <FiCheck size={11} className="text-emerald-500 shrink-0" />
                ) : (
                  <FiCopy size={11} className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                )}
              </button>
            </div>
            <span className={`ml-auto shrink-0 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full ${
              user.isVerified ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-gray-500"
            }`}>
              {user.isVerified ? "Verified" : "Unverified"}
            </span>
          </div>

          {/* Quick stats strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5 pt-5 border-t border-gray-50">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Orders</p>
              <p className="text-lg font-extrabold text-[#1E293B] mt-0.5">{orderCount}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Saved addresses</p>
              <p className="text-lg font-extrabold text-[#1E293B] mt-0.5">{addresses.length}</p>
            </div>
            <div className="col-span-2 sm:col-span-1 min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Primary location</p>
              <p className="text-sm font-bold text-[#1E293B] mt-0.5 truncate">
                {defaultAddress ? `${defaultAddress.city}, ${defaultAddress.country}` : "—"}
              </p>
            </div>
          </div>
        </div>

        {/* Saved addresses */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
          <div className="p-5 border-b border-gray-50 flex items-center gap-2">
            <FiMapPin className="text-[#635BFF]" size={16} />
            <h3 className="font-bold text-sm text-[#1E1B4B]">Saved Addresses ({addresses.length})</h3>
          </div>

          {addresses.length > 0 ? (
            <div className="divide-y divide-gray-50">
              {addresses.map((addr) => (
                <div key={addr._id} className="p-5 flex items-start gap-4 hover:bg-slate-50/50 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-slate-50 text-gray-400 flex items-center justify-center shrink-0">
                    <FiHome size={14} />
                  </div>
                  <div className="min-w-0 flex-1 flex items-start justify-between gap-4 flex-wrap sm:flex-nowrap">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-800 flex items-center flex-wrap gap-2">
                        {addr.firstName} {addr.lastName}
                        {addr.isDefault && (
                          <span className="text-[9px] font-bold uppercase tracking-wide bg-indigo-50 text-[#635BFF] px-2 py-0.5 rounded-full">
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
                </div>
              ))}
            </div>
          ) : (
            <div className="p-10 text-center">
              <div className="p-3 bg-slate-50 border border-gray-100 text-gray-300 rounded-xl mb-3 inline-block">
                <FiMapPin size={18} />
              </div>
              <p className="text-xs font-semibold text-gray-500">No saved addresses</p>
              <p className="text-[10px] text-gray-400 mt-0.5">This customer hasn't added a delivery address yet</p>
            </div>
          )}
        </div>

        {/* Order history */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-50 flex items-center gap-2">
            <FiPackage className="text-[#635BFF]" size={16} />
            <h3 className="font-bold text-sm text-[#1E1B4B]">Order History ({orderCount})</h3>
          </div>
          {orderCount > 0 ? (
            <div className="divide-y divide-gray-50">
              {user.orders.map((order) => (
                <div key={order._id} className="p-5 flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-slate-50 text-gray-400 flex items-center justify-center shrink-0">
                      <FiPackage size={14} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-mono font-bold text-gray-700">
                        #{order._id?.toString().slice(-8).toUpperCase()}
                      </p>
                      {order.createdAt && (
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full border shrink-0 ${statusStyle(order.orderStatus)}`}>
                    {order.orderStatus || "Unknown"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-10 text-center">
              <div className="p-3 bg-slate-50 border border-gray-100 text-gray-300 rounded-xl mb-3 inline-block">
                <FiPackage size={18} />
              </div>
              <p className="text-xs font-semibold text-gray-500">No orders placed yet</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Orders will appear here once this customer checks out</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default UserDetail;