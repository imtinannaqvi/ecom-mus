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
    // Main Category: Men, Women, or Kids
    mainCategory: {
      type: String,
      required: [true, "Please specify a main category"],
      enum: ["Men", "Women", "Kids"], // Seeded values se match hona chahiye
    },
    // Sub Category: Dress, Shoes, Watch etc.
    subCategory: {
      type: String,
      required: [true, "Please specify a sub-category"],
    },
    colors: {
      type: [String],
      required: [true, "Please add at least one color"],
    },
    sizes: {
      type: [String],
      required: [true, "Please add at least one size"],
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
      },
    ],
    stock: {
      type: Number,
      required: [true, "Please enter product stock"],
      default: 1,
    },
    // Average Rating for easy filtration (e.g. show products with 4+ stars)
    ratings: {
      type: Number,
      default: 0,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    reviews: [
      
       {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        stars: { type: Number, required: true },
        title: { type: String },
        description: { type: String },
        reviewMedia: { type: String }, // Image ya Video ka URL/Path
        createdAt: { type: Date, default: Date.now }
      }
    
    ],
  },
{ timestamps: true }
);

const productModel = mongoose.model("product", productSchema);
module.exports = productModel;