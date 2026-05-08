import React from "react";
import { RiEqualizer3Fill } from "react-icons/ri";
import { Link } from "react-router-dom";

function Orders() {
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
        {/* Single Order Card Start */}
        <div className="w-full border-b pb-6">
          <div className="flex flex-col md:flex-row items-start justify-between gap-4">
            
            <div className="flex gap-4 w-full md:w-auto">
              {/* Product Image */}
              <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-100 rounded-md shrink-0 overflow-hidden">
                <img
                  src="/images/p1.jpg"
                  alt="product"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Details */}
              <div className="flex flex-col gap-1 flex-1">
                <h2 className="text-base md:text-lg font-bold text-gray-800 leading-tight">
                  Girls Pink Moana Printed Dress
                </h2>
                <div className="flex flex-wrap gap-2 md:gap-4 text-xs md:text-sm text-gray-600 mt-1">
                  <p>
                    Size: <span className="font-semibold text-black">S</span>
                  </p>
                  <p className="border-l pl-2 md:pl-4">
                    Color: <span className="font-semibold text-black">White</span>
                  </p>
                </div>
                <p className="text-xs md:text-sm text-gray-600">
                  Qty: <span className="font-semibold text-black">1</span>
                </p>
              </div>
            </div>

            {/* Price (Mobile par image ke sath ya alag line mein) */}
            <div className="text-lg md:text-xl font-bold">₹449</div>

            {/* Buttons Section */}
            <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto">
              <Link to={'/profile/orders/1'} className="flex-1 text-center md:px-6 py-2 border border-gray-400 rounded-md text-xs md:text-sm font-semibold hover:bg-gray-50 transition">
                View Order
              </Link>
              <Link to={'/profile/orders/review/1'} className="flex-1 text-center md:px-6 py-2 bg-black text-white rounded-md text-xs md:text-sm font-semibold hover:bg-gray-800 transition">
                Write Review
              </Link>
            </div>
          </div>

          {/* Status Section */}
          <div className="flex items-center gap-3 mt-4 bg-gray-50 p-2 md:bg-transparent md:p-0 rounded-md">
            <span className="px-2 md:px-3 py-1 bg-green-100 text-green-700 text-[10px] md:text-xs font-bold rounded">
              Delivered
            </span>
            <p className="text-xs md:text-sm text-gray-600 font-medium">
              Your product has been delivered
            </p>
          </div>
        </div>
        {/* Single Order Card End */}

        {/* Second Order (In Process Example) */}
        <div className="w-full border-b pb-6">
          <div className="flex flex-col md:flex-row items-start justify-between gap-4">
            <div className="flex gap-4 w-full md:w-auto">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-100 rounded-md shrink-0 overflow-hidden">
                <img
                  src="/images/bag.jpg"
                  alt="product"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col gap-1 flex-1">
                <h2 className="text-base md:text-lg font-bold text-gray-800 leading-tight">
                  Women Textured Handheld Bag
                </h2>
                <div className="flex flex-wrap gap-2 md:gap-4 text-xs md:text-sm text-gray-600 mt-1">
                  <p>Size: <span className="font-semibold text-black">M</span></p>
                  <p className="border-l pl-2 md:pl-4">Color: <span className="font-semibold text-black">Pink</span></p>
                </div>
                <p className="text-xs md:text-sm text-gray-600">
                  Qty: <span className="font-semibold text-black">1</span>
                </p>
              </div>
            </div>
            <div className="text-lg md:text-xl font-bold">₹549</div>
            <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto">
              <button className="flex-1 md:px-6 py-2 border border-gray-400 rounded-md text-xs md:text-sm font-semibold">
                View Order
              </button>
              <button className="flex-1 md:px-6 py-2 bg-red-600 text-white rounded-md text-xs md:text-sm font-semibold hover:bg-red-700 transition">
                Cancel Order
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-4 bg-gray-50 p-2 md:bg-transparent md:p-0 rounded-md">
            <span className="px-2 md:px-3 py-1 bg-orange-100 text-orange-600 text-[10px] md:text-xs font-bold rounded">
              In Process
            </span>
            <p className="text-xs md:text-sm text-gray-600 font-medium">
              Your product is in process
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Orders;