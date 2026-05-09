const express = require('express')
const authUser = require('../middlewares/auth.middleware')
const { newOrder, cancelOrder, myOrders } = require('../controllers/order.controller')
const router = express.Router()


router.post('/new' , authUser , newOrder)
router.post('/cancel/:id', authUser , cancelOrder)
router.get('/get' , authUser , myOrders)



module.exports= router