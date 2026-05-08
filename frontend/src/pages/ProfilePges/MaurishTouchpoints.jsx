import React from "react";

function MaurishTouchpoints() {
  const transactions = [
    { name: "Turtleneck Sweater", date: "May 04, 2025", points: "-50" },
    { name: "Turtleneck Sweater", date: "May 04, 2025", points: "-50" },
    { name: "Turtleneck Sweater", date: "May 04, 2025", points: "-50" },
    { name: "Turtleneck Sweater", date: "May 04, 2025", points: "-50" },
  ];
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      {/* Main Card Container */}
      <div className="relative w-full max-w-2xl bg-black text-white rounded-xl overflow-hidden  p-8 pt-16">
        {/* Left and Right "Cut-out" effect circles */}
        <div className="absolute top-1/4 -left-6 w-12 h-12 bg-white rounded-full"></div>
        <div className="absolute top-1/4 -right-6 w-12 h-12 bg-[#FFFFFF] rounded-full"></div>
        <div className="w-full flex items-center justify-center mb-5">
          <img src="/images/footer-logo.png" alt="" />
        </div>
        {/* Available Points Section */}
        <div className="flex flex-col items-center mb-12">
          <div className="flex items-center gap-2 text-gray-400 mb-4">
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
            <span className="uppercase tracking-widest text-xs font-semibold">
              Available Points
            </span>
          </div>

          {/* Points Box with Dashed Border */}
          <div className="w-full border border-dashed border-gray-600 rounded-lg py-2 text-center">
            <h1 className="text-xl font-bold tracking-[0.5em]">4900</h1>
          </div>
        </div>

        {/* Transaction History Section */}
        <div className="space-y-6">
          <h2 className="text-lg font-bold mb-4">Transaction History</h2>

          {transactions.map((item, index) => (
            <div
              key={index}
              className="border-b border-gray-800 pb-4 flex justify-between items-center"
            >
              <div>
                <h3 className="text-sm font-medium">{item.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{item.date}</p>
              </div>
              <div className="text-sm font-bold">{item.points}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MaurishTouchpoints;
