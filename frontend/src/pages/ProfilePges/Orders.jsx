import React from "react";
import { RiEqualizer3Fill } from "react-icons/ri";
import { Link } from "react-router-dom";
import { getOrder } from "../../services/orderService";
import { useEffect } from "react";
import { useState } from "react";
import { cancelOrder } from "../../services/orderService";

function Orders() {
  const [orders, setOrders] = useState([]);
  const BACKEND_URL = "http://localhost:3000";

  const getOrders = async () => {
    try {
      const res = await getOrder();

      if (res && res.success && res.orders) {
        setOrders(res.orders);
      } else if (Array.isArray(res)) {
        setOrders(res);
      } else {
        setOrders([]); // Fallback to empty array
      }
    } catch (error) {
      console.error("Fetch Error:", error.message);
      setOrders([]);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);


  const handleCancelOrder = async (id) => {
    try {
      const res = await cancelOrder(id)
      if (res.success) {
        alert('order is canceled')
      }
    } catch (err) {
      alert(err.message)
    }

  }


  return (
    <section className="w-full h-full">
      {/* Search and Filter Section */}
      <div className="w-full flex flex-col md:flex-row gap-3 md:gap-5 items-center md:justify-end px-0 md:px-6">
        <input
          placeholder="Search"
          className="px-6 py-2 rounded-lg w-full md:w-80 border outline-none text-sm"
          type="search"
        />
        <button
          className="flex items-center gap-2 justify-center py-2 px-4 rounded-sm bg-black text-white w-full md:w-auto text-sm"
        >
          <RiEqualizer3Fill />
          Filter
        </button>
      </div>

    <div className="w-full flex mt-6 md:mt-10 flex-col gap-8 md:gap-6">
  {/* Agar orders load nahi hue toh skeleton ya message dikhao */}
  {orders && orders.length > 0 ? (
    orders.map((order) => (
      <div key={order._id} className="w-full border-b pb-8 mb-4">
        {/* Order Header: ID aur Date yahan dikha dein (Optional but better) */}
        <div className="flex justify-between items-center mb-4 bg-gray-50 p-2 rounded">
             <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Order ID: {order._id}</p>
             <p className="text-[10px] font-bold text-gray-500 uppercase">{new Date(order.createdAt).toLocaleDateString()}</p>
        </div>

        {/* Ab Order ke andar ke Items dikhao */}
        {order.orderItems?.map((item, index) => {
          const product = item.productId || {};
          // Image fallback logic
          const imgSource = product.images?.[0]?.url || product.images?.[0] || "";

          return (
            <div key={`${order._id}-${index}`} className="flex flex-col md:flex-row items-start justify-between gap-4 mb-6 last:mb-0">
              <div className="flex gap-4 w-full md:w-auto">
                {/* Image */}
                <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-100 rounded-md shrink-0 overflow-hidden">
                  <img
                    src={imgSource.startsWith("http") ? imgSource : `${BACKEND_URL}${imgSource}`}
                    alt="product"
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = "/images/placeholder.png"; }} // Error handling
                  />
                </div>

                {/* Details */}
                <div className="flex flex-col gap-1 flex-1">
                  <h2 className="text-sm md:text-base font-bold text-gray-800 uppercase tracking-tight">
                    {product.name || "Product Name"}
                  </h2>
                  <div className="flex flex-wrap gap-2 md:gap-4 text-[10px] md:text-xs text-gray-600 mt-1">
                    <p>SIZE: <span className="font-bold text-black uppercase">{item.size || "STD"}</span></p>
                    <p className="border-l pl-2">QTY: <span className="font-bold text-black">{item.quantity}</span></p>
                  </div>
                  <div className="text-sm font-bold mt-2">Rs. {item.price * item.quantity}</div>
                </div>
              </div>

              {/* Action Buttons (Sirf pehle item ke sath dikhaein ya separate column mein) */}
              
{index === 0 && (
  <div className="flex flex-row md:flex-col gap-2 w-full md:w-48">
    <Link 
      to={`/profile/orders/${order._id}`} 
      className="flex-1 text-center py-2 bg-black text-white text-[10px] font-bold uppercase tracking-widest hover:bg-gray-800 transition"
    >
      View Details
    </Link>
    
    {/* Cancel button sirf tab jab order pending ho */}
    {order.orderStatus === "Processing" && (
      <button 
        onClick={() => handleCancelOrder(order._id)} 
        className="flex-1 py-2 border border-red-600 text-red-600 text-[10px] font-bold uppercase tracking-widest hover:bg-red-50"
      >
        Cancel Order
      </button>
    )}
  </div>
)}
            </div>
          );
        })}

        {/* Status Section for the whole Order */}
        <div className="mt-4 flex items-center gap-2">
           <div className={`w-2 h-2 rounded-full ${order.orderStatus === "Delivered" ? "bg-green-500" : order.orderStatus === "Cancelled" ? "bg-red-500" : "bg-orange-500"}`}></div>
           <p className="text-[11px] font-bold uppercase tracking-tighter text-gray-600">
             Status: {order.orderStatus} — <span className="font-normal normal-case">{order.orderStatus === "Delivered" ? "Your product has been delivered" : `Your order is currently ${order.orderStatus.toLowerCase()}`}</span>
           </p>
        </div>
      </div>
    ))
  ) : (
    <div className="text-center py-20 uppercase tracking-widest text-gray-400 text-sm">No orders found</div>
  )}
</div>
    </section>
  );
}

export default Orders;