import React, { useState, useEffect } from "react";
import { FiUploadCloud, FiX, FiCheckCircle } from "react-icons/fi";
import Api from "../api/api";

const NewProduct = () => {
  const availableSizes = ["S", "M", "L", "XL", "XXL"];
  const availableColors = ["Black", "White", "Red", "Blue", "Grey", "Beige"];

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [mainCategory, setMainCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [stock, setStock] = useState(1);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allCategories, setAllCategories] = useState([]);

  // Logic remains untouched as per instruction
  const handleSizeChange = (size) => {
    setSizes((prev) => prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]);
  };

  const handleColorChange = (color) => {
    setColors((prev) => prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]);
  };

  const handleMainCategoryChange = (e) => {
    setMainCategory(e.target.value);
    setSubCategory("");
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await Api.get("/admin/all");
        setAllCategories(res.data.data ?? res.data ?? []);
      } catch (err) {
        console.log("Failed to fetch categories:", err.message);
      }
    };
    fetchCategories();
  }, []);

  const createProductImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles((prev) => [...prev, ...files]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((prev) => [...prev, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const removeImage = (index) => {
    setImagesPreview((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (colors.length === 0 || sizes.length === 0 || imageFiles.length === 0) {
        return alert("Please select all required attributes.");
    }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("description", description);
      formData.append("mainCategory", mainCategory);
      formData.append("subCategory", subCategory);
      formData.append("stock", stock);
      formData.append("colors", JSON.stringify(colors));
      formData.append("sizes", JSON.stringify(sizes));
      imageFiles.forEach((file) => formData.append("images", file));

      await Api.post("/product/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Product published!");
      // Reset logic
      setName(""); setPrice(""); setDescription(""); setMainCategory("");
      setSubCategory(""); setStock(1); setColors([]); setSizes([]);
      setImagesPreview([]); setImageFiles([]);
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-[#F1F3F6] min-h-screen font-sans text-slate-900">
      <div className="max-w-5xl mx-auto">
        <header className="mb-4 flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight text-slate-800">New Inventory</h1>
          <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded font-bold">V2.1</span>
        </header>

        <form onSubmit={submitHandler} className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Title</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-slate-900 outline-none text-sm font-medium transition-all"
                    placeholder="Product name..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Price</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-slate-900 outline-none text-sm font-bold"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Stock</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-slate-900 outline-none text-sm font-bold"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Description</label>
                  <textarea
                    rows="3"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-slate-900 outline-none text-sm leading-snug"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Gender</label>
                      <select
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-slate-900 outline-none text-xs font-semibold appearance-none"
                        value={mainCategory}
                        onChange={handleMainCategoryChange}
                        required
                      >
                        <option value="">Select</option>
                        <option value="Men">Men</option>
                        <option value="Women">Women</option>
                        <option value="Kids">Kids</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Type</label>
                      <select
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-slate-900 outline-none text-xs font-semibold appearance-none disabled:opacity-40"
                        value={subCategory}
                        onChange={(e) => setSubCategory(e.target.value)}
                        required
                        disabled={!mainCategory}
                      >
                        <option value="">{mainCategory ? "Sub Category" : "---"}</option>
                        {allCategories.find((cat) => cat.name === mainCategory)?.subCategories.map((sub) => (
                              <option key={sub._id} value={sub.name}>{sub.name}</option>
                        ))}
                      </select>
                    </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-5">
              {/* Sizes */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block tracking-wider">Sizes</label>
                <div className="flex flex-wrap gap-1.5">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => handleSizeChange(size)}
                      className={`w-10 h-10 rounded-lg text-xs font-bold border transition-all ${
                        sizes.includes(size) ? "bg-slate-900 border-slate-900 text-white" : "bg-white border-slate-200 text-slate-400 hover:border-slate-400"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block tracking-wider">Colors</label>
                <div className="grid grid-cols-3 gap-2">
                  {availableColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => handleColorChange(color)}
                      className={`py-1.5 rounded-lg text-[11px] font-bold border transition-all ${
                        colors.includes(color) ? "bg-slate-900 border-slate-900 text-white" : "bg-slate-50 border-slate-200 text-slate-500"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Photos */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block tracking-wider">Gallery</label>
                <div className="grid grid-cols-4 gap-2">
                  {imagesPreview.map((img, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-slate-100 group">
                      <img src={img} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                      >
                        <FiX className="text-white" />
                      </button>
                    </div>
                  ))}
                  <label className="aspect-square rounded-lg border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:border-slate-900 transition-all group">
                    <FiUploadCloud className="text-lg text-slate-300 group-hover:text-slate-900" />
                    <input type="file" accept="image/*" onChange={createProductImagesChange} multiple className="hidden" />
                  </label>
                </div>
                <p className="text-[9px] text-slate-400 mt-2 flex items-center gap-1 font-bold">
                  <FiCheckCircle className="text-green-500" /> {imageFiles.length} IMAGES SELECTED
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-slate-900 text-white rounded-xl font-bold text-xs tracking-widest hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? "PROCESSING..." : "PUBLISH STORE"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewProduct;