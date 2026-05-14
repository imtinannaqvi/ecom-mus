const productModel = require("../models/product.model");
const userModel = require("../models/user.model");

exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      mainCategory,
      subCategory,
      colors,
      sizes,
      stock,
    } = req.body;

    // Multiple Images handle karna
    const imageFiles = req.files;
    if (!imageFiles || imageFiles.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Please upload at least one image" });
    }

    // Har image ka path nikaal kar array banana
    const images = imageFiles.map((file) => ({
      url: `/uploads/${file.filename}`,
    }));

    const product = await productModel.create({
      name,
      description,
      price,
      mainCategory,
      subCategory,
      colors: JSON.parse(colors), // Frontend se array stringify ho kar aata hai form-data mein
      sizes: JSON.parse(sizes), // Isliye JSON.parse zaroori hai
      stock,
      images,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Saare Products Get Karna (With Optional Filters)
exports.getAllProducts = async (req, res) => {
  try {
    const { mainCategory, subCategory } = req.query;
    let filter = {};

    if (mainCategory) filter.mainCategory = mainCategory;
    if (subCategory) filter.subCategory = subCategory;

    const products = await productModel.find(filter);
    res.status(200).json({ success: true, count: products.length, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUserProducts = async (req, res) => {
  try {
    const { category } = req.params;  
    const products = await productModel.find({ mainCategory: category });

    if (!products || products.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No products found" });
    }

    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
