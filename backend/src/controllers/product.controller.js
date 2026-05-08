const productModel = require("../models/product.model");
const APIFeatures = require("../utils/apiFeaturs");

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

exports.createProduct = async (req, res) => {
  try {
    const product = await productModel.create(req.body);

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
