import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FiPackage, FiUser, FiCreditCard, FiClock, FiTruck, 
  FiCheckCircle, FiRefreshCw, FiTrash2, FiArrowLeft, FiAlertTriangle, FiMapPin 
} from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Api, { BACKEND_URL } from '../api/api'; // Aapka setup kiya hua Axios instance

const ProcessOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Core Functional States
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [status, setStatus] = useState("");



  // 🔌 Operation 1: Fetch Order Details Workflow Node
  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      // Apne backend route ke mutabik url set kiya hai
      const res = await Api.get(`/admin/get-order-by-id/${id}`);
      if (res.data.success) {
        setOrder(res.data.order);
        setStatus(res.data.order?.orderStatus || "Processing");
      }
    } catch (err) {
      console.error("Fetch Data Stream Error:", err);
      toast.error(err.response?.data?.message || "Failed to load order matrix.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchOrderDetails();
  }, [id]);

  // ⚡ Operation 2: Shift / Update Status Mechanics
  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      const res = await Api.put(`/admin/update-order-status/${id}`, { orderStatus: status });
      if (res.data.success) {
        toast.success(res.data.message || "Fulfillment state migrated successfully.");
        fetchOrderDetails();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Status shift pipeline failed.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleOrderPurge = async () => {
    const doubleConfirm = window.confirm(
      "🛑 CRITICAL ACTION REQUIRED: Are you completely sure you want to permanently purge this order tracking data entry from Maurish registries?"
    );
    if (!doubleConfirm) return;
    console.log('data is sending to backend' , id)
    try {
      setActionLoading(true);
      const res = await Api.delete(`/admin/delete-order/${id}`);
      if (res.data.success) {
        toast.error("Order tracking sheet destroyed cleanly. Redirecting...");
        setTimeout(() => navigate('/admin/orders'), 1500);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Erase operation fault.");
    } finally {
      setActionLoading(false);
    }
  };

  // Status Style Manager Engine
  const getStatusBadgeStyle = (node) => {
    switch (node) {
      case "Processing": return "bg-amber-50 text-amber-700 border-amber-200/60";
      case "Shipped": return "bg-indigo-50 text-indigo-700 border-indigo-200/60";
      case "Delivered": return "bg-emerald-50 text-emerald-700 border-emerald-200/60";
      case "Cancelled": return "bg-rose-50 text-rose-700 border-rose-200/60";
      default: return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-3">
          <FiRefreshCw className="animate-spin text-[#635BFF]" size={28} />
          <p className="text-xs font-bold text-gray-400 tracking-wider uppercase">Compiling Order Document Payload...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] p-4 text-center">
        <FiAlertTriangle className="text-rose-500 mb-2" size={32} />
        <p className="text-sm font-bold text-gray-700">Order tracking key registry empty or corrupted.</p>
        <button onClick={() => navigate('/admin/orders')} className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[#635BFF]">
          <FiArrowLeft /> Back to Pipeline Index
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-[#F8FAFC] min-h-screen font-sans text-[#1E293B]">
      <div className="max-w-6xl mx-auto">
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        
        {/* Navigation Control Top Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <button 
            onClick={() => navigate('/admin/orders')}
            className="inline-flex items-center gap-2 px-3 py-1.5 border border-gray-200 text-gray-500 hover:text-[#1E1B4B] hover:border-gray-400 rounded-xl text-xs font-bold transition bg-white shadow-sm self-start"
          >
            <FiArrowLeft size={13} /> Pipeline Board
          </button>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#1E1B4B] sm:text-right">
              Fulfillment Desk
            </h1>
            <p className="text-xs font-mono font-bold text-[#635BFF] uppercase tracking-wide mt-0.5">
              Ticket ID: #{order._id}
            </p>
          </div>
        </div>

        {/* Core Layout Grid System */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT COLUMN: PRIMARY INVOICE AND PACKAGING METADATA */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 1. Customer Profiles & Logistic Fields */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="flex items-center gap-2 font-bold text-sm text-gray-800 mb-4 border-b border-gray-50 pb-3">
                <FiUser className="text-[#635BFF]" size={16} /> 
                <span>Buyer Profile & Dispatch Address</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-4 text-xs font-medium text-gray-600">
                <div>
                  <span className="text-gray-400 uppercase text-[9px] block mb-0.5 tracking-wider">Account Handshake</span>
                  <span className="text-gray-800 font-bold text-sm">{order.user?.name || "Guest Checkout"}</span>
                </div>
                <div>
                  <span className="text-gray-400 uppercase text-[9px] block mb-0.5 tracking-wider">Communication Node</span>
                  <span className="text-gray-800 font-bold text-sm">{order.user?.email || "No Email Bound"}</span>
                </div>
                <div className="md:col-span-2 border-t border-gray-50 pt-3">
                  <span className="text-gray-400 uppercase text-[9px] block mb-1 tracking-wider flex items-center gap-1">
                    <FiMapPin size={10} /> Fulfillment Drop-off Location
                  </span>
                  <span className="text-gray-800 font-bold leading-relaxed text-xs">
                    {order.shippingAddress?.address || "Address registry data field empty in database."}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Accounting Ledger & Settled Status */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="flex items-center gap-2 font-bold text-sm text-gray-800 mb-4 border-b border-gray-50 pb-3">
                <FiCreditCard className="text-emerald-500" size={16} /> 
                <span>Financial Invoice Ledger</span>
              </h3>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs font-semibold">
                <div>
                  <span className="text-gray-400 uppercase text-[9px] block mb-1.5 tracking-wider">Payment Parameter</span>
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold border uppercase tracking-wider ${
                    order.paymentStatus === 'Completed' || order.isPaid
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                      : 'bg-amber-50 text-amber-700 border-amber-100'
                  }`}>
                    {order.paymentStatus} ({order.paymentMethod})
                  </span>
                </div>
                <div className="sm:text-right">
                  <span className="text-gray-400 uppercase text-[9px] block mb-0.5 tracking-wider">Total Value Claimed</span>
                  <p className="font-black text-lg text-[#1E1B4B]">Rs. {order.totalPrice?.toLocaleString()}</p>
                  <span className="text-[10px] text-gray-400 font-normal">Delivery Surcharge: Rs. {order.deliveryCharge || 0}</span>
                </div>
              </div>
            </div>

            {/* 3. Package Items Stack Mapping Loop */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="flex items-center gap-2 font-bold text-sm text-gray-800 mb-4 border-b border-gray-50 pb-3">
                <FiPackage className="text-orange-500" size={16} /> 
                <span>Basket Product Stream Bundle ({order.orderItems?.length || 0})</span>
              </h3>
              <div className="space-y-4 divide-y divide-gray-50">
                {order.orderItems?.map((item, index) => (
                  <div key={item._id || index} className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${index > 0 ? "pt-4" : ""}`}>
                    <div className="flex items-center gap-3.5">
                      {/* Product Thumbnail Asset */}
                      <div className="w-12 h-12 bg-slate-50 border border-gray-100 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center">
                        {item.productId?.images?.length > 0 ? (
                          <img src={`${BACKEND_URL}${item.productId.images[0].url}`} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[9px] font-extrabold text-gray-300 uppercase tracking-widest">TEE</span>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-xs text-gray-800">{item.productId?.name || "Premium Maurish Asset Item"}</p>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1 text-[10px] text-gray-400 font-bold font-mono uppercase">
                          {item.size && <span>Size: {item.size}</span>}
                          {item.color && <span>• Color: {item.color}</span>}
                          <span>• Code: {item.productId?._id?.substring(0,6)}...</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs font-semibold text-gray-500 self-end sm:self-center">
                      {item.quantity} x Rs. {item.price} = <span className="text-gray-800 font-extrabold text-sm pl-1">Rs. {item.quantity * item.price}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: ACTION CONTROLS & ERASURE PANELS */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Box Module 1: State Workflow Operator Mutation */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 sticky top-6 space-y-5">
              <div>
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#1E1B4B] text-center">Fulfillment System</h3>
                <p className="text-[10px] text-gray-400 font-medium text-center mt-1">Alter active shipment status parameters.</p>
              </div>
              
              <div className="text-center p-3 border rounded-xl bg-slate-50/50">
                <p className="text-[10px] text-gray-400 uppercase font-extrabold tracking-wider">Current Pipeline Node</p>
                <span className={`inline-flex items-center justify-center mt-2 px-3 py-1 border rounded-md text-[10px] font-extrabold uppercase tracking-widest ${getStatusBadgeStyle(order.orderStatus)}`}>
                  {order.orderStatus || "Processing"}
                </span>
              </div>

              <form onSubmit={handleStatusUpdate} className="space-y-3.5">
                <select 
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-700 outline-none focus:border-[#635BFF] focus:ring-1 focus:ring-[#635BFF] transition cursor-pointer"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  disabled={actionLoading}
                >
                  <option value="Processing">Processing Department</option>
                  <option value="Shipped">Dispatched / Shipped</option>
                  <option value="Delivered">Arrived / Delivered</option>
                  <option value="Cancelled">Void / Cancelled</option>
                </select>

                <button 
                  type="submit"
                  disabled={actionLoading}
                  className="w-full bg-[#1E1B4B] text-white py-3 rounded-xl text-xs font-bold tracking-widest hover:bg-[#282467] transition shadow-md active:scale-[0.98] flex items-center justify-center gap-2 uppercase disabled:opacity-60"
                >
                  <FiRefreshCw className={actionLoading ? "animate-spin" : ""} size={12} />
                  <span>{actionLoading ? "Transitioning Node..." : "Commit Status Shift"}</span>
                </button>
              </form>
            </div>

            {/* Box Module 2: Danger Administrative Destruction Layer */}
            <div className="bg-rose-50/40 p-5 rounded-2xl border border-rose-100/70 space-y-3.5">
              <div>
                <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wide flex items-center gap-1.5 justify-center sm:justify-start">
                  <FiAlertTriangle size={14} /> Critical Admin Zone
                </h4>
                <p className="text-[10px] text-rose-500/80 font-medium mt-1 leading-relaxed text-center sm:text-left">
                  Erasing this package data profile breaks systemic accounting metrics across shopper history streams. Action is absolute.
                </p>
              </div>

              <button 
                type="button"
                onClick={handleOrderPurge}
                disabled={actionLoading}
                className="w-full border border-rose-200 hover:border-transparent bg-white hover:bg-rose-600 text-rose-600 hover:text-white py-2.5 rounded-xl text-xs font-bold transition duration-200 shadow-sm flex items-center justify-center gap-2"
              >
                <FiTrash2 size={13} />
                <span>Purge Entire Record</span>
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default ProcessOrder;