const categoryModel = require("../models/category.model");
const Product = require("../models/product.model");
const userModel = require("../models/user.model");
const orderModel = require("../models/order.model");
const jwt = require("jsonwebtoken");

// PII fields never returned to the admin client (DPDP data-minimization).
const USER_SAFE_FIELDS = "-password -otp -otpExpire";

// Admin login: validates against ADMIN_EMAIL / ADMIN_PASSWORD env credentials
// and issues a JWT (role: admin). No admin user lives in the DB.
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid admin credentials" });
    }

    const token = jwt.sign(
      { role: "admin", email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      success: true,
      message: "Admin logged in successfully",
      token,
      admin: { email },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 1. Main Category Create ya Update karna (Men, Women, Kids)
// exports.createMainCategory = async (req, res) => {
//   try {
//     const { name } = req.body;
//     if (!req.file) {
//       return res.status(400).json({ message: "Please upload an image" });
//     }

//     const imagePath = `/uploads/${req.file.filename}`;

//     const category = await categoryModel.findOneAndUpdate(
//       { name },
//       { name, image: imagePath },
//       { upsert: true, new: true, runValidators: true },
//     );

//     res.status(200).json({
//       success: true,
//       message: `${name} category set up successfully!`,
//       data: category,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// 2. Sub-Category add karna (Existing Main Category ke array mein push karna)
exports.addSubCategory = async (req, res) => {
  try {
    const { mainCategoryName, subName } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Please upload an image" });
    }

    const imagePath = `/uploads/${req.file.filename}`;

    const category = await categoryModel.findOneAndUpdate(
      { name: mainCategoryName },
      {
        $push: {
          subCategories: { name: subName, image: imagePath },
        },
      },
      { new: true },
    );

    res.status(200).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===================== USER MANAGEMENT (Admin) =====================

// List all customers. Sensitive PII (password/otp) is stripped at the query level.
exports.getAllUsers = async (req, res) => {
  try {
    const users = await userModel
      .find()
      .select(USER_SAFE_FIELDS)
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: users.length, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await userModel
      .findById(req.params.id)
      .select(USER_SAFE_FIELDS)
      .populate("orders");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Right-to-erasure (DPDP): removes the customer record entirely.
exports.deleteUser = async (req, res) => {
  try {
    const user = await userModel.findByIdAndDelete(req.params.id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "User account deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===================== DASHBOARD / REPORTS (Admin) =====================

exports.getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalProducts, totalOrders] = await Promise.all([
      userModel.countDocuments(),
      Product.countDocuments(),
      orderModel.countDocuments(),
    ]);

    // Revenue from orders that were not cancelled.
    const revenueAgg = await orderModel.aggregate([
      { $match: { orderStatus: { $ne: "Cancelled" } } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;

    // Count of orders by status.
    const statusAgg = await orderModel.aggregate([
      { $group: { _id: "$orderStatus", count: { $sum: 1 } } },
    ]);
    const statusBreakdown = statusAgg.reduce((acc, s) => {
      acc[s._id] = s.count;
      return acc;
    }, {});

    // Monthly sales (non-cancelled) grouped by year+month.
    const monthlySales = await orderModel.aggregate([
      { $match: { orderStatus: { $ne: "Cancelled" } } },
      {
        $group: {
          _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
          total: { $sum: "$totalPrice" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // Top 5 best-selling products by quantity ordered.
    const topProducts = await orderModel.aggregate([
      { $unwind: "$orderItems" },
      {
        $group: {
          _id: "$orderItems.productId",
          sold: { $sum: "$orderItems.quantity" },
          revenue: {
            $sum: { $multiply: ["$orderItems.price", "$orderItems.quantity"] },
          },
        },
      },
      { $sort: { sold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          sold: 1,
          revenue: 1,
          name: "$product.name",
          image: { $arrayElemAt: ["$product.images.url", 0] },
        },
      },
    ]);

    const recentOrders = await orderModel
      .find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
        statusBreakdown,
        monthlySales,
        topProducts,
        recentOrders,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===================== MAIN CATEGORY (Admin) =====================

// Create or update one of the fixed main categories (Men/Women/Kids).
exports.createMainCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Please upload an image" });
    }

    const imagePath = `/uploads/${req.file.filename}`;

    const category = await categoryModel.findOneAndUpdate(
      { name },
      { name, image: imagePath },
      { upsert: true, new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: `${name} category set up successfully!`,
      data: category,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await categoryModel.find();
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteSubCategory = async (req, res) => {
  try {
    const { id } = req.params; 

    const updatedCategory = await categoryModel.findOneAndUpdate(
      { "subCategories._id": id }, 
      {
        $pull: {
          subCategories: { _id: id }
        }
      },
      { returnDocument: 'after' } 
    );

    if (!updatedCategory) {
      return res.status(404).json({ 
        success: false, 
        message: "Sub-category not found or already deleted." 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: "Sub-category deleted successfully!",
      data: updatedCategory 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};






