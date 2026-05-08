import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  AiOutlinePlus,
  AiOutlineLeft,
  AiOutlineCheck,
  AiOutlineDown,
  AiOutlineUp,
  AiOutlineInfoCircle,
} from "react-icons/ai";
import Footer from "../components/Footer";
import Header from "../components/Header";

const Checkout = () => {
  const [step, setStep] = useState("address"); // address, payment
  const [openSection, setOpenSection] = useState("card"); // card, wallet, netbanking
  const [selectedWallet, setSelectedWallet] = useState("paytm");
  const [orderPlaced, setOrderPlaced] = useState(false);

  const subtotal = 1798;

  if (orderPlaced) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
        <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6 text-5xl">
          <AiOutlineCheck />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Order Successful!
        </h2>
        <p className="text-gray-500 mb-8 text-center max-w-sm">
          Your order has been confirmed. You'll receive an email shortly with
          details.
        </p>
        <button
          onClick={() => (window.location.href = "/")}
          className="bg-black text-white px-12 py-4 rounded-sm font-bold uppercase tracking-widest text-xs"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#fcfcfc] min-h-screen">
      <Header />

      {/* --- MAIN CONTENT --- */}
      <div className="max-w-[1240px] mx-auto px-6 lg:px-10 py-10">
        {/* Page Title & Login Link */}
        <div className="flex justify-between items-end mb-10 border-b pb-6 border-gray-100">
          <h1 className="text-[28px] font-bold uppercase tracking-tighter">
            {step === "address" ? "Shipping Address" : "Payment Method"}
          </h1>
          <p className="text-[13px] text-gray-500 font-medium">
            Have An Account?{" "}
            <Link to="/login" className="text-black font-bold underline ml-1">
              Log In
            </Link>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* LEFT COLUMN: 8 Units */}
          <div className="lg:col-span-8">
            {/* PROGRESS STEPPER */}
            <div className="flex items-center justify-between max-w-[550px] mb-12 relative">
              <div className="absolute top-5 left-0 w-full h-[1px] border-t border-dashed border-gray-300 -z-0"></div>

              {[
                {
                  id: "address",
                  label: "Address",
                  icon: (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 32 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16 24V20"
                        stroke="white"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M13.4264 3.75996L4.18637 11.16C3.14637 11.9866 2.4797 13.7333 2.70637 15.04L4.4797 25.6533C4.7997 27.5466 6.61304 29.08 8.53304 29.08H23.4664C25.373 29.08 27.1997 27.5333 27.5197 25.6533L29.293 15.04C29.5064 13.7333 28.8397 11.9866 27.813 11.16L18.573 3.7733C17.1464 2.62663 14.8397 2.62663 13.4264 3.75996Z"
                        stroke="white"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  ),
                },
                {
                  id: "payment",
                  label: "Payment Method",
                  icon: (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 32 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2.66602 11.3398H29.3327"
                        stroke="white"
                        stroke-width="1.5"
                        stroke-miterlimit="10"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M8 22.0066H10.6667"
                        stroke="white"
                        stroke-width="1.5"
                        stroke-miterlimit="10"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M14 22.0066H19.3333"
                        stroke="white"
                        stroke-width="1.5"
                        stroke-miterlimit="10"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M8.58602 4.67334H23.3993C28.146 4.67334 29.3327 5.84667 29.3327 10.5267V21.4733C29.3327 26.1533 28.146 27.3267 23.4127 27.3267H8.58602C3.85268 27.34 2.66602 26.1667 2.66602 21.4867V10.5267C2.66602 5.84667 3.85268 4.67334 8.58602 4.67334Z"
                        stroke="white"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  ),
                },
                {
                  id: "review",
                  label: "Review",
                  icon: (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 32 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M29.3327 13.3334V20.0001C29.3327 26.6667 26.666 29.3334 19.9993 29.3334H11.9993C5.33268 29.3334 2.66602 26.6667 2.66602 20.0001V12.0001C2.66602 5.33341 5.33268 2.66675 11.9993 2.66675H18.666"
                        stroke="#292D32"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M29.3327 13.3334H23.9993C19.9993 13.3334 18.666 12.0001 18.666 8.00008V2.66675L29.3327 13.3334Z"
                        stroke="#292D32"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M9.33398 17.3333H17.334"
                        stroke="#292D32"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M9.33398 22.6667H14.6673"
                        stroke="#292D32"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  ),
                },
              ].map((s, idx) => (
                <div
                  key={s.id}
                  className="flex flex-col items-center z-10 bg-[#fcfcfc] px-3"
                >
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center mb-2 transition-all ${
                      step === s.id || (step === "payment" && idx === 0)
                        ? "bg-black text-white shadow-lg shadow-black/20"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    <span className="text-xl">{s.icon}</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider ${step === s.id ? "text-black" : "text-gray-400"}`}
                  >
                    {s.label}
                  </span>
                </div>
              ))}
            </div>

            {/* STEP 1: ADDRESS SELECTION */}
            {step === "address" && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <h3 className="text-lg font-bold">Select A Delivery Address</h3>
                <p className="text-xs text-gray-400 font-medium leading-relaxed max-w-xl">
                  Is the address you'd like to use displayed below? If so, click
                  the corresponding "Deliver to this address" button, or enter a
                  new address.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Address Card 1 */}
                  <div className="bg-white p-6 rounded-sm border-2 border-black relative">
                    <div className="absolute top-4 right-4 w-5 h-5 bg-black text-white rounded-sm flex items-center justify-center text-[10px]">
                      <AiOutlineCheck />
                    </div>
                    <h4 className="font-bold text-sm mb-2 uppercase">
                      Brooklyn Simmons
                    </h4>
                    <p className="text-xs text-gray-500 leading-6 mb-8">
                      2972 Westheimer Rd, Santa Ana,
                      <br /> Illinois 85486
                    </p>
                    <div className="flex gap-2">
                      <button className="flex-1 bg-gray-50 py-3 text-[10px] font-bold border border-gray-200 hover:bg-gray-100 uppercase">
                        Edit
                      </button>
                      <button className="flex-1 bg-red-50 text-red-500 py-3 text-[10px] font-bold border border-red-100 hover:bg-red-100 uppercase">
                        Delete
                      </button>
                    </div>
                  </div>
                  {/* Address Card 2 */}
                  <div className="bg-white p-6 rounded-sm border border-gray-100 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
                    <h4 className="font-bold text-sm mb-2 uppercase">
                      Cameron Williamson
                    </h4>
                    <p className="text-xs text-gray-500 leading-6 mb-8">
                      4517 Washington Ave, Manchester,
                      <br /> Kentucky 39495
                    </p>
                    <div className="flex gap-2">
                      <button className="flex-1 bg-gray-50 py-3 text-[10px] font-bold border border-gray-200 uppercase">
                        Edit
                      </button>
                      <button className="flex-1 bg-red-50 text-red-500 py-3 text-[10px] font-bold border border-red-100 uppercase">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>

                <button className="flex items-center gap-2 text-xs font-bold mt-8 border-b border-black pb-1 uppercase tracking-tighter">
                  <AiOutlinePlus className="text-sm" /> Add a new Address
                </button>

                <div className="flex justify-between items-center pt-10 border-t border-gray-100 mt-12">
                  <Link to={'/shopping-bag'} className="text-xs font-bold text-gray-400 flex items-center gap-2 uppercase tracking-widest">
                    <AiOutlineLeft /> Return to Cart
                  </Link>
                  <button
                    onClick={() => setStep("payment")}
                    className="bg-black text-white px-16 py-4 font-bold text-xs uppercase tracking-[3px] rounded-sm shadow-xl shadow-black/10"
                  >
                    Save & Continue
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: PAYMENT METHOD */}
            {step === "payment" && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                <h3 className="text-lg font-bold uppercase tracking-tight">
                  Select A Payment Method
                </h3>

                {/* Horizontal Card Selection */}
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                  {[1, 2].map((card, i) => (
                    <div
                      key={i}
                      className={`min-w-[340px] h-[190px] rounded-2xl p-6 text-white relative transition-all ${i === 0 ? "bg-gradient-to-br from-[#1293d2] to-[#40b7ef]" : "bg-gradient-to-br from-[#4b6cb7] to-[#182848] opacity-50"}`}
                    >
                      <div className="flex justify-between items-start mb-8">
                        <span className="font-black italic text-sm tracking-widest">
                          VISA
                        </span>
                        {i === 0 && (
                          <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center border-2 border-white/20">
                            <AiOutlineCheck />
                          </div>
                        )}
                      </div>
                      <p className="text-xl tracking-[5px] mb-6 font-medium font-mono">
                        **** **** **** 8378
                      </p>
                      <div className="flex justify-between items-end text-[10px] uppercase font-bold tracking-widest">
                        <div>
                          <p className="opacity-60 mb-1">Card Holder</p>
                          <p>Sunil Phani</p>
                        </div>
                        <div>
                          <p className="opacity-60 mb-1">Expires</p>
                          <p>05/24</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* --- PAYMENT OPTIONS ACCORDION --- */}
                <div className="border border-gray-100 rounded-sm bg-white shadow-sm overflow-hidden">
                  {/* Credit/Debit Card Section */}
                  <div className="border-b border-gray-50">
                    <button
                      onClick={() =>
                        setOpenSection(openSection === "card" ? "" : "card")
                      }
                      className="w-full flex justify-between items-center p-5 text-sm font-bold uppercase tracking-tighter"
                    >
                      <span className="flex items-center gap-3 italic">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 32 32"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M2.66602 11.3398H29.3327"
                            stroke="black"
                            stroke-width="1.5"
                            stroke-miterlimit="10"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M8 22.0068H10.6667"
                            stroke="black"
                            stroke-width="1.5"
                            stroke-miterlimit="10"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M14 22.0068H19.3333"
                            stroke="black"
                            stroke-width="1.5"
                            stroke-miterlimit="10"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M8.58602 4.67334H23.3993C28.146 4.67334 29.3327 5.84667 29.3327 10.5267V21.4733C29.3327 26.1533 28.146 27.3267 23.4127 27.3267H8.58602C3.85268 27.34 2.66602 26.1667 2.66602 21.4867V10.5267C2.66602 5.84667 3.85268 4.67334 8.58602 4.67334Z"
                            stroke="black"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                        Credit/Debit Card
                      </span>
                      {openSection === "card" ? (
                        <AiOutlineUp />
                      ) : (
                        <AiOutlineDown />
                      )}
                    </button>
                    {openSection === "card" && (
                      <div className="p-6 pt-0 space-y-4 animate-in slide-in-from-top-2">
                        <input
                          className="w-full border border-gray-200 p-4 text-xs bg-[#fbfbfb] focus:outline-black"
                          placeholder="Card Number"
                          defaultValue="3523 5815 2378 4765"
                        />
                        <input
                          className="w-full border border-gray-200 p-4 text-xs bg-[#fbfbfb] focus:outline-black"
                          placeholder="Card Holder Name"
                          defaultValue="Brooklyn Simmons"
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <input
                            className="border border-gray-200 p-4 text-xs bg-[#fbfbfb] focus:outline-black"
                            placeholder="MM/YY"
                            defaultValue="08/26"
                          />
                          <input
                            className="border border-gray-200 p-4 text-xs bg-[#fbfbfb] focus:outline-black"
                            placeholder="CVV"
                            defaultValue="***"
                          />
                        </div>
                        <p className="text-right text-[10px] font-bold underline cursor-pointer">
                          + ADD NEW CARD
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Wallets Section */}
                  <div className="border-b border-gray-50">
                    <button
                      onClick={() =>
                        setOpenSection(openSection === "wallet" ? "" : "wallet")
                      }
                      className="w-full flex justify-between items-center p-5 text-sm font-bold uppercase tracking-tighter"
                    >
                      <span className="flex items-center gap-3">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 32 32"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M24.054 18.0668C23.494 18.6135 23.174 19.4002 23.254 20.2402C23.374 21.6802 24.694 22.7335 26.134 22.7335H28.6673V24.3202C28.6673 27.0802 26.414 29.3335 23.654 29.3335H8.34732C5.58732 29.3335 3.33398 27.0802 3.33398 24.3202V15.3468C3.33398 12.5868 5.58732 10.3335 8.34732 10.3335H23.654C26.414 10.3335 28.6673 12.5868 28.6673 15.3468V17.2668H25.974C25.2273 17.2668 24.5473 17.5601 24.054 18.0668Z"
                            stroke="#292D32"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M3.33398 16.5467V10.4535C3.33398 8.86681 4.30732 7.45341 5.78732 6.89341L16.374 2.89341C18.0273 2.26675 19.8007 3.49345 19.8007 5.26679V10.3334"
                            stroke="#292D32"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M30.0791 18.627V21.3738C30.0791 22.1071 29.4924 22.7071 28.7457 22.7337H26.1324C24.6924 22.7337 23.3724 21.6804 23.2524 20.2404C23.1724 19.4004 23.4924 18.6137 24.0524 18.0671C24.5457 17.5604 25.2257 17.2671 25.9724 17.2671H28.7457C29.4924 17.2938 30.0791 17.8937 30.0791 18.627Z"
                            stroke="#292D32"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M9.33398 16H18.6673"
                            stroke="#292D32"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                        Wallets
                      </span>
                      {openSection === "wallet" ? (
                        <AiOutlineUp />
                      ) : (
                        <AiOutlineDown />
                      )}
                    </button>
                    {openSection === "wallet" && (
                      <div className="p-6 pt-0 space-y-3">
                        {["Paytm", "PhonePe", "Google Pay", "Amazon Pay"].map(
                          (w) => (
                            <div
                              key={w}
                              onClick={() => setSelectedWallet(w)}
                              className={`flex justify-between items-center p-4 border rounded-md cursor-pointer transition-all ${selectedWallet === w ? "border-black bg-gray-50" : "border-gray-100"}`}
                            >
                              <span className="text-xs font-bold">{w}</span>
                              <div
                                className={`w-4 h-4 rounded-full border-2 ${selectedWallet === w ? "bg-black border-black" : "border-gray-300"}`}
                              ></div>
                            </div>
                          ),
                        )}
                      </div>
                    )}
                  </div>

                  {/* Net Banking Section */}
                  <div className="border-b border-gray-50">
                    <button
                      onClick={() =>
                        setOpenSection(openSection === "net" ? "" : "net")
                      }
                      className="w-full flex justify-between items-center p-5 text-sm font-bold uppercase tracking-tighter"
                    >
                      <span className="flex items-center gap-3">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 32 32"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M16.4927 2.86662L28.4927 7.66659C28.9593 7.85326 29.3327 8.41325 29.3327 8.90658V13.3333C29.3327 14.0666 28.7327 14.6666 27.9993 14.6666H3.99935C3.26602 14.6666 2.66602 14.0666 2.66602 13.3333V8.90658C2.66602 8.41325 3.03936 7.85326 3.50602 7.66659L15.506 2.86662C15.7727 2.75995 16.226 2.75995 16.4927 2.86662Z"
                            stroke="#292D32"
                            stroke-width="1.5"
                            stroke-miterlimit="10"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M29.3327 29.3333H2.66602V25.3333C2.66602 24.6 3.26602 24 3.99935 24H27.9993C28.7327 24 29.3327 24.6 29.3327 25.3333V29.3333Z"
                            stroke="#292D32"
                            stroke-width="1.5"
                            stroke-miterlimit="10"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M5.33398 23.9998V14.6665"
                            stroke="#292D32"
                            stroke-width="1.5"
                            stroke-miterlimit="10"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M10.666 23.9998V14.6665"
                            stroke="#292D32"
                            stroke-width="1.5"
                            stroke-miterlimit="10"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M16 23.9998V14.6665"
                            stroke="#292D32"
                            stroke-width="1.5"
                            stroke-miterlimit="10"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M21.334 23.9998V14.6665"
                            stroke="#292D32"
                            stroke-width="1.5"
                            stroke-miterlimit="10"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M26.666 23.9998V14.6665"
                            stroke="#292D32"
                            stroke-width="1.5"
                            stroke-miterlimit="10"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M1.33398 29.3335H30.6673"
                            stroke="#292D32"
                            stroke-width="1.5"
                            stroke-miterlimit="10"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M16 11.3335C17.1046 11.3335 18 10.4381 18 9.3335C18 8.22893 17.1046 7.3335 16 7.3335C14.8954 7.3335 14 8.22893 14 9.3335C14 10.4381 14.8954 11.3335 16 11.3335Z"
                            stroke="#292D32"
                            stroke-width="1.5"
                            stroke-miterlimit="10"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                        Net Banking
                      </span>
                      {openSection === "net" ? (
                        <AiOutlineUp />
                      ) : (
                        <AiOutlineDown />
                      )}
                    </button>
                    {openSection === "net" && (
                      <div className="p-6 pt-0 grid grid-cols-2 gap-3">
                        {["HDFC Bank", "SBI", "ICICI Bank", "Axis Bank"].map(
                          (bank) => (
                            <div
                              key={bank}
                              className="p-3 border border-gray-100 rounded text-[11px] font-bold hover:border-black cursor-pointer text-center"
                            >
                              {bank}
                            </div>
                          ),
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Maurish TouchPoints (Optional Choice) */}
                <div className="p-5 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50 flex justify-between items-center">
                  <div className="flex gap-4 items-center">
                    <div className="text-2xl">
                      <svg
                        width="30"
                        height="30"
                        viewBox="0 0 42 42"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M23.2183 0C25.6846 0 28.1268 0.491074 30.4054 1.44518C32.684 2.39929 34.7544 3.79776 36.4984 5.56072C38.2424 7.32369 39.6258 9.41663 40.5696 11.7201C41.5134 14.0235 41.9992 16.4923 41.9992 18.9855C41.9992 28.0383 35.8034 35.9707 27.343 37.5117C24.4984 38.0299 23.9534 40.1463 21.0142 39.8023C16.9754 39.3299 19.7776 34.9082 16.6663 33.942C15.0597 33.4431 13.3644 35.6697 11.956 35.7733C8.75342 36.0088 4.37106 33.0424 8.33276 27.349C9.80924 25.2268 6.46459 23.7815 4.70948 23.6863C3.21161 23.6049 2.66486 22.3915 2.53551 21.1223C2.42681 19.5986 4.43302 17.1889 4.77252 15.3949C5.5992 11.0622 7.89251 7.15571 11.2586 4.3464C14.6246 1.53709 18.8533 0.000307169 23.2183 0Z"
                          fill="black"
                        />
                        <path
                          d="M23.1719 10.6758C28.4556 10.7061 33.9442 10.7666 34.5488 10.7666C35.2557 10.7667 36.2868 10.8931 37.0645 11.7734C37.8155 12.6237 38.1275 13.9525 38.0273 15.832V15.8359C37.8995 18.0992 37.5579 20.3454 37.0068 22.543L36.999 22.5723L36.9902 22.6016L36.9893 22.6025V22.6045C36.9889 22.6056 36.9887 22.607 36.9883 22.6084C36.9873 22.6113 36.9858 22.6149 36.9844 22.6191C36.9815 22.628 36.9775 22.6401 36.9727 22.6543C36.963 22.6826 36.949 22.721 36.9316 22.7686C36.8967 22.8639 36.8461 22.9963 36.7783 23.1533C36.6438 23.4649 36.4372 23.8884 36.1523 24.3213C35.6143 25.1391 34.6244 26.2439 33.1016 26.3076C32.0499 26.3516 30.8648 26.3516 29.9502 26.3408C29.4913 26.3354 29.0971 26.3271 28.8174 26.3203C28.6775 26.3169 28.5659 26.3137 28.4893 26.3115C28.4511 26.3104 28.4216 26.3092 28.4014 26.3086H28.3721L28.3701 26.3076L25.833 26.2246L27.7441 24.5557C28.7159 23.707 29.2114 22.5574 29.6025 21.0752C30.0268 18.9038 30.316 16.9507 30.5176 14.7725H29.1865C29.4507 15.3979 29.5381 16.2129 29.3926 17.2412L29.3877 17.2725L29.3818 17.3037C28.8913 19.6837 28.4725 21.7143 27.8848 23.2012C27.2915 24.7018 26.4138 25.9329 24.8438 26.2842L24.7412 26.3076L24.6357 26.3086C23.5117 26.3202 22.4756 26.3203 21.7207 26.3174C21.3431 26.3159 21.0356 26.3133 20.8223 26.3115C20.7158 26.3106 20.6328 26.3102 20.5762 26.3096C20.5479 26.3093 20.5254 26.3088 20.5107 26.3086H20.4883L17.9365 26.2773L19.8301 24.5664C19.8312 24.5654 19.8331 24.5642 19.835 24.5625C19.842 24.5559 19.8542 24.5438 19.8711 24.5273C19.9051 24.4942 19.9579 24.4418 20.0244 24.3711C20.1583 24.2288 20.3464 24.0153 20.5518 23.7422C20.9667 23.1901 21.429 22.425 21.6777 21.5303C21.9527 20.5408 22.2356 18.9819 22.4316 17.5498C22.529 16.8388 22.6026 16.1751 22.6426 15.6465C22.6626 15.3819 22.6737 15.1599 22.6758 14.9873C22.6768 14.9011 22.6754 14.8328 22.6729 14.7822C22.6727 14.7799 22.672 14.7776 22.6719 14.7754C22.6592 14.7742 22.6482 14.7725 22.6406 14.7725H21.0674C21.296 15.4012 21.3501 16.2181 21.1914 17.2529C20.9621 18.7483 20.6364 20.803 19.9951 22.5391C19.3833 24.1953 18.3144 26.0223 16.3291 26.2988L16.2695 26.3076L16.2109 26.3086C13.4005 26.3634 12.2824 26.3086 10.7334 26.3086C10.617 26.3086 10.4868 26.3046 10.3633 26.2871C10.3017 26.2784 10.2129 26.2621 10.1162 26.2295C10.0335 26.2016 9.8534 26.132 9.68848 25.9658C9.48396 25.7595 9.35221 25.4501 9.39746 25.1055C9.4341 24.8271 9.57222 24.641 9.63574 24.5645C9.7638 24.4102 9.91807 24.3128 9.97754 24.2754C10.1303 24.1792 10.3356 24.077 10.5146 23.9893C10.7146 23.8913 10.9288 23.7884 11.165 23.668C11.6383 23.4268 12.1328 23.1479 12.5381 22.8311C12.957 22.5034 13.1804 22.212 13.2588 21.9795C13.558 21.0913 13.7981 19.4425 13.9629 17.9248C14.0432 17.185 14.1031 16.506 14.1426 16.0117C14.1623 15.765 14.1768 15.5648 14.1865 15.4268C14.1914 15.358 14.1949 15.3045 14.1973 15.2686C14.1985 15.2506 14.1996 15.2365 14.2002 15.2275V15.2148L14.2051 15.1465L14.2188 15.0801C14.3184 14.5863 14.2366 14.0728 13.9902 13.6367C13.7438 13.2008 13.3502 12.8724 12.8857 12.7109C12.8491 12.6982 12.7585 12.6655 12.6582 12.6006C12.6043 12.5657 12.2751 12.3538 12.208 11.9023C12.127 11.3563 12.4879 11.0348 12.5957 10.9531C12.7219 10.8575 12.8418 10.8154 12.8809 10.8018C13.0298 10.7498 13.1872 10.7353 13.2256 10.7314C13.3769 10.7162 13.5954 10.7065 13.8486 10.6982C14.3678 10.6812 15.1398 10.6707 16.0771 10.665C17.9562 10.6537 20.5367 10.6607 23.1719 10.6758Z"
                          fill="black"
                          stroke="white"
                          stroke-width="2"
                        />
                        <path
                          d="M2.17397 29.9129C3.37462 29.9129 4.34794 28.929 4.34794 27.7152C4.34794 26.5015 3.37462 25.5176 2.17397 25.5176C0.973319 25.5176 0 26.5015 0 27.7152C0 28.929 0.973319 29.9129 2.17397 29.9129Z"
                          fill="black"
                        />
                        <path
                          d="M14.4923 41.9998C15.693 41.9998 16.6663 41.0159 16.6663 39.8021C16.6663 38.5884 15.693 37.6045 14.4923 37.6045C13.2917 37.6045 12.3184 38.5884 12.3184 39.8021C12.3184 41.0159 13.2917 41.9998 14.4923 41.9998Z"
                          fill="black"
                        />
                        <path
                          d="M6.78679 40.4771C7.68407 40.4771 8.41147 39.7418 8.41147 38.8348C8.41147 37.9277 7.68407 37.1924 6.78679 37.1924C5.8895 37.1924 5.16211 37.9277 5.16211 38.8348C5.16211 39.7418 5.8895 40.4771 6.78679 40.4771Z"
                          fill="black"
                        />
                        <path
                          d="M2.17403 36.2199C2.84939 36.2199 3.39689 35.6665 3.39689 34.9837C3.39689 34.301 2.84939 33.7476 2.17403 33.7476C1.49866 33.7476 0.951172 34.301 0.951172 34.9837C0.951172 35.6665 1.49866 36.2199 2.17403 36.2199Z"
                          fill="black"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest">
                        Maurish TouchPoints
                      </p>
                      <p className="text-[10px] text-gray-400">
                        Balance: 600 Points Available
                      </p>
                    </div>
                  </div>
                  <input type="checkbox" className="w-5 h-5 accent-black" />
                </div>

                <div className="flex items-center gap-3 mt-4">
                  <input
                    type="checkbox"
                    id="t-c"
                    className="w-4 h-4 accent-black"
                    defaultChecked
                  />
                  <label
                    htmlFor="t-c"
                    className="text-[11px] font-medium text-gray-500"
                  >
                    I agree to the{" "}
                    <span className="underline text-black font-bold">
                      Terms & Conditions
                    </span>{" "}
                    and Privacy Policy.
                  </label>
                </div>

                <button
                  onClick={() => setStep("address")}
                  className="text-xs font-bold text-gray-400 flex items-center gap-2 uppercase tracking-widest pt-4"
                >
                  <AiOutlineLeft /> Back to Address
                </button>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: SIDEBAR (4 Units) */}
          <div className="lg:col-span-4">
            <div className="bg-white border border-gray-100 rounded-sm p-8 shadow-sm sticky top-24">
              <div className="flex justify-between items-center mb-6">
                <span className="text-[18px] font-bold uppercase tracking-tighter">
                  Subtotal
                </span>
                <span className="text-[18px] font-bold tracking-tighter">
                  ₹{subtotal}
                </span>
              </div>

              {/* Coupon Box (Exact as Blue Box in image) */}
              <div className="bg-[#f9f9f9] border border-dashed border-gray-200 rounded-sm p-5 mb-6">
                <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                  <span className="flex items-center gap-1">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 32 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5.31853 19.5472L3.29188 17.5205C2.46521 16.6938 2.46521 15.3338 3.29188 14.5071L5.31853 12.4804C5.66519 12.1338 5.9452 11.4538 5.9452 10.9738V8.10706C5.9452 6.93373 6.9052 5.97376 8.07854 5.97376H10.9452C11.4252 5.97376 12.1052 5.6938 12.4519 5.34713L14.4785 3.32044C15.3052 2.49377 16.6652 2.49377 17.4919 3.32044L19.5186 5.34713C19.8652 5.6938 20.5452 5.97376 21.0252 5.97376H23.8919C25.0652 5.97376 26.0252 6.93373 26.0252 8.10706V10.9738C26.0252 11.4538 26.3052 12.1338 26.6519 12.4804L28.6786 14.5071C29.5052 15.3338 29.5052 16.6938 28.6786 17.5205L26.6519 19.5472C26.3052 19.8938 26.0252 20.5738 26.0252 21.0538V23.9204C26.0252 25.0937 25.0652 26.0538 23.8919 26.0538H21.0252C20.5452 26.0538 19.8652 26.3338 19.5186 26.6805L17.4919 28.7072C16.6652 29.5338 15.3052 29.5338 14.4785 28.7072L12.4519 26.6805C12.1052 26.3338 11.4252 26.0538 10.9452 26.0538H8.07854C6.9052 26.0538 5.9452 25.0937 5.9452 23.9204V21.0538C5.9452 20.5605 5.66519 19.8805 5.31853 19.5472Z"
                        stroke="#292D32"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M12 20L20 12"
                        stroke="#292D32"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M19.3254 19.3334H19.3373"
                        stroke="#292D32"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M12.6593 12.6667H12.6713"
                        stroke="#292D32"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    Coupon Code
                  </span>
                  <span className="text-black cursor-pointer border-b border-black">
                    View Offers
                  </span>
                </div>
                <div className="flex gap-2">
                  <input
                    className="flex-1 bg-transparent border-none text-[11px] focus:ring-0 p-0 font-medium"
                    placeholder="Have a code? type it here..."
                  />
                  <button className="text-green-600 text-[11px] font-bold uppercase tracking-tighter">
                    Validate
                  </button>
                </div>
              </div>

              <div className="flex justify-between text-[13px] text-gray-500 mb-8 font-medium">
                <span>Delivery Charge</span>
                <span className="text-black font-bold uppercase text-[11px]">
                  Free
                </span>
              </div>

              <div className="flex justify-between items-center border-t border-gray-100 pt-6 mb-10">
                <span className="text-[22px] font-black uppercase tracking-tighter">
                  Grand Total
                </span>
                <span className="text-[22px] font-black tracking-tighter">
                  ₹{subtotal}
                </span>
              </div>

              {step === "payment" && (
                <button
                  onClick={() => setOrderPlaced(true)}
                  className="w-full bg-black text-white py-5 font-bold text-xs uppercase tracking-[4px] rounded-sm mb-8 hover:bg-gray-900 transition-colors shadow-2xl shadow-black/20"
                >
                  Place My Order
                </button>
              )}

              {/* Secure Badges */}
              <div className="text-center">
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[3px] mb-6 flex items-center justify-center gap-2">
                  <AiOutlineInfoCircle /> 100% Secured Payment
                </p>
                <div className="flex justify-center gap-4 opacity-80 scale-90">
                  <img
                    src="https://img.icons8.com/color/48/visa.png"
                    className="h-6"
                    alt="visa"
                  />
                  <img
                    src="https://img.icons8.com/color/48/mastercard.png"
                    className="h-6"
                    alt="mastercard"
                  />
                  <img
                    src="https://img.icons8.com/color/48/paypal.png"
                    className="h-6"
                    alt="paypal"
                  />
                  <img
                    src="https://img.icons8.com/color/48/google-pay.png"
                    className="h-6"
                    alt="gpay"
                  />
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
