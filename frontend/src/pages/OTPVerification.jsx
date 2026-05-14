import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import authUser from "../hooks/authService";

const OTPVerification = () => {
  const navigate = useNavigate();
  const { verifyOTP, loading } = authUser(); // loading state hook se aa rahi hai
  
  const [otp, setOtp] = useState(["", "", "", "", "", ""]); 
  const [timer, setTimer] = useState(30);
  const [error, setError] = useState(""); // Error state handle karne ke liye

  const inputRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (index, value) => {
    const char = value.slice(-1);
    if (isNaN(char)) return; 

    const newOtp = [...otp];
    newOtp[index] = char;
    setOtp(newOtp);

    // Error saaf kar dein jab user dobara type shuru kare
    if (error) setError("");

    if (char !== "" && index < 5) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handleContinue = async (e) => {
    e.preventDefault();
    const finalOtp = otp.join("");
    
    if (finalOtp.length < 6) {
      setError("Pura 6-digit code likhein.");
      return;
    }

    try {
      setError(""); // Purana error clear karein
      const response = await verifyOTP(finalOtp); 
      
      if (response.success) {
        navigate("/login");
      }
    } catch (err) {
      // Backend se jo error message aayega wo yahan set hoga
      setError(err.response?.data?.message || "Ghalat OTP! Dobara koshish karein.");
      
      // Ghalat OTP par boxes laal karne ke liye otp clear kar sakte hain (Optional)
      // setOtp(["", "", "", "", "", ""]);
      // inputRefs[0].current.focus();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-black font-sans">
      <Link to={'/'} className="w-full h-16 flex items-center justify-center py-2 bg-white shadow-md z-10">
        <img src="/images/logo.png" alt="Logo" className="h-10 object-contain" />
      </Link>

      <main className="flex-1 w-full max-w-7xl mx-auto flex items-center justify-center lg:justify-evenly p-5 md:p-10 lg:p-20 gap-10">
        
        <div className="w-full sm:w-[85%] md:w-[65%] lg:w-[45%] flex flex-col gap-5 p-2 md:p-5">
          <div>
            <h1 className="text-xl font-bold">Verification Code</h1>
            <p className="text-sm text-gray-600 mt-1">
              Enter the 6-digit code sent to your email.
            </p>
          </div>

          {/* ERROR MESSAGE DISPLAY */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* OTP INPUTS */}
          <div className="w-full flex items-center justify-between gap-1.5 py-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={inputRefs[index]}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                disabled={loading} // Loading ke waqt disable
                className={`w-10 h-12 md:w-12 md:h-14 text-center text-xl font-bold outline-none rounded-lg border-2 transition-all ${
                  error ? "border-red-300 bg-red-50" : "border-transparent bg-[#F0F2F5]"
                } ${loading ? "opacity-50 cursor-not-allowed" : "focus:border-black focus:bg-white"}`}
                type="text"
                maxLength="1"
              />
            ))}
          </div>

          {/* SUBMIT BUTTON WITH LOADING */}
          <button 
            onClick={handleContinue}
            disabled={loading}
            className={`w-full text-white flex items-center justify-center py-3.5 rounded-lg font-bold uppercase text-xs tracking-widest transition-all ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-800 shadow-lg"
            }`}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying...
              </div>
            ) : (
              "Verify & Continue"
            )}
          </button>

          <div className="w-full mt-2 text-gray-400 flex items-center justify-between text-sm px-1">
             <span className="text-gray-500">
               {timer > 0 ? `Resend in 00:${timer < 10 ? `0${timer}` : timer}` : "Didn't get code?"}
             </span>
             <button 
                onClick={() => { if(timer === 0) setTimer(30); }}
                disabled={timer > 0 || loading}
                className={`font-bold underline ${timer > 0 || loading ? "text-gray-300 cursor-not-allowed" : "text-black hover:text-blue-600"}`}
             >
               Resend OTP
             </button>
          </div>

          <p className="w-full text-center text-[10px] text-gray-400 mt-12 tracking-widest uppercase text-opacity-50">
            © 2026 ALL RIGHTS RESERVED
          </p>
        </div>

        <div className="hidden lg:block w-[38%] h-[600px]">
          <img 
            className="w-full h-full object-cover object-top rounded-lg shadow-lg grayscale-[20%]" 
            src="/images/loginImg.jpg" 
            alt="Verification Visual" 
          />
        </div>
      </main>
    </div>
  );
};

export default OTPVerification;