const express = require('express')
const authUser = require('../middlewares/auth.middleware')
const {cancelOrder, myOrders, createOrder, getOrderById } = require('../controllers/order.controller')
const router = express.Router()


router.post('/new' , authUser , createOrder)
router.post('/cancel/:id', authUser , cancelOrder)
router.get('/get-order' , authUser , myOrders)
router.get('/get-order-by-id/:id' , getOrderById )



module.exports= router