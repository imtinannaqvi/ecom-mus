const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is required"],
  },
  email: {
    type: String,
    required: true,
    unique: [true, "email is unique"],
  },
  password: {
    type: String,
    required: [true, "password is compulsory"],
  },
  phoneNo: {
    type: Number,
    required: true,
  },
});



const userModel = mongoose.model('user' ,userSchema )

module.exports = userModel