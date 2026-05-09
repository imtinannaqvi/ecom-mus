const express =require('express')
const authUser = require('../middlewares/auth.middleware')
const { addToCart, getCart, removeFromCart } = require('../controllers/cart.controller')

const router = express.Router()


router.post('/add-to-cart', authUser , addToCart)
router.get('/get-cart' , authUser , getCart)
router.delete('/delete-cart-item/:id' , authUser , removeFromCart)


module.exports = router