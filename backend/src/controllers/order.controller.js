const orderModel = require("../models/order.model");
const productModel = require("../models/product.model");
const userModel = require("../models/user.model");

// 1. Create New Order
exports.newOrder = async (req, res) => {
  try {
    const {
      shippingInfo,
      orderItems,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    const order = await orderModel.create({
      shippingInfo,
      orderItems,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      paidAt: Date.now(),
      user: req.user._id,
    });

    // Order place hone ke baad Stock update karna
    for (const item of orderItems) {
      await updateStock(item.product, item.quantity);
    }

    // Order ke baad User ka Cart khali kar dena (Optional but recommended)
    const user = await userModel.findById(req.user._id);
    user.cart = []; 
    await user.save();

    res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Function: Stock Update karne ke liye
async function updateStock(id, quantity) {
  const product = await productModel.findById(id);
  product.stock -= quantity;
  await product.save({ validateBeforeSave: false });
}

// 2. Cancel Order (User Only)
exports.cancelOrder = async (req, res) => {
  try {
    const order = await orderModel.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check karein ke order pehle hi deliver toh nahi ho gaya?
    if (order.orderStatus === "Delivered") {
      return res.status(400).json({ message: "You cannot cancel a delivered order" });
    }

    // Cancel karne par Status update karein
    order.orderStatus = "Cancelled";
    
    // Cancel hone par stock wapas barhana (Stock Revert)
    for (const item of order.orderItems) {
        const product = await productModel.findById(item.product);
        product.stock += item.quantity;
        await product.save({ validateBeforeSave: false });
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Get My Orders (User apne orders dekh sake)
exports.myOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ user: req.user._id });
        res.status(200).json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};