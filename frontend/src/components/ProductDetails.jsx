import React from "react";
import { Heart, Star, Truck, Headset, ShieldCheck, RefreshCcw } from "lucide-react";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

function ProductDetails({
  productName, productDescription, selectedSize, setSelectedSize,
  quantity, setQuantity, setSizeGuideOpen, hoveredSize, setHoveredSize,
  productType, sizeGuide, sizeGuideImages, sizeDetailsBySize, guideLabel = [],
}) {
  return (
    <div className="flex flex-col space-y-5">
      {/* Name & Wishlist */}
      <div className="flex justify-between items-start">
        <div className="max-w-[85%]">
          <h1 className="text-xl md:text-2xl font-bold uppercase tracking-tight">{productName}</h1>
          <p className="text-gray-500 text-xs md:text-sm mt-1">{productDescription}</p>
        </div>
        <button className="p-2 border border-gray-200 rounded-full hover:bg-black hover:text-white transition-all shrink-0">
          <Heart size={20} />
        </button>
      </div>

      {/* Price & Reviews */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-3xl md:text-4xl font-black">$449</span>
          <span className="text-gray-400 line-through text-lg">$549</span>
        </div>
        <span className="bg-red-500 text-white text-[10px] px-2 py-1 rounded-full font-bold">SAVE 33%</span>
        <div className="flex items-center gap-1 text-sm ml-auto">
          <Star size={16} fill="#FBBF24" className="text-yellow-400" />
          <span className="font-bold">4.6/5</span>
          <span className="text-gray-400">| 135 Reviews</span>
        </div>
      </div>

      <hr className="border-dashed" />

      {/* Sizes Section */}
      <div className="relative">
        <div className="flex justify-between items-center mb-3">
          <p className="text-xs font-bold uppercase tracking-widest">Sizes</p>
          <button onClick={() => setSizeGuideOpen(true)} className="text-[10px] font-bold underline uppercase">Size Chart</button>
        </div>
        <div className="flex flex-wrap gap-2">
          {["XS", "S", "M", "L", "XL", "XXL", "XXXL"].map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              onMouseEnter={() => setHoveredSize(size)}
              onMouseLeave={() => setHoveredSize(null)}
              className={`px-4 py-2 border text-xs font-bold transition-all ${
                selectedSize === size ? "bg-black text-white border-black" : "border-gray-200 hover:border-black"
              }`}
            >
              {size}
            </button>
          ))}
        </div>

        {/* Hover Size Preview (Fixed the error here) */}
        {hoveredSize && sizeDetailsBySize[hoveredSize] && (
          <div className="hidden lg:block absolute top-full left-0 mt-2 rounded-2xl border border-gray-200 bg-white p-4 shadow-xl z-50 w-full animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <p className="text-sm font-bold uppercase">Preview: {hoveredSize}</p>
              <span className="text-[10px] bg-gray-100 px-2 py-1 rounded uppercase font-bold">{productType}</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                {Object.entries(sizeDetailsBySize[hoveredSize]).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-xs border-b border-gray-50 pb-1">
                    <span className="text-gray-400 capitalize">{key}</span>
                    <span className="font-bold">{value}</span>
                  </div>
                ))}
              </div>
              {/* FIXED: Added safe check for sizeGuideImages */}
              {sizeGuideImages && sizeGuideImages[productType] && (
                <img src={sizeGuideImages[productType]} className="h-24 w-full object-contain rounded-lg bg-gray-50" alt="guide" />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Quantity & Add to Cart */}
      <div className="flex flex-col sm:flex-row gap-4 pt-2">
        <div className="flex items-center border border-gray-200 h-12 w-full sm:w-32">
          <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="flex-1 h-full hover:bg-gray-50">-</button>
          <span className="w-10 text-center font-bold">{quantity.toString().padStart(2, '0')}</span>
          <button onClick={() => setQuantity(q => q + 1)} className="flex-1 h-full hover:bg-gray-50">+</button>
        </div>
        <button className="flex-1 bg-black text-white h-12 font-bold uppercase text-xs tracking-[2px] hover:bg-gray-900 transition-all shadow-lg shadow-black/10">
          🛒 Add to cart
        </button>
      </div>

      {/* Feature Icons Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-100">
        {[
          { icon: <Truck size={20} />, title: "Track Order" },
          { icon: <Headset size={20} />, title: "Support" },
          { icon: <ShieldCheck size={20} />, title: "Quality" },
          { icon: <RefreshCcw size={20} />, title: "Return" }
        ].map((item, i) => (
          <div key={i} className="flex flex-col items-center text-center p-2">
            <div className="p-2 bg-gray-50 rounded-full mb-1">{item.icon}</div>
            <p className="text-[10px] font-bold uppercase tracking-tighter">{item.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
export default ProductDetails;