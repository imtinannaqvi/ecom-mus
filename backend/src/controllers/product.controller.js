const productModel = require("../models/productModel");
const APIFeatures = require("../utils/apiFeatures");

exports.getAllProducts = async (req, res) => {
  try {
    // API Features apply karna
    const apiFeature = new APIFeatures(productModel.find(), req.query)
      .search()
      .filter();

    const products = await apiFeature.query;

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
