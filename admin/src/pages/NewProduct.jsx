import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Added for navigation
import { FiUploadCloud, FiX, FiCheckCircle } from "react-icons/fi";
import Api from "../api/api";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // ✅ Added to ensure toast styles render properly

const AGE_GROUP_OPTIONS = ["0-2 Years", "3-5 Years", "6-8 Years", "9-12 Years", "13-16 Years"];

const NewProduct = () => {
  const navigate = useNavigate(); // ✅ Initialize navigation hook
  const availableSizes = ["S", "M", "L", "XL", "XXL"];
  const availableColors = ["Black", "White", "Red", "Blue", "Grey", "Beige"];

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [description, setDescription] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [mainCategory, setMainCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [stock, setStock] = useState(1);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [isTopTrend, setIsTopTrend] = useState(false);
  const [isBuy2Get1, setIsBuy2Get1] = useState(false);
  const [ageGroups, setAgeGroups] = useState([]);
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

  const handleAgeGroupChange = (age) => {
    setAgeGroups((prev) => prev.includes(age) ? prev.filter((a) => a !== age) : [...prev, age]);
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
        toast.error("Please select all required attributes."); // ✅ Swapped alert with premium toast error
        return;
    }
    if (oldPrice && Number(oldPrice) <= Number(price)) {
      toast.error("Old price must be higher than the current price to show a discount.");
      return;
    }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      if (oldPrice) formData.append("oldPrice", oldPrice);
      formData.append("description", description);
      formData.append("shortDescription", shortDescription);
      formData.append("seoTitle", seoTitle);
      formData.append("seoDescription", seoDescription);
      formData.append("mainCategory", mainCategory);
      formData.append("subCategory", subCategory);
      formData.append("stock", stock);
      formData.append("colors", JSON.stringify(colors));
      formData.append("sizes", JSON.stringify(sizes));
      formData.append("isTopTrend", isTopTrend);
      formData.append("isBuy2Get1", isBuy2Get1);
      formData.append("ageGroups", JSON.stringify(ageGroups));
      imageFiles.forEach((file) => formData.append("images", file));

      await Api.post("/product/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      // ✅ React Toastify Success notification 
      toast.success("Product published successfully!", {
        position: "top-right",
        autoClose: 2000,
      });

      // Reset logic
      setName(""); setPrice(""); setOldPrice(""); setDescription(""); setShortDescription(""); setSeoTitle(""); setSeoDescription(""); setMainCategory("");
      setSubCategory(""); setStock(1); setColors([]); setSizes([]);
      setIsTopTrend(false); setIsBuy2Get1(false); setAgeGroups([]);
      setImagesPreview([]); setImageFiles([]);

      // ✅ Securely route back to products overview pane after timeout
      setTimeout(() => {
        navigate("/admin/products");
      }, 2000);

    } catch (err) {
      toast.error("Error: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen font-sans text-[#1E293B] p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Premium Dashboard Header */}
        <header className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#1E1B4B]">Create New Product</h1>
            <p className="text-xs text-gray-400 mt-0.5">Add details, metrics, sizes and asset gallery for the inventory</p>
          </div>
          <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded font-bold text-slate-600 shrink-0">V2.3</span>
        </header>
        
        <ToastContainer />

        {/* ✅ Form structure configured for seamless md and lg dual-column split setups */}
        <form onSubmit={submitHandler} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* Left Column - Core Details (7 Columns on md and up) */}
          <div className="md:col-span-7 space-y-5 w-full">
            <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase mb-1.5 block tracking-wider">Product Title</label>
                <input
                  type="text"
                  className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-gray-200 rounded-xl focus:border-[#635BFF] focus:bg-white outline-none text-sm font-medium transition-all"
                  placeholder="e.g. Premium Cotton Shirt"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase mb-1.5 block tracking-wider">
                  Short Description <span className="normal-case font-medium text-gray-400"></span>
                </label>
                <input
                  type="text"
                  maxLength={120}
                  className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-gray-200 rounded-xl focus:border-[#635BFF] focus:bg-white outline-none text-sm font-medium transition-all"
                  placeholder="Write here.."
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-50">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase mb-1.5 block tracking-wider">SEO Title</label>
                  <input
                    type="text"
                    maxLength={70}
                    className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-gray-200 rounded-xl focus:border-[#635BFF] focus:bg-white outline-none text-sm font-medium transition-all"
                    placeholder="e.g. Premium Cotton Shirt | Maurish"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase mb-1.5 block tracking-wider">SEO Description</label>
                  <input
                    type="text"
                    maxLength={160}
                    className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-gray-200 rounded-xl focus:border-[#635BFF] focus:bg-white outline-none text-sm font-medium transition-all"
                    placeholder="e.g. Shop the Premium Cotton Shirt — soft, breathable, made to last."
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-50">
                <label className="flex items-center justify-between px-3.5 py-2.5 bg-slate-50/60 border border-gray-200 rounded-xl cursor-pointer">
                  <span className="text-xs font-bold text-gray-600"> Top Trending</span>
                  <input
                    type="checkbox"
                    checked={isTopTrend}
                    onChange={(e) => setIsTopTrend(e.target.checked)}
                    className="w-4 h-4 accent-[#635BFF]"
                  />
                </label>
                <label className="flex items-center justify-between px-3.5 py-2.5 bg-slate-50/60 border border-gray-200 rounded-xl cursor-pointer">
                  <span className="text-xs font-bold text-gray-600">Buy 2 Get 1 Free</span>
                  <input
                    type="checkbox"
                    checked={isBuy2Get1}
                    onChange={(e) => setIsBuy2Get1(e.target.checked)}
                    className="w-4 h-4 accent-[#635BFF]"
                  />
                </label>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase mb-1.5 block tracking-wider">Description</label>
                <textarea
                  rows="4"
                  className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-gray-200 rounded-xl focus:border-[#635BFF] focus:bg-white outline-none text-sm leading-relaxed transition-all"
                  placeholder="Write here.."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase mb-1.5 block tracking-wider">Gender Category</label>
                  <div className="relative">
                    <select
                      className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-gray-200 rounded-xl focus:border-[#635BFF] focus:bg-white outline-none text-xs font-semibold appearance-none transition-all"
                      value={mainCategory}
                      onChange={handleMainCategoryChange}
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="Men">Men</option>
                      <option value="Women">Women</option>
                      <option value="Kids">Kids</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase mb-1.5 block tracking-wider">Product Type</label>
                  <div className="relative">
                    <select
                      className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-gray-200 rounded-xl focus:border-[#635BFF] focus:bg-white outline-none text-xs font-semibold appearance-none disabled:opacity-40 transition-all"
                      value={subCategory}
                      onChange={(e) => setSubCategory(e.target.value)}
                      required
                      disabled={!mainCategory}
                    >
                      <option value="">{mainCategory ? "Select Sub Category" : "Choose Gender First"}</option>
                      {allCategories
                        .find((cat) => cat.name === mainCategory)
                        ?.subCategories.flatMap((group) =>
                          (group.items || []).map((item) => (
                            <option key={item._id} value={item.name}>{group.name} — {item.name}</option>
                          ))
                        )}
                    </select>
                  </div>
                </div>
              </div>

              {/* Age Groups — available for any product, any category */}
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase mb-2.5 block tracking-wider">Age Groups </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {AGE_GROUP_OPTIONS.map((age) => (
                    <button
                      key={age}
                      type="button"
                      onClick={() => handleAgeGroupChange(age)}
                      className={`py-2 px-1 rounded-xl text-[11px] font-bold border text-center transition-all duration-200 ${
                        ageGroups.includes(age)
                          ? "bg-[#635BFF] border-[#635BFF] text-white shadow-sm"
                          : "bg-slate-50 border-gray-200 text-gray-500 hover:border-gray-300"
                      }`}
                    >
                      {age}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>

          <div className="md:col-span-5 space-y-5 w-full">
            <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
              
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase mb-2.5 block tracking-wider">Available Sizes</label>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => handleSizeChange(size)}
                      className={`w-10 h-10 rounded-xl text-xs font-bold border transition-all duration-200 shrink-0 ${
                        sizes.includes(size) 
                          ? "bg-[#1E1B4B] border-[#1E1B4B] text-white shadow-sm" 
                          : "bg-white border-gray-200 text-gray-400 hover:border-gray-400 hover:text-gray-600"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase mb-2.5 block tracking-wider">Product Colors</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {availableColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => handleColorChange(color)}
                      className={`py-2 px-1 rounded-xl text-[11px] font-bold border text-center transition-all duration-200 truncate ${
                        colors.includes(color) 
                          ? "bg-[#635BFF] border-[#635BFF] text-white shadow-sm" 
                          : "bg-slate-50 border-gray-200 text-gray-500 hover:border-gray-300"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase mb-2.5 block tracking-wider">Media Gallery</label>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {imagesPreview.map((img, index) => (
                    <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-gray-100 group shadow-sm">
                      <img src={img} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-200"
                      >
                        <FiX className="text-white text-base" />
                      </button>
                    </div>
                  ))}
                  
                  <label className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-[#635BFF] hover:bg-indigo-50/20 transition-all group">
                    <FiUploadCloud className="text-xl text-gray-300 group-hover:text-[#635BFF] transition-colors" />
                    <span className="text-[9px] font-bold text-gray-400 mt-1 group-hover:text-[#635BFF]">Upload</span>
                    <input type="file" accept="image/*" onChange={createProductImagesChange} multiple className="hidden" />
                  </label>
                </div>
                
                {imageFiles.length > 0 && (
                  <p className="text-[10px] text-emerald-600 mt-2.5 flex items-center gap-1 font-bold bg-emerald-50 w-fit px-2 py-0.5 rounded-md border border-emerald-100">
                    <FiCheckCircle className="shrink-0" /> <span className="truncate">{imageFiles.length} IMAGES SELECTED</span>
                  </p>
                )}
              </div>

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#1E1B4B] text-white rounded-xl font-bold text-xs tracking-widest hover:bg-[#2e2a70] transition-all active:scale-[0.99] disabled:opacity-50 shadow-md"
            >
              {loading ? "PUBLISHING TO STORE..." : "PUBLISH PRODUCT"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default NewProduct;
