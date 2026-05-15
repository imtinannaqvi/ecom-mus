const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  country: { type: String, default: 'India', required: true },
  flatColony: { type: String, required: true }, // Flat, Colony, Street, Sector
  state: { type: String, required: true },
  city: { type: String, required: true },
  zipCode: { type: String, required: true },
  mobileNumber: {
    countryCode: { type: String, default: '+91' },
    number: { type: String, required: true }
  },
  isDefault: { type: Boolean, default: false }
}, { timestamps: true });

const addressModel = mongoose.model('Address', addressSchema);
module.exports = addressModel