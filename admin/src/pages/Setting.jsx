import React, { useState, useEffect } from 'react';
import {
  FiSliders,
  FiUser,
  FiGlobe,
  FiLock,
  FiSave,
  FiRefreshCw,
  FiCheckCircle
} from 'react-icons/fi';
import Api from "../api/api";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Setting = () => {
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  const [formData, setFormData] = useState({
    storeName: "",
    supportEmail: "",
    currency: "PKR",
    taxRate: "",
    deliveryCharge: "",
    freeShippingThreshold: "",
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setFetchLoading(true);
        const { data } = await Api.get("/settings");
        if (data.success) {
          const s = data.settings;
          setFormData({
            storeName: s.storeName || "",
            supportEmail: s.supportEmail || "",
            currency: s.currency || "PKR",
            taxRate: s.taxRate ?? "",
            deliveryCharge: s.deliveryCharge ?? "",
            freeShippingThreshold: s.freeShippingThreshold ?? "",
          });
        }
      } catch (err) {
        toast.error("Failed to load settings: " + (err.response?.data?.message || err.message));
      } finally {
        setFetchLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await Api.put("/settings", formData);
      toast.success("System configurations updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="bg-[#F8FAFC] min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-[#635BFF] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen font-sans text-[#1E293B] p-4 sm:p-6 md:p-8 lg:p-12">
      <div className="max-w-4xl mx-auto min-w-0">
        <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#1E1B4B]">System Settings</h1>
            <p className="text-xs md:text-sm text-gray-400 mt-0.5">
              Control center. Calibrate core platform parameters, checkout values, and keys access.
            </p>
          </div>
          <button
            type="submit"
            form="admin-settings-form"
            disabled={loading}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#635BFF] hover:bg-[#5149E4] disabled:bg-indigo-400 text-white rounded-xl text-xs font-bold tracking-wide transition-all shadow-md active:scale-[0.98] self-start sm:self-center shrink-0"
          >
            {loading ? <FiRefreshCw className="animate-spin" size={14} /> : <FiSave size={14} />}
            {loading ? "SAVING CONFIGS..." : "SAVE CHANGES"}
          </button>
        </header>

        <ToastContainer />

        <form id="admin-settings-form" onSubmit={handleSaveSettings} className="space-y-6">

          {/* SECTION 1: CORE STORE DATA */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-w-0">
            <div className="p-5 border-b border-gray-50 bg-slate-50/50 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-50 text-[#635BFF] shrink-0">
                <FiGlobe className="text-base" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-xs md:text-sm uppercase tracking-wider text-[#1E1B4B]">Store Identity</h3>
                <p className="text-[10px] md:text-xs text-gray-400">Public profile and metadata configurations</p>
              </div>
            </div>
            <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] md:text-xs font-bold text-gray-400 uppercase tracking-wide">Brand Name</label>
                <input
                  type="text"
                  name="storeName"
                  value={formData.storeName}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 md:py-3 border border-gray-200 rounded-xl bg-white text-xs md:text-sm font-semibold text-gray-700 focus:border-[#635BFF] focus:ring-1 focus:ring-[#635BFF] outline-none transition"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] md:text-xs font-bold text-gray-400 uppercase tracking-wide">Support Gateway Email</label>
                <input
                  type="email"
                  name="supportEmail"
                  value={formData.supportEmail}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 md:py-3 border border-gray-200 rounded-xl bg-white text-xs md:text-sm font-semibold text-gray-700 focus:border-[#635BFF] focus:ring-1 focus:ring-[#635BFF] outline-none transition"
                  required
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: REGIONAL & CURRENCY */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-w-0">
            <div className="p-5 border-b border-gray-50 bg-slate-50/50 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-700 shrink-0">
                <FiSliders className="text-base" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-xs md:text-sm uppercase tracking-wider text-[#1E1B4B]">Regional & Finances</h3>
                <p className="text-[10px] md:text-xs text-gray-400">Manage transactional variables and pricing matrix parameters</p>
              </div>
            </div>
            <div className="p-6 md:p-8 grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] md:text-xs font-bold text-gray-400 uppercase tracking-wide">Currency</label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 md:py-3 border border-gray-200 rounded-xl bg-white text-xs md:text-sm font-semibold text-gray-700 focus:border-[#635BFF] focus:ring-1 focus:ring-[#635BFF] outline-none transition"
                >
                  <option value="PKR">PKR — Pakistani Rupee</option>
                  <option value="USD">USD — US Dollar</option>
                  <option value="INR">INR — Indian Rupee</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] md:text-xs font-bold text-gray-400 uppercase tracking-wide">Tax Rate (%)</label>
                <input
                  type="number"
                  name="taxRate"
                  value={formData.taxRate}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 md:py-3 border border-gray-200 rounded-xl bg-white text-xs md:text-sm font-semibold text-gray-700 focus:border-[#635BFF] focus:ring-1 focus:ring-[#635BFF] outline-none transition"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] md:text-xs font-bold text-gray-400 uppercase tracking-wide">Delivery Charge</label>
                <input
                  type="number"
                  name="deliveryCharge"
                  value={formData.deliveryCharge}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 md:py-3 border border-gray-200 rounded-xl bg-white text-xs md:text-sm font-semibold text-gray-700 focus:border-[#635BFF] focus:ring-1 focus:ring-[#635BFF] outline-none transition"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] md:text-xs font-bold text-gray-400 uppercase tracking-wide">Free Shipping Threshold</label>
                <input
                  type="number"
                  name="freeShippingThreshold"
                  value={formData.freeShippingThreshold}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 md:py-3 border border-gray-200 rounded-xl bg-white text-xs md:text-sm font-semibold text-gray-700 focus:border-[#635BFF] focus:ring-1 focus:ring-[#635BFF] outline-none transition"
                  placeholder="Order total above which shipping is free"
                />
              </div>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Setting;