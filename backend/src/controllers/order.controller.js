const orderModel = require("../models/order.model");
const productModel = require("../models/product.model");
const userModel = require("../models/user.model");

// 1. Create New Order
// @desc    Create new order
// @route   POST /api/orders
exports.createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice
    } = req.body;

    // 1. Basic Validation
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    // 2. Prevent Duplicate Order (Logic)
    // Hum check kar rahe hain ke pichle 1 minute mein same user ne same price ka order to nahi kiya?
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);

    const isDuplicate = await orderModel.findOne({
      user: req.user._id,
      totalPrice: totalPrice,
      createdAt: { $gte: oneMinuteAgo }
    });

    if (isDuplicate) {
      return res.status(400).json({
        success: false,
        message: "Your order is already being processed. Please wait a minute before trying again."
      });
    }

    // 3. Create Order if not duplicate
    const order = new orderModel({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      isPaid: paymentMethod === 'COD' ? false : true,
      paidAt: paymentMethod === 'COD' ? null : Date.now() // PaidAt bhi set kar diya payment ke liye
    });

    const createdOrder = await order.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: createdOrder
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


async function updateStock(id, quantity) {
  const product = await productModel.findById(id);
  product.stock -= quantity;
  await product.save({ validateBeforeSave: false });
}

exports.cancelOrder = async (req, res) => {
  try {
    const order = await orderModel.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (order.orderStatus === "Delivered") {
      return res.status(400).json({ message: "You cannot cancel a delivered order" });
    }
    order.orderStatus = "Cancelled";

    for (const item of order.orderItems) {

      // Aapke schema ke mutabik key 'productId' hai
      const product = await productModel.findById(item.productId);

      if (product) {
        product.stock += item.quantity;
        await product.save({ validateBeforeSave: false });
      } else {
      }
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

exports.myOrders = async (req, res) => {
  try {
    // 1. Path se extra backtick hataya
    // 2. Model name "Product" kiya (jo schema mein ref hai)
    // 3. Path ko string mein sahi se likha
    const orders = await orderModel.find({ user: req.user.id })
      .populate({
        path: 'orderItems.productId',
        select: 'name images price',
        model: 'product'
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders
    });
  } catch (error) {
    console.error("Backend Error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    // 'User' (Capital U) ko 'user' (Small u) kar do
    const order = await orderModel.findById(req.params.id)
      .populate({
        path: 'user',        // Schema field name (must be small 'u' if defined so)
        model: 'user',        // Explicitly model name batayein
        select: 'name email' 
      }) // <--- Yahan change kiya: 'user'
      .populate({
        path: 'orderItems.productId',
        model: 'product',
        select: 'name images price'
      })
      .populate('shippingAddress');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    return res.status(200).json({ 
      success: true, 
      data: order 
    });

  } catch (err) {
    // Console mein error print karein taaki exact line pata chale
    console.error("Populate Error:", err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
}