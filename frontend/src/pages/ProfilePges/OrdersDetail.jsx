import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BsArrowLeft } from "react-icons/bs";
import { getOrderById } from "../../services/orderService";
import { BACKEND_URL } from "../../api/api";

function OrdersDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()

  useEffect(() => {
    const getOrder = async () => {
      try {
        setLoading(true);
        const res = await getOrderById(id);
        // Backend se data 'res.data' mein aa raha hai
        if (res) {
          setOrder(res);
        }
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    };

  

    if (id) getOrder();
  }, [id]);

  if (loading) return <div className="p-10 text-center font-bold tracking-widest uppercase">Loading Order...</div>;
  if (!order) return <div className="p-10 text-center font-bold text-red-500 uppercase">Order Not Found</div>;

  return (
    <section className="w-full h-full ">
      <Link
        className="flex items-center gap-2 font-bold"
        to={"/profile/orders"}
      >
        <BsArrowLeft className="scale-x-150 text-lg font-bold" /> Back
      </Link>

      <div className="w-full mt-10">
        <h1>Order #{order._id?.slice(-6).toUpperCase()}</h1>
        <p>Status - {order.orderStatus}</p>

        <div className="w-full mt-10 p-5 flex flex-col gap-5 rounded-xl shadow-sm border border-gray-50">
          <div className="w-full flex items-center justify-between">
            <p>Order Number</p> <p>{order._id}</p>
          </div>
          <div className="w-full flex items-center justify-between">
            <p>Payment Method</p> <p className="uppercase">{order.paymentMethod}</p>
          </div>
          <div className="w-full flex items-center justify-between">
            <p>Delivery Address</p>
            <p className="text-right max-w-[200px]">
              {order.shippingAddress?.address}, {order.shippingAddress?.city}
            </p>
          </div>
        </div>

        <div className="w-full mt-10 p-5 flex flex-col gap-5 rounded-xl shadow-sm border border-gray-50">
          {/* Order Items Dynamic Mapping */}
{order.orderItems?.map((item, index) => (
  <div key={index} className="w-full flex items-center justify-between border-b py-4 last:border-none">
    <div className="flex items-center gap-4">
      {/* Product Image (Optional) */}
      <img 
        src={item.productId?.images?.[0]?.url?.startsWith("http") ? item.productId?.images?.[0]?.url : `${BACKEND_URL}${item.productId?.images?.[0]?.url}`} 
        className="w-12 h-12 object-cover rounded" 
        alt="" 
      />
      <div>
        <p className="font-medium text-sm">
          {item.productId?.name} <span className="text-xs text-gray-400">x{item.quantity}</span>
        </p>
        <b className="text-sm">Rs. {item.price * item.quantity}</b>
      </div>
    </div>

    {/* Yahan Condition check karein: Agar delivered hai tabhi Rate dikhao */}
    {order.orderStatus === "Delivered" ? (
      <Link
        to={`/profile/orders/review/${item.productId?._id}`} 
        className="px-6 py-2 bg-black text-white text-[10px] font-bold uppercase tracking-widest active:scale-95 transition-all"
      >
        Rate Product
      </Link>
    ) : (
      <span className="text-[10px] text-gray-400 uppercase font-bold italic">
        {order.orderStatus}
      </span>
    )}
  </div>
))}

          <div className="w-full flex items-center justify-between border-t pt-5">
            <p>Subtotal</p> <b>Rs. {order.totalPrice}</b>
          </div>
          <div className="w-full border-b pb-5 border-gray-200 flex items-center justify-between">
            <p>Shipping</p> <b>Rs. 0.00</b>
          </div>
          <div className="w-full flex items-center justify-between">
            <p className="font-bold">Total</p> <b className="text-xl">Rs. {order.totalPrice}</b>
          </div>
        </div>

        <div className="w-full flex items-center justify-between mt-10 h-12">
          {order.orderStatus !== "Cancelled" && order.orderStatus !== "Delivered" ? (
            <button className="w-[55%] h-full bg-black text-white font-bold uppercase text-xs tracking-widest active:scale-95 transition-all">
              Cancel Order
            </button>
          ) : (
            <button disabled className="w-[55%] h-full bg-gray-200 text-gray-500 font-bold uppercase text-xs tracking-widest cursor-not-allowed">
              {order.orderStatus === "Cancelled" ? "Cancelled" : "Completed"}
            </button>
          )}

        </div>
      </div>
    </section>
  );
}

export default OrdersDetail;