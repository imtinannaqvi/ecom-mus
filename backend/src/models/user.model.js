const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password is compulsory"],
    },
    phoneNo: {
      type: String,
      required: true,
    },
    otp: { type: String },
    otpExpire: { type: Date },
    isVerified: { type: Boolean, default: false },

    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
      },
    ],

    cart: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],

    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "order",
      },
    ],
  },
  { timestamps: true },
);

const userModel = mongoose.model("user", userSchema);
module.exports = userModel;
