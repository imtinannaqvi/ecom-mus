const userModel = require("../models/user.model");

// GET /api/wishlist — return the logged-in user's wishlist with product details.
exports.getWishlist = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).populate({
      path: "wishlist",
      select: "name price images mainCategory ratings",
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/wishlist/:productId — add a product (idempotent, no duplicates).
exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await userModel.findByIdAndUpdate(
      req.user.id,
      { $addToSet: { wishlist: productId } }, // $addToSet prevents duplicates
      { new: true }
    ).populate({
      path: "wishlist",
      select: "name price images mainCategory ratings",
    });

    res.status(200).json({
      success: true,
      message: "Added to wishlist",
      wishlist: user.wishlist,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/wishlist/:productId — remove a product from the wishlist.
exports.removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await userModel.findByIdAndUpdate(
      req.user.id,
      { $pull: { wishlist: productId } },
      { new: true }
    ).populate({
      path: "wishlist",
      select: "name price images mainCategory ratings",
    });

    res.status(200).json({
      success: true,
      message: "Removed from wishlist",
      wishlist: user.wishlist,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
