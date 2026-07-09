import React, { useState, useEffect } from "react";
import Api from "../api/api";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NewCategoryItem = () => {
  const [allCategories, setAllCategories] = useState([]);
  const [mainCategoryName, setMainCategoryName] = useState("Men");
  const [subCategoryId, setSubCategoryId] = useState("");
  const [itemName, setItemName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await Api.get("/admin/all");
        setAllCategories(res.data.data ?? res.data ?? []);
      } catch (err) {
        toast.error("Failed to load categories: " + err.message);
      }
    };
    fetchCategories();
  }, []);

  // Menu groups available for whichever main department is selected.
  const availableGroups =
    allCategories.find((cat) => cat.name === mainCategoryName)?.subCategories || [];

  const handleMainCategoryChange = (e) => {
    setMainCategoryName(e.target.value);
    setSubCategoryId(""); // reset group selection when department changes
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subCategoryId) return toast.error("Please select a menu group");
    if (!itemName.trim()) return toast.error("Please enter an item name");

    setLoading(true);
    try {
      await Api.post("/admin/sub-item", { subCategoryId, itemName: itemName.trim() });
      toast.success("Item added successfully!", { position: "top-right", autoClose: 2000 });
      setItemName("");
    } catch (err) {
      toast.error("Error: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen font-sans text-[#1E293B]">
      <div className="max-w-2xl mx-auto">

        <header className="mb-6">
          <h1 className="text-xl font-bold tracking-tight text-[#1E1B4B]">Add Menu Item</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            A specific item like "Classic Fit T-Shirts" under an existing menu group. No image
            needed — this is what products get tagged with.
          </p>
        </header>

        <ToastContainer />

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5">

          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase mb-1.5 block tracking-wider">
              Main Department
            </label>
            <select
              value={mainCategoryName}
              onChange={handleMainCategoryChange}
              className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-gray-200 rounded-xl focus:border-[#635BFF] focus:bg-white outline-none text-xs font-semibold appearance-none transition-all"
            >
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase mb-1.5 block tracking-wider">
              Menu Group
            </label>
            <select
              value={subCategoryId}
              onChange={(e) => setSubCategoryId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-gray-200 rounded-xl focus:border-[#635BFF] focus:bg-white outline-none text-xs font-semibold appearance-none transition-all disabled:opacity-40"
              disabled={availableGroups.length === 0}
            >
              <option value="">
                {availableGroups.length === 0 ? "No menu groups yet — create one first" : "Select a group"}
              </option>
              {availableGroups.map((group) => (
                <option key={group._id} value={group._id}>{group.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase mb-1.5 block tracking-wider">
              Item Name
            </label>
            <input
              type="text"
              placeholder="e.g. Classic Fit T-Shirts"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-gray-200 rounded-xl focus:border-[#635BFF] focus:bg-white outline-none text-sm font-medium transition-all"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || availableGroups.length === 0}
            className="w-full h-12 bg-[#1E1B4B] text-white rounded-xl font-bold text-xs tracking-widest hover:bg-[#2e2a70] transition-all active:scale-[0.99] disabled:opacity-50 shadow-md"
          >
            {loading ? "ADDING..." : "ADD ITEM"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default NewCategoryItem;