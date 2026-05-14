const userModel = require("../models/user.model");
const productModel = require('../models/product.model')

// 1. Add to Cart / Update Quantity
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity, size, color } = req.body; // Size/Color receive karein
    const user = await userModel.findById(req.user.id);

    // Check if EXACT combination exists
    const itemIndex = user.cart.findIndex(
      (item) => 
        item.productId.toString() === productId && 
        item.size === size && 
        item.color === color
    );

    if (itemIndex > -1) {
      // Agar exact combo hai toh quantity plus karein (ya update karein)
      user.cart[itemIndex].quantity += quantity; 
    } else {
      // Naya combination add karein
      user.cart.push({ productId, quantity, size, color });
    }

    await user.save();
    // Populate karke bhejein taaki frontend ko fauran update mile
    const updatedUser = await userModel.findById(req.user.id).populate("cart.productId");
    res.status(200).json({ success: true, cart: updatedUser.cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Get User Cart Details
exports.getCart = async (req, res) => {
  try {
    // Check karein ki user.id mil raha hai
    if (!req.user || !req.user.id) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Populate ko thoda detail mein likhte hain taaki image lazmi aaye
    const user = await userModel.findById(req.user.id).populate({
      path: "cart.productId",
      select: "name price images description mainCategory" // Yahan 'images' lazmi likhen
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      cart: user.cart, // Isme ab productId object ke roop mein hoga
    });
  } catch (error) {
    console.error("Get Cart Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Remove Item from Cart
exports.removeFromCart = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const initialLength = user.cart.length;
    user.cart = user.cart.filter(
      (item) => item._id.toString() !== req.params.id
    );

    if (user.cart.length === initialLength) {
        user.cart = user.cart.filter(
            (item) => item.productId.toString() !== req.params.id
        );
    }

    await user.save();

    const populatedUser = await userModel.findById(req.user.id).populate({
      path: "cart.productId",
      model: "product", 
    });

    res.status(200).json({ 
      success: true, 
      cart: populatedUser.cart // Ab isme pura product object hoga, sirf ID nahi
    });

  } catch (error) {
    console.error("Remove Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};