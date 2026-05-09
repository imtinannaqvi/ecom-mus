import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FiRefreshCw, FiArrowLeft } from 'react-icons/fi';

const UpdateProduct = () => {
  const { id } = useParams();
  const availableSizes = ["S", "M", "L", "XL"];
  const availableColors = ["Black", "White", "Red", "Grey"];

  // States (Inmein default value backend se ayegi)
  const [name, setName] = useState("Existing Hoodie Name"); 
  const [price, setPrice] = useState(2500);
  const [description, setDescription] = useState("Old Description...");
  const [category, setCategory] = useState("Hoodie");
  const [stock, setStock] = useState(10);
  const [colors, setColors] = useState(["Black"]);
  const [sizes, setSizes] = useState(["M", "L"]);

  // Handlers same wahi honge jo NewProduct mein the
  const handleSizeChange = (size) => {
    sizes.includes(size) ? setSizes(sizes.filter(s => s !== size)) : setSizes([...sizes, size]);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8 flex items-center justify-between">
        <button className="flex items-center gap-2 text-gray-500 hover:text-black font-bold transition">
          <FiArrowLeft /> Back
        </button>
        <h1 className="text-xl font-black italic uppercase tracking-tighter">Edit Product ID: {id}</h1>
      </div>

      <form className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side: Fields */}
        <div className="bg-white p-6 rounded-2xl border space-y-5">
           <div>
              <label className="text-xs font-black text-gray-400 uppercase">Product Title</label>
              <input type="text" className="w-full p-3 bg-gray-50 border rounded-xl" value={name} onChange={(e)=>setName(e.target.value)} />
           </div>
           <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-black text-gray-400 uppercase">Price</label>
                <input type="number" className="w-full p-3 bg-gray-50 border rounded-xl" value={price} onChange={(e)=>setPrice(e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-black text-gray-400 uppercase">Stock</label>
                <input type="number" className="w-full p-3 bg-gray-50 border rounded-xl" value={stock} onChange={(e)=>setStock(e.target.value)} />
              </div>
           </div>
           {/* Description & Category fields yahan bhi ayenge... */}
        </div>

        {/* Right Side: Checkboxes & Update Button */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border space-y-4">
            <h3 className="text-xs font-black text-gray-400 uppercase underline decoration-black underline-offset-4 mb-4">Modify Variations</h3>
            
            <div className="flex flex-wrap gap-3">
               {availableSizes.map(size => (
                 <label key={size} className={`px-4 py-2 rounded-lg border font-bold cursor-pointer transition ${sizes.includes(size) ? 'bg-black text-white' : 'bg-gray-50 text-gray-400'}`}>
                   <input type="checkbox" className="hidden" checked={sizes.includes(size)} onChange={() => handleSizeChange(size)} />
                   {size}
                 </label>
               ))}
            </div>
          </div>

          <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black tracking-widest hover:bg-blue-700 transition shadow-xl flex items-center justify-center gap-2">
            <FiRefreshCw /> UPDATE PRODUCT
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProduct;