const express = require('express');
const router = express.Router();
const adminAuth = require('../middlewares/adminAuth.middleware')
const {
  createCoupon,
  getAllCoupons,
  toggleCouponStatus,
  deleteCoupon,
  validateCoupon,
} = require("../controllers/coupon.controller");

router.post('/validate', validateCoupon)
router.get('/admin/all', adminAuth, getAllCoupons)
router.post('/admin/create', adminAuth, createCoupon)
router.patch('/admin/toggle-status/id', authAdmin, toggleCouponStatus)
router.delete('/admin/:id', authAdmin, deleteCoupon)

module.exports = router;