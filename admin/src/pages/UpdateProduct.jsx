import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiRefreshCw, FiArrowLeft, FiEdit3, FiSliders, FiEye, FiUploadCloud } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Api, { BACKEND_URL } from '../api/api';

const AGE_GROUP_OPTIONS = ["0-2 Years", "3-5 Years", "6-8 Years", "9-12 Years", "13-16 Years"];

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const availableSizes = ["S", "M", "L", "XL", "XXL"];
  const availableColors = ["Black", "White", "Red", "Grey", "Navy", "Beige"];

  // Form Pipeline States
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  
  const [name, setName] = useState(""); 
  const [price, setPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [mainCategory, setMainCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("");
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [isTopTrend, setIsTopTrend] = useState(false);
  const [isBuy2Get1, setIsBuy2Get1] = useState(false);
  const [ageGroups, setAgeGroups] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  
  // Image assets management
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // Fetch the real category structure (groups + items) so the Product Type
  // dropdown lists actual items instead of a stale hardcoded map.
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

  // Fetch Existing Product Details and Fill State Matrices
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const { data } = await Api.get(`/product/${id}`);
        if (data.success && data.product) {
          const prod = data.product;
          
          setName(prod.name);
          setPrice(prod.price);
          setOldPrice(prod.oldPrice || "");
          setStock(prod.stock);
          setDescription(prod.description);
          setShortDescription(prod.shortDescription || "");
          setMainCategory(prod.mainCategory || "Men");
          setSubCategory(prod.subCategory || "");
          setColors(prod.colors || []);
          setSizes(prod.sizes || []);
          setIsTopTrend(!!prod.isTopTrend);
          setIsBuy2Get1(!!prod.isBuy2Get1);
          setAgeGroups(prod.ageGroups || []);
          
          if (prod.images && prod.images.length > 0) {
            const structuralPreviews = prod.images.map(img => `${BACKEND_URL}${img.url}`);
            setImagePreviews(structuralPreviews);
          }
        }
        setFetchLoading(false);
      } catch (error) {
        toast.error(error.response?.data?.message || "Error pulling product data stream.");
        setFetchLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  const handleMainCategoryChange = (e) => {
    setMainCategory(e.target.value);
    setSubCategory("");
  };

  const handleSizeChange = (size) => {
    sizes.includes(size) ? setSizes(sizes.filter(s => s !== size)) : setSizes([...sizes, size]);
  };

  const handleColorChange = (color) => {
    colors.includes(color) ? setColors(colors.filter(c => c !== color)) : setColors([...colors, color]);
  };

  const handleAgeGroupChange = (age) => {
    setAgeGroups((prev) => prev.includes(age) ? prev.filter((a) => a !== age) : [...prev, age]);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setImageFiles(files);
      const filePreviews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(filePreviews);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (oldPrice && Number(oldPrice) <= Number(price)) {
      toast.error("Old price must be higher than the current price to show a discount.");
      return;
    }
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("oldPrice", oldPrice || "");
      formData.append("stock", stock);
      formData.append("description", description);
      formData.append("shortDescription", shortDescription);
      formData.append("mainCategory", mainCategory);
      formData.append("subCategory", subCategory);
      formData.append("sizes", JSON.stringify(sizes)); 
      formData.append("colors", JSON.stringify(colors));
      formData.append("isTopTrend", isTopTrend);
      formData.append("isBuy2Get1", isBuy2Get1);
      formData.append("ageGroups", JSON.stringify(ageGroups));

      imageFiles.forEach((file) => {
        formData.append("images", file);
      });

      const { data } = await Api.put(`/product/update/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (data.success) {
        toast.success(data.message || "Product data committed safely!");
        setTimeout(() => navigate('/admin/products'), 1500);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Internal network error.");
    } finally {
      setLoading(false);
    }
  };

if (fetchLoading) {
  return (
    <div className="min-h-screen flex justify-center items-center bg-[#F8FAFC]">
      <div className="w-8 h-8 border-2 border-gray-200 border-t-[#635BFF] rounded-full animate-spin" />
    </div>
  );
}

  return (
    <div className="bg-[#F8FAFC] min-h-screen font-sans text-[#1E293B]">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <button 
            type="button"
            onClick={() => navigate('/admin/products')} 
            className="inline-flex items-center gap-2 px-3 py-1.5 border border-gray-200 text-gray-500 hover:text-[#1E1B4B] hover:border-[#1E1B4B] rounded-lg text-xs font-bold transition bg-white shadow-sm self-start"
          >
            <FiArrowLeft size={13} /> Back to Products
          </button>
          
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#1E1B4B] flex items-center gap-2 sm:justify-end">
              <FiEdit3 size={18} className="text-[#635BFF]" /> 
              <span>Modify Catalog Record</span>
            </h1>
            <p className="text-[11px] font-mono text-gray-400 text-left sm:text-right mt-0.5 uppercase tracking-wider">
              Token Ref ID: {id}
            </p>
          </div>
        </div>

        <ToastContainer />

        <form onSubmit={handleFormSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT BLOCK: PRODUCT CORE DETAILS */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5">
              
              {/* Product Title */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Product Title / Catalog Name</label>
                <input 
                  type="text" 
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-white text-xs font-semibold text-gray-700 focus:border-[#635BFF] focus:ring-1 focus:ring-[#635BFF] outline-none transition" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required
                />
              </div>

              {/* Short Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">
                  Short Description <span className="normal-case font-medium text-gray-400"></span>
                </label>
                <input
                  type="text"
                  maxLength={120}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-white text-xs font-semibold text-gray-700 focus:border-[#635BFF] focus:ring-1 focus:ring-[#635BFF] outline-none transition"
                  placeholder="Write here.."
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                />
              </div>

              {/* Price, Old Price & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Price </label>
                  <input 
                    type="number" 
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-white text-xs font-semibold text-gray-700 focus:border-[#635BFF] focus:ring-1 focus:ring-[#635BFF] outline-none transition" 
                    value={price} 
                    onChange={(e) => setPrice(e.target.value)} 
                    required 
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Old Price</label>
                  <input 
                    type="number" 
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-white text-xs font-semibold text-gray-700 focus:border-[#635BFF] focus:ring-1 focus:ring-[#635BFF] outline-none transition" 
                    placeholder="Amount"
                    value={oldPrice} 
                    onChange={(e) => setOldPrice(e.target.value)} 
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Stock Unit </label>
                  <input 
                    type="number" 
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-white text-xs font-semibold text-gray-700 focus:border-[#635BFF] focus:ring-1 focus:ring-[#635BFF] outline-none transition" 
                    value={stock} 
                    onChange={(e) => setStock(e.target.value)} 
                    required 
                  />
                </div>
              </div>

              {/* Storefront Placement Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-50">
                <label className="flex items-center justify-between px-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-xl cursor-pointer">
                  <span className="text-xs font-bold text-gray-600"> Top Trending</span>
                  <input
                    type="checkbox"
                    checked={isTopTrend}
                    onChange={(e) => setIsTopTrend(e.target.checked)}
                    className="w-4 h-4 accent-[#635BFF]"
                  />
                </label>
                <label className="flex items-center justify-between px-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-xl cursor-pointer">
                  <span className="text-xs font-bold text-gray-600">Buy 2 Get 1 Free</span>
                  <input
                    type="checkbox"
                    checked={isBuy2Get1}
                    onChange={(e) => setIsBuy2Get1(e.target.checked)}
                    className="w-4 h-4 accent-[#635BFF]"
                  />
                </label>
              </div>

              {/* Dynamic Category Dropdowns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Main Category Selector */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Main Category </label>
                  <select 
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-white text-xs font-semibold text-gray-700 focus:border-[#635BFF] focus:ring-1 focus:ring-[#635BFF] outline-none transition cursor-pointer"
                    value={mainCategory}
                    onChange={handleMainCategoryChange}
                    required
                  >
                    <option value="Men">Men Department</option>
                    <option value="Women">Women Department</option>
                    <option value="Kids">Kids Department</option>
                  </select>
                </div>

                {/* Dynamic Sub-Category Selector — real items pulled from admin categories */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Sub Category </label>
                  <select 
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-white text-xs font-semibold text-gray-700 focus:border-[#635BFF] focus:ring-1 focus:ring-[#635BFF] outline-none transition cursor-pointer"
                    value={subCategory}
                    onChange={(e) => setSubCategory(e.target.value)}
                    required
                  >
                    <option value="">Select Sub Category</option>
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

              {/* Age Groups — available for any product, any category */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Age Groups</label>
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

              {/* Public Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide"> Description</label>
                <textarea 
                  rows="4" 
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-white text-xs font-semibold text-gray-700 focus:border-[#635BFF] focus:ring-1 focus:ring-[#635BFF] outline-none transition resize-none leading-relaxed" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

            </div>
          </div>

          {/* RIGHT BLOCK: IMAGE ASSETS & VARIATIONS */}
          <div className="space-y-6">
            
            {/* Box 1: Multiple Images Display Component */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1E1B4B] flex items-center gap-1.5">
                <FiEye className="text-gray-400" /> Image Assets Showcase
              </h3>
              
              <div className="grid grid-cols-2 gap-2 max-h-52 overflow-y-auto p-1 bg-slate-50 border border-gray-100 rounded-xl">
                {imagePreviews.map((url, index) => (
                  <div key={index} className="aspect-square rounded-lg border border-gray-200/60 overflow-hidden bg-white shadow-sm">
                    <img src={url} alt={`Preview index ${index}`} className="w-full h-full object-cover" />
                  </div>
                ))}
                {imagePreviews.length === 0 && (
                  <div className="col-span-2 text-[10px] text-gray-400 font-medium py-10 text-center">
                    No active image bundles loaded.
                  </div>
                )}
              </div>
              
              <div className="relative group border border-dashed border-gray-200 rounded-xl overflow-hidden bg-slate-50 p-4 text-center">
                <label className="bg-white hover:bg-slate-50 border border-gray-200 text-[#1E1B4B] text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm cursor-pointer flex items-center justify-center gap-2 transition duration-200 w-full">
                  <FiUploadCloud size={14} className="text-[#635BFF]" />
                  <span>Upload Fresh Batches</span>
                  <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1E1B4B] flex items-center gap-1.5">
                <FiSliders className="text-gray-400" /> Configuration Matrix
              </h3>
              
              {/* Sizes scope */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold uppercase text-gray-400 tracking-wide">Select Size</h4>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map(size => {
                    const isSelected = sizes.includes(size);
                    return (
                      <label key={size} className={`px-3 py-1.5 rounded-lg border font-bold text-[11px] cursor-pointer transition-all ${isSelected ? 'bg-[#1E1B4B] text-white border-[#1E1B4B] shadow-sm' : 'bg-slate-50/70 text-gray-400 border-gray-100 hover:bg-slate-50'}`}>
                        <input type="checkbox" className="hidden" checked={isSelected} onChange={() => handleSizeChange(size)} />
                        {size}
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Colors array */}
              <div className="space-y-2 pt-2 border-t border-gray-50">
                <h4 className="text-[10px] font-bold uppercase text-gray-400 tracking-wide">Select Colors</h4>
                <div className="flex flex-wrap gap-2">
                  {availableColors.map(color => {
                    const isSelected = colors.includes(color);
                    return (
                      <label key={color} className={`px-3 py-1.5 rounded-lg border font-bold text-[11px] cursor-pointer transition-all ${isSelected ? 'bg-[#635BFF] text-white border-[#635BFF] shadow-sm' : 'bg-slate-50/70 text-gray-400 border-gray-100 hover:bg-slate-50'}`}>
                        <input type="checkbox" className="hidden" checked={isSelected} onChange={() => handleColorChange(color)} />
                        {color}
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Commit update CTA */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#1E1B4B] hover:bg-[#2a2668] disabled:bg-[#43407c] text-white py-3.5 rounded-xl text-xs font-bold tracking-widest transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2 uppercase"
            >
              <FiRefreshCw className={loading ? "animate-spin" : ""} size={14} /> 
              {loading ? "Publishing Database Matrix..." : "Update here"}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProduct;