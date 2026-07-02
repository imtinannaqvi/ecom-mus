const express = require("express");
const {
  registerUser,
  loginUser,
  verifyOTP,
  logoutUser,
  getMe,
  updateProfile,
  changePassword,
} = require("../controllers/auth.controller");
const authUser = require("../middlewares/auth.middleware");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-otp", verifyOTP);
router.post("/logout", logoutUser);
router.get('/me' ,authUser ,  getMe)
router.put('/update-profile', authUser, updateProfile)
router.put('/change-password', authUser, changePassword)

module.exports = router;
