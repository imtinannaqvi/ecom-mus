import React, { useState, useEffect } from "react";
import { FiStar, FiCheck, FiTrash2, FiMessageSquare } from "react-icons/fi";
import Api, { BACKEND_URL } from "../api/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Pending"); // Pending | Approved | All
  const [actingId, setActingId] = useState(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await Api.get("/product/admin/reviews");
      setReviews(res.data.reviews || []);
    } catch (err) {
      toast.error("Failed to load reviews: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleApprove = async (review) => {
    setActingId(review._id);
    try {
      await Api.patch(`/product/admin/reviews/${review.productId}/${review._id}/approve`);
      toast.success("Review approved — now visible on the storefront");
      setReviews((prev) =>
        prev.map((r) => (r._id === review._id ? { ...r, isApproved: true } : r))
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to approve review");
    } finally {
      setActingId(null);
    }
  };

  const handleDelete = async (review) => {
    if (!window.confirm("Permanently delete this review?")) return;
    setActingId(review._id);
    try {
      await Api.delete(`/product/admin/reviews/${review.productId}/${review._id}`);
      toast.success("Review deleted");
      setReviews((prev) => prev.filter((r) => r._id !== review._id));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete review");
    } finally {
      setActingId(null);
    }
  };

  const filteredReviews = reviews.filter((r) => {
    if (filter === "Pending") return !r.isApproved;
    if (filter === "Approved") return r.isApproved;
    return true;
  });

  const pendingCount = reviews.filter((r) => !r.isApproved).length;

  const getMediaUrl = (path) => {
    if (!path) return null;
    return path.startsWith("http") ? path : `${BACKEND_URL}${path}`;
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen font-sans text-[#1E293B]">
      <div className="max-w-5xl mx-auto">
        <ToastContainer />

        <header className="mb-6">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight italic text-[#1E1B4B]">Review Moderation</h1>
            {pendingCount > 0 && (
              <span className="text-[10px] bg-rose-50 text-rose-600 px-2 py-0.5 rounded-md font-extrabold border border-rose-100">
                {pendingCount} Pending
              </span>
            )}
          </div>
        
        </header>

        {/* Filter Tabs */}
        <div className="flex gap-1 bg-slate-200/50 p-1 rounded-xl w-max border border-gray-100 shadow-inner mb-6">
          {["Pending", "Approved", "All"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wide transition-all ${
                filter === tab
                  ? "bg-white text-[#1E1B4B] shadow-sm border border-slate-100"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
          {loading ? (
<div className="p-16 flex justify-center"><div className="w-8 h-8 border-2 border-gray-200 border-t-[#635BFF] rounded-full animate-spin" /></div>          ) : filteredReviews.length === 0 ? (
            <div className="p-16 text-center text-gray-400 text-sm font-medium">
              <FiMessageSquare className="mx-auto text-2xl mb-2 text-gray-300" />
              No {filter.toLowerCase()} reviews.
            </div>
          ) : (
            filteredReviews.map((review) => (
              <div key={review._id} className="p-5 flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-[#1E293B]">{review.reviewerName}</span>
                    <span className="text-[10px] text-gray-400">on</span>
                    <span className="text-xs font-semibold text-[#635BFF]">{review.productName}</span>
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${
                        review.isApproved
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-amber-50 text-amber-600"
                      }`}
                    >
                      {review.isApproved ? "Approved" : "Pending"}
                    </span>
                  </div>

                  <div className="flex items-center mt-1.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <FiStar
                        key={n}
                        size={13}
                        className={n <= review.stars ? "text-yellow-400" : "text-gray-300"}
                        fill={n <= review.stars ? "#FBBF24" : "none"}
                      />
                    ))}
                    <span className="text-[10px] text-gray-400 ml-2">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {review.title && <p className="text-sm font-semibold mt-2">{review.title}</p>}
                  <p className="text-sm text-gray-600 mt-1">{review.description}</p>

                  {review.reviewMedia && (
                    <img
                      src={getMediaUrl(review.reviewMedia)}
                      alt="Review attachment"
                      className="mt-3 w-20 h-20 object-cover rounded-lg border border-gray-200"
                    />
                  )}
                </div>

                <div className="flex sm:flex-col gap-2 shrink-0">
                  {!review.isApproved && (
                    <button
                      type="button"
                      onClick={() => handleApprove(review)}
                      disabled={actingId === review._id}
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-bold transition disabled:opacity-50"
                    >
                      <FiCheck size={14} /> Approve
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDelete(review)}
                    disabled={actingId === review._id}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-bold transition disabled:opacity-50"
                  >
                    <FiTrash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Reviews;