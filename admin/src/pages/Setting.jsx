import React, { useState } from 'react';
import {
  FiSliders,
  FiGlobe,
  FiSave,
  FiRefreshCw,
  FiUploadCloud,
  FiX,
  FiShare2
} from 'react-icons/fi';
import Api, { BACKEND_URL } from "../api/api";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Setting = () => {
  const [loading, setLoading] = useState(false);

  const emptyFormData = {
    storeName: "",
    supportEmail: "",
    currency: "PKR",
    taxRate: "",
    deliveryCharge: "",
    freeShippingThreshold: "",
    description: "",
  };
  const emptySocialLinks = {
    facebook: "",
    instagram: "",
    twitter: "",
    youtube: "",
  };

  const [formData, setFormData] = useState(emptyFormData);
  const [socialLinks, setSocialLinks] = useState(emptySocialLinks);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSocialChange = (platform, value) => {
    setSocialLinks(prev => ({ ...prev, [platform]: value }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => payload.append(key, value));
      payload.append("socialLinks", JSON.stringify(socialLinks));
      if (logoFile) payload.append("logo", logoFile);

      await Api.put("/settings", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("System configurations updated successfully!");

      setFormData(emptyFormData);
      setSocialLinks(emptySocialLinks);
      setLogoFile(null);
      setLogoPreview("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen font-sans text-[#1E293B] p-4 sm:p-6 md:p-8 lg:p-12">
      <div className="max-w-4xl mx-auto min-w-0">
        <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl md:text-2xl font-bold tracking-tight italic text-[#1E1B4B]">System Settings</h1>
           
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

          {/* SECTION 1: BRANDING */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-w-0">
            <div className="p-5 border-b border-gray-50 bg-slate-50/50 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-50 text-[#635BFF] shrink-0">
                <FiGlobe className="text-base" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-xs md:text-sm uppercase tracking-wider text-[#1E1B4B]">Store Identity & Branding</h3>
              </div>
            </div>
            <div className="p-6 md:p-8 space-y-5">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
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

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] md:text-xs font-bold text-gray-400 uppercase tracking-wide">
                  Platform Description <span className="normal-case font-medium text-gray-400"></span>
                </label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3.5 py-2.5 md:py-3 border border-gray-200 rounded-xl bg-white text-xs md:text-sm font-medium text-gray-700 focus:border-[#635BFF] focus:ring-1 focus:ring-[#635BFF] outline-none transition resize-none"
                  placeholder="Add here"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] md:text-xs font-bold text-gray-400 uppercase tracking-wide">Store Logo</label>
                <div className="flex items-center gap-4">
                  {logoPreview ? (
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200 bg-slate-50 group shrink-0">
                      <img src={logoPreview} alt="Logo preview" className="w-full h-full object-contain p-2" />
                      <button
                        type="button"
                        onClick={() => { setLogoPreview(""); setLogoFile(null); }}
                        className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                      >
                        <FiX className="text-white" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-300 shrink-0">
                      <FiUploadCloud size={22} />
                    </div>
                  )}
                  <label className="px-4 py-2.5 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-slate-50 cursor-pointer transition">
                    Upload New Logo
                    <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                  </label>
                </div>
              </div>

            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-w-0">
            <div className="p-5 border-b border-gray-50 bg-slate-50/50 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-700 shrink-0">
                <FiSliders className="text-base" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-xs md:text-sm uppercase tracking-wider text-[#1E1B4B]">Regional & Finances</h3>
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
                  <option value="USD">USD — US Dollar ($)</option>
                  <option value="INR">INR — Indian Rupee (₹)</option>
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
                  placeholder="Add Amount"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: SOCIAL LINKS */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-w-0">
            <div className="p-5 border-b border-gray-50 bg-slate-50/50 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 shrink-0">
                <FiShare2 className="text-base" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-xs md:text-sm uppercase tracking-wider text-[#1E1B4B]">Social Media Links</h3>
              </div>
            </div>
            <div className="p-6 md:p-8 grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] md:text-xs font-bold text-gray-400 uppercase tracking-wide">Facebook URL</label>
                <input
                  type="url"
                  value={socialLinks.facebook}
                  onChange={(e) => handleSocialChange("facebook", e.target.value)}
                  placeholder="https://facebook.com/yourstore"
                  className="w-full px-3.5 py-2.5 md:py-3 border border-gray-200 rounded-xl bg-white text-xs md:text-sm font-medium text-gray-700 focus:border-[#635BFF] focus:ring-1 focus:ring-[#635BFF] outline-none transition"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] md:text-xs font-bold text-gray-400 uppercase tracking-wide">Instagram URL</label>
                <input
                  type="url"
                  value={socialLinks.instagram}
                  onChange={(e) => handleSocialChange("instagram", e.target.value)}
                  placeholder="https://instagram.com/yourstore"
                  className="w-full px-3.5 py-2.5 md:py-3 border border-gray-200 rounded-xl bg-white text-xs md:text-sm font-medium text-gray-700 focus:border-[#635BFF] focus:ring-1 focus:ring-[#635BFF] outline-none transition"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] md:text-xs font-bold text-gray-400 uppercase tracking-wide">Twitter / X URL</label>
                <input
                  type="url"
                  value={socialLinks.twitter}
                  onChange={(e) => handleSocialChange("twitter", e.target.value)}
                  placeholder="https://x.com/yourstore"
                  className="w-full px-3.5 py-2.5 md:py-3 border border-gray-200 rounded-xl bg-white text-xs md:text-sm font-medium text-gray-700 focus:border-[#635BFF] focus:ring-1 focus:ring-[#635BFF] outline-none transition"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] md:text-xs font-bold text-gray-400 uppercase tracking-wide">YouTube URL</label>
                <input
                  type="url"
                  value={socialLinks.youtube}
                  onChange={(e) => handleSocialChange("youtube", e.target.value)}
                  placeholder="https://youtube.com/@yourstore"
                  className="w-full px-3.5 py-2.5 md:py-3 border border-gray-200 rounded-xl bg-white text-xs md:text-sm font-medium text-gray-700 focus:border-[#635BFF] focus:ring-1 focus:ring-[#635BFF] outline-none transition"
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