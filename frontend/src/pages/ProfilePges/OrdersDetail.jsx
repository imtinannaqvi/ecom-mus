import React from "react";
import { Link } from "react-router-dom";
import { BsArrowLeft } from "react-icons/bs";

function OrdersDetail() {
  return (
    <section className="w-full h-full ">
      <Link
        className="flex items-center gap-2 font-bold"
        to={"/profile/orders"}
      >
        <BsArrowLeft className="scale-x-150 text-lg font-bold" /> Back
      </Link>
      <div className="w-full  mt-10">
        <h1>Order #1524</h1>
        <p>Tracking Number -IK987362341</p>
        <div className="w-full mt-10 p-5 flex flex-col gap-5  rounded-xl  shadow-sm ">
          <div className="w-full  flex items-center justify-between">
            <p>Order Number</p> <p>1524</p>
          </div>
          <div className="w-full  flex items-center justify-between">
            <p>Tracking Number</p> <p>1524342211</p>
          </div>
          <div className="w-full  flex items-center justify-between">
            <p>Delivery Address</p> <p>faisalabad pakistan</p>
          </div>
        </div>
        <div className="w-full mt-10 p-5 flex flex-col gap-5  rounded-xl  shadow-sm ">
          <div className="w-full  flex items-center justify-between">
            <p>Maxi dress</p> <b>$62.00</b>
          </div>
          <div className="w-full  flex items-center justify-between">
            <p>Luni Dress</p> <b>$34.00</b>
          </div>
          <div className="w-full  flex items-center justify-between">
            <p>Subtotal</p> <b>$94.00</b>
          </div>
          <div className="w-full border-b pb-5 border-gray-400  flex items-center justify-between">
            <p>Shipping</p> <b>$0.00</b>
          </div>
          <div className="w-full  flex items-center justify-between">
            <p>Total</p> <b>$94.00</b>
          </div>
        </div>
        <div className="w-full flex items-center justify-between  mt-10 h-15">
          <button className="w-[55%] h-full bg-black text-white ">
            Cancel Order
          </button>
          <button className="w-[43%] h-full bg-black text-white ">Rate</button>
        </div>
      </div>
    </section>
  );
}

export default OrdersDetail;
