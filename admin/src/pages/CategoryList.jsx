import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FiTrash2, FiFolder, FiLayers, FiAlertCircle, FiPlus, FiChevronDown } from "react-icons/fi";
import Api, { BACKEND_URL } from "../api/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// A single menu group — its items are collapsed behind a chevron so a category
// with several groups stays compact instead of rendering every item at once.
const CategoryGroup = ({ group, imageSrc, onDeleteGroup, onDeleteItem }) => {
  const [isOpen, setIsOpen] = useState(false);
  const itemCount = group.items?.length || 0;

  return (
    <div className="border border-gray-50 rounded-xl overflow-hidden">
      {/* Group header row — clicking it toggles the items open/closed */}
      <div className="flex items-center justify-between p-2.5 bg-slate-50/40 gap-2">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex items-center gap-3 min-w-0 flex-1 text-left"
        >
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={group.name}
              className="w-9 h-9 rounded-lg object-cover border border-gray-100 shadow-sm shrink-0"
            />
          ) : (
            <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs shrink-0">
              <FiLayers />
            </div>
          )}
          <span className="text-xs font-bold text-gray-800 truncate" title={group.name}>
            {group.name}
          </span>
          <span className="text-[9px] text-gray-400 font-semibold shrink-0">
            ({itemCount})
          </span>
          <FiChevronDown
            size={14}
            className={`text-gray-400 shrink-0 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        <button
          type="button"
          onClick={() => onDeleteGroup(group._id)}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition duration-150 shrink-0"
        >
          <FiTrash2 size={14} />
        </button>
      </div>

      {/* Items only render when the group is expanded */}
      {isOpen && (
        group.items && group.items.length > 0 ? (
          <div className="divide-y divide-gray-50">
            {group.items.map((item) => (
              <div key={item._id} className="flex items-center justify-between px-3 py-2 pl-14 group">
                <span className="text-[11px] text-gray-600 truncate" title={item.name}>
                  {item.name}
                </span>
                <button
                  type="button"
                  onClick={() => onDeleteItem(group._id, item._id)}
                  className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-md transition duration-150 md:opacity-0 group-hover:opacity-100"
                >
                  <FiTrash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[10px] text-gray-400 italic px-3 py-2 pl-14">No items yet.</p>
        )
      )}
    </div>
  );
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

  const deleteGroupHandler = useCallback(async (groupId) => {
    try {
      await Api.delete(`/admin/delete/${groupId}`);
      toast.success("Menu group deleted successfully!");
      setAllCategories((prev) =>
        prev.map((cat) => ({
          ...cat,
          subCategories: cat.subCategories ? cat.subCategories.filter((g) => g._id !== groupId) : [],
        }))
      );
    } catch (err) {
      toast.error("Error deleting: " + (err.response?.data?.message || err.message));
    }
  }, []);

  const deleteItemHandler = useCallback(async (groupId, itemId) => {
    try {
      await Api.delete(`/admin/sub-item/${groupId}/${itemId}`);
      toast.success("Item deleted successfully!");
      setAllCategories((prev) =>
        prev.map((cat) => ({
          ...cat,
          subCategories: cat.subCategories?.map((g) =>
            g._id === groupId
              ? { ...g, items: g.items.filter((it) => it._id !== itemId) }
              : g
          ),
        }))
      );
    } catch (err) {
      toast.error("Error deleting item: " + (err.response?.data?.message || err.message));
    }
  }, []);

  const deleteMainCategoryHandler = useCallback(async (categoryId, categoryName, subCount) => {
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
      setAllCategories((prev) =>
        prev.map((cat) =>
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

  const getGroupImageSrc = (group) => {
    if (!group.image) return "";
    const rawPath = group.image.url || group.image.secure_url || group.image.path || group.image;
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
            <h1 className="text-xl md:text-2xl font-bold tracking-tight italic text-[#1E1B4B]">Manage Categories</h1>
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
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 border border-[#1E1B4B] text-[#1E1B4B] hover:bg-slate-50 rounded-xl text-xs font-bold tracking-wide transition-all shadow-sm active:scale-[0.98] whitespace-nowrap"
            >
              <FiPlus size={16} /> MENU GROUP
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/category/item/new")}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1E1B4B] hover:bg-[#2e2a70] text-white rounded-xl text-xs font-bold tracking-wide transition-all shadow-md active:scale-[0.98] whitespace-nowrap"
            >
              <FiPlus size={16} /> ADD ITEM
            </button>
          </div>
        </header>


        {loading ? (
         <div className="flex justify-center"><div className="w-8 h-8 border-2 border-gray-200 border-t-[#635BFF] rounded-full animate-spin" /></div>
        ) : allCategories.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center text-gray-400 text-sm font-medium shadow-sm">
            <FiAlertCircle className="mx-auto text-xl mb-2 text-gray-300" /> No categories found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allCategories.map((category) => {
              const isActive = category.isActive !== false;
              const groupCount = category.subCategories?.length || 0;

              return (
              <div key={category._id || category.name} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between w-full">

                <div className="p-5 border-b border-gray-50 bg-slate-50/50 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    
                    <div className="min-w-0">
                      <h3 className="font-bold text-md text-[#1E1B4B] truncate" title={category.name}>
                        {category.name}
                      </h3>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider whitespace-nowrap">
                        {groupCount} Menu Groups
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
                      onClick={() => deleteMainCategoryHandler(category._id, category.name, groupCount)}
                      disabled={deletingCategoryId === category._id}
                      title="Delete this category"
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition duration-150 disabled:opacity-50"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="p-4 flex-1 space-y-3">
                  {category.subCategories && category.subCategories.length > 0 ? (
                    category.subCategories.map((group) => (
                      <CategoryGroup
                        key={group._id}
                        group={group}
                        imageSrc={getGroupImageSrc(group)}
                        onDeleteGroup={deleteGroupHandler}
                        onDeleteItem={deleteItemHandler}
                      />
                    ))
                  ) : (
                    <p className="text-[11px] text-gray-400 italic text-center py-4">No menu groups linked yet.</p>
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