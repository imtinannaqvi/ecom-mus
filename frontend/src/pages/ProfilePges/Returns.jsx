import React, { useState } from "react";

function Returns() {
  const [cancelOrder, setCancelOrder] = useState(false);

  return (
    <section className="w-full h-full p-4 md:p-0">
      {/* Success Modal */}
      {cancelOrder && (
        <div className="fixed inset-0 w-full h-full bg-black/60 backdrop-blur-md z-[1000] flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl flex flex-col items-center justify-center p-6 md:p-10 gap-5 text-center animate-in zoom-in duration-300">
            <img 
              className="w-32 md:w-40 object-contain" 
              src="/images/Check.jpg" 
              alt="Success" 
            />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Your order will be cancelled</h1>
              <p className="text-gray-500 mt-2">Thank You</p>
            </div>
            <button 
              onClick={() => setCancelOrder(false)} 
              className="w-full py-4 bg-black rounded-lg cursor-pointer text-white font-semibold hover:bg-gray-800 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}

      {/* Header Info */}
      <div className="w-full md:w-1/2 flex items-center justify-between font-medium">
        <span className="text-sm md:text-base">Product (1/2)</span>
        <span className="text-red-600 underline cursor-pointer text-sm">Edit</span>
      </div>

      {/* Product Card */}
      <div className="w-full md:w-1/2 flex gap-4 h-28 md:h-32 shadow-[0_4px_20px_rgba(0,0,0,0.1)] rounded-xl overflow-hidden mt-5 bg-white">
        <img
          className="w-24 md:w-[25%] h-full object-cover"
          src="/images/p1.jpg"
          alt="Product"
        />
        <div className="flex flex-col justify-center py-2">
          <h3 className="font-bold text-sm md:text-base">Turtleneck Sweater</h3>
          <p className="text-red-600 font-bold text-sm">$ 39.99</p>
          <p className="text-xs md:text-sm text-gray-500 mt-1">Size: M | Color: White</p>
        </div>
      </div>

      {/* Reason Selection */}
      <h1 className="text-base md:text-lg mt-8 font-bold text-gray-800">
        Please Mention the Reason for Return Request
      </h1>
      
      <div className="w-full md:w-1/2 text-sm mt-5 flex flex-col items-start gap-4">
        {[
          "Wrong Item Received",
          "Defective or Damaged Product",
          "Quality Issues",
          "Size or Fit Issue",
          "Other"
        ].map((reason, index) => (
          <label key={index} className="flex items-center gap-3 cursor-pointer group w-full">
            <input 
              type="radio" 
              name="returnReason" 
              className="w-4 h-4 accent-black cursor-pointer" 
            />
            <p className="group-hover:text-black text-gray-700 transition-colors">{reason}</p>
          </label>
        ))}
      </div>

      {/* Detail Textarea */}
      <textarea 
        className="w-full md:w-1/2 resize-none h-28 border border-gray-300 rounded-xl mt-6 p-4 outline-none focus:border-black transition-all text-sm" 
        placeholder="Explain detail here..."
      ></textarea>

      {/* Action Button */}
      <div className="w-full md:w-1/2 mt-6 pb-10">
        <button 
          onClick={() => setCancelOrder(true)} 
          className="w-full py-4 bg-black rounded-xl cursor-pointer text-white font-bold hover:bg-gray-800 active:scale-[0.98] transition-all"
        >
          Continue
        </button>
      </div>
    </section>
  );
}

export default Returns;