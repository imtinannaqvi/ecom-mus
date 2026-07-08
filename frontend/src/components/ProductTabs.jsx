import React, { useState, useContext } from "react";
import { Star } from "lucide-react";
import Api, { BACKEND_URL } from "../api/api";
import { AppContext } from "../context/AppContextProvider";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const tabs = ["Description", "Additional Info", "Vendor", "Reviews"];

// Star picker used inside the write-a-review form.
const StarPicker = ({ value, onChange }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((n) => (
      <button
        key={n}
        type="button"
        onClick={() => onChange(n)}
        className="p-0.5"
      >
        <Star
          size={22}
          className={n <= value ? "text-yellow-400" : "text-gray-300"}
          fill={n <= value ? "#FBBF24" : "none"}
        />
      </button>
    ))}
  </div>
);

function ProductTabs({ activeTab, setActiveTab, product, onProductUpdate }) {
  const { user } = useContext(AppContext);

  const [stars, setStars] = useState(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mediaFile, setMediaFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const reviews = product?.reviews || [];

  const resetForm = () => {
    setStars(0);
    setTitle("");
    setDescription("");
    setMediaFile(null);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please log in to write a review.");
      return;
    }
    if (stars === 0) {
      toast.error("Please select a star rating.");
      return;
    }
    if (!title.trim() || !description.trim()) {
      toast.error("Please fill in a title and description for your review.");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("productId", product._id);
      formData.append("stars", stars);
      formData.append("title", title);
      formData.append("description", description);
      if (mediaFile) formData.append("reviewMedia", mediaFile);

      await Api.put("/product/rating", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Review submitted successfully!");
      resetForm();

      // Refresh the product so the new review + updated rating show immediately.
      if (onProductUpdate) {
        const { data } = await Api.get(`/product/${product._id}`);
        if (data.success) onProductUpdate(data.product);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  const getMediaUrl = (path) => {
    if (!path) return null;
    return path.startsWith("http") ? path : `${BACKEND_URL}${path}`;
  };

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <ToastContainer />

      {/* Tab Buttons */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-semibold transition rounded-t ${
              activeTab === tab
                ? "bg-black text-white"
                : "bg-transparent text-gray-600 hover:text-black"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-6 space-y-4 text-sm text-gray-700">
        
        {/* DESCRIPTION TAB */}
        {activeTab === "Description" && (
          <div className="space-y-4 animate-fadeIn">
            <p className="leading-relaxed">
              {product?.description || "No description provided for this product."}
            </p>
          </div>
        )}

        {/* ADDITIONAL INFO TAB */}
        {activeTab === "Additional Info" && (
          <div className="space-y-3 animate-fadeIn">
            <ul className="list-disc list-inside space-y-2 text-gray-700 font-medium">
              <li>Category: {product?.subCategory || "General Merchandise"}</li>
              <li>Available Colors: {product?.colors?.join(", ") || "N/A"}</li>
              <li>Available Sizes: {product?.sizes?.join(", ") || "Free Size"}</li>
              <li>Stock Status: {product?.stock > 0 ? `In Stock (${product.stock} left)` : "Out of Stock"}</li>
            </ul>
          </div>
        )}

        {/* VENDOR TAB */}
        {activeTab === "Vendor" && (
          <div className="space-y-3 animate-fadeIn">
            <p className="font-semibold text-gray-900">
              Vendor: {product?.vendorName || "Maurish Official Store"}
            </p>
            <p>
              {product?.vendorDetails ||
               "This product is sold and shipped directly by Maurish."}
            </p>
          </div>
        )}

        {/* REVIEWS TAB */}
        {activeTab === "Reviews" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center gap-2 text-gray-900">
              <Star size={16} fill="#FBBF24" className="text-yellow-400" />
              <span className="text-sm font-semibold">
                {product?.ratings ? product.ratings.toFixed(1) : "0.0"}/5
              </span>
              <span className="text-xs text-gray-400">
                ({product?.numOfReviews || 0} review{product?.numOfReviews === 1 ? "" : "s"})
              </span>
            </div>

            {/* Existing Reviews */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {reviews.length > 0 ? (
                reviews.map((review, index) => (
                  <div key={review._id || index} className="rounded-xl border border-gray-200 p-4 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">{review.userId?.name || "Anonymous"}</p>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <Star
                            key={n}
                            size={12}
                            className={n <= review.stars ? "text-yellow-400" : "text-gray-300"}
                            fill={n <= review.stars ? "#FBBF24" : "none"}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ""}
                    </p>
                    {review.title && <p className="mt-2 text-sm font-semibold">{review.title}</p>}
                    <p className="mt-1 text-sm text-gray-700">{review.description}</p>
                    {review.reviewMedia && (
                      <img
                        src={getMediaUrl(review.reviewMedia)}
                        alt="Review attachment"
                        className="mt-3 w-20 h-20 object-cover rounded-lg border border-gray-200"
                      />
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-400 italic col-span-2 text-center py-4">
                  No reviews yet for this product. Be the first to review it!
                </p>
              )}
            </div>

            {/* Write a Review Form */}
            <div className="border-t border-gray-100 pt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Write a Review</h3>

              {!user ? (
                <p className="text-sm text-gray-500">
                  Please <a href="/login" className="font-semibold underline text-black">log in</a> to write a review.
                </p>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1.5">
                      Your Rating
                    </label>
                    <StarPicker value={stars} onChange={setStars} />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1.5">
                      Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Sum up your experience"
                      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-black transition"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1.5">
                      Review
                    </label>
                    <textarea
                      rows="3"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Tell others what you think about this product"
                      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-black transition resize-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1.5">
                      Add a Photo (optional)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setMediaFile(e.target.files[0] || null)}
                      className="text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-black text-white text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-xl hover:bg-gray-800 transition disabled:opacity-50"
                  >
                    {submitting ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductTabs;