const express = require("express");
const router = express.Router();
const upload = require("../middlewares/Multer");
const {
  createMainCategory,
  addSubCategory,
  getAllCategories,createProduct ,getAllProducts,
  deleteSubCategory
} = require("../controllers/admin.controller");
const { myOrders, getOrderById, getAllOrder, deleteOrder, updateOrderStatus } = require("../controllers/order.controller");


// router.post("/main",  upload.single("image"), createMainCategory); this route will be used to add main category but now we just want add just 3 c=main category so that's why i can pause this 
router.post("/sub", upload.single("image"), addSubCategory);
router.get("/all", getAllCategories);
router.delete('/delete/:id' , deleteSubCategory)
router.get('/get-order' ,  getAllOrder)
router.get('/get-order-by-id/:id' , getOrderById)
router.delete('/delete-order/:id' , deleteOrder)
router.put('/update-order-status/:id' , updateOrderStatus)



module.exports = router;
