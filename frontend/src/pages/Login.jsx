import React from "react";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white text-black font-sans">
      {/* Header / Logo */}
      <Link to={'/'} className="w-full h-16 flex items-center justify-center py-2 bg-white shadow-md z-10">
        <img src="/images/logo.png" alt="Logo" className="h-10 object-contain" />
      </Link>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto flex items-center justify-center lg:justify-evenly p-5 md:p-10 lg:p-20 gap-10">
        
        {/* Left Side: Form */}
        <div className="w-full sm:w-[80%] md:w-[60%] lg:w-[40%] flex flex-col gap-4 p-2 md:p-5">
          <h1 className="text-lg font-semibold">Login / Signup</h1>
          <p className="text-sm md:text-base">Join us now to be a part of Maurish family</p>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium" htmlFor="mobile">Mobile Number</label>
            <div className="w-full py-3 px-3 flex items-center border border-gray-400 focus-within:border-black transition-colors">
              <select className="bg-transparent outline-none border-r border-gray-300 pr-2 mr-3 text-sm" name="countryCode">
                <option value="+91">+91</option>
                <option value="+92">+92</option>
                <option value="+241">+241</option>
                <option value="+221">+221</option>
              </select>
              <input
                id="mobile"
                className="w-full bg-transparent outline-none text-sm"
                placeholder="Enter Mobile Number"
                type="text"
              />
            </div>
          </div>

          <button className="w-full text-white flex items-center justify-center bg-black py-3 mt-2 hover:bg-gray-800 transition-all font-medium">
            Continue
          </button>

          {/* New Signup Line */}
          <p className="text-center text-sm mt-2">
            Don't have an account? <Link to="/register" className="font-bold underline">Signup</Link>
          </p>

          <div className="w-full mt-4 flex items-center justify-between gap-3 text-gray-400 text-sm">
            <hr className="flex-1 border-gray-300" /> Or <hr className="flex-1 border-gray-300" />
          </div>

          {/* Social Buttons */}
          <div className="space-y-3 mt-4">
            <button className="w-full flex bg-[#F3F9FA] py-3 items-center justify-center gap-3 hover:bg-gray-100 transition-all text-sm font-medium">
              <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
                <g clipPath="url(#clip0_8117_17763)">
                  <path d="M27.7273 14.3225C27.7273 13.3709 27.6501 12.414 27.4855 11.4778H14.2803V16.8689H21.8423C21.5285 18.6077 20.5202 20.1458 19.0438 21.1232V24.6213H23.5553C26.2046 22.1829 27.7273 18.582 27.7273 14.3225Z" fill="#4285F4"/>
                  <path d="M14.2803 28.0009C18.0561 28.0009 21.2404 26.7611 23.5605 24.6211L19.049 21.1231C17.7938 21.977 16.1734 22.4606 14.2854 22.4606C10.633 22.4606 7.5362 19.9965 6.42505 16.6836H1.76953V20.2897C4.14616 25.0172 8.98688 28.0009 14.2803 28.0009Z" fill="#34A853"/>
                  <path d="M6.4199 16.6837C5.83346 14.9449 5.83346 13.0621 6.4199 11.3234V7.71729H1.76953C-0.216144 11.6732 -0.216144 16.3339 1.76953 20.2898L6.4199 16.6837Z" fill="#FBBC04"/>
                  <path d="M14.2803 5.54127C16.2762 5.51041 18.2053 6.26146 19.6508 7.64012L23.6479 3.64305C21.1169 1.26642 17.7578 -0.0402103 14.2803 0.000943444C8.98687 0.000943444 4.14616 2.98459 1.76953 7.71728L6.41991 11.3234C7.52591 8.00536 10.6279 5.54127 14.2803 5.54127Z" fill="#EA4335"/>
                </g>
                <defs><clipPath id="clip0_8117_17763"><rect width="28" height="28" fill="white"/></clipPath></defs>
              </svg>
              Sign in With Google
            </button>

            <button className="w-full flex bg-[#F3F9FA] py-3 items-center justify-center gap-3 hover:bg-gray-100 transition-all text-sm font-medium">
              <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
                <g clipPath="url(#clip0_8117_17778)">
                  <path d="M28 14C28 6.26801 21.732 0 14 0C6.26801 0 0 6.26801 0 14C0 20.9877 5.11957 26.7796 11.8125 27.8299V18.0469H8.25781V14H11.8125V10.9156C11.8125 7.40687 13.9027 5.46875 17.1005 5.46875C18.6318 5.46875 20.2344 5.74219 20.2344 5.74219V9.1875H18.4691C16.73 9.1875 16.1875 10.2668 16.1875 11.375V14H20.0703L19.4496 18.0469H16.1875V27.8299C22.8804 26.7796 28 20.9877 28 14Z" fill="#1877F2"/>
                  <path d="M19.4496 18.0469L20.0703 14H16.1875V11.375C16.1875 10.2679 16.73 9.1875 18.4691 9.1875H20.2344V5.74219C20.2344 5.74219 18.6323 5.46875 17.1005 5.46875C13.9027 5.46875 11.8125 7.40688 11.8125 10.9156V14H8.25781V18.0469H11.8125V27.8299C13.262 28.0567 14.738 28.0567 16.1875 27.8299V18.0469H19.4496Z" fill="white"/>
                </g>
                <defs><clipPath id="clip0_8117_17778"><rect width="28" height="28" fill="white"/></clipPath></defs>
              </svg>
              Sign In with Facebook
            </button>
          </div>

          <p className="w-full text-center text-[10px] text-gray-400 mt-8 tracking-widest uppercase">
            © 2025 ALL RIGHTS RESERVED
          </p>
        </div>

        {/* Right Side: Image (Hidden on mobile/tablet) */}
        <div className="hidden lg:block w-[38%] h-[600px]">
          <img className="w-full h-full object-cover object-top rounded-sm shadow-sm" src="/images/loginImg.jpg" alt="Login Visual" />
        </div>

      </main>
    </div>
  );
};

export default Login;