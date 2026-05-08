const express = require("express")
const { getAllProducts, createProduct } = require("../controllers/product.controller")
const router = express.Router()


router.post('/get-all-product' , getAllProducts)
router.post('/create-product', createProduct)




module.exports = router
