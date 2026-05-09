const userModel = require("../models/user.model");

// 1. Add to Cart / Update Quantity
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const user = await userModel.findById(req.user.id);

    const isItemExist = user.cart.find(
      (item) => item.productId.toString() === productId
    );

    if (isItemExist) {
      user.cart.forEach((item) => {
        if (item.productId.toString() === productId) {
          item.quantity = quantity;
        }
      });
    } else {
      // Agar nahi hai toh naya product add karein
      user.cart.push({ productId, quantity });
    }

    await user.save();
    res.status(200).json({ success: true, cart: user.cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Get User Cart Details
exports.getCart = async (req, res) => {
  try {
    // .populate('cart.productId') se product ki saari details (name, price, image) mil jayengi
    const user = await userModel.findById(req.user.id).populate("cart.productId");
    
    res.status(200).json({
      success: true,
      cart: user.cart,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Remove Item from Cart
exports.removeFromCart = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);

    // Filter use karke wo product nikal dein
    user.cart = user.cart.filter(
      (item) => item.productId.toString() !== req.params.id
    );

    await user.save();
    res.status(200).json({ success: true, cart: user.cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};