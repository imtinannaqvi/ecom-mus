import React, { useState } from "react";

function ProductImageGallery({ thumbnails, mainImage }) {
  // Main image ko dynamic karne ke liye state (Optional but recommended)
  const [activeImage, setActiveImage] = useState(mainImage);

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-3 md:gap-4 w-full h-full">
      
      {/* Thumbnails Container */}
      {/* Mobile: Horizontal Row | Desktop: Vertical Column */}
      <div className="flex flex-row lg:flex-col gap-2 md:gap-3 overflow-x-auto lg:overflow-y-auto no-scrollbar lg:h-[500px] xl:h-[600px]">
        {/* Agar thumbnails array mein mainImage nahi hai toh usay bhi add kar sakte hain */}
        {[mainImage, ...thumbnails].map((src, i) => (
          <div 
            key={i}
            onClick={() => setActiveImage(src)}
            className={`
              shrink-0 cursor-pointer overflow-hidden rounded-md border-2 transition-all duration-300
              w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-[130px]
              ${activeImage === src ? "border-black" : "border-transparent opacity-70 hover:opacity-100"}
            `}
          >
            <img
              src={src}
              alt={`thumb-${i}`}
              className="w-full h-full object-cover transition-transform hover:scale-110"
            />
          </div>
        ))}
      </div>

      {/* Main Image Display */}
      <div className="flex-1 aspect-[3/4] sm:aspect-square lg:aspect-[3/4] bg-gray-50 rounded-lg overflow-hidden relative group">
        <img
          src={activeImage}
          alt="Main Product"
          className="w-full h-full object-cover rounded-sm transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Zoom Indicator for Desktop */}
        <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full hidden lg:block opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-xs font-bold uppercase tracking-tighter">🔍 Hover to Zoom</span>
        </div>
      </div>

    </div>
  );
}

export default ProductImageGallery;