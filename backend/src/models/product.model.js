const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
    },
    // Color Selection
    colors: {
      type: [String], // Array: ["Red", "Blue", "Black"]
      required: [true, "Please add at least one color"],
    },
    // Size Selection
    sizes: {
      type: [String], // Array: ["S", "M", "L", "XL"]
      required: [true, "Please add at least one size"],
    },
    images: [
      {
        public_id: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
    category: {
      type: String,
      required: [true, "Please specify a category"],
    },
    stock: {
      type: Number,
      required: [true, "Please enter product stock"],
      default: 1,
    },
    // User/Admin Reference
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true },
);

const productModel = mongoose.model("product", productSchema);
module.exports = productModel;
