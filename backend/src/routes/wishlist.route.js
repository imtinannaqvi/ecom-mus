const express = require("express");
const router = express.Router();
const authUser = require("../middlewares/auth.middleware");
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} = require("../controllers/wishlist.controller");

router.get("/", authUser, getWishlist);
router.post("/:productId", authUser, addToWishlist);
router.delete("/:productId", authUser, removeFromWishlist);

module.exports = router;
