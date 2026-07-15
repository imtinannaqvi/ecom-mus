import React, { useState, useEffect } from "react";
import { FiPlus, FiTrash2, FiTag, FiX } from "react-icons/fi";
import Api from "../api/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  const [form, setForm] = useState({
    code: "",
    discountType: "fixed",
    discountValue: "",
    maxDiscountAmount: "",
    minOrderAmount: "",
    expiryDate: "",
    usageLimit: "",
  });

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await Api.get("/coupons/admin/all");
      setCoupons(res.data.coupons || []);
    } catch (err) {
      toast.error("Failed to load coupons: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const resetForm = () => {
    setForm({
      code: "",
      discountType: "fixed",
      discountValue: "",
      maxDiscountAmount: "",
      minOrderAmount: "",
      expiryDate: "",
      usageLimit: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.code || !form.discountValue) {
      return toast.error("Code and discount value are required");
    }

    setSubmitting(true);
    try {
      const payload = {
        code: form.code,
        discountType: form.discountType,
        discountValue: Number(form.discountValue),
        maxDiscountAmount: form.maxDiscountAmount ? Number(form.maxDiscountAmount) : null,
        minOrderAmount: form.minOrderAmount ? Number(form.minOrderAmount) : 0,
        expiryDate: form.expiryDate || null,
        usageLimit: form.usageLimit ? Number(form.usageLimit) : null,
      };
      await Api.post("/coupons/admin/create", payload);
      toast.success("Coupon created successfully!");
      resetForm();
      setShowForm(false);
      fetchCoupons();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create coupon");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleStatus = async (id) => {
    setTogglingId(id);
    try {
      const res = await Api.patch(`/coupons/admin/toggle-status/${id}`);
      setCoupons((prev) =>
        prev.map((c) => (c._id === id ? { ...c, isActive: res.data.coupon.isActive } : c))
      );
    } catch (err) {
      toast.error("Failed to update coupon status");
    } finally {
      setTogglingId(null);
    }
  };

 const deleteCoupon = async (id) => {
  try {
    await Api.delete(`/coupons/admin/${id}`);
    toast.success("Coupon deleted");
    setCoupons((prev) => prev.filter((c) => c._id !== id));
  } catch (err) {
    toast.error("Failed to delete coupon");
  }
};

  const formatDiscount = (c) =>
    c.discountType === "fixed" ? `Rs. ${c.discountValue} off` : `${c.discountValue}% off`;

  return (
    <div className="bg-[#F8FAFC] min-h-screen font-sans text-[#1E293B] p-4 sm:p-6 md:p-8">
      <div className="max-w-5xl mx-auto min-w-0">

        <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight italic text-[#1E1B4B]">Coupons</h1>
          </div>
          <button
            type="button"
            onClick={() => setShowForm((prev) => !prev)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#635BFF] hover:bg-[#5149E4] text-white rounded-xl text-xs font-bold tracking-wide transition-all shadow-md active:scale-[0.98] shrink-0 w-full sm:w-auto"
          >
            {showForm ? <FiX size={16} /> : <FiPlus size={16} />}
            {showForm ? "Cancel" : "New Coupon"}
          </button>
        </header>

        {/* Create Coupon Form */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-sm mb-6 space-y-5 transition-all"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase mb-1.5 block tracking-wider">
                  Coupon Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. WELCOME10"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-gray-200 rounded-xl focus:border-[#635BFF] focus:bg-white outline-none text-xs font-semibold transition-all uppercase"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase mb-1.5 block tracking-wider">
                  Discount Type
                </label>
                <select
                  value={form.discountType}
                  onChange={(e) => setForm({ ...form, discountType: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-gray-200 rounded-xl focus:border-[#635BFF] focus:bg-white outline-none text-xs font-semibold transition-all appearance-none"
                >
                  <option value="fixed">Fixed Amount (Rs.)</option>
                  <option value="percentage">Percentage (%)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase mb-1.5 block tracking-wider">
                  Discount Value {form.discountType === "fixed" ? "(Rs.)" : "(%)"}
                </label>
                <input
                  type="number"
                  min="0"
                  max={form.discountType === "percentage" ? 100 : undefined}
                  value={form.discountValue}
                  onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-gray-200 rounded-xl focus:border-[#635BFF] focus:bg-white outline-none text-xs font-semibold transition-all"
                  required
                />
              </div>

              {form.discountType === "percentage" && (
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase mb-1.5 block tracking-wider">
                    Max Discount Cap (Rs., optional)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="No cap"
                    value={form.maxDiscountAmount}
                    onChange={(e) => setForm({ ...form, maxDiscountAmount: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-gray-200 rounded-xl focus:border-[#635BFF] focus:bg-white outline-none text-xs font-semibold transition-all"
                  />
                </div>
              )}

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase mb-1.5 block tracking-wider">
                  Minimum Order Amount (Rs.)
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={form.minOrderAmount}
                  onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-gray-200 rounded-xl focus:border-[#635BFF] focus:bg-white outline-none text-xs font-semibold transition-all"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase mb-1.5 block tracking-wider">
                  Usage Limit (optional)
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="Unlimited"
                  value={form.usageLimit}
                  onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-gray-200 rounded-xl focus:border-[#635BFF] focus:bg-white outline-none text-xs font-semibold transition-all"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase mb-1.5 block tracking-wider">
                  Expiry Date (optional)
                </label>
                <input
                  type="date"
                  value={form.expiryDate}
                  onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-gray-200 rounded-xl focus:border-[#635BFF] focus:bg-white outline-none text-xs font-semibold transition-all"
                />
              </div>
            </div>

           <div className="flex justify-center mt-6">
  <button
    type="submit"
    disabled={submitting}
    className="w-48 h-14 rounded-xl font-bold text-xs tracking-widest bg-[#635BFF] hover:bg-[#5149E4] text-white transition-all active:scale-[0.99] disabled:opacity-50 shadow-md"
  >
    {submitting ? "CREATING..." : "Create Coupon"}
  </button>
</div>
          </form>
        )}

        {/* Coupons List */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-w-0">
          {loading ? (
<div className="p-16 flex justify-center"><div className="w-8 h-8 border-2 border-gray-200 border-t-[#635BFF] rounded-full animate-spin" /></div>          ) : coupons.length === 0 ? (
            <div className="p-16 text-center text-gray-400 text-sm font-medium">
              <FiTag className="mx-auto text-2xl mb-2 text-gray-300" />
              No coupons created yet.
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse min-w-[700px] md:min-w-0">
                <thead>
                  <tr className="border-b border-gray-100 text-[#8A94A6] text-xs font-semibold bg-gray-50/50">
                    <th className="p-4 font-medium text-[11px]">Code</th>
                    <th className="p-4 font-medium text-[11px]">Discount</th>
                    <th className="p-4 font-medium text-[11px]">Min Order</th>
                    <th className="p-4 font-medium text-[11px]">Usage</th>
                    <th className="p-4 font-medium text-[11px]">Expires</th>
                    <th className="p-4 font-medium text-[11px]">Status</th>
                    <th className="p-4 font-medium text-[11px] text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-[13px] font-medium">
                  {coupons.map((c) => (
                    <tr key={c._id} className="hover:bg-gray-50/40 transition-colors">
                      <td className="p-4 font-bold text-[#1E293B] tracking-wide whitespace-nowrap">{c.code}</td>
                      <td className="p-4 text-gray-600 whitespace-nowrap">{formatDiscount(c)}</td>
                      <td className="p-4 text-gray-500 whitespace-nowrap">{c.minOrderAmount > 0 ? `Rs. ${c.minOrderAmount}` : "None"}</td>
                      <td className="p-4 text-gray-500 whitespace-nowrap">
                        {c.usedCount}{c.usageLimit ? ` / ${c.usageLimit}` : " / ∞"}
                      </td>
                      <td className="p-4 text-gray-500 whitespace-nowrap">
                        {c.expiryDate ? new Date(c.expiryDate).toLocaleDateString() : "Never"}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <button
                          type="button"
                          disabled={togglingId === c._id}
                          onClick={() => toggleStatus(c._id)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide transition disabled:opacity-50 ${
                            c.isActive
                              ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                              : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                          }`}
                        >
                          {c.isActive ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="p-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => deleteCoupon(c._id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Coupons;