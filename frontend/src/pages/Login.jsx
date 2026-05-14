import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authUser from "../hooks/authService"; // Aapka custom hook

const Login = () => {
  const navigate = useNavigate();
  const { loginUser, loading } = authUser();

  // 1. States for Form and Errors
  const [formData, setFormData] = useState({
    identifier: "", // Email ya Phone ke liye ek hi input
    countryCode: "+91",
    password: "",
  });
  const [error, setError] = useState("");

  // 2. Handle Inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id || e.target.name]: e.target.value });
    if (error) setError(""); // Typing shuru karte hi error hata do
  };

  // 3. Validation Logic
  const validateForm = () => {
    if (!formData.identifier || !formData.password) {
      setError("Please enter your credentials.");
      return false;
    }
    return true;
  };

  // 4. Submit Logic
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      // Backend ko pata nahi identifier kya hai, toh hum check karte hain
      const isEmail = formData.identifier.includes("@");
      
      const loginPayload = {
        password: formData.password,
        [isEmail ? "email" : "phoneNo"]: isEmail 
          ? formData.identifier 
          : `${formData.countryCode}${formData.identifier}`,
      };

      const response = await loginUser(loginPayload);

      if (response.success) {
        // Redirect to /profile/order
        navigate("/profile/orders");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid Email/Phone or Password");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-black font-sans">
      <Link to={'/'} className="w-full h-16 flex items-center justify-center py-2 bg-white shadow-md z-10">
        <img src="/images/logo.png" alt="Logo" className="h-10 object-contain" />
      </Link>

      <main className="flex-1 w-full max-w-7xl mx-auto flex items-center justify-center lg:justify-evenly p-5 md:p-10 lg:p-20 gap-10">
        
        <form onSubmit={handleLogin} className="w-full sm:w-[80%] md:w-[60%] lg:w-[40%] flex flex-col gap-4 p-2 md:p-5">
          <h1 className="text-xl font-bold italic tracking-tight">Login / Welcome Back</h1>
          <p className="text-sm text-gray-500">Enter your details to access your account</p>

          {/* Error Message */}
          {error && (
            <p className="text-red-500 text-sm font-medium bg-red-50 p-2 border-l-4 border-red-500">
              {error}
            </p>
          )}
          
          <div className="flex flex-col gap-4">
            {/* Email or Phone Input */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium" htmlFor="identifier">Email or Mobile Number</label>
              <div className={`w-full py-3 px-3 flex items-center border transition-colors ${error ? 'border-red-500' : 'border-gray-400 focus-within:border-black'}`}>
                
                {/* Agar input mein @ nahi hai toh Country code dikhao */}
                {!formData.identifier.includes("@") && (
                  <select 
                    className="bg-transparent outline-none border-r border-gray-300 pr-2 mr-3 text-sm" 
                    name="countryCode"
                    value={formData.countryCode}
                    onChange={handleChange}
                  >
                    <option value="+91">+91</option>
                    <option value="+92">+92</option>
                    <option value="+1">+1</option>
                  </select>
                )}

                <input
                  id="identifier"
                  className="w-full bg-transparent outline-none text-sm"
                  placeholder="email@example.com or 123456789"
                  type="text"
                  value={formData.identifier}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium" htmlFor="password">Password</label>
              <div className={`w-full py-3 px-3 border transition-colors ${error ? 'border-red-500' : 'border-gray-400 focus-within:border-black'}`}>
                <input
                  id="password"
                  className="w-full bg-transparent outline-none text-sm"
                  placeholder="Enter Password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Login Button with Loading UI */}
          <button 
            type="submit"
            disabled={loading}
            className={`w-full text-white flex items-center justify-center py-3 mt-2 transition-all font-medium uppercase tracking-widest text-xs ${loading ? 'bg-gray-400 cursor-wait' : 'bg-black hover:bg-gray-800'}`}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </div>
            ) : "Continue"}
          </button>

          <p className="text-center text-sm mt-2">
            Don't have an account? <Link to="/register" className="font-bold underline">Signup</Link>
          </p>

          <div className="w-full mt-4 flex items-center justify-between gap-3 text-gray-400 text-sm">
            <hr className="flex-1 border-gray-300" /> Or <hr className="flex-1 border-gray-300" />
          </div>

          {/* Social Buttons (Disabled while loading) */}
          <div className="space-y-3 mt-4 opacity-70">
            <button type="button" disabled={loading} className="w-full flex bg-[#F3F9FA] py-3 items-center justify-center gap-3 hover:bg-gray-100 transition-all text-sm font-medium">
                {/* Google SVG from your code */}
                Sign in With Google
            </button>
          </div>

          <p className="w-full text-center text-[10px] text-gray-400 mt-8 tracking-widest uppercase">
            © 2026 ALL RIGHTS RESERVED
          </p>
        </form>

        <div className="hidden lg:block w-[38%] h-[600px]">
          <img className="w-full h-full object-cover object-top rounded-sm shadow-sm" src="/images/loginImg.jpg" alt="Login Visual" />
        </div>

      </main>
    </div>
  );
};

export default Login;