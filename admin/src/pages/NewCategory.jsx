import React, { useState } from "react";
import { FiPlus, FiUpload, FiX } from "react-icons/fi";
import Api from "../api/api";

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
    if (!subName) return alert("Please enter sub-category name");
    if (!image) return alert("Please upload an image");

    setLoading(true);

    const formData = new FormData();
    formData.append("mainCategoryName", mainCategoryName); // ✅ exact field name
    formData.append("subName", subName);                   // ✅ exact field name
    formData.append("image", image);

    try {
      const res = await Api.post("/admin/sub", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Sub-Category Added Successfully!");
      // Reset
      setMainCategoryName("Men");
      setSubName("");
      setImage(null);
      setPreview(null);
    } catch (err) {
      console.error("Full error:", err);
      const message = err.response?.data?.message || err.message || "Unknown error";
      alert("Error: " + message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-sm border border-gray-100 mt-10">
      <div className="flex items-center gap-2 mb-6 border-b pb-4">
        <div className="p-2 bg-black text-white rounded-lg">
          <FiPlus size={20} />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Add New Sub-Category</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Main Category Dropdown */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Main Category
          </label>
          <select
            value={mainCategoryName}
            onChange={(e) => setMainCategoryName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none transition"
          >
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>

        {/* Sub-Category Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Sub-Category Name
          </label>
          <input
            type="text"
            placeholder="e.g. Hoodies, T-Shirts, Sneakers"
            value={subName}
            onChange={(e) => setSubName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none transition"
            required
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Sub-Category Image
          </label>

          {!preview ? (
            <label className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:bg-gray-50 transition">
              <FiUpload className="text-gray-400 mb-2" size={24} />
              <p className="text-sm text-gray-500">Click to upload image</p>
              <input
                type="file"
                className="hidden"
                onChange={handleImageChange}
                accept="image/*"
              />
            </label>
          ) : (
            <div className="relative w-full h-44 rounded-2xl overflow-hidden border">
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => { setPreview(null); setImage(null); }}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition"
              >
                <FiX size={16} />
              </button>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-xl font-bold text-white transition shadow-lg ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-800 active:scale-95"
          }`}
        >
          {loading ? "Creating..." : "Create Sub-Category"}
        </button>

      </form>
    </div>
  );
};

export default NewCategory;