import React from "react";
import { Link } from "react-router-dom";

const Register = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white text-black font-sans">
      {/* Header / Logo (Same as Login) */}
      <Link to={'/'} className="w-full h-16 flex items-center justify-center py-2 bg-white shadow-md z-10">
        <img src="/images/logo.png" alt="Logo" className="h-10 object-contain" />
      </Link>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto flex items-center justify-center lg:justify-evenly p-5 md:p-10 lg:p-20 gap-10">
        
        {/* Left Side: Register Form */}
        <div className="w-full sm:w-[80%] md:w-[60%] lg:w-[40%] flex flex-col gap-4 p-2 md:p-5">
          <h1 className="text-lg font-semibold">Signup / Create Account</h1>
          <p className="text-sm md:text-base">Join us now to be a part of Maurish family</p>
          
          <div className="flex flex-col gap-4 mt-2">
            {/* Full Name Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700" htmlFor="name">Full Name</label>
              <div className="w-full py-3 px-4 border border-gray-400 focus-within:border-black transition-colors">
                <input
                  id="name"
                  className="w-full bg-transparent outline-none text-sm"
                  placeholder="Enter your full name"
                  type="text"
                />
              </div>
            </div>

            {/* Mobile Number Input (Country Code Select + Input) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700" htmlFor="mobile">Mobile Number</label>
              <div className="w-full py-3 px-3 flex items-center border border-gray-400 focus-within:border-black transition-colors">
                <select className="bg-transparent outline-none border-r border-gray-300 pr-2 mr-3 text-sm" name="countryCode">
                  <option value="+91">+91</option>
                  <option value="+92">+92</option>
                  <option value="+1">+1</option>
                </select>
                <input
                  id="mobile"
                  className="w-full bg-transparent outline-none text-sm"
                  placeholder="Enter Mobile Number"
                  type="tel"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700" htmlFor="password">Password</label>
              <div className="w-full py-3 px-4 border border-gray-400 focus-within:border-black transition-colors">
                <input
                  id="password"
                  className="w-full bg-transparent outline-none text-sm"
                  placeholder="Create a password"
                  type="password"
                />
              </div>
            </div>
          </div>

          <button className="w-full text-white flex items-center justify-center bg-black py-3 mt-4 hover:bg-gray-800 transition-all font-medium uppercase text-xs tracking-widest">
            Create account
          </button>

          {/* Login Link */}
          <p className="text-center text-sm mt-2">
            Already have an account? <Link to="/login" className="font-bold underline">Login</Link>
          </p>

          {/* Social Divider */}
          <div className="w-full mt-4 flex items-center justify-between gap-3 text-gray-400 text-sm">
            <hr className="flex-1 border-gray-300" /> Or <hr className="flex-1 border-gray-300" />
          </div>

          {/* Social Signups (Design matched to Login) */}
          <div className="space-y-3 mt-4">
            <button className="w-full flex bg-[#F3F9FA] py-3 items-center justify-center gap-3 hover:bg-gray-100 transition-all text-sm font-medium">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              Signup With Google
            </button>
            <button className="w-full flex bg-[#F3F9FA] py-3 items-center justify-center gap-3 hover:bg-gray-100 transition-all text-sm font-medium">
              <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" alt="Facebook" className="w-5 h-5" />
              Signup with Facebook
            </button>
          </div>

          <p className="w-full text-center text-[10px] text-gray-400 mt-8 tracking-widest uppercase">
            © 2025 ALL RIGHTS RESERVED
          </p>
        </div>

        {/* Right Side: Image (Visible only on Desktop) */}
        <div className="hidden lg:block w-[38%] h-[650px]">
          <img 
            className="w-full h-full object-cover object-top rounded-sm shadow-sm" 
            src="/images/loginImg.jpg" 
            alt="Register Visual" 
          />
        </div>

      </main>
    </div>
  );
};

export default Register;