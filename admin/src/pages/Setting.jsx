import React, { useState } from 'react';
import { 
  FiSliders, 
  FiUser, 
  FiGlobe, 
  FiLock, 
  FiSave, 
  FiRefreshCw, 
  FiCheckCircle 
} from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Setting = () => {
  const [loading, setLoading] = useState(false);
  
  // Settings Form States
  const [formData, setFormData] = useState({
    storeName: "Maurish Apparel",
    supportEmail: "support@maurish.com",
    currency: "PKR",
    taxRate: "15",
    currentPassword: "",
    newPassword: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setLoading(true);

    // Mock Save Pipeline Action
    setTimeout(() => {
      setLoading(false);
      toast.success("System configurations updated successfully!");
    }, 1200);
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen font-sans text-[#1E293B]">
      <div className="max-w-4xl mx-auto">
        
        {/* Modern Header Layout */}
        <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#1E1B4B]">System Settings</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Control center. Calibrate core platform parameters, checkout values, and keys access.
            </p>
          </div>
          
          <button
            type="submit"
            form="admin-settings-form"
            disabled={loading}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#635BFF] hover:bg-[#5149E4] disabled:bg-indigo-400 text-white rounded-xl text-xs font-bold tracking-wide transition-all shadow-md active:scale-[0.98] self-start sm:self-center"
          >
            {loading ? <FiRefreshCw className="animate-spin" size={14} /> : <FiSave size={14} />}
            {loading ? "SAVING CONFIGS..." : "SAVE CHANGES"}
          </button>
        </header>

        <ToastContainer />

        <form id="admin-settings-form" onSubmit={handleSaveSettings} className="space-y-6">
          
          {/* SECTION 1: CORE STORE DATA */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-50 bg-slate-50/50 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-50 text-[#635BFF]">
                <FiGlobe className="text-base" />
              </div>
              <div>
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#1E1B4B]">Store Identity</h3>
                <p className="text-[10px] text-gray-400">Public profile and metadata configurations</p>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Brand Name</label>
                <input 
                  type="text" 
                  name="storeName"
                  value={formData.storeName}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-white text-xs font-semibold text-gray-700 focus:border-[#635BFF] focus:ring-1 focus:ring-[#635BFF] outline-none transition"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Support Gateway Email</label>
                <input 
                  type="email" 
                  name="supportEmail"
                  value={formData.supportEmail}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-white text-xs font-semibold text-gray-700 focus:border-[#635BFF] focus:ring-1 focus:ring-[#635BFF] outline-none transition"
                  required
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: REGIONAL & CURRENCY ARRAYS */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-50 bg-slate-50/50 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
                <FiSliders className="text-base" />
              </div>
              <div>
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#1E1B4B]">Regional & Finances</h3>
                <p className="text-[10px] text-gray-400">Manage transactional variables and pricing matrix parameters</p>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Base Currency Symbol</label>
                <select 
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-white text-xs font-semibold text-gray-700 focus:border-[#635BFF] focus:ring-1 focus:ring-[#635BFF] outline-none transition cursor-pointer"
                >
                  <option value="PKR">PKR (Rs.)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Standard GST Rate (%)</label>
                <input 
                  type="number" 
                  name="taxRate"
                  value={formData.taxRate}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-white text-xs font-semibold text-gray-700 focus:border-[#635BFF] focus:ring-1 focus:ring-[#635BFF] outline-none transition"
                  min="0"
                  max="100"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: SYSTEM SECURITY KEYHOLDS */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-50 bg-slate-50/50 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                <FiLock className="text-base" />
              </div>
              <div>
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#1E1B4B]">Security Guardrails</h3>
                <p className="text-[10px] text-gray-400">Update root administrative passwords access tokens</p>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Current Admin Key</label>
                <input 
                  type="password" 
                  name="currentPassword"
                  placeholder="••••••••"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-white text-xs font-semibold text-gray-700 focus:border-[#635BFF] focus:ring-1 focus:ring-[#635BFF] outline-none transition placeholder:text-gray-300"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">New Secure Identity Password</label>
                <input 
                  type="password" 
                  name="newPassword"
                  placeholder="Min 8 secure chars"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-white text-xs font-semibold text-gray-700 focus:border-[#635BFF] focus:ring-1 focus:ring-[#635BFF] outline-none transition placeholder:text-gray-300"
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