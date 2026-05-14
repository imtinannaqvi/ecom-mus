import { useContext } from "react";
import API from "../api/api";
import { AppContext } from "../context/AppContextProvider";
import { useNavigate } from "react-router-dom";

const authUser = () => {
  const { setUser, setLoading } = useContext(AppContext);
  const navigate = useNavigate();

  // 1. Register User (Saves email for OTP)
  const registerUser = async (formData) => {
    setLoading(true);
    try {
      const res = await API.post("/auth/register", formData);
      
      // 🔥 YAHAN EMAIL SAVE KAR RAHE HAIN
      localStorage.setItem("pendingEmail", formData.email);
      
      return res.data; 
    } catch (error) {
      console.log("Register Error:", error.response?.data?.message || error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 2. Verify OTP (Takes email from LocalStorage)
  const verifyOTP = async (otp) => {
    setLoading(true);
    try {
      // 🔥 YAHAN SE EMAIL UTHAYI
      const email = localStorage.getItem("pendingEmail");
      
      if (!email) {
        throw new Error("Email not found. Please signup again.");
      }

      const res = await API.post("/auth/verify-otp", { email, otp });
      
      // Verification success ke baad email remove kar dein (Safai!)
      localStorage.removeItem("pendingEmail");
      
      return res.data;
    } catch (error) {
      console.log("OTP Error:", error.response?.data?.message || error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 3. Login User
  const loginUser = async (loginData) => {
    setLoading(true);
    try {
      const res = await API.post("/auth/login", loginData);
      const { token, user: userData } = res.data;

      localStorage.setItem("token", token);
      setUser(userData);
      
      return res.data;
    } catch (error) {
      console.log("Login Error:", error.response?.data?.message || error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 4. Logout User
  const logoutUser = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return { registerUser, verifyOTP, loginUser, logoutUser };
};

export default authUser;