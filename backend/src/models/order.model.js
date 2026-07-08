const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  orderItems: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
      quantity: { type: Number, required: true },
      size: String,
      color: String,
      price: { type: Number, required: true }
    }
  ],
  shippingAddress: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address',
    required: true
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['COD', 'Card', 'UPI', 'NetBanking'],
    default: 'COD'
  },
  paymentStatus: {
    type: String,
    required: true,
    enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
    default: 'Pending'
  },
  // Future use ke liye (agar card use ho)
  paymentDetails: {
    transactionId: String,
    cardLastFour: String,
  },
  // Coupon applied at checkout, if any.
  couponCode: { type: String, default: null },
  discountAmount: { type: Number, default: 0 },
  // Cart total before any coupon discount was applied.
  subtotal: { type: Number },
  totalPrice: { type: Number, required: true },
  deliveryCharge: { type: Number, default: 0 },
  isPaid: { type: Boolean, default: false },
  paidAt: Date,
  orderStatus: {
    type: String,
    default: 'Processing',
    enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled']
  }
}, { timestamps: true });

const orderModel = mongoose.model('Order', orderSchema);
module.exports = orderModel