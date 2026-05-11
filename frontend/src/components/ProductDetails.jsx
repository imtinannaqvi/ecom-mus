import React, { useContext } from "react";
import {
  FaWhatsapp,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaRegHeart,
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
  hasSizing,
  setSizeGuideOpen,
  quantity,
  setQuantity,
}) => {
  const { cartItem, setCartItem } = useContext(AppContext);


  return (
    <div className="flex flex-col gap-5">
      {/* Product name, description, price and discount information */}
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-tight">
          {product.name}
        </h1>
        <p className="text-gray-500 text-sm md:text-base">
          {product.description}
        </p>
        <div className="flex items-center gap-4 mt-2">
          <span className="text-3xl font-bold">${product.price}</span>
          <span className="text-gray-400 line-through text-lg">$549</span>
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            SAVE 33%
          </span>
        </div>
      </div>

      {/* Size selector with optional size chart guide */}
      {hasSizing && (
        <div className="space-y-4 pt-4 border-t border-dashed">
          <div className="flex justify-between items-center">
            <span className="font-bold text-sm uppercase">Sizes</span>
            <button
              onClick={() => setSizeGuideOpen(true)}
              className="text-xs font-bold underline hover:text-blue-600 transition-colors"
            >
              VIEW SIZE CHART
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

      {/* Quantity selector and add-to-cart button with social sharing options */}
      <div className="flex justify-between  gap-2 mt-2">
        <div className="flex items-center border  border-gray-300 rounded overflow-hidden">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-2  hover:bg-gray-100 "
          >
            -
          </button>
          <span className="px-2 font-semibold">
            {quantity < 10 ? `0${quantity}` : quantity}
          </span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="px-2  hover:bg-gray-100 "
          >
            +
          </button>
        </div>
        <button
          onClick={() => {
            // Check if this product already exists in the shopping cart
            const isExist = cartItem.find((item) => item.id === product.id);

            if (isExist) {
              // Notify user if item is already in cart
              alert("This item is already in your cart!");
            } else {
              // Add new item to cart with selected size and quantity
              setCartItem([
                ...cartItem,
                { ...product, quantity: quantity, size: selectedSize },
              ]);
              alert("Product added to cart!");
            }
          }}
          className="px-4 grow bg-black text-white py-4 rounded shadow-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
        >
          <IoCartOutline /> Add To Cart
        </button>
        <div className="flex items-center  gap-2 py-4 ">
          <span className="text-xs font-semibold text-gray-400">Share:</span>
          <div className="flex gap-2 text-gray-600">
            <FaWhatsapp className="cursor-pointer hover:text-green-500" />
            <FaFacebookF className="cursor-pointer hover:text-blue-600" />
            <FaTwitter className="cursor-pointer hover:text-blue-400" />
            <FaInstagram className="cursor-pointer hover:text-pink-500" />
          </div>
        </div>
      </div>

      {/* Estimated delivery and free shipping information */}
      <div className="space-y-3 ">
        <div className="flex items-center gap-3 text-xs">
          <FaTruck className="text-gray-400" />
          <p>
            <strong>Estimated Delivery:</strong> Jul 30 - Aug 03
          </p>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <FaUndoAlt className="text-gray-400" />
          <p>
            <strong>Free Shipping & Returns:</strong> On all orders over $75
          </p>
        </div>
      </div>

      {/* Key features: track order, 24/7 support, quality guarantee, and returns policy */}
      <div className="flex flex-wrap lg:flex-nowrap items-center justify-between gap-4 pt-6 border-t mt-4">
        {/* Track Order */}
        <div className="flex items-center gap-2 min-w-fit">
          <MdOutlineTrackChanges className="text-2xl text-gray-400 shrink-0" />
          <div>
            <p className="text-[10px] font-bold uppercase leading-none">
              Track Order
            </p>
            <p className="text-[9px] text-gray-500 italic">Over 2 years</p>
          </div>
        </div>

        {/* 24/7 Support */}
        <div className="flex items-center gap-2 min-w-fit">
          <FaHeadset className="text-2xl text-gray-400 shrink-0" />
          <div>
            <p className="text-[10px] font-bold uppercase leading-none">
              24/7 Support
            </p>
            <p className="text-[9px] text-gray-500 italic">Dedicated</p>
          </div>
        </div>

        {/* Quality */}
        <div className="flex items-center gap-2 min-w-fit">
          <FaShieldAlt className="text-2xl text-gray-400 shrink-0" />
          <div>
            <p className="text-[10px] font-bold uppercase leading-none">
              Quality
            </p>
            <p className="text-[9px] text-gray-500 italic">Over 2 years</p>
          </div>
        </div>

        {/* Return Policy */}
        <div className="flex items-center gap-2 min-w-fit">
          <FaUndoAlt className="text-2xl text-gray-400 shrink-0" />
          <div>
            <p className="text-[10px] font-bold uppercase leading-none">
              Return Policy
            </p>
            <p className="text-[9px] text-gray-500 italic">Instant Return</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
