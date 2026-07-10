import React, { useContext } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { CartContext } from "../context/CartContext"; // Context import kiya
import { useNavigate } from 'react-router-dom';

function AddPayment() {
  const { cartItems, cartLoading } = useContext(CartContext); // Cart data fetching
  const navigate = useNavigate();

  // Subtotal calculation (Dynamic)
  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.productId?.price || 0;
    return sum + (price * item.quantity);
  }, 0);

  // Handle Order Placement (COD Logic)
  const handlePlaceOrder = () => {
    // Payment method context ya localStorage mein save karna
    localStorage.setItem('selectedPaymentMethod', 'COD');
    
    // Agle page (Review) par bhej do
    navigate('/shopping-bag'); 
  };

if (cartLoading) return 
<div className="flex justify-center p-20"><div className="w-8 h-8 border-2 border-gray-200 border-t-black rounded-full animate-spin" /></div>;
  return (
    <main>
      <Header />
      <div className="min-h-screen bg-white p-4 md:p-10 font-sans text-gray-800">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left Section: Payment Methods */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold uppercase tracking-tight">Payment Method</h1>
              <p className="text-sm">Have An Account? <span className="font-bold cursor-pointer underline">Log In</span></p>
            </div>

            {/* Stepper */}
            <div className="flex items-center justify-between mb-10 relative px-4">
              <div className="flex flex-col items-center z-10">
                <div className="w-10 h-10 bg-black text-white rounded-lg flex items-center justify-center mb-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                </div>
                <span className="text-[10px] font-bold uppercase">Address</span>
              </div>
              <div className="flex-1 h-[1px] border-t border-dotted border-gray-400 mx-2 mt-[-20px]"></div>
              <div className="flex flex-col items-center z-10">
                <div className="w-10 h-10 bg-black text-white rounded-lg flex items-center justify-center mb-2 shadow-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                </div>
                <span className="text-[10px] font-bold uppercase">Payment Method</span>
              </div>
              <div className="flex-1 h-[1px] border-t border-dotted border-gray-400 mx-2 mt-[-20px]"></div>
              <div className="flex flex-col items-center z-10 opacity-30">
                <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center mb-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <span className="text-[10px] font-bold uppercase">Review</span>
              </div>
            </div>

            <h2 className="text-lg font-bold mb-4">Select A Payment Method</h2>
            
            {/* Cash on Delivery (Primary Option) */}
            <div className="mb-8">
              <div className="border-2 border-black bg-white rounded-lg p-5 flex justify-between items-center cursor-pointer shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-xl">💵</div>
                  <div>
                    <p className="text-sm font-bold uppercase">Cash On Delivery (COD)</p>
                    <p className="text-[10px] text-gray-500">Pay when your order is delivered</p>
                  </div>
                </div>
                <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center">
                   <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Blurred Coming Soon Sections */}
            <div className="space-y-4 opacity-40 select-none pointer-events-none">
              <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide blur-[2px]">
                {[1, 2].map((_, i) => (
                  <div key={i} className={`min-w-[280px] h-44 rounded-xl p-5 relative text-white bg-gradient-to-br from-gray-400 to-gray-600`}>
                    <div className="flex justify-between items-start italic font-bold">VISA</div>
                    <div className="mt-6 text-lg tracking-[0.2em] font-mono">**** **** **** ****</div>
                    <div className="mt-10 text-[10px] font-bold uppercase tracking-widest text-center">COMING SOON</div>
                  </div>
                ))}
              </div>

              <div className="border-b pb-4 blur-[1px]">
                <div className="flex justify-between items-center py-2">
                  <div className="flex items-center gap-2 font-bold text-sm uppercase">💳 Credit/Debit Card</div>
                  <span className="text-[10px] font-bold text-red-500">OFFLINE</span>
                </div>
              </div>

              <div className="border-b pb-2 blur-[1px]">
                <div className="flex justify-between items-center py-2 font-bold text-sm uppercase">
                  <span className="flex items-center gap-2">👛 Wallets</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section: Order Summary (Dynamic from CartContext) */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm sticky top-10">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xl font-bold">Subtotal</span>
                <span className="text-xl font-bold tracking-tighter">₹{subtotal}</span>
              </div>

              {/* Coupon Code Section */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-bold uppercase flex items-center gap-1">🏷 Coupon Code</span>
                  <button className="text-[10px] font-bold underline">View Offers</button>
                </div>
                <div className="relative">
                  <input type="text" placeholder="Have a code? type it here..." className="w-full bg-gray-50 border border-gray-100 rounded-lg py-3 px-4 text-xs focus:outline-none" />
                  <button className="absolute right-4 top-1/2 -translate-y-1/2 text-green-600 font-bold text-xs uppercase">Validate</button>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6 text-sm">
                <span className="text-gray-500 font-medium">Delivery Charge</span>
                <span className="font-bold uppercase">Free</span>
              </div>

              <div className="flex justify-between items-center pt-6 border-t border-gray-100 mb-6">
                <span className="text-xl font-bold">Grand Total</span>
                <span className="text-xl font-bold tracking-tighter">₹{subtotal}</span>
              </div>

              <div className="flex items-start gap-2 mb-6">
                <input type="checkbox" defaultChecked className="mt-1 accent-black" />
                <label className="text-[10px] leading-tight">
                  I agree to <span className="font-bold underline">Terms and conditions</span>
                </label>
              </div>

              <button 
                onClick={handlePlaceOrder}
                className="w-full bg-black text-white py-4 rounded-lg font-bold text-sm hover:opacity-90 transition uppercase tracking-widest"
              >
                Place My Order
              </button>

              <div className="mt-8 text-center">
                <p className="text-[10px] font-bold text-gray-400 mb-4 uppercase">100% Secured Payment Gateways</p>
                <div className="flex justify-center gap-3 grayscale opacity-70">
                  <span className="text-blue-800 font-black text-xs italic">PayPal</span>
                  <span className="text-blue-600 font-black text-xs italic">VISA</span>
                  <span className="text-orange-500 font-black text-xs italic">Mastercard</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </main>
  );
}

export default AddPayment;