const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      enum: ["Men", "Women", "Kids"],
      unique: true,
    },
    image: {
      type: String,
      required: true,
    },
    subCategories: [
      {
        name: { type: String, required: true },
        image: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);

const categoryModel = mongoose.model("Category", categorySchema);

module.exports = categoryModel
