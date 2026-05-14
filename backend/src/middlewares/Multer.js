const multer = require("multer");
const path = require("path");

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Ye folder pehle se bana hona chahiye
  },
  filename: function (req, file, cb) {
    // Image ka naam unique rakhne ke liye timestamp add kar rahe hain
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });
module.exports = upload;