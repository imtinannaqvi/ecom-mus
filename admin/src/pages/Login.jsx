import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { adminLogin } from '../api';
import { FiLock, FiMail, FiEye, FiEyeOff } from 'react-icons/fi';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const { setAdmin, setIsAuthenticated } = useAdmin();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await adminLogin(email, password);
      if (data.success) {
        setAdmin(data.user);
        setIsAuthenticated(true);
        navigate("/admin/dashboard");
      }
    } catch (err) {
      alert(err.message || "Invalid Credentials");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md bg-white rounded-[2rem] p-10 shadow-2xl relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black italic tracking-tighter text-black mb-2">MAURISH</h1>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em]">Admin Portal Access</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Email Address</label>
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="email" 
                required
                className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-black transition-all outline-none font-medium"
                placeholder="admin@maurish.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Password</label>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type={showPassword ? "text" : "password"} 
                required
                className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-12 focus:ring-2 focus:ring-black transition-all outline-none font-medium"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-sm hover:bg-neutral-800 transition-all active:scale-[0.98] shadow-xl shadow-black/20"
          >
            Authenticate
          </button>
        </form>

        <p className="text-center mt-8 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
          Secure Encrypted Connection
        </p>
      </div>
    </div>
  );
};

export default Login;