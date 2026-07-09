import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FiTrash2, FiFolder, FiLayers, FiAlertCircle, FiPlus } from "react-icons/fi";
import Api, { BACKEND_URL } from "../api/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Groups a flat subCategories array into { groupName: [sub, sub, ...] }.
const groupSubCategories = (subCategories = []) => {
  const groups = {};
  subCategories.forEach((sub) => {
    const key = sub.group && sub.group.trim() ? sub.group : "General";
    if (!groups[key]) groups[key] = [];
    groups[key].push(sub);
  });
  return groups;
};

const CategoryList = () => {
  const navigate = useNavigate();
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState(null);
  const [deletingCategoryId, setDeletingCategoryId] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await Api.get("/admin/all");
        if (isMounted) {
          setAllCategories(res.data.data ?? res.data ?? []);
        }
      } catch (err) {
        toast.error("Failed to fetch categories: " + err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchCategories();
    return () => { isMounted = false; };
  }, []);

  const deleteSubCategoryHandler = useCallback(async (subId) => {
    if (!window.confirm("Are you sure you want to delete this sub-category?")) return;
    try {
      await Api.delete(`/admin/delete/${subId}`);
      toast.success("Sub-Category deleted successfully!");
      setAllCategories((prevCategories) =>
        prevCategories.map((cat) => ({
          ...cat,
          subCategories: cat.subCategories ? cat.subCategories.filter((sub) => sub._id !== subId) : [],
        }))
      );
    } catch (err) {
      toast.error("Error deleting: " + (err.response?.data?.message || err.message));
    }
  }, []);

  const deleteMainCategoryHandler = useCallback(async (categoryId, categoryName, subCount) => {
    const warning = subCount > 0
      ? `Delete "${categoryName}"? This will also remove all ${subCount} of its sub-categories. This cannot be undone.`
      : `Delete "${categoryName}"? This cannot be undone.`;
    if (!window.confirm(warning)) return;

    setDeletingCategoryId(categoryId);
    try {
      await Api.delete(`/admin/main/${categoryId}`);
      toast.success(`${categoryName} category deleted successfully!`);
      setAllCategories((prev) => prev.filter((cat) => cat._id !== categoryId));
    } catch (err) {
      toast.error("Error deleting category: " + (err.response?.data?.message || err.message));
    } finally {
      setDeletingCategoryId(null);
    }
  }, []);

  const toggleCategoryStatusHandler = useCallback(async (categoryId, currentStatus) => {
    setTogglingId(categoryId);
    try {
      const res = await Api.patch(`/admin/toggle-status/${categoryId}`);
      const updated = res.data.data;
      setAllCategories((prevCategories) =>
        prevCategories.map((cat) =>
          cat._id === categoryId ? { ...cat, isActive: updated.isActive } : cat
        )
      );
      toast.success(
        updated.isActive
          ? `${updated.name} is now visible on the storefront`
          : `${updated.name} is now hidden from the storefront`
      );
    } catch (err) {
      toast.error("Error updating visibility: " + (err.response?.data?.message || err.message));
    } finally {
      setTogglingId(null);
    }
  }, []);

  const getSubImageSrc = (sub) => {
    if (!sub.image) return "";
    const rawPath = sub.image.url || sub.image.secure_url || sub.image.path || sub.image;
    if (typeof rawPath !== "string") return "";
    if (rawPath.startsWith("http")) return rawPath;
    if (rawPath.startsWith("uploads/")) return `${BACKEND_URL}/${rawPath}`;
    if (rawPath.startsWith("/uploads/")) return `${BACKEND_URL}${rawPath}`;
    return `${BACKEND_URL}/uploads/${rawPath}`;
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen font-sans text-[#1E293B] p-4 sm:p-6 md:p-8 lg:p-10">
      <div className="max-w-6xl mx-auto">

        <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#1E1B4B]">Manage Categories</h1>
            <p className="text-xs text-gray-400 mt-0.5">Overview of your store's structure.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
            <button
              type="button"
              onClick={() => navigate("/admin/category/main")}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 border border-[#1E1B4B] text-[#1E1B4B] hover:bg-slate-50 rounded-xl text-xs font-bold tracking-wide transition-all shadow-sm active:scale-[0.98] whitespace-nowrap"
            >
              <FiPlus size={16} /> MAIN CATEGORY
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/category/new")}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1E1B4B] hover:bg-[#2e2a70] text-white rounded-xl text-xs font-bold tracking-wide transition-all shadow-md active:scale-[0.98] whitespace-nowrap"
            >
              <FiPlus size={16} /> ADD SUB-CATEGORY
            </button>
          </div>
        </header>

        <ToastContainer />

        {loading ? (
          <div className="flex justify-center items-center h-40 text-sm font-semibold text-gray-400">
            Loading your store matrix...
          </div>
        ) : allCategories.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center text-gray-400 text-sm font-medium shadow-sm">
            <FiAlertCircle className="mx-auto text-xl mb-2 text-gray-300" /> No categories found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allCategories.map((category) => {
              const isActive = category.isActive !== false;
              const subCount = category.subCategories?.length || 0;
              const grouped = groupSubCategories(category.subCategories);
              const groupNames = Object.keys(grouped);

              return (
              <div key={category._id || category.name} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between w-full">

                <div className="p-5 border-b border-gray-50 bg-slate-50/50 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-xl bg-indigo-50 text-[#635BFF] shrink-0">
                      <FiFolder className="text-base" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-sm text-[#1E1B4B] truncate" title={category.name}>
                        {category.name}
                      </h3>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider whitespace-nowrap">
                        {subCount} Sub-Branches
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex flex-col items-end gap-1">
                      <button
                        type="button"
                        role="switch"
                        aria-checked={isActive}
                        disabled={togglingId === category._id}
                        onClick={() => toggleCategoryStatusHandler(category._id, isActive)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 disabled:opacity-50 ${
                          isActive ? "bg-emerald-500" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-200 ${
                            isActive ? "translate-x-4.5" : "translate-x-0.5"
                          }`}
                        />
                      </button>
                      <span className={`text-[9px] font-bold uppercase tracking-wider ${isActive ? "text-emerald-600" : "text-gray-400"}`}>
                        {isActive ? "Visible" : "Hidden"}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => deleteMainCategoryHandler(category._id, category.name, subCount)}
                      disabled={deletingCategoryId === category._id}
                      title="Delete this category"
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition duration-150 disabled:opacity-50"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="p-4 flex-1 space-y-4">
                  {groupNames.length > 0 ? (
                    groupNames.map((groupName) => (
                      <div key={groupName}>
                        <p className="text-[9px] font-extrabold text-[#635BFF] uppercase tracking-widest mb-2 px-1">
                          {groupName}
                        </p>
                        <div className="space-y-2">
                          {grouped[groupName].map((sub) => {
                            const imageSrc = getSubImageSrc(sub);
                            return (
                              <div key={sub._id} className="flex items-center justify-between p-2.5 rounded-xl border border-gray-50 bg-slate-50/20 hover:bg-slate-50 transition duration-150 group gap-2">
                                <div className="flex items-center gap-3 min-w-0">
                                  {imageSrc ? (
                                    <img
                                      src={imageSrc}
                                      alt={sub.name}
                                      className="w-9 h-9 rounded-lg object-cover border border-gray-100 shadow-sm shrink-0"
                                    />
                                  ) : (
                                    <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs shrink-0">
                                      <FiLayers />
                                    </div>
                                  )}
                                  <span className="text-xs font-semibold text-gray-700 truncate" title={sub.name}>
                                    {sub.name}
                                  </span>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => deleteSubCategoryHandler(sub._id)}
                                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition duration-150 md:opacity-0 group-hover:opacity-100 focus:opacity-100 shrink-0"
                                >
                                  <FiTrash2 size={14} />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-[11px] text-gray-400 italic text-center py-4">No sub-categories linked yet.</p>
                  )}
                </div>

              </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryList;