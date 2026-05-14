import React, { useContext } from "react";
import {
  FaWhatsapp,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaTruck,
  FaUndoAlt,
  FaHeadset,
  FaShieldAlt,
} from "react-icons/fa";
import { MdOutlineTrackChanges } from "react-icons/md";
import { IoCartOutline } from "react-icons/io5";
import { AppContext } from "../context/AppContextProvider";

const ProductDetails = ({
  product,
  selectedSize,
  setSelectedSize,
  selectedColor,
  setSelectedColor, // Ensure this is passed from parent
  hasSizing,
  setSizeGuideOpen,
  quantity,
  setQuantity,
  handleAddToCart
}) => {
  const { cartItem, setCartItem } = useContext(AppContext);

  return (
    <div className="flex flex-col gap-5">
      {/* Product name, description, price */}
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-tight">
          {product.name}
        </h1>
        <p className="text-gray-500 text-sm md:text-base line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center gap-4 mt-2">
          <span className="text-3xl font-bold">${product.price}</span>
          {product.oldPrice && (
            <span className="text-gray-400 line-through text-lg">${product.oldPrice}</span>
          )}
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            SAVE 33%
          </span>
        </div>
      </div>

      {/* 1. COLOR SELECTOR (Visual Circles) */}
      {product.colors && product.colors.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex justify-between items-center">
            <span className="font-bold text-sm uppercase">Color: <span className="text-gray-400 font-normal">{selectedColor}</span></span>
          </div>
          <div className="flex flex-wrap gap-3">
            {product.colors.map((color, index) => (
              <button
                key={index}
                onClick={() => setSelectedColor(color)}
                title={color}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  selectedColor === color ? "border-black scale-110" : "border-transparent"
                }`}
                style={{ backgroundColor: color.toLowerCase() }} // Backend se color name/hex code yahan apply hoga
              >
                <span className="sr-only">{color}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 2. SIZE SELECTOR & SIZE CHART */}
      {hasSizing && (
        <div className="space-y-4 pt-4 border-t border-dashed">
          <div className="flex justify-between items-center">
            <span className="font-bold text-sm uppercase">Sizes</span>
            <button
              onClick={() => setSizeGuideOpen(true)}
              className="text-xs underline text-gray-500 hover:text-black transition-colors"
            >
              View Full Size Chart
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`w-12 h-11 flex items-center justify-center border font-bold transition-all
                  ${selectedSize === size ? "border-black bg-black text-white" : "border-gray-200 text-gray-500 hover:border-black"}`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity and Add to Cart */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mt-2">
        <div className="flex items-center border border-gray-300 rounded h-14">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-4 h-full hover:bg-gray-100 transition-colors"
          >
            -
          </button>
          <span className="px-4 font-semibold w-12 text-center">
            {quantity < 10 ? `0${quantity}` : quantity}
          </span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="px-4 h-full hover:bg-gray-100 transition-colors"
          >
            +
          </button>
        </div>

        <button
          onClick={() => {
           handleAddToCart()
            
          }}
          className="px-4 grow bg-black text-white h-14 rounded shadow-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-2 font-bold uppercase"
        >
          <IoCartOutline className="text-xl" /> Add To Cart
        </button>
      </div>

      {/* Social Sharing */}
      <div className="flex items-center gap-3 pt-2">
        <span className="text-xs font-semibold text-gray-400 uppercase">Share:</span>
        <div className="flex gap-4 text-gray-600">
          <FaWhatsapp className="cursor-pointer hover:text-green-500 transition-colors" />
          <FaFacebookF className="cursor-pointer hover:text-blue-600 transition-colors" />
          <FaTwitter className="cursor-pointer hover:text-blue-400 transition-colors" />
          <FaInstagram className="cursor-pointer hover:text-pink-500 transition-colors" />
        </div>
      </div>

      {/* Delivery Info */}
      <div className="space-y-3 pt-4 border-t border-dashed">
        <div className="flex items-center gap-3 text-xs">
          <FaTruck className="text-gray-400 text-lg" />
          <p><strong>Estimated Delivery:</strong> Jul 30 - Aug 03</p>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <FaUndoAlt className="text-gray-400" />
          <p><strong>Free Shipping & Returns:</strong> On all orders over $75</p>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t mt-4">
        <div className="flex items-center gap-2">
          <MdOutlineTrackChanges className="text-2xl text-gray-400" />
          <div>
            <p className="text-[10px] font-bold uppercase leading-none">Track Order</p>
            <p className="text-[9px] text-gray-500 italic">Global Shipping</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <FaHeadset className="text-2xl text-gray-400" />
          <div>
            <p className="text-[10px] font-bold uppercase leading-none">24/7 Support</p>
            <p className="text-[9px] text-gray-500 italic">Online Help</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <FaShieldAlt className="text-2xl text-gray-400" />
          <div>
            <p className="text-[10px] font-bold uppercase leading-none">Quality</p>
            <p className="text-[9px] text-gray-500 italic">Certified</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <FaUndoAlt className="text-2xl text-gray-400" />
          <div>
            <p className="text-[10px] font-bold uppercase leading-none">Return Policy</p>
            <p className="text-[9px] text-gray-500 italic">30 Days Return</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;