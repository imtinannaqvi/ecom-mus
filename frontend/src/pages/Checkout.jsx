import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import {
  AiOutlinePlus,
  AiOutlineLeft,
  AiOutlineCheck,
  AiOutlineInfoCircle,
} from "react-icons/ai";
import { 
  MdOutlineLocalShipping, 
  MdOutlinePayment, 
  MdOutlineCheckCircle 
} from "react-icons/md";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { AppContext } from "../context/AppContextProvider";

const Checkout = () => {
  const { cartItem } = useContext(AppContext);

  // --- LOGIC: CALCULATIONS ---
  const subtotal = cartItem.reduce((acc, item) => {
    const price = typeof item.price === "string"
        ? parseFloat(item.price.replace(/[^0-9.-]+/g, ""))
        : item.price;
    return acc + price * (item.quantity || 1);
  }, 0);

  const deliveryCharge = 0; 
  const total = subtotal + deliveryCharge;

  // --- STATE MANAGEMENT ---
  const [step, setStep] = useState("address"); 
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod"); // 'cod', 'card', 'netbanking'
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: "Brooklyn Simmons",
      address: "2972 Westheimer Rd, Santa Ana, Illinois 85486",
      selected: true,
    },
  ]);

  const handlePlaceOrder = () => setOrderPlaced(true);

  if (orderPlaced) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 animate-in fade-in zoom-in duration-300">
        <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6 text-5xl shadow-sm">
          <AiOutlineCheck />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4 uppercase tracking-tighter">Order Successful!</h2>
        <button onClick={() => (window.location.href = "/")} className="bg-black text-white px-12 py-4 rounded-sm font-bold uppercase tracking-widest text-[10px]">Return to Home</button>
      </div>
    );
  }

  return (
    <div className="bg-[#fcfcfc] min-h-screen font-sans selection:bg-black selection:text-white">
      <Header />

      <div className="max-w-[1240px] mx-auto px-6 lg:px-10 py-10">
        
        {/* TOP PROGRESS BAR */}
        <div className="flex items-center justify-center mb-16 max-w-2xl mx-auto">
          <div className="flex flex-col items-center gap-2 relative z-10">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-colors ${step === 'address' ? 'bg-black text-white' : 'bg-green-500 text-white'}`}>
              <MdOutlineLocalShipping />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest">Shipping</span>
          </div>
          
          <div className={`flex-1 h-[2px] -mt-6 mx-2 ${step === 'payment' ? 'bg-black' : 'bg-gray-200'}`}></div>
          
          <div className="flex flex-col items-center gap-2 relative z-10">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-colors ${step === 'payment' ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'}`}>
              <MdOutlinePayment />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest">Payment</span>
          </div>
          
          <div className="flex-1 h-[2px] -mt-6 mx-2 bg-gray-200"></div>
          
          <div className="flex flex-col items-center gap-2 relative z-10 opacity-30">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-xl text-gray-400">
              <MdOutlineCheckCircle />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest">Confirm</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-8">
            
            {/* STEP 1: ADDRESS */}
            {step === "address" && (
              <div className="space-y-6 animate-in slide-in-from-left-5 duration-500">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold uppercase tracking-tighter">Shipping Address</h3>
                    <button className="flex items-center gap-2 text-[11px] font-bold border-b-2 border-black pb-0.5 uppercase">
                        <AiOutlinePlus /> Add New
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {addresses.map((addr) => (
                    <div key={addr.id} className={`bg-white p-6 rounded-sm border-2 transition-all relative ${addr.selected ? 'border-black' : 'border-gray-100'}`}>
                      {addr.selected && <div className="absolute top-4 right-4 w-5 h-5 bg-black text-white rounded-sm flex items-center justify-center text-[10px]"><AiOutlineCheck /></div>}
                      <h4 className="font-bold text-sm mb-2 uppercase">{addr.name}</h4>
                      <p className="text-xs text-gray-500 leading-6 mb-8">{addr.address}</p>
                      <div className="flex gap-2">
                        <button className="flex-1 bg-gray-50 py-3 text-[10px] font-bold border border-gray-200 uppercase hover:bg-black hover:text-white transition-all">Edit</button>
                        <button className="flex-1 bg-red-50 text-red-500 py-3 text-[10px] font-bold border border-red-100 uppercase hover:bg-red-500 hover:text-white transition-all">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-10 border-t border-gray-100 mt-12">
                  <Link to="/shopping-bag" className="text-[10px] font-bold text-gray-400 flex items-center gap-2 uppercase tracking-widest hover:text-black transition-colors">
                    <AiOutlineLeft /> Return to Cart
                  </Link>
                  <button onClick={() => setStep("payment")} className="bg-black text-white px-12 py-4 font-bold text-[10px] uppercase tracking-[2px] shadow-lg">Continue to Payment</button>
                </div>
              </div>
            )}

            {/* STEP 2: PAYMENT */}
            {step === "payment" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-5 duration-500">
                <h3 className="text-xl font-bold uppercase tracking-tighter">Payment Method</h3>
                
                {/* 1. Cash on Delivery */}
                <div 
                  onClick={() => setPaymentMethod("cod")}
                  className={`bg-white border-2 p-6 rounded-sm cursor-pointer transition-all ${paymentMethod === "cod" ? 'border-black' : 'border-gray-100 opacity-60'}`}
                >
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="font-bold text-sm uppercase">Cash on Delivery (COD)</h4>
                        {paymentMethod === "cod" && <div className="w-5 h-5 bg-black text-white rounded-full flex items-center justify-center text-[10px]"><AiOutlineCheck /></div>}
                    </div>
                    <p className="text-xs text-gray-500">Pay with cash upon delivery.</p>
                </div>

                {/* 2. Credit/Debit Card (RESTORED) */}
                {/* <div 
                  onClick={() => setPaymentMethod("card")}
                  className={`bg-white border-2 p-6 rounded-sm cursor-pointer transition-all ${paymentMethod === "card" ? 'border-black' : 'border-gray-100 opacity-60'}`}
                >
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="font-bold text-sm uppercase">Credit / Debit Card</h4>
                        {paymentMethod === "card" && <div className="w-5 h-5 bg-black text-white rounded-full flex items-center justify-center text-[10px]"><AiOutlineCheck /></div>}
                    </div>
                    {paymentMethod === "card" && (
                      <div className="space-y-4 animate-in fade-in duration-300">
                        <input type="text" placeholder="Card Number" className="w-full border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-black" />
                        <div className="flex gap-4">
                          <input type="text" placeholder="MM / YY" className="flex-1 border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-black" />
                          <input type="text" placeholder="CVV" className="flex-1 border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-black" />
                        </div>
                      </div>
                    )}
                </div> */}

                {/* 3. Net Banking / Wallet (RESTORED) */}
                {/* <div 
                  onClick={() => setPaymentMethod("netbanking")}
                  className={`bg-white border-2 p-6 rounded-sm cursor-pointer transition-all ${paymentMethod === "netbanking" ? 'border-black' : 'border-gray-100 opacity-60'}`}
                >
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="font-bold text-sm uppercase">Net Banking / Indian Wallets</h4>
                        {paymentMethod === "netbanking" && <div className="w-5 h-5 bg-black text-white rounded-full flex items-center justify-center text-[10px]"><AiOutlineCheck /></div>}
                    </div>
                    {paymentMethod === "netbanking" && (
                      <div className="grid grid-cols-3 gap-3 animate-in fade-in duration-300">
                        {['SBI', 'HDFC', 'ICICI', 'Paytm', 'PhonePe', 'GPay'].map(bank => (
                          <div key={bank} className="border border-gray-200 p-3 text-[10px] text-center font-bold hover:border-black transition-colors">{bank}</div>
                        ))}
                      </div>
                    )}
                </div> */}

                {/* Maurish TouchPoints */}
                {/* <div className="p-5 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50 flex justify-between items-center">
                  <div className="flex gap-4 items-center">
                    <div className="text-2xl">
                      <svg width="30" height="30" viewBox="0 0 42 42" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M23.2183 0C25.6846 0 28.1268 0.491074 30.4054 1.44518C32.684 2.39929 34.7544 3.79776 36.4984 5.56072C38.2424 7.32369 39.6258 9.41663 40.5696 11.7201C41.5134 14.0235 41.9992 16.4923 41.9992 18.9855C41.9992 28.0383 35.8034 35.9707 27.343 37.5117C24.4984 38.0299 23.9534 40.1463 21.0142 39.8023C16.9754 39.3299 19.7776 34.9082 16.6663 33.942C15.0597 33.4431 13.3644 35.6697 11.956 35.7733C8.75342 36.0088 4.37106 33.0424 8.33276 27.349C9.80924 25.2268 6.46459 23.7815 4.70948 23.6863C3.21161 23.6049 2.66486 22.3915 2.53551 21.1223C2.42681 19.5986 4.43302 17.1889 4.77252 15.3949C5.5992 11.0622 7.89251 7.15571 11.2586 4.3464C14.6246 1.53709 18.8533 0.000307169 23.2183 0Z" fill="black"/></svg>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest">Maurish TouchPoints</p>
                      <p className="text-[10px] text-gray-400">Balance: 600 Points Available</p>
                    </div>
                  </div>
                  <input type="checkbox" className="w-5 h-5 accent-black" />
                </div> */}

                {/* T&C */}
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="t-c" className="w-4 h-4 accent-black" defaultChecked />
                  <label htmlFor="t-c" className="text-[11px] font-medium text-gray-500">I agree to the <span className="underline text-black font-bold">Terms & Conditions</span>.</label>
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <button onClick={() => setStep("address")} className="text-[10px] font-bold text-gray-400 flex items-center gap-2 uppercase tracking-widest hover:text-black transition-colors">
                    <AiOutlineLeft /> Back to Address
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: SIDEBAR */}
          <div className="lg:col-span-4">
            <div className="bg-white border border-gray-100 rounded-sm p-8 shadow-sm sticky top-10">
              <div className="flex justify-between items-center mb-6">
                <span className="text-[18px] font-bold uppercase tracking-tighter">Subtotal</span>
                <span className="text-[18px] font-bold tracking-tighter">₹{subtotal}</span>
              </div>

              <div className="bg-[#f9f9f9] border border-dashed border-gray-200 p-5 mb-6">
                <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                  <span>Coupon Code</span>
                  <span className="text-black cursor-pointer border-b border-black">View Offers</span>
                </div>
                <div className="flex gap-2">
                  <input className="flex-1 bg-transparent border-none text-[11px] focus:ring-0 p-0 font-medium" placeholder="Have a code? type it here..." />
                  <button className="text-green-600 text-[11px] font-bold uppercase">Validate</button>
                </div>
              </div>

              <div className="flex justify-between text-[13px] text-gray-500 mb-8 font-medium">
                <span>Delivery Charge</span>
                <span className="text-black font-bold uppercase text-[11px]">Free</span>
              </div>

              <div className="flex justify-between items-center border-t border-gray-100 pt-6 mb-10">
                <span className="text-[22px] font-black uppercase tracking-tighter">Grand Total</span>
                <span className="text-[22px] font-black tracking-tighter">₹{total}</span>
              </div>

              {step === "payment" && (
                <button onClick={handlePlaceOrder} className="w-full bg-black text-white py-5 font-bold text-xs uppercase tracking-[4px] rounded-sm mb-8 hover:bg-gray-900 shadow-xl">Place My Order</button>
              )}

              <div className="text-center opacity-70">
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[3px] mb-4">Secure Payments</p>
                <div className="flex justify-center gap-4 grayscale scale-90">
                  <img src="https://img.icons8.com/color/48/visa.png" className="h-6" alt="visa" />
                  <img src="https://img.icons8.com/color/48/mastercard.png" className="h-6" alt="mastercard" />
                  <img src="https://img.icons8.com/color/48/paypal.png" className="h-6" alt="paypal" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;