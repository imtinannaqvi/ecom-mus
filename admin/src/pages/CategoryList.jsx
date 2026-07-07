import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FiTrash2, FiFolder, FiLayers, FiAlertCircle, FiPlus } from "react-icons/fi";
import Api, { BACKEND_URL } from "../api/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CategoryList = () => {
  const navigate = useNavigate();
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(true);



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

  return (
    <div className="bg-[#F8FAFC] min-h-screen font-sans text-[#1E293B]">
      <div className="max-w-6xl mx-auto">

        <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#1E1B4B]">Manage Categories</h1>
            <p className="text-xs text-gray-400 mt-0.5">Overview of your store's structure.</p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/admin/category/new")}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1E1B4B] hover:bg-[#2e2a70] text-white rounded-xl text-xs font-bold tracking-wide transition-all shadow-md active:scale-[0.98]"
          >
            <FiPlus size={16} /> ADD SUB-CATEGORY
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/category/main")}
            className="flex items-center justify-center gap-2 px-4 py-2.5 border border-[#1E1B4B] text-[#1E1B4B] hover:bg-slate-50 rounded-xl text-xs font-bold tracking-wide transition-all shadow-sm active:scale-[0.98]"
          >
            <FiPlus size={16} /> MAIN CATEGORY
          </button>
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
            {allCategories.map((category) => (
              <div key={category._id || category.name} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between">

                <div className="p-5 border-b border-gray-50 bg-slate-50/50 flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-indigo-50 text-[#635BFF]"><FiFolder className="text-base" /></div>
                  <div>
                    <h3 className="font-bold text-sm text-[#1E1B4B]">{category.name}</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{category.subCategories?.length || 0} Sub-Branches</p>
                  </div>
                </div>

                <div className="p-4 flex-1">
                  {category.subCategories && category.subCategories.length > 0 ? (
                    <div className="space-y-2">
                      {category.subCategories.map((sub) => {

                        // 🛠️ SMART IMAGE URL GENERATOR
                        let imageSrc = "";
                        if (sub.image) {
                          const rawPath = sub.image.url || sub.image.secure_url || sub.image.path || sub.image;

                          if (typeof rawPath === "string") {
                            if (rawPath.startsWith("http")) {
                              imageSrc = rawPath;
                            } else if (rawPath.startsWith("uploads/")) {
                              imageSrc = `${BACKEND_URL}/${rawPath}`;
                            } else if (rawPath.startsWith("/uploads/")) {
                              imageSrc = `${BACKEND_URL}${rawPath}`;
                            } else {
                              // Agar database mein sirf filename hai (e.g. "img_123.png"), toh uploads folder manually add karein
                              imageSrc = `${BACKEND_URL}/uploads/${rawPath}`;
                            }
                          }
                        }

                        return (
                          <div key={sub._id} className="flex items-center justify-between p-2.5 rounded-xl border border-gray-50 bg-slate-50/20 hover:bg-slate-50 transition duration-150 group">
                            <div className="flex items-center gap-3">
                              {imageSrc ? (
                                <img
                                  src={imageSrc}
                                  alt={sub.name}
                                  className="w-9 h-9 rounded-lg object-cover border border-gray-100 shadow-sm animate-fade-in"
                                />
                              ) : (
                                <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                                  <FiLayers />
                                </div>
                              )}
                              <span className="text-xs font-semibold text-gray-700">{sub.name}</span>
                            </div>

                            <button
                              type="button"
                              onClick={() => deleteSubCategoryHandler(sub._id)}
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition duration-150 opacity-0 group-hover:opacity-100 focus:opacity-100"
                            >
                              <FiTrash2 size={14} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-[11px] text-gray-400 italic text-center py-4">No sub-categories linked yet.</p>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryList;