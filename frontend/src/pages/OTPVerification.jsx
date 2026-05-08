import React from "react";
import { Link } from "react-router-dom";

const OTPVerification = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white text-black font-sans">
      {/* Header / Logo (Same as Login/Register) */}
      <Link to={'/'} className="w-full h-16 flex items-center justify-center py-2 bg-white shadow-md z-10">
        <img src="/images/logo.png" alt="Logo" className="h-10 object-contain" />
      </Link>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto flex items-center justify-center lg:justify-evenly p-5 md:p-10 lg:p-20 gap-10">
        
        {/* Left Side: OTP Form */}
        <div className="w-full sm:w-[80%] md:w-[60%] lg:w-[40%] flex flex-col gap-5 p-2 md:p-5">
          <div>
            <h1 className="text-lg font-semibold">Verification Code</h1>
            <p className="text-sm text-gray-600 mt-1">
              Please enter the verification code we sent to your email address
            </p>
          </div>

          {/* OTP Inputs Grid */}
          <div className="w-full flex items-center justify-between gap-2 py-4">
            {[1, 2, 3, 4].map((index) => (
              <input
                key={index}
                className="w-12 h-12 md:w-14 md:h-14 text-center text-lg outline-none rounded-full bg-[#D4D7E3] border border-gray-200 focus:border-black transition-all"
                type="text"
                maxLength="1"
              />
            ))}
          </div>

          {/* Action Button */}
          <button className="w-full text-white flex items-center justify-center bg-black py-3 hover:bg-gray-800 transition-all font-medium uppercase text-xs tracking-widest">
            Continue
          </button>

          {/* Timer Section */}
          <div className="w-full mt-2 text-gray-400 flex items-center justify-between text-sm">
             <span className="text-[#A0A5BA]">Resend IN 00:10</span>
             <button className="text-black font-bold underline text-xs">Resend OTP</button>
          </div>

          <p className="w-full text-center text-[10px] text-gray-400 mt-12 tracking-widest uppercase">
            © 2025 ALL RIGHTS RESERVED
          </p>
        </div>

        {/* Right Side: Image (Visible only on Desktop) */}
        <div className="hidden lg:block w-[38%] h-[600px]">
          <img 
            className="w-full h-full object-cover object-top rounded-sm shadow-sm" 
            src="/images/loginImg.jpg" 
            alt="Verification Visual" 
          />
        </div>

      </main>
    </div>
  );
};

export default OTPVerification;