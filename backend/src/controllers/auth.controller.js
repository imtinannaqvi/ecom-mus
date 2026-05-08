const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const { name, email, password, phoneNo } = req.body;
    if (!name || !email || !password || !phoneNo) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const userExist = await userModel.findOne({ email });

    if (userExist) {
      return res.status(400).json({ message: "user is already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      email,
      name,
      password: hashedPassword,
      phoneNo,
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", error: error.message });
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

module.exports = { registerUser, loginUser };
