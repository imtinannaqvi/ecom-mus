import React, { useState } from "react";
import { FiUploadCloud, FiX, FiCheckCircle } from "react-icons/fi";
import Api from "../api/api";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    if (!subName) return toast.error("Please enter a menu group name");
    if (!image) return toast.error("Please upload an image");

    setLoading(true);

    const formData = new FormData();
    formData.append("mainCategoryName", mainCategoryName);
    formData.append("subName", subName);
    formData.append("image", image);

    try {
      await Api.post("/admin/sub", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Menu Group Added Successfully!", {
        position: "top-right",
        autoClose: 2500,
      });

      setMainCategoryName("Men");
      setSubName("");
      setImage(null);
      setPreview(null);
    } catch (err) {
      console.error("Full error:", err);
      const message = err.response?.data?.message || err.message || "Unknown error";
      toast.error("Error: " + message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen font-sans text-[#1E293B]">
      <div className="max-w-3xl mx-auto">

        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#1E1B4B]">Create Menu Group</h1>
          
          </div>
        </header>


        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase mb-1.5 block tracking-wider">
                Main Department
              </label>
              <select
                value={mainCategoryName}
                onChange={(e) => setMainCategoryName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-gray-200 rounded-xl focus:border-[#635BFF] focus:bg-white outline-none text-xs font-semibold appearance-none transition-all"
              >
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Kids">Kids</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase mb-1.5 block tracking-wider">
                ADD Menu
              </label>
              <input
                type="text"
                placeholder="e.g. Top Wear, Footwear, Accessories"
                value={subName}
                onChange={(e) => setSubName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-gray-200 rounded-xl focus:border-[#635BFF] focus:bg-white outline-none text-sm font-medium transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase mb-2 block tracking-wider">
              Add Image
            </label>

            {!preview ? (
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-[#635BFF] hover:bg-indigo-50/10 transition-all group">
                <FiUploadCloud className="text-2xl text-gray-300 group-hover:text-[#635BFF] transition-colors mb-1.5" />
                <span className="text-xs font-bold text-gray-500 group-hover:text-[#635BFF] transition-colors">Upload image</span>
                <p className="text-[10px] text-gray-400 mt-1">Supports PNG, JPG..</p>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleImageChange}
                  accept="image/*"
                />
              </label>
            ) : (
              <div className="relative w-full h-48 rounded-xl overflow-hidden border border-gray-100 shadow-sm group">
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
                <FiCheckCircle /> 1 ASSET SELECTED
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-[#1E1B4B] text-white rounded-xl font-bold text-xs tracking-widest hover:bg-[#2e2a70] transition-all active:scale-[0.99] disabled:opacity-50 shadow-md"
          >
            {loading ? "CREATING..." : "CREATE MENU "}
          </button>

        </form>
      </div>
    </div>
  );
};

export default NewCategory;