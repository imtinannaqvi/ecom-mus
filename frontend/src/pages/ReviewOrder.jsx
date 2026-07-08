import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { CartContext } from "../context/CartContext";
import { AppContext } from "../context/AppContextProvider"; // Address aur Payment ke liye
import { placeOrder } from "../services/orderService";
import Api, { BACKEND_URL } from "../api/api";

const ReviewOrder = () => {
  const { cartItems, cartLoading, setCartItems } = useContext(CartContext);
  const { selectedAddress, paymentMethod, user } = useContext(AppContext); // Dynamic Data + user
  const navigate = useNavigate();


  const [agreed, setAgreed] = useState(true);
  const [isOrdering, setIsOrdering] = useState(false); // Loading state
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  // --- Coupon State ---
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null); // { code, discountAmount }
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.productId?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  const discountAmount = appliedCoupon?.discountAmount || 0;
  const grandTotal = Math.max(subtotal - discountAmount, 0);

  // Re-check the coupon whenever the cart total changes, so the discount
  // shown always matches the current subtotal (e.g. if items were removed).
  useEffect(() => {
    if (appliedCoupon) {
      handleApplyCoupon(appliedCoupon.code, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subtotal]);

  const handleApplyCoupon = async (codeOverride, silent = false) => {
    const code = (codeOverride || couponInput).trim();
    if (!code) return;

    setCouponLoading(true);
    setCouponError("");
    try {
      const res = await Api.post("/coupons/validate", { code, cartTotal: subtotal });
      if (res.data.success) {
        setAppliedCoupon({ code: res.data.coupon.code, discountAmount: res.data.discountAmount });
        if (!silent) setCouponInput("");
      }
    } catch (err) {
      setAppliedCoupon(null);
      setCouponError(err.response?.data?.message || "Invalid coupon code");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponError("");
  };

  // --- Complete Order Logic ---
  const completeOrder = async () => {
    // 0. Require login only at the point of actually placing the order.
    // Guests can freely view/manage their bag up to this point.
    if (!user) {
      alert("Please log in or sign up to complete your order.");
      return navigate('/login');
    }

    // 1. Validations
    if (!selectedAddress) {
      alert("Shipping address is missing. Please select one.");
      return navigate('/address');
    }
    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return navigate('/cart');
    }

    // 2. Payload Preparation
    const payload = {
      orderItems: cartItems.map(item => ({
        productId: item.productId._id,
        quantity: item.quantity,
        size: item.size || "M",
        color: item.color || "Default",
        price: item.productId.price
      })),
      shippingAddress: selectedAddress._id,
      paymentMethod: paymentMethod || 'COD',
      totalPrice: subtotal, // backend re-validates the coupon and computes the final total itself
      deliveryCharge: 0,
      couponCode: appliedCoupon?.code || undefined,
    };

    try {
      setIsOrdering(true);
      const res = await placeOrder(payload);

      if (res.success) {
        // Clear logic
        localStorage.removeItem("selectedAddress");
        if(setCartItems) setCartItems([]); // Context clear

        navigate(`/profile/orders`);
      } else {
        alert(res.message || "Failed to place order.");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsOrdering(false);
    }
  };

  if (cartLoading && cartItems.length === 0) {
    return <div className="flex h-screen items-center justify-center font-bold tracking-widest uppercase">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Header />

      <div className="px-6 md:px-12 py-4 text-[11px] text-gray-400">
        Cart / <span className="text-black font-bold">Info</span> / Shipping / Payment
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-6 grid grid-cols-1 lg:grid-cols-3 gap-12">

        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold tracking-tight uppercase">Payment Method</h1>
            {!user && (
              <p className="text-sm">
                Have An Account?{" "}
                <span
                  onClick={() => navigate('/login')}
                  className="font-bold underline cursor-pointer"
                >
                  Log In
                </span>
              </p>
            )}
          </div>

          <div className="flex items-center justify-between mb-12 px-2 relative">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center shadow-md">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              </div>
              <span className="text-[10px] mt-2 font-bold uppercase text-gray-400">Address</span>
            </div>
            <div className="flex-1 h-[0px] border-t border-dashed border-gray-300 mx-4 mt-[-20px]"></div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center shadow-md">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
              </div>
              <span className="text-[10px] mt-2 font-bold uppercase text-gray-400">Payment Method</span>
            </div>
            <div className="flex-1 h-[0px] border-t border-dashed border-gray-300 mx-4 mt-[-20px]"></div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center shadow-md">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <span className="text-[10px] mt-2 font-bold uppercase">Review</span>
            </div>
          </div>

          <div className="mb-6 flex items-center gap-3">
             <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
             <h2 className="text-base font-bold">Estimated Delivery: <span className="font-extrabold text-black">15 May 2025</span></h2>
          </div>

          <div className="space-y-6 mb-10">
            {cartItems.map((item) => {
              const product = item.productId || {};
              const imgSource = product.images?.[0]?.url || product.images?.[0] || "";

              return (
                <div key={item._id} className="flex gap-4 items-start">
                  <div className="w-20 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={imgSource.startsWith("http") ? imgSource : `${BACKEND_URL}${imgSource}`}
                      alt="" className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 py-1">
                    <h3 className="font-bold text-base leading-tight">{product.name || "Product Name"}</h3>
                    <p className="text-xs text-gray-400 mt-1 uppercase font-bold">
                      Size: <span className="text-black">{item.size}</span> | Color: <span className="text-black">{item.color}</span>
                    </p>
                    <p className="text-lg font-extrabold mt-2 tracking-tight">₹{product.price * item.quantity}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <hr className="border-gray-100 mb-8" />

          {/* Dynamic Shipping Summary */}
          <div className="mb-10 relative">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-bold">Shipping Address</h3>
              <button onClick={()=>navigate('/address')} className="text-gray-400 cursor-pointer hover:text-black transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
              </button>
            </div>
            {selectedAddress ? (
              <>
                <p className="font-bold text-sm uppercase tracking-tight">{selectedAddress.firstName} {selectedAddress.lastName}</p>
                <p className="text-xs text-gray-500 mt-1">{selectedAddress.flatColony}, {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.zipCode}</p>
              </>
            ) : (
              <p className="text-xs text-red-400 uppercase font-bold">No address selected</p>
            )}
          </div>

          {/* Dynamic Payment Summary */}
          <div className="mb-10">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-bold">Payment Method</h3>
              <button onClick={()=>navigate('/payment')} className="text-gray-400 cursor-pointer hover:text-black transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
              </button>
            </div>
            <p className="text-xs text-gray-500 font-bold uppercase">{paymentMethod === 'COD' ? "Cash On Delivery (COD)" : paymentMethod}</p>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow-sm sticky top-10">
            <div className="flex justify-between items-center mb-8">
              <span className="text-xl font-bold">Subtotal</span>
              <span className="text-xl font-bold tracking-tighter">₹{subtotal}</span>
            </div>

            <div className="mb-8">
              <div className="flex justify-between items-center mb-2 px-1">
                <span className="text-[10px] font-bold uppercase flex items-center gap-1">
                   <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 011.026-.14c.445.03.94.18 1.435.413.484.23.94.542 1.314.933a3.524 3.524 0 01.811 1.171c.16.39.243.834.243 1.313 0 1.206-.494 2.27-1.337 3.007a4.534 4.534 0 01-3.04 1.054 4.4 4.4 0 01-2.974-1.098c-.76-.695-1.163-1.635-1.163-2.652 0-.25.02-.5.059-.745a3.5 3.5 0 01.59-1.692c.38-.527.844-1.022 1.305-1.485.46-.463.92-.89 1.32-1.246.63-.56 1.088-.9 1.348-1.066.204-.13.328-.21.414-.27a.5.5 0 00.115-.708z" clipRule="evenodd" /></svg>
                   Coupon Code
                </span>
              </div>

              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
                  <div>
                    <p className="text-xs font-bold text-emerald-700">{appliedCoupon.code} applied</p>
                    <p className="text-[10px] text-emerald-600">You saved ₹{appliedCoupon.discountAmount}</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-[10px] font-bold uppercase text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Have a code? type it here..."
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleApplyCoupon())}
                      className="w-full bg-gray-50 border-none rounded-xl py-4 px-4 text-xs font-medium placeholder:text-gray-400 focus:ring-1 focus:ring-black outline-none uppercase"
                    />
                    <button
                      type="button"
                      onClick={() => handleApplyCoupon()}
                      disabled={couponLoading || !couponInput.trim()}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-green-600 font-bold text-xs disabled:opacity-40"
                    >
                      {couponLoading ? "..." : "Apply"}
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-[10px] text-red-500 font-semibold mt-2">{couponError}</p>
                  )}
                </>
              )}
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between items-center mb-8 border-t border-gray-100 pt-6">
                <span className="text-sm font-medium text-emerald-600 tracking-tight">Discount</span>
                <span className="text-sm font-bold text-emerald-600">- ₹{discountAmount}</span>
              </div>
            )}

            <div className="flex justify-between items-center mb-8 border-t border-gray-100 pt-6">
              <span className="text-sm font-medium text-gray-500 tracking-tight">Delivery Charge</span>
              <span className="text-sm font-bold uppercase">Free</span>
            </div>

            <div className="flex justify-between items-center mb-8 border-t border-gray-100 pt-6">
              <span className="text-xl font-extrabold">Grand Total</span>
              <span className="text-xl font-extrabold tracking-tighter">₹{grandTotal}</span>
            </div>

            <div className="flex items-start gap-3 mb-8">
              <input
                type="checkbox"
                checked={agreed}
                onChange={() => setAgreed(!agreed)}
                className="mt-1 accent-black h-4 w-4"
              />
              <label className="text-[10px] leading-relaxed text-gray-500">
                I agree to <span className="font-bold underline text-black cursor-pointer">Terms and conditions</span>
              </label>
            </div>

            <button
              onClick={completeOrder}
              disabled={!agreed || isOrdering}
              className={`w-full py-5 rounded-xl font-bold text-sm tracking-widest uppercase transition ${agreed && !isOrdering ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
            >
              {isOrdering ? "Placing Order..." : "Place My Order"}
            </button>

            <div className="mt-10 text-center">
               <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-6">100% Secured Payment Gateways</p>
               <div className="flex justify-center gap-5 grayscale opacity-60">
                 <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-4" alt="paypal" />
                 <img src="https://upload.wikimedia.org/wikipedia/commons/d/d6/Visa_2014_logo_detail.svg" className="h-4" alt="visa" />
                 <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-4" alt="master" />
                 <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_Pay_logo.svg" className="h-4" alt="apple" />
               </div>
            </div>
          </div>
        </div>

      </div>
      <Footer />
    </div>
  );
};

export default ReviewOrder;