import React from "react";
import { IoWalletOutline } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";

function Security() {
  return (
    <section className="w-full h-full p-4 md:p-8 flex flex-col items-center">
      {/* Container to limit width on large screens and stay full on mobile */}
      <div className="w-full max-w-2xl flex flex-col gap-10">
        
        {/* Section 1: Change Password */}
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
          <div className="w-full items-center flex justify-between cursor-pointer group">
            <span className="flex items-center gap-3 font-semibold text-gray-700">
              <IoWalletOutline className="text-xl group-hover:text-black transition-colors" /> 
              Confirm Password
            </span>
            <IoIosArrowDown className="text-gray-400 group-hover:text-black" />
          </div>
          
          <div className="w-full mt-6 space-y-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600">Create Password</label>
              <input
                type="password"
                placeholder="********"
                className="w-full mt-2 py-3 px-4 border border-gray-300 bg-gray-50 focus:bg-white focus:border-black outline-none rounded-lg transition-all"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600">Confirm Password</label>
              <input
                type="password"
                placeholder="********"
                className="w-full mt-2 py-3 px-4 border border-gray-300 bg-gray-50 focus:bg-white focus:border-black outline-none rounded-lg transition-all"
              />
            </div>
            <button className="w-full mt-2 py-3.5 bg-black text-white font-bold rounded-lg active:scale-[0.98] transition-transform shadow-md">
              Submit
            </button>
          </div>
        </div>

        {/* Section 2: Forgot Password */}
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
          <div className="w-full items-center flex justify-between cursor-pointer group">
            <span className="flex items-center gap-3 font-semibold text-gray-700">
              <IoWalletOutline className="text-xl group-hover:text-black" /> 
              Forgot Password
            </span>
            <IoIosArrowDown className="text-gray-400 group-hover:text-black" />
          </div>
          
          <div className="w-full mt-6">
            <label className="text-sm font-medium text-gray-600">Mobile Number / Email</label>
            <input
              type="text"
              placeholder="Enter Mobile Number or Email"
              className="w-full mt-2 py-3 px-4 border border-gray-300 bg-gray-50 focus:bg-white focus:border-black outline-none rounded-lg transition-all"
            />
            <button className="w-full mt-5 py-3.5 bg-black text-white font-bold rounded-lg active:scale-[0.98] transition-transform">
              Send OTP
            </button>
          </div>
        </div>

        {/* Section 3: OTP Verification */}
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
          <h1 className="text-xl font-bold text-gray-900">Verification Code</h1>
          <p className="text-sm text-gray-500 mt-2">
            Please enter the verification code we sent to your email address
          </p>

          <div className="w-full py-6 flex items-center justify-center gap-3 md:gap-5">
            {[1, 2, 3, 4].map((_, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                className="w-12 h-12 md:w-14 md:h-14 text-center text-lg font-bold outline-none rounded-full bg-gray-200 focus:bg-white focus:ring-2 focus:ring-black border border-transparent transition-all"
              />
            ))}
          </div>

          <button className="w-full py-3.5 bg-black text-white font-bold rounded-lg active:scale-[0.98] transition-transform">
            Continue
          </button>
        </div>

        {/* Section 4: Create New Password */}
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 mb-10">
           <div className="space-y-4">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-600">Create New Password</label>
                <input
                  type="password"
                  placeholder="********"
                  className="w-full mt-2 py-3 px-4 border border-gray-300 bg-gray-50 focus:bg-white focus:border-black outline-none rounded-lg transition-all"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-600">Confirm New Password</label>
                <input
                  type="password"
                  placeholder="********"
                  className="w-full mt-2 py-3 px-4 border border-gray-300 bg-gray-50 focus:bg-white focus:border-black outline-none rounded-lg transition-all"
                />
              </div>
              <button className="w-full mt-2 py-3.5 bg-black text-white font-bold rounded-lg active:scale-[0.98] transition-transform shadow-lg">
                Update
              </button>
           </div>
        </div>

      </div>
    </section>
  );
}

export default Security;