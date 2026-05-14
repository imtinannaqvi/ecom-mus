import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authUser from "../hooks/authService"; // Hook import kiya

const Register = () => {
  const navigate = useNavigate();
  const { registerUser } = authUser(); // Hook se function nikala

  // 1. State for Form Fields
  const [formData, setFormData] = useState({
    name: "",
    email: "", // Email field zaroori hai backend ke liye
    countryCode: "+91",
    mobile: "",
    password: "",
  });

  const [error, setError] = useState("");

  // 2. Handle Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id || e.target.name]: e.target.value });
  };

  // 3. Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic Validation
    if (!formData.name || !formData.email || !formData.mobile || !formData.password) {
      setError("All fields are required!");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      // Combine Country Code and Mobile
      const fullPhone = `${formData.countryCode}${formData.mobile}`;
      
      const dataToSend = {
        name: formData.name,
        email: formData.email,
        phoneNo: fullPhone,
        password: formData.password
      };

      // API Call
      await registerUser(dataToSend);
      
      // Success: Redirect to Verify OTP
      navigate("/verify-otp");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-black font-sans">
      <Link to={'/'} className="w-full h-16 flex items-center justify-center py-2 bg-white shadow-md z-10">
        <img src="/images/logo.png" alt="Logo" className="h-10 object-contain" />
      </Link>

      <main className="flex-1 w-full max-w-7xl mx-auto flex items-center justify-center lg:justify-evenly p-5 md:p-10 lg:p-20 gap-10">
        
        <form onSubmit={handleSubmit} className="w-full sm:w-[80%] md:w-[60%] lg:w-[40%] flex flex-col gap-4 p-2 md:p-5">
          <h1 className="text-lg font-semibold">Signup / Create Account</h1>
          <p className="text-sm md:text-base">Join us now to be a part of Maurish family</p>
          
          {/* Error Message Display */}
          {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

          <div className="flex flex-col gap-4 mt-2">
            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700" htmlFor="name">Full Name</label>
              <div className="w-full py-3 px-4 border border-gray-400 focus-within:border-black transition-colors">
                <input
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-transparent outline-none text-sm"
                  placeholder="Enter your full name"
                  type="text"
                  required
                />
              </div>
            </div>

            {/* Email (Missing in original design but required for OTP) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700" htmlFor="email">Email Address</label>
              <div className="w-full py-3 px-4 border border-gray-400 focus-within:border-black transition-colors">
                <input
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-transparent outline-none text-sm"
                  placeholder="Enter your email"
                  type="email"
                  required
                />
              </div>
            </div>

            {/* Mobile Number */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700" htmlFor="mobile">Mobile Number</label>
              <div className="w-full py-3 px-3 flex items-center border border-gray-400 focus-within:border-black transition-colors">
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
                <input
                  id="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="w-full bg-transparent outline-none text-sm"
                  placeholder="Enter Mobile Number"
                  type="tel"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700" htmlFor="password">Password</label>
              <div className="w-full py-3 px-4 border border-gray-400 focus-within:border-black transition-colors">
                <input
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-transparent outline-none text-sm"
                  placeholder="Create a password"
                  type="password"
                  required
                />
              </div>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full text-white flex items-center justify-center bg-black py-3 mt-4 hover:bg-gray-800 transition-all font-medium uppercase text-xs tracking-widest"
          >
            Create account
          </button>

          <p className="text-center text-sm mt-2">
            Already have an account? <Link to="/login" className="font-bold underline">Login</Link>
          </p>

          {/* Rest of Social buttons... */}
          <div className="w-full mt-4 flex items-center justify-between gap-3 text-gray-400 text-sm">
            <hr className="flex-1 border-gray-300" /> Or <hr className="flex-1 border-gray-300" />
          </div>

          <div className="space-y-3 mt-4">
            <button type="button" className="w-full flex bg-[#F3F9FA] py-3 items-center justify-center gap-3 hover:bg-gray-100 transition-all text-sm font-medium">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              Signup With Google
            </button>
          </div>
        </form>

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