const express = require("express");
const router = express.Router();
const upload = require("../middlewares/Multer");
const {
  createMainCategory,
  addSubCategory,
  getAllCategories,createProduct ,getAllProducts,
  deleteSubCategory,
  adminLogin,
  getAllUsers,
  getUserById,
  deleteUser,
  getDashboardStats
} = require("../controllers/admin.controller");
const { myOrders, getOrderById, getAllOrder, deleteOrder, updateOrderStatus } = require("../controllers/order.controller");
const adminAuth = require("../middlewares/adminAuth.middleware");


// --- Public ---
router.post("/login", adminLogin);
router.get("/all", getAllCategories); // also consumed by the storefront for categories

// --- Admin-only (token required) ---
// Categories
router.post("/main", adminAuth, upload.single("image"), createMainCategory);
router.post("/sub", adminAuth, upload.single("image"), addSubCategory);
router.delete('/delete/:id' , adminAuth, deleteSubCategory)

// Orders
router.get('/get-order' , adminAuth, getAllOrder)
router.get('/get-order-by-id/:id' , adminAuth, getOrderById)
router.delete('/delete-order/:id' , adminAuth, deleteOrder)
router.put('/update-order-status/:id' , adminAuth, updateOrderStatus)

// Users
router.get('/users', adminAuth, getAllUsers)
router.get('/users/:id', adminAuth, getUserById)
router.delete('/users/:id', adminAuth, deleteUser)

// Dashboard / Reports
router.get('/stats', adminAuth, getDashboardStats)



module.exports = router;
