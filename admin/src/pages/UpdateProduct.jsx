import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiRefreshCw, FiArrowLeft, FiEdit3, FiSliders, FiEye, FiUploadCloud } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Api, { BACKEND_URL } from '../api/api';

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const availableSizes = ["S", "M", "L", "XL", "XXL"];
  const availableColors = ["Black", "White", "Red", "Grey", "Navy", "Beige"];


  // 1. Subcategory Mapping Repository (Fixed Database Matrix)
  const subCategoryMapping = {
    Men: ["Hoodies & Sweatshirts", "Casual Shirts", "Jeans & Denims", "Polo Tees"],
    Women: ["Kurtas & Ethnic", "Tops & Blouses", "Trousers", "Winter Wear"],
    Kids: ["Infant Rompers", "Teens Casuals", "Toys & Gadgets"]
  };

  // Form Pipeline States
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  
  const [name, setName] = useState(""); 
  const [price, setPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [mainCategory, setMainCategory] = useState("Men"); // Default node
  const [subCategory, setSubCategory] = useState("");
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [isTopTrend, setIsTopTrend] = useState(false);
  const [isBuy2Get1, setIsBuy2Get1] = useState(false);
  
  // Image assets management
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // 2. Fetch Existing Product Details and Fill State Matrices
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const { data } = await Api.get(`/product/${id}`);
        if (data.success && data.product) {
          const prod = data.product;
          
          // Old data variables population layer
          setName(prod.name);
          setPrice(prod.price);
          setOldPrice(prod.oldPrice || "");
          setStock(prod.stock);
          setDescription(prod.description);
          setMainCategory(prod.mainCategory || "Men");
          setSubCategory(prod.subCategory || "");
          setColors(prod.colors || []);
          setSizes(prod.sizes || []);
          setIsTopTrend(!!prod.isTopTrend);
          setIsBuy2Get1(!!prod.isBuy2Get1);
          
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

  // 3. Reset Sub-Category option whenever Main-Category alters
  const handleMainCategoryChange = (e) => {
    const selectedMain = e.target.value;
    setMainCategory(selectedMain);
    // Automatically fall back to first sub-category node of selected branch
    setSubCategory(subCategoryMapping[selectedMain]?.[0] || "");
  };

  // Variations Handlers
  const handleSizeChange = (size) => {
    sizes.includes(size) ? setSizes(sizes.filter(s => s !== size)) : setSizes([...sizes, size]);
  };

  const handleColorChange = (color) => {
    colors.includes(color) ? setColors(colors.filter(c => c !== color)) : setColors([...colors, color]);
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
      formData.append("mainCategory", mainCategory);
      formData.append("subCategory", subCategory);
      formData.append("sizes", JSON.stringify(sizes)); 
      formData.append("colors", JSON.stringify(colors));
      formData.append("isTopTrend", isTopTrend);
      formData.append("isBuy2Get1", isBuy2Get1);

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
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-3">
          <FiRefreshCw className="animate-spin text-[#635BFF]" size={30} />
          <p className="text-xs font-bold text-gray-400 tracking-wider">LOADING DATA CORE MATRIX...</p>
        </div>
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

              {/* Price, Old Price & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Price Valuation (PKR)</label>
                  <input 
                    type="number" 
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-white text-xs font-semibold text-gray-700 focus:border-[#635BFF] focus:ring-1 focus:ring-[#635BFF] outline-none transition" 
                    value={price} 
                    onChange={(e) => setPrice(e.target.value)} 
                    required 
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Old Price (optional)</label>
                  <input 
                    type="number" 
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-white text-xs font-semibold text-gray-700 focus:border-[#635BFF] focus:ring-1 focus:ring-[#635BFF] outline-none transition" 
                    placeholder="Leave blank for no discount"
                    value={oldPrice} 
                    onChange={(e) => setOldPrice(e.target.value)} 
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Inventory Stock Unit Counter</label>
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
                  <span className="text-xs font-bold text-gray-600">Show in Top Trending</span>
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
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Main Category Cluster</label>
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

                {/* Dynamic Sub-Category Selector */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Sub Category Branch Node</label>
                  <select 
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-white text-xs font-semibold text-gray-700 focus:border-[#635BFF] focus:ring-1 focus:ring-[#635BFF] outline-none transition cursor-pointer"
                    value={subCategory}
                    onChange={(e) => setSubCategory(e.target.value)}
                    required
                  >
                    {/* Render corresponding items based on current main category state */}
                    {(subCategoryMapping[mainCategory] || []).map((subNode) => (
                      <option key={subNode} value={subNode}>{subNode}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Public Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Public Specification Description</label>
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
                <p className="text-[9px] text-gray-400 font-normal mt-2">Uploading fresh assets will replace current database image bundles.</p>
              </div>
            </div>

            {/* Box 2: Configuration Options Grid */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1E1B4B] flex items-center gap-1.5">
                <FiSliders className="text-gray-400" /> Configuration Matrix
              </h3>
              
              {/* Sizes scope */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold uppercase text-gray-400 tracking-wide">Size Variants Scope</h4>
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
                <h4 className="text-[10px] font-bold uppercase text-gray-400 tracking-wide">Color Spectrum Arrays</h4>
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
              {loading ? "Publishing Database Matrix..." : "Commit Update Package"}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProduct;