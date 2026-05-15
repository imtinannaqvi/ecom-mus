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



exports.createProductReview = async (req, res) => {
  try {
    const { stars, title, description, productId } = req.body;
    
    let mediaUrl = "";
    if (req.file) {
      mediaUrl = `/uploads/reviews/${req.file.filename}`; 
    }

    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const review = {
      userId: req.user._id,
      stars: Number(stars),
      title,
      description,
      reviewMedia: mediaUrl,
    };

    // Check if already reviewed
    const isReviewed = product.reviews.find(
      (rev) => rev.userId.toString() === req.user._id.toString()
    );

    if (isReviewed) {
      product.reviews.forEach((rev) => {
        if (rev.userId.toString() === req.user._id.toString()) {
          rev.stars = stars;
          rev.title = title;
          rev.description = description;
          // Purani image update karni hai toh:
          if (mediaUrl) rev.reviewMedia = mediaUrl; 
        }
      });
    } else {
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
    }

    let avg = 0;
    product.reviews.forEach((rev) => {
      avg += rev.stars;
    });
    product.ratings = avg / product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: "Review submitted successfully",
      ratings: product.ratings
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};