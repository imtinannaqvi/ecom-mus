import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import API from '../api/api';
import { AppContext } from "../context/AppContextProvider";
import { CartContext } from "../context/CartContext"; 
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ShippingAddress() {
  // Context se values nikalna
  const { selectedAddress, setSelectedAddress } = useContext(AppContext);
  const { cartItems, cartLoading } = useContext(CartContext);
  
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 1. Backend se addresses load karna
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await API.get('/address/get-address');
        const data = response.data.addresses || response.data;
        setAddresses(data);
        
        // Agar pehle se koi address context/localstorage mein nahi hai, toh pehla wala select kar lo
        if (!selectedAddress && data.length > 0) {
          setSelectedAddress(data[0]);
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAddresses();
  }, [selectedAddress, setSelectedAddress]);

  // 2. Dynamic Total Calculation
  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.productId?.price || 0;
    return sum + (price * item.quantity);
  }, 0);

  // 3. Selection Logic (Context + LocalStorage update automatically via AppContext)
  const handleAddressSelect = (addr) => {
    setSelectedAddress(addr);
  };

  const handleNext = () => {
  if (!selectedAddress) {
    toast.warning("Please select a delivery address");
    return;
  }

  navigate("/payment");
};

if (loading || cartLoading) return <div className="flex justify-center p-20"><div className="w-8 h-8 border-2 border-gray-200 border-t-black rounded-full animate-spin" /></div>;
  return (
    <>
     <ToastContainer
    position="top-right"
    autoClose={3000}
    hideProgressBar={false}
  />
    <main>
      <Header />
      <div className="min-h-screen bg-gray-50 p-4 md:p-10 text-gray-800">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Section: Shipping Details */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold uppercase tracking-wide">Shipping Address</h1>
              <p className="text-sm">Have An Account? <span className="font-bold cursor-pointer underline">Log In</span></p>
            </div>

            {/* Stepper (Original UI) */}
            <div className="flex items-center justify-between mb-10 relative">
              <div className="flex flex-col items-center z-10">
                <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <span className="text-xs font-semibold">Address</span>
              </div>
              <div className="flex-1 h-[1px] border-t border-dashed border-gray-300 mx-4 mt-[-20px]"></div>
              <div className="flex flex-col items-center z-10 opacity-40">
                <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <span className="text-xs font-semibold">Payment Method</span>
              </div>
              <div className="flex-1 h-[1px] border-t border-dashed border-gray-300 mx-4 mt-[-20px]"></div>
              <div className="flex flex-col items-center z-10 opacity-40">
                <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span className="text-xs font-semibold">Review</span>
              </div>
            </div>

            <h2 className="text-lg font-bold mb-2">Select A Delivery Address</h2>
            <p className="text-xs text-gray-500 mb-8 leading-relaxed">
              Is The Address You'd Like To Use Displayed Below? If So, Click The Corresponding "Deliver To This Address" Button. Or <span className="text-blue-900 font-bold cursor-pointer">You Can Enter A New Delivery Address</span>
            </p>

            {/* Address Cards (Dynamic) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {addresses.map((addr) => (
                <div 
                  key={addr._id}
                  onClick={() => handleAddressSelect(addr)}
                  className={`border-2 p-6 rounded-lg relative shadow-sm cursor-pointer transition-all ${
                    selectedAddress?._id === addr._id ? "border-black bg-white" : "border-gray-100 bg-white"
                  }`}
                >
                  <input 
                    type="radio" 
                    name="address"
                    checked={selectedAddress?._id === addr._id} 
                    readOnly 
                    className="absolute top-4 right-4 h-5 w-5 accent-black" 
                  />
                  <h3 className="font-bold text-lg mb-1">{addr.firstName} {addr.lastName}</h3>
                  <p className="text-sm text-gray-500 mb-4">{addr.flatColony}, {addr.city},<br/>{addr.state} {addr.zipCode}</p>
                  <div className="flex gap-2">
                    <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-100 rounded hover:bg-gray-200 transition text-sm font-medium">
                      <span>✎</span> Edit
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-50 text-red-500 rounded hover:bg-red-100 transition text-sm font-medium">
                      <span>🗑</span> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row justify-between cursor-pointer items-center gap-4">
              <button onClick={() => navigate('/shopping-bag')} className="text-sm cursor-pointer font-bold flex items-center gap-2">
                <span>‹</span> Return To Cart
              </button>
              <button onClick={()=>navigate('/profile/address')} className="flex cursor-pointer items-center gap-2 text-sm font-bold">
                <span className="border-2 border-gray-800 rounded-full w-5 h-5 flex items-center justify-center text-xs">+</span> Add a new Address
              </button>
            </div>

            <button 
              onClick={handleNext}
              className="w-full bg-black cursor-pointer text-white py-4 rounded-lg mt-10 font-bold hover:bg-gray-800 transition"
            >
              Save
            </button>
          </div>

          {/* Right Section: Order Summary (Dynamic) */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xl font-bold">Subtotal</span>
                <span className="text-xl font-bold uppercase tracking-tighter">₹{subtotal}</span>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>%</span> <span className="font-semibold uppercase">Coupon Code</span>
                  </div>
                  <button className="text-sm font-bold underline">View Offers</button>
                </div>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Have a code? type it here..." 
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 px-4 text-sm focus:outline-none"
                  />
                  <button className="absolute right-4 top-1/2 -translate-y-1/2 text-green-600 font-bold text-sm">
                    Validate
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6 pt-4 border-t border-gray-100">
                <span className="text-sm font-medium text-gray-600">Delivery Charge</span>
                <div className="flex items-center gap-2">
                  <input type="radio" checked readOnly className="accent-black" />
                  <span className="text-sm font-bold">Free</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                <span className="text-xl font-bold">Grand Total</span>
                <span className="text-xl font-bold uppercase tracking-tighter">₹{subtotal}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </main>
    </>
    
  );
}

export default ShippingAddress;