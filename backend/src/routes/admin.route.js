const express = require("express");
const router = express.Router();
const upload = require("../middlewares/Multer");
const {
  createMainCategory,
  addSubCategory,
  getAllCategories,createProduct ,getAllProducts
} = require("../controllers/admin.controller");


// router.post("/main",  upload.single("image"), createMainCategory); this route will be used to add main category but now we just want add just 3 c=main category so that's why i can pause this 
router.post("/sub", upload.single("image"), addSubCategory);
router.get("/all", getAllCategories);




module.exports = router;
