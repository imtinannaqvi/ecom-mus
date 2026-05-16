const categoryModel = require("../models/category.model");
const Product = require("../models/product.model");

// 1. Main Category Create ya Update karna (Men, Women, Kids)
// exports.createMainCategory = async (req, res) => {
//   try {
//     const { name } = req.body;
//     if (!req.file) {
//       return res.status(400).json({ message: "Please upload an image" });
//     }

//     const imagePath = `/uploads/${req.file.filename}`;

//     const category = await categoryModel.findOneAndUpdate(
//       { name },
//       { name, image: imagePath },
//       { upsert: true, new: true, runValidators: true },
//     );

//     res.status(200).json({
//       success: true,
//       message: `${name} category set up successfully!`,
//       data: category,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// 2. Sub-Category add karna (Existing Main Category ke array mein push karna)
exports.addSubCategory = async (req, res) => {
  try {
    const { mainCategoryName, subName } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Please upload an image" });
    }

    const imagePath = `/uploads/${req.file.filename}`;

    const category = await categoryModel.findOneAndUpdate(
      { name: mainCategoryName },
      {
        $push: {
          subCategories: { name: subName, image: imagePath },
        },
      },
      { new: true },
    );

    res.status(200).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await categoryModel.find();
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteSubCategory = async (req, res) => {
  try {
    const { id } = req.params; 

    const updatedCategory = await categoryModel.findOneAndUpdate(
      { "subCategories._id": id }, 
      {
        $pull: {
          subCategories: { _id: id }
        }
      },
      { returnDocument: 'after' } 
    );

    if (!updatedCategory) {
      return res.status(404).json({ 
        success: false, 
        message: "Sub-category not found or already deleted." 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: "Sub-category deleted successfully!",
      data: updatedCategory 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};






