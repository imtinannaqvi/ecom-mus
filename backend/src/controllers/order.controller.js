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
    const { id } = req.params;
    
    // 💡 .populate lagane se user aur address ki raw IDs poore object mein convert ho jayengi
    const order = await orderModel.findById(id)
      .populate("user", "name email phone") // User schema se fields nikalega
      .populate("shippingAddress")         // Address schema se actual road/city nikalega
      .populate("orderItems.productId", "name price images");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order data entry missing." });
    }

    return res.status(200).json({ success: true, order });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 📦 Get All Orders for Admin Dashboard (StrictPopulate Error Fixed)
exports.getAllOrder = async (req, res) => {
  try {
    // 💡 FIX: 'User' (Capital U) ko badal kar 'user' (Small u) kar diya hai
    // kyunki aapke schema mein field ka naam "user: { type: ... }" hai.
    const orders = await orderModel.find()
      .populate("user", "name email") // ✅ Fixed path case-sensitivity
      .populate("orderItems.productId", "name price images") 
      .populate("shippingAddress") 
      .sort({ createdAt: -1 }); 

    return res.status(200).json({
      success: true,
      count: orders.length,
      message: "Orders data matrix fetched successfully.",
      orders
    });

  } catch (error) {
    console.error("❌ BACKEND ERROR IN GET_ALL_ORDERS:", error); 

    return res.status(500).json({ 
      success: false, 
      message: "Internal server data stream error.",
      error: error.message 
    });
  }
};

exports.deleteOrder = async(req,res)=>{
  try{
    const {id} = req.params

    const order = await orderModel.findByIdAndDelete(id)
    if(!order){
      return res.status(400).json({success:false , message:'order is not found'})

    }
    return res.status(200).json({success:true, message:'order is deleted successfully'})
  }
  catch(err){
    return res.status(400).json({message:err.message})
  }
}


exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    // 1. Check karein ke order database mein exist karta hai ya nahi
    const order = await orderModel.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order record not found."
      });
    }

    // 2. Agar order pehle se hi Delivered ya Cancelled hai, toh change rok dein
    if (order.orderStatus === "Delivered") {
      return res.status(400).json({
        success: false,
        message: "Cannot alter status. This order has already been delivered."
      });
    }

    if (order.orderStatus === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "This order is already cancelled and void."
      });
    }

    // 3. 💥 SMART LOGIC: Agar admin status "Cancelled" kar raha hai, toh stock wapas badhao
    if (orderStatus === "Cancelled") {
      for (const item of order.orderItems) {
        await productModel.findByIdAndUpdate(item.productId, {
          $inc: { stock: item.quantity } // Product ka stock quantity jitna wapas plus (+) ho jayega
        });
      }
    }

    // 4. Status update karein aur agar status "Delivered" ho toh payment status bhi auto-complete karein
    order.orderStatus = orderStatus;
    
    if (orderStatus === "Delivered") {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentStatus = "Completed";
    }

    // Database mein changes save karein
    await order.save();

    return res.status(200).json({
      success: true,
      message: `Order status successfully shifted to ${orderStatus}.`,
      order
    });

  } catch (error) {
    console.error("❌ ERROR IN UPDATE_ORDER_STATUS:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while updating status pipeline.",
      error: error.message
    });
  }
};