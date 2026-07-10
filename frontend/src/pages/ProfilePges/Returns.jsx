import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Api, { BACKEND_URL } from "../../api/api";

const CANCEL_REASONS = [
  "Ordered by mistake",
  "Found a better price elsewhere",
  "Delivery is taking too long",
  "Changed my mind",
  "Other",
];

const getImageUrl = (images) => {
  const img = images?.[0];
  if (!img) return "/images/placeholder.png";
  const path = typeof img === "string" ? img : img.url;
  if (!path) return "/images/placeholder.png";
  return path.startsWith("http") ? path : `${BACKEND_URL}${path}`;
};

function Returns() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const [reason, setReason] = useState("");
  const [detail, setDetail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [cancelled, setCancelled] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setFetchLoading(true);
        const { data } = await Api.get(`/order/get-order-by-id/${id}`);
        if (data.success) setOrder(data.order);
      } catch (err) {
        setFetchError(err.response?.data?.message || "Failed to load this order.");
      } finally {
        setFetchLoading(false);
      }
    };
    if (id) fetchOrder();
  }, [id]);

  const handleSubmit = async () => {
    if (!reason) {
      setSubmitError("Please select a reason.");
      return;
    }
    setSubmitError("");
    setSubmitting(true);
    try {
      // Reason/detail are sent along in case the backend is later updated to
      // store them — cancelOrder currently just cancels the order itself.
      await Api.post(`/order/cancel/${id}`, { reason, detail });
      setCancelled(true);
    } catch (err) {
      setSubmitError(err.response?.data?.message || "Failed to cancel this order.");
    } finally {
      setSubmitting(false);
    }
  };

 if (fetchLoading) {
  return (
    <div className="max-w-2xl mx-auto p-6 flex justify-center">
      <div className="w-8 h-8 border-2 border-gray-200 border-t-black rounded-full animate-spin" />
    </div>
  );
}

  if (fetchError || !order) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <p className="text-gray-400 font-medium mb-3">{fetchError || "Order not found."}</p>
        <Link to="/profile/orders" className="text-sm font-bold underline">Back to Orders</Link>
      </div>
    );
  }

  if (order.orderStatus === "Delivered") {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <p className="text-gray-500 font-medium mb-3">This order has already been delivered and can no longer be cancelled.</p>
        <Link to={`/profile/track/${order._id}`} className="text-sm font-bold underline">View Order</Link>
      </div>
    );
  }

  if (order.orderStatus === "Cancelled") {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <p className="text-gray-500 font-medium mb-3">This order has already been cancelled.</p>
        <Link to="/profile/orders" className="text-sm font-bold underline">Back to Orders</Link>
      </div>
    );
  }

  return (
    <section className="w-full h-full p-4 md:p-0 max-w-2xl">
      {/* Success Modal */}
      {cancelled && (
        <div className="fixed inset-0 w-full h-full bg-black/60 backdrop-blur-md z-[1000] flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl flex flex-col items-center justify-center p-6 md:p-10 gap-5 text-center animate-in zoom-in duration-300">
            <img
              className="w-32 md:w-40 object-contain"
              src="/images/Check.jpg"
              alt="Success"
            />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Your order has been cancelled</h1>
              <p className="text-gray-500 mt-2">Stock has been restored and we're sorry to see this order go.</p>
            </div>
            <button
              onClick={() => navigate("/profile/orders")}
              className="w-full py-4 bg-black rounded-lg cursor-pointer text-white font-semibold hover:bg-gray-800 transition-colors"
            >
              Back to Orders
            </button>
          </div>
        </div>
      )}

      <header className="mb-2">
        <h1 className="text-xl md:text-2xl font-bold">Cancel Order</h1>
        <p className="text-sm text-gray-500">Order #{order._id.slice(-8).toUpperCase()}</p>
      </header>

      {/* Real Order Items */}
      <div className="w-full flex items-center justify-between font-medium mt-6">
        <span className="text-sm md:text-base">Items ({order.orderItems?.length || 0})</span>
      </div>

      <div className="flex flex-col gap-3 mt-4">
        {order.orderItems?.map((item, idx) => (
          <div key={idx} className="w-full flex gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.06)] rounded-xl overflow-hidden bg-white">
            <img
              className="w-24 h-24 object-cover shrink-0"
              src={getImageUrl(item.productId?.images)}
              alt={item.productId?.name}
            />
            <div className="flex flex-col justify-center py-2 min-w-0">
              <h3 className="font-bold text-sm md:text-base truncate">{item.productId?.name || "Product"}</h3>
              <p className="text-red-600 font-bold text-sm">Rs. {item.price}</p>
              <p className="text-xs md:text-sm text-gray-500 mt-1">
                {item.size && `Size: ${item.size}`} {item.color && `| Color: ${item.color}`} | Qty: {item.quantity}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Reason Selection */}
      <h1 className="text-base md:text-lg mt-8 font-bold text-gray-800">
        Please mention the reason for cancelling this order
      </h1>

      <div className="w-full text-sm mt-5 flex flex-col items-start gap-4">
        {CANCEL_REASONS.map((r, index) => (
          <label key={index} className="flex items-center gap-3 cursor-pointer group w-full">
            <input
              type="radio"
              name="cancelReason"
              checked={reason === r}
              onChange={() => setReason(r)}
              className="w-4 h-4 accent-black cursor-pointer"
            />
            <p className="group-hover:text-black text-gray-700 transition-colors">{r}</p>
          </label>
        ))}
      </div>

      {/* Detail Textarea */}
      <textarea
        className="w-full resize-none h-28 border border-gray-300 rounded-xl mt-6 p-4 outline-none focus:border-black transition-all text-sm"
        placeholder="Explain further (optional)..."
        value={detail}
        onChange={(e) => setDetail(e.target.value)}
      ></textarea>

      {submitError && (
        <p className="text-xs text-red-500 font-semibold mt-2">{submitError}</p>
      )}

      {/* Action Button */}
      <div className="w-full mt-6 pb-10">
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full py-4 bg-black rounded-xl cursor-pointer text-white font-bold hover:bg-gray-800 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {submitting ? "Cancelling..." : "Confirm Cancellation"}
        </button>
      </div>
    </section>
  );
}

export default Returns;