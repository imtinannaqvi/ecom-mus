const express = require("express");
const router = express.Router();
const upload = require('../middlewares/Multer')
const {
  createProduct,
  getAllProducts,
  getProductById,
  getUserProducts,
  createProductReview,
  updateProduct,
} = require("../controllers/product.controller");
const authUser = require("../middlewares/auth.middleware");

router.post("/add", upload.array("images", 5), createProduct);
router.put('/update/:id', upload.array("images", 5), updateProduct)

router.get("/all", getAllProducts);
router.get("/get-products/:category", authUser, getUserProducts);
router.put('/rating', authUser, upload.single('reviewMedia'), createProductReview)

module.exports = router;
