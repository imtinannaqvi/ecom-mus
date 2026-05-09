import React, { useState } from 'react';
import { FiUploadCloud, FiX } from 'react-icons/fi';

const NewProduct = () => {
  // Pre-defined Options
  const availableSizes = ["S", "M", "L", "XL", "XXL"];
  const availableColors = ["Black", "White", "Red", "Blue", "Grey", "Beige"];

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState(1);
  
  // States for Selected Options
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);

  // --- Checkbox Handlers ---
  const handleSizeChange = (size) => {
    if (sizes.includes(size)) {
      setSizes(sizes.filter((s) => s !== size)); // Uncheck logic
    } else {
      setSizes([...sizes, size]); // Check logic
    }
  };

  const handleColorChange = (color) => {
    if (colors.includes(color)) {
      setColors(colors.filter((c) => c !== color));
    } else {
      setColors([...colors, color]);
    }
  };

  // --- Image Preview Handler ---
  const createProductImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setImages([]);
    setImagesPreview([]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((old) => [...old, reader.result]);
          setImages((old) => [...old, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const productData = { name, price, description, category, stock, colors, sizes, images };
    console.log("Product to be created:", productData);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-black italic mb-8 border-l-4 border-black pl-3 uppercase">Add New Stock</h1>

      <form onSubmit={submitHandler} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Side: General Info */}
        <div className="space-y-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-2">Product Title</label>
            <input type="text" className="w-full p-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-black outline-none font-medium" 
              placeholder="e.g. Maurish Signature Hoodie" value={name} onChange={(e)=>setName(e.target.value)} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase mb-2">Price (PKR)</label>
              <input type="number" className="w-full p-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-black outline-none font-bold" 
                placeholder="2500" value={price} onChange={(e)=>setPrice(e.target.value)} required />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase mb-2">Stock Quantity</label>
              <input type="number" className="w-full p-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-black outline-none font-bold" 
                value={stock} onChange={(e)=>setStock(e.target.value)} required />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-2">Detailed Description</label>
            <textarea rows="5" className="w-full p-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-black outline-none text-sm" 
              placeholder="Describe the fabric and fit..." value={description} onChange={(e)=>setDescription(e.target.value)} required></textarea>
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-2">Category</label>
            <select className="w-full p-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-black outline-none font-bold cursor-pointer" 
              value={category} onChange={(e)=>setCategory(e.target.value)} required>
              <option value="">Select Category</option>
              <option value="Hoodie">Hoodie</option>
              <option value="T-Shirt">T-Shirt</option>
              <option value="Bottoms">Bottoms</option>
            </select>
          </div>
        </div>

        {/* Right Side: Options & Images */}
        <div className="space-y-6">
          
          {/* Sizes & Colors Selection */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
            
            {/* Size Checkboxes */}
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase mb-3 underline decoration-black underline-offset-4">Available Sizes</label>
              <div className="flex flex-wrap gap-4">
                {availableSizes.map((size) => (
                  <label key={size} className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 accent-black rounded cursor-pointer"
                      checked={sizes.includes(size)}
                      onChange={() => handleSizeChange(size)}
                    />
                    <span className={`text-sm font-bold ${sizes.includes(size) ? 'text-black' : 'text-gray-400'}`}>{size}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Color Checkboxes */}
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase mb-3 underline decoration-black underline-offset-4">Available Colors</label>
              <div className="grid grid-cols-3 gap-3">
                {availableColors.map((color) => (
                  <label key={color} className={`flex items-center justify-center gap-2 p-2 border rounded-lg cursor-pointer transition ${colors.includes(color) ? 'border-black bg-black text-white' : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-300'}`}>
                    <input 
                      type="checkbox" 
                      className="hidden"
                      checked={colors.includes(color)}
                      onChange={() => handleColorChange(color)}
                    />
                    <span className="text-xs font-bold">{color}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Image Upload Area */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <label className="block text-xs font-black text-gray-400 uppercase mb-4 underline decoration-black underline-offset-4">Product Images</label>
            
            <div className="grid grid-cols-4 gap-3 mb-4">
              {imagesPreview.map((img, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden border group">
                  <img src={img} alt="Preview" className="w-full h-full object-cover" />
                </div>
              ))}
              <label className="aspect-square border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-black hover:bg-gray-50 transition group">
                <FiUploadCloud className="text-xl text-gray-400 group-hover:text-black" />
                <input type="file" accept="image/*" onChange={createProductImagesChange} multiple className="hidden" />
              </label>
            </div>
          </div>

          <button type="submit" className="w-full bg-black text-white py-4 rounded-2xl font-black tracking-[0.2em] hover:bg-gray-800 transition-all shadow-xl active:scale-[0.98]">
            PUBLISH TO STORE
          </button>
        </div>

      </form>
    </div>
  );
};

export default NewProduct;