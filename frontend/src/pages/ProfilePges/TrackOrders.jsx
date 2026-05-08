import React from "react";
import { FaCheckCircle, FaBoxOpen, FaTruck, FaWarehouse, FaMapMarkerAlt, FaPhoneAlt, FaCopy } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";

const TrackOrders = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 font-sans text-gray-800">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold">Track Current Order</h1>
        <p className="text-sm text-gray-500">
          Order ID - <span className="font-semibold text-black">5465845 HKW458628</span>
        </p>
      </header>

      {/* Parcel Selection Tabs - Mobile par scrollable kiya gaya hai */}
      <div className="flex md:grid md:grid-cols-3 gap-3 md:gap-4 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        <div className="min-w-[120px] md:min-w-0 border p-3 rounded-lg bg-white cursor-pointer border-gray-200">
          <p className="font-bold text-sm md:text-base">Parcel 1</p>
          <p className="text-[10px] md:text-xs text-gray-500">Top Wear</p>
        </div>
        <div className="min-w-[120px] md:min-w-0 relative border-2 p-3 rounded-lg bg-white cursor-pointer border-black">
          <FaCheckCircle className="absolute -top-2 -right-2 text-black bg-white rounded-full text-lg md:text-xl" />
          <p className="font-bold text-sm md:text-base">Parcel 2</p>
          <p className="text-[10px] md:text-xs text-gray-500">Nike Shoes</p>
        </div>
        <div className="min-w-[120px] md:min-w-0 border p-3 rounded-lg bg-white cursor-pointer border-gray-200">
          <p className="font-bold text-sm md:text-base">Parcel 3</p>
          <p className="text-[10px] md:text-xs text-gray-500">Sneakers</p>
        </div>
      </div>

      {/* Current Location Card */}
      <div className="border p-4 rounded-lg mb-6 shadow-sm bg-white">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">🛰️</span>
          <h2 className="text-base md:text-lg font-bold">Current Location</h2>
        </div>
        <p className="text-xs md:text-sm leading-relaxed">
          <span className="font-bold uppercase">Belgium</span> – Processed at <span className="font-bold uppercase">Brussels–Bel</span> – 23, November 2024 | 06:11 AM
        </p>
      </div>

      {/* Shipment Piece Info */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="bg-gray-200 text-[9px] md:text-[10px] font-bold px-2 py-1 rounded">Shipment Piece</span>
        <span className="bg-gray-100 text-[9px] md:text-[10px] text-gray-600 px-2 py-1 rounded break-all">#UCP41474675702552430</span>
      </div>

      {/* Journey Map */}
      <div className="border p-4 md:p-6 rounded-lg mb-6 bg-white relative">
        <div className="flex justify-between items-center mb-4 text-[10px] md:text-xs font-bold">
          <div className="flex items-center gap-1 uppercase tracking-tighter">UK Store 🇬🇧</div>
          <div className="flex items-center gap-1 text-right uppercase tracking-tighter">India 🇮🇳</div>
        </div>
        
        {/* Animated Path */}
        <div className="relative w-full h-[2px] bg-gray-200 flex items-center my-6">
            <div className="absolute left-0 w-1/2 h-full border-t-2 border-dashed border-green-500"></div>
            <div className="absolute left-0 w-3 h-3 border-2 border-green-500 bg-white rounded-full -ml-1"></div>
            <div className="absolute left-1/2 -top-3 text-xl md:text-2xl transform -translate-x-1/2">✈️</div>
            <div className="absolute right-0 w-3 h-3 border-2 border-gray-300 bg-white rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-gray-200 rounded-full"></div>
            </div>
        </div>

        <div className="flex justify-between text-[9px] md:text-[10px] text-gray-400">
          <p>23, Nov 2024</p>
          <p>30, Nov 2024</p>
        </div>
      </div>

      {/* Parcel Items Horizontal Scroll */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6 relative">
        <span className="bg-gray-200 text-[10px] font-bold px-2 py-1 rounded mb-4 inline-block uppercase">Parcel Items - 2</span>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {[1, 2, 3].map((item) => (
            <div key={item} className="min-w-[180px] md:min-w-[220px] flex items-center gap-3 bg-white border p-3 rounded-xl shadow-sm">
              <img src="https://via.placeholder.com/50" alt="Shoes" className="w-10 h-10 md:w-12 md:h-12 bg-gray-100 rounded-lg object-contain" />
              <div>
                <p className="text-xs md:text-sm font-bold">Nike Shoes</p>
                <p className="text-xs md:text-sm text-gray-500">₹ 240</p>
              </div>
            </div>
          ))}
        </div>
        <button className="hidden md:flex absolute right-2 top-[60%] -translate-y-1/2 bg-white shadow-md p-2 rounded-lg z-10">
          <IoIosArrowForward />
        </button>
      </div>

      {/* Tracking Timeline */}
      <div className="border p-4 md:p-6 rounded-xl bg-white space-y-6">
        <TimelineItem title="Order Placed" location="UK Store" date="23, Nov 2024" time="06:11 AM" status="completed" icon={<FaCheckCircle />} />
        <TimelineItem title="Your Goods is Picked" location="BERUN" date="23, Nov 2024" time="08:15 AM" status="active" icon={<FaBoxOpen />} />
        <TimelineItem title="On the Way to Warehouse" location="Germany" date="23, Nov 2024" time="10:11 AM" status="active" icon={<FaMapMarkerAlt />} />
        <TimelineItem title="Arrived at Warehouse" location="Delhi" date="23, Nov 2024" time="12:18 PM" status="pending" icon={<FaWarehouse />} />
        <TimelineItem title="Out for Delivery" location="Jaipur" date="23, Nov 2024" time="02:00 PM" status="pending" icon={<FaTruck />} />
        <TimelineItem title="Delivered" location="Jaipur" date="23, Nov 2024" time="05:40 PM" status="pending" isLast icon={<FaCheckCircle />} />
      </div>

      {/* Bottom Actions - Mobile par stacked kiya gaya hai */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-8 gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="bg-yellow-400 p-2 rounded shrink-0">
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b3/DHL_Logo.svg" alt="DHL" className="h-3 md:h-4" />
            </div>
            <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Track AWB</p>
                <div className="flex items-center gap-2 font-bold text-sm md:text-base">
                    1540044564 <FaCopy className="text-gray-400 cursor-pointer hover:text-black" />
                </div>
            </div>
        </div>
        <button className="w-full md:w-auto bg-black text-white px-8 py-3 rounded-xl flex items-center justify-center gap-2 font-bold hover:bg-gray-800 transition text-sm">
          <FaPhoneAlt /> Contact DHL
        </button>
      </div>
    </div>
  );
};

// Sub-component for Timeline items (Responsive text sizes)
const TimelineItem = ({ title, location, date, time, status, isLast, icon }) => {
  const getColors = () => {
    if (status === "completed") return "bg-green-500 text-white border-green-500";
    if (status === "active") return "bg-green-500 text-white border-green-500";
    return "bg-gray-400 text-white border-gray-400";
  };

  return (
    <div className="flex gap-4 relative">
      {!isLast && <div className="absolute left-[13px] top-7 w-[2px] h-full border-l-2 border-dotted border-gray-300"></div>}
      <div className={`z-10 w-7 h-7 rounded-full flex items-center justify-center text-[10px] border shrink-0 ${getColors()}`}>
        {icon}
      </div>
      <div className="flex-1 pb-2 flex justify-between gap-2">
        <div>
          <h3 className="text-xs md:text-sm font-bold leading-none mb-1">{title}</h3>
          <p className="text-[10px] text-gray-400 font-medium uppercase">{location} | {date}</p>
        </div>
        <p className="text-xs md:text-sm font-bold whitespace-nowrap">{time}</p>
      </div>
    </div>
  );
};

export default TrackOrders;