import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { RiDeleteBin5Line } from "react-icons/ri";
import Api, { BACKEND_URL } from "../../api/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const getImageUrl = (images) => {
  const img = images?.[0];
  if (!img) return "/images/placeholder.png";
  const path = typeof img === "string" ? img : img.url;
  if (!path) return "/images/placeholder.png";
  return path.startsWith("http") ? path : `${BACKEND_URL}${path}`;
};

function Wishlist() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true);
        const { data } = await Api.get("/wishlist");
        if (data.success) setItems(data.wishlist || []);
      } catch (err) {
        toast.error("Failed to load wishlist: " + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  const handleRemove = async (productId) => {
    setRemovingId(productId);
    try {
      const { data } = await Api.delete(`/wishlist/${productId}`);
      if (data.success) {
        setItems(data.wishlist || []);
        toast.success("Removed from wishlist");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove item");
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) {
    return (
      <div className="w-full flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="w-full text-center py-20">
        <ToastContainer />
        <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-4">
          Your wishlist is empty
        </p>
        <Link to="/shop/men" className="text-xs font-bold underline">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-wrap gap-y-8 gap-x-[2%] items-start justify-start">
      <ToastContainer />
      {items.map((item) => (
        <div
          key={item._id}
          className="w-[49%] md:w-[32%] lg:w-[23.5%] relative shrink-0 group"
        >
          {/* Delete Button */}
          <button
            type="button"
            onClick={() => handleRemove(item._id)}
            disabled={removingId === item._id}
            className="w-8 h-8 rounded-full bg-white absolute z-10 flex items-center justify-center text-red-500 right-2 top-2 shadow-md opacity-80 hover:opacity-100 cursor-pointer transition-opacity disabled:opacity-40"
          >
            <RiDeleteBin5Line />
          </button>

          {/* Image Container with Hover Scale */}
          <Link to={`/product/${item._id}`} className="block w-full h-60 md:h-72 lg:h-80 overflow-hidden rounded-sm bg-gray-100">
            <img
              className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
              src={getImageUrl(item.images)}
              alt={item.name}
              onError={(e) => { e.target.src = "/images/placeholder.png"; }}
            />
          </Link>

          {/* Product Details */}
          <div className="w-full py-3">
            <p className="text-[10px] uppercase tracking-widest text-gray-400">{item.mainCategory}</p>
            <Link to={`/product/${item._id}`}>
              <h4 className="text-sm font-bold uppercase tracking-tight hover:underline truncate">{item.name}</h4>
            </Link>
            <div className="w-full flex items-center justify-between text-xs mt-1 gap-1">
              <p className="font-bold text-black">${item.price}</p>
              {item.ratings > 0 && (
                <p className="text-gray-500">★ {item.ratings.toFixed(1)}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Wishlist;