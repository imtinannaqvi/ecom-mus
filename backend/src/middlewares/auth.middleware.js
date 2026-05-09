const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model"); // User model import karein

const authUser = async (req, res, next) => {
  try {
    // 1. Cookies se token nikaalein (plural 'cookies')
    const { token } = req.cookies;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Please login first to access this resource" });
    }

    // 2. Token verify karein
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Database se user nikaal kar request object mein daal dein
    // Is se humein req.user.id aur req.user.cart sab mil jayega
    req.user = await userModel.findById(decoded.id);

    if (!req.user) {
      return res.status(404).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authUser;
