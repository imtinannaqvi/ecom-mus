import React, { useState } from "react";
import { FiPlus, FiUploadCloud, FiX, FiCheckCircle } from "react-icons/fi";
import Api from "../api/api";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // ✅ Ensures toast styling renders perfectly

const NewCategory = () => {
  const [mainCategoryName, setMainCategoryName] = useState("Men");
  const [subName, setSubName] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subName) return toast.error("Please enter sub-category name"); // ✅ Swapped alert with toast
    if (!image) return toast.error("Please upload an image");            // ✅ Swapped alert with toast

    setLoading(true);

    const formData = new FormData();
    formData.append("mainCategoryName", mainCategoryName); 
    formData.append("subName", subName);                   
    formData.append("image", image);

    try {
      const res = await Api.post("/admin/sub", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      // ✅ Premium React Toastify Success Trigger
      toast.success("Sub-Category Added Successfully!", {
        position: "top-right",
        autoClose: 2500,
      });

      // Reset
      setMainCategoryName("Men");
      setSubName("");
      setImage(null);
      setPreview(null);
    } catch (err) {
      console.error("Full error:", err);
      const message = err.response?.data?.message || err.message || "Unknown error";
      toast.error("Error: " + message); // ✅ Swapped alert with toast error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen font-sans text-[#1E293B] p-4 sm:p-6 md:p-8 lg:p-12">
      <div className="max-w-3xl mx-auto">
        
        {/* Unified Dashboard Header Theme — Adjusted for smaller to larger screens */}
        <header className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#1E1B4B]">Create Sub-Category</h1>
            <p className="text-xs text-gray-400 mt-0.5">Configure sub-branches for your primary storefront departments</p>
          </div>
          <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded font-bold text-slate-600 self-start sm:self-center shrink-0">V2.1</span>
        </header>

        <ToastContainer />

        {/* Form Container Container — Dynamic interior padding across screen tiers */}
        <form onSubmit={handleSubmit} className="bg-white p-4 sm:p-6 md:p-8 lg:p-10 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Main Category Dropdown Selector */}
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase mb-1.5 block tracking-wider">
                Main Department
              </label>
              <div className="relative">
                <select
                  value={mainCategoryName}
                  onChange={(e) => setMainCategoryName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-gray-200 rounded-xl focus:border-[#635BFF] focus:bg-white outline-none text-xs font-semibold transition-all"
                >
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Kids">Kids</option>
                </select>
              </div>
            </div>

            {/* Sub-Category Name Input Field */}
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase mb-1.5 block tracking-wider">
                Sub-Category Title
              </label>
              <input
                type="text"
                placeholder="e.g. Hoodies, T-Shirts, Sneakers"
                value={subName}
                onChange={(e) => setSubName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-gray-200 rounded-xl focus:border-[#635BFF] focus:bg-white outline-none text-sm font-medium transition-all"
                required
              />
            </div>
          </div>

          {/* Asset Image Uploader Slot */}
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase mb-2 block tracking-wider">
              Category Cover Image
            </label>

            {!preview ? (
              <label className="flex flex-col items-center justify-center w-full h-48 md:h-56 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-[#635BFF] hover:bg-indigo-50/10 transition-all group p-4 text-center">
                <FiUploadCloud className="text-2xl md:text-3xl text-gray-300 group-hover:text-[#635BFF] transition-colors mb-1.5" />
                <span className="text-xs font-bold text-gray-500 group-hover:text-[#635BFF] transition-colors">Click to upload image</span>
                <p className="text-[10px] text-gray-400 mt-1">Supports PNG, JPG up to 5MB</p>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleImageChange}
                  accept="image/*"
                />
              </label>
            ) : (
              <div className="relative w-full h-48 md:h-56 rounded-xl overflow-hidden border border-gray-100 shadow-sm group">
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => { setPreview(null); setImage(null); }}
                  className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-200"
                >
                  <div className="p-2 bg-red-500 text-white rounded-xl shadow-md transform scale-90 group-hover:scale-100 transition duration-200">
                    <FiX size={18} />
                  </div>
                </button>
              </div>
            )}
            
            {preview && (
              <p className="text-[10px] text-emerald-600 mt-2.5 flex items-center gap-1 font-bold bg-emerald-50 w-fit px-2 py-0.5 rounded-md border border-emerald-100">
                <FiCheckCircle className="shrink-0" /> <span>1 ASSET SELECTED</span>
              </p>
            )}
          </div>

          {/* Action Publish CTA Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-[#1E1B4B] text-white rounded-xl font-bold text-xs tracking-widest hover:bg-[#2e2a70] transition-all active:scale-[0.99] disabled:opacity-50 shadow-md"
          >
            {loading ? "CREATING SUB-CATEGORY..." : "CREATE SUB-CATEGORY"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default NewCategory;