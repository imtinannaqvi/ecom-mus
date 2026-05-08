import React from "react";
import { RiDeleteBin5Line } from "react-icons/ri";

function Wishlist() {
  const items = [
    { img: '/images/listImg/5.jpg' },
    { img: '/images/listImg/6.jpg' },
    { img: '/images/listImg/7.jpg' },
    { img: '/images/listImg/4.jpg' },
    { img: '/images/listImg/5.jpg' },
    { img: '/images/listImg/6.jpg' },
    { img: '/images/listImg/2.jpg' },
    { img: '/images/listImg/3.jpg' },
  ];

  return (
    <div className="w-full flex flex-wrap gap-y-8 gap-x-[2%] items-start justify-start">
      {items.map((item, idx) => {
        return (
          <div 
            key={idx} 
            className="w-[49%] md:w-[32%] lg:w-[23.5%] relative shrink-0 group"
          >
            {/* Delete Button */}
            <div className="w-8 h-8 rounded-full bg-white absolute z-10 flex items-center justify-center text-red-500 right-2 top-2 shadow-md opacity-80 hover:opacity-100 cursor-pointer transition-opacity">
              <RiDeleteBin5Line />
            </div>

            {/* Image Container with Hover Scale */}
            <div className="w-full h-60 md:h-72 lg:h-80 overflow-hidden rounded-sm bg-gray-100">
              <img
                className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                src={item.img}
                alt="wishlist product"
              />
            </div>

            {/* Product Details */}
            <div className="w-full py-3">
              <p className="text-[10px] uppercase tracking-widest text-gray-400">dress</p>
              <h4 className="text-sm font-bold uppercase tracking-tight">samsoe samsoe</h4>
              <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between text-xs mt-1 gap-1">
                <p className="text-gray-600 truncate mr-2">women's yellow all over</p> 
                <p className="font-bold text-black">233$</p>
              </div>
              
              {/* Mobile perspective add-to-cart button (Optional but good for UX) */}
              <button className="w-full mt-3 py-2 text-[10px] font-bold uppercase border border-black hover:bg-black hover:text-white transition-all lg:hidden">
                Add to Cart
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Wishlist;