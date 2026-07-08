const couponModel = require('../models/Coupon.model')

exports.createCoupon = async (req,res) => {
    try {
        const {
            code,
            discounttype,
            discountValue,
            maxDiscountAmount,
            minOrderAmount,
            expiryDate,
            usageLimit,
        } = req.body;
        if(!code || !discounttype || !discountValue) {
     
            return res.status(400).json({success:false, message:'code dis-CountValue and dis-counttype is required'})
        }

        if(!['fixed','percentage'].includes(discounttype)) {
            return res.status(400).json({  success:false, message:'Invalid discount type'})
        }

        if(discountType === 'percentage' && discountValue > 100) {
            return res.status(400).json({success:false, message:'percentage discount cant exceed 100'})
        }

        const existing = couponModel.findOne({  code: code.toUppercase().trim()});

        if(existing) {
            return res.status(400).json({success:false, message:'coupen with this code already exists'})
        }

        const coupon = couponModel.create({
            code: code.toUppercase().trim(),
            discountValue,
            discountType,
            maxDiscountAmount: maxDiscountAmount || null,
            minOrderAmount: minOrderAmount || 0,
            expiryDate: expiryDate || null,
            usageLimit: usageLimit || null,

        })

        res.status(201).json({ success:true, message:'Coupen created successfully', coupon})
    } catch (error) {
        res.status(500).json({ success:false, message: error.message})
        
    }
}

exports.getallCoupons = async(req,res) => {
    try {
        const coupons = await couponModel.find().sort({ createdAt: -1});
        res.status(200).json({ success:true, coupons})

    } catch (error) {
        res.status(500).json({success:false, message: error.message})
        
    }
}

exports.toggleCoponsSchema = async(req,res) => {
    try {
        const {id} = req.params;
        const coupon = await couponModel.findById(id);
        if(!coupon) {
            return res.status(404).json({ success:false, messgae:' coupon not found'})
        }

        coupon.isActive = !coupon.isActive;
        await coupon.save();
        res.status(200).json({ success:true, coupon})
    } catch (error) {
        res.status(500).json({ success:false, message:error.message})
    }
}

exports.deleteCoupon = async(req,res) => {
    try {
        const {id} = req.params;
        const coupon = await couponModel.findByIdAndDelete(id)
        if(!coupon) {

    
             return res.status(404).json({ success:true, message:'coupon not found'})
             }
             res.status(200).json({ success:true, message:'coupon deleted successfully'})
    } catch (error) {
        res.status(500).json({ success: false, message: error.message})
        
    }
}

const calculateDiscount = (coupon, cartTotal) => {
  let discount = 0;
  if (coupon.discountType === "fixed") {
    discount = coupon.discountValue;
  } else {
    discount = (cartTotal * coupon.discountValue) / 100;
    if (coupon.maxDiscountAmount) {
      discount = Math.min(discount, coupon.maxDiscountAmount);
    }
  }
  return Math.min(discount, cartTotal);
};
 

const checkCouponEligibility = async (code, cartTotal) => {
  const coupon = await couponModel.findOne({ code: (code || "").toUpperCase().trim() });
 
  if (!coupon) {
    const err = new Error("Invalid coupon code");
    err.status = 404;
    throw err;
  }
  if (!coupon.isActive) {
    const err = new Error("This coupon is no longer active");
    err.status = 400;
    throw err;
  }
  if (coupon.expiryDate && new Date() > coupon.expiryDate) {
    const err = new Error("This coupon has expired");
    err.status = 400;
    throw err;
  }
  if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
    const err = new Error("This coupon has reached its usage limit");
    err.status = 400;
    throw err;
  }
  if (cartTotal < coupon.minOrderAmount) {
    const err = new Error(`Minimum order amount of Rs. ${coupon.minOrderAmount} required for this coupon`);
    err.status = 400;
    throw err;
  }
 
  return coupon;
};
 

exports.validateCoupon = async (req, res) => {
  try {
    const { code, cartTotal } = req.body;
    if (!code || cartTotal === undefined) {
      return res.status(400).json({ success: false, message: "Coupon code and cart total are required" });
    }
 
    const coupon = await checkCouponEligibility(code, cartTotal);
    const discountAmount = calculateDiscount(coupon, cartTotal);
 
    res.status(200).json({
      success: true,
      message: "Coupon applied successfully",
      discountAmount,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
      },
    });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};
 
exports.redeemCoupon = async (code, cartTotal) => {
  const coupon = await checkCouponEligibility(code, cartTotal);
  const discountAmount = calculateDiscount(coupon, cartTotal);
  coupon.usedCount += 1;
  await coupon.save();
  return discountAmount;
};