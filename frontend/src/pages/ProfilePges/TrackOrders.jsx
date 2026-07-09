import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FaCheckCircle, FaBoxOpen, FaTruck, FaClipboardList, FaTimesCircle } from "react-icons/fa";
import Api, { BACKEND_URL } from "../../api/api";

// Real fulfillment steps, driven by the order's actual orderStatus field —
// no fictional couriers, countries, or flight paths.
const STEPS = [
  { key: "Processing", label: "Order Placed", icon: <FaClipboardList /> },
  { key: "Shipped", label: "Shipped", icon: <FaBoxOpen /> },
  { key: "Delivered", label: "Delivered", icon: <FaTruck /> },
];

const getImageUrl = (images) => {
  const img = images?.[0];
  if (!img) return "/images/placeholder.png";
  const path = typeof img === "string" ? img : img.url;
  if (!path) return "/images/placeholder.png";
  return path.startsWith("http") ? path : `${BACKEND_URL}${path}`;
};

const TrackOrders = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const { data } = await Api.get(`/order/get-order-by-id/${id}`);
        if (data.success) setOrder(data.order);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load this order.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center text-gray-400 font-medium">
        Loading order...
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <p className="text-gray-400 font-medium mb-3">{error || "Order not found."}</p>
        <Link to="/profile/orders" className="text-sm font-bold underline">Back to Orders</Link>
      </div>
    );
  }

  const isCancelled = order.orderStatus === "Cancelled";
  const currentStepIndex = STEPS.findIndex((s) => s.key === order.orderStatus);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 font-sans text-gray-800">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold">Track Order</h1>
        <p className="text-sm text-gray-500">
          Order ID - <span className="font-semibold text-black">#{order._id.slice(-8).toUpperCase()}</span>
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Placed on {new Date(order.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
        </p>
      </header>

      {/* Status Banner */}
      {isCancelled ? (
        <div className="border border-red-100 bg-red-50 p-4 rounded-lg mb-6 flex items-center gap-3">
          <FaTimesCircle className="text-red-500 text-xl shrink-0" />
          <div>
            <h2 className="text-sm font-bold text-red-700">This order has been cancelled</h2>
            <p className="text-xs text-red-500 mt-0.5">
              Last updated {new Date(order.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      ) : (
        <div className="border p-4 rounded-lg mb-6 shadow-sm bg-white">
          <h2 className="text-base md:text-lg font-bold mb-3">Order Status</h2>
          <div className="flex items-center justify-between relative">
            {STEPS.map((step, idx) => {
              const isDone = idx <= currentStepIndex;
              return (
                <div key={step.key} className="flex-1 flex flex-col items-center relative z-10">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-sm ${
                      isDone ? "bg-black text-white" : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    {step.icon}
                  </div>
                  <p className={`text-[10px] font-bold uppercase mt-2 text-center ${isDone ? "text-black" : "text-gray-400"}`}>
                    {step.label}
                  </p>
                  {idx < STEPS.length - 1 && (
                    <div
                      className={`absolute top-[18px] left-1/2 w-full h-[2px] ${
                        idx < currentStepIndex ? "bg-black" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
          <p className="text-xs text-gray-400 mt-4 text-center">
            Last updated {new Date(order.updatedAt).toLocaleDateString()}
          </p>
        </div>
      )}

      {/* Shipping Address */}
      {order.shippingAddress && (
        <div className="border p-4 rounded-lg mb-6 bg-white">
          <h2 className="text-sm font-bold mb-2">Shipping To</h2>
          <p className="text-sm font-semibold">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
          <p className="text-xs text-gray-500 mt-1">
            {order.shippingAddress.flatColony}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
          </p>
        </div>
      )}

      {/* Order Items */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <span className="bg-gray-200 text-[10px] font-bold px-2 py-1 rounded mb-4 inline-block uppercase">
          Items ({order.orderItems?.length || 0})
        </span>
        <div className="flex flex-col gap-3">
          {order.orderItems?.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 bg-white border p-3 rounded-xl shadow-sm">
              <img
                src={getImageUrl(item.productId?.images)}
                alt={item.productId?.name}
                className="w-12 h-12 bg-gray-100 rounded-lg object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs md:text-sm font-bold truncate">{item.productId?.name || "Product"}</p>
                <p className="text-[10px] text-gray-400 uppercase font-medium">
                  {item.size && `Size: ${item.size}`} {item.color && `| Color: ${item.color}`} | Qty: {item.quantity}
                </p>
              </div>
              <p className="text-xs md:text-sm font-bold shrink-0">Rs. {item.price * item.quantity}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Summary */}
      <div className="border p-4 rounded-xl bg-white space-y-2 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Payment Method</span>
          <span className="font-bold">{order.paymentMethod === "COD" ? "Cash on Delivery" : order.paymentMethod}</span>
        </div>
        {order.discountAmount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Discount {order.couponCode ? `(${order.couponCode})` : ""}</span>
            <span className="font-bold text-emerald-600">- Rs. {order.discountAmount}</span>
          </div>
        )}
        <div className="flex justify-between text-base border-t pt-2 mt-2">
          <span className="font-bold">Total Paid</span>
          <span className="font-extrabold">Rs. {order.totalPrice}</span>
        </div>
      </div>

      {/* Actions */}
      {!isCancelled && order.orderStatus !== "Delivered" && (
        <div className="flex justify-end">
          <button
            onClick={() => navigate(`/profile/returns/${order._id}`)}
            className="px-6 py-3 border border-red-200 text-red-600 rounded-xl font-bold text-sm hover:bg-red-50 transition"
          >
            Cancel This Order
          </button>
        </div>
      )}
    </div>
  );
};

export default TrackOrders;