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
  deleteProduct,
} = require("../controllers/product.controller");
const authUser = require("../middlewares/auth.middleware");
const adminAuth = require("../middlewares/adminAuth.middleware");

router.post("/add", adminAuth, upload.array("images", 5), createProduct);
router.put('/update/:id', adminAuth, upload.array("images", 5), updateProduct)
router.delete('/delete/:id', adminAuth, deleteProduct)

router.get("/all", getAllProducts);
router.get("/get-products/:category", authUser, getUserProducts);
router.put('/rating', authUser, upload.single('reviewMedia'), createProductReview)
router.get('/:id', getProductById) // keep last: single-segment param must not shadow literal routes above

module.exports = router;
