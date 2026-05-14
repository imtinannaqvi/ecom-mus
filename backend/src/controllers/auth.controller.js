const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
// Aapka path

const registerUser = async (req, res) => {
  try {
    const { name, email, password, phoneNo } = req.body;

    if (!name || !email || !password || !phoneNo) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const userExist = await userModel.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 1. Generate 6 Digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpire = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes valid

    // 2. Create User (Verification Pending)
    const user = await userModel.create({
      email,
      name,
      password: hashedPassword,
      phoneNo,
      otp,
      otpExpire,
      isVerified: false, // Make sure to add this in your Schema
    });

    // 3. Nodemailer Configuration
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Your 16-character App Password
      },
    });

    const mailOptions = {
      from: `"Store Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify Your Account - OTP",
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee">
          <h2 style="color: #333">Welcome to our Store!</h2>
          <p>Please use the following OTP to verify your email:</p>
          <h1 style="background: #f4f4f4; padding: 10px; text-align: center; letter-spacing: 5px;">${otp}</h1>
          <p style="color: #666 text-align: center;">This OTP is valid for 5 minutes only.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      success: true,
      message: "OTP sent to your email. Please verify to continue.",
      email: user.email,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if OTP is correct
    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Check if OTP is expired
    if (new Date() > user.otpExpire) {
      return res
        .status(400)
        .json({ message: "OTP expired. Please signup again." });
    }

    // Success: Update User
    user.isVerified = true;
    user.otp = undefined; // Clear OTP
    user.otpExpire = undefined; // Clear Expiry
    await user.save();

    res.status(200).json({
      success: true,
      message: "Email verified successfully. You can now login.",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Verification failed", error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, phoneNo, password } = req.body;

    const user = await userModel.findOne({
      $or: [{ email }, { phoneNo }],
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    if(!user.isVerified){
      return res.status(400).json({success:false , message:'please verify your email through otp'})
    }      
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
const logoutUser = async (req, res) => {
  try {
    // Cookie ko expire kar dena ya delete kar dena
    res.cookie("token", null, {
      expires: new Date(Date.now()), // Foran expire kar do
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const getMe = async (req, res) => {
 
  try {
    const user = await userModel.findById(req.user.id).select("-password");
    
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Session expired" });
  }
};

module.exports = { registerUser, loginUser, verifyOTP, logoutUser , getMe};
