import React, { useState, useEffect } from 'react';

const ProductImageGallery = ({ thumbnails, mainImage }) => {
  const [currentImage, setCurrentImage] = useState(mainImage);

  // Jab product change ho toh main image update ho jaye
  useEffect(() => {
    setCurrentImage(mainImage);
  }, [mainImage]);

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4 h-auto md:h-[650px]">
      {/* Side Thumbnails */}
      <div className="flex md:flex-col gap-3 w-full md:w-24 h-auto md:h-full overflow-y-auto no-scrollbar">
        {thumbnails.map((img, idx) => (
          <div 
            key={idx} 
            onClick={() => setCurrentImage(img)}
            className={`w-20 h-20 md:w-full md:h-28 shrink-0 rounded-lg overflow-hidden border-2 cursor-pointer transition-all
              ${currentImage === img ? "border-black" : "border-transparent hover:border-gray-300"}`}
          >
            <img src={img} alt="thumb" className="w-full h-full object-cover" />
          </div>
        ))}
      </div>

      {/* Main Image View */}
      <div className="flex-1 w-full h-[450px] md:h-full bg-[#f9f9f9] rounded-xl overflow-hidden shadow-sm">
        <img 
          src={currentImage} 
          alt="Main product" 
          className="w-full h-full object-cover object-top transition-all duration-500" 
        />
      </div>
    </div>
  );
};

export default ProductImageGallery;