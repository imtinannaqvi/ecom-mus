const addressModel = require('../models/address.model');

/**
 * @desc    Create a new shipping address
 * @route   POST /api/address
 * @access  Private
 */
exports.addAddress = async (req, res) => {
  try {
    const { 
      firstName, 
      lastName, 
      country, 
      flatColony, 
      state, 
      city, 
      zipCode, 
      mobileNumber 
    } = req.body;

    // Basic Validation
    if (!firstName || !lastName || !flatColony || !zipCode || !mobileNumber.number) {
      return res.status(400).json({ 
        success: false, 
        message: "Please provide all required fields" 
      });
    }

    const address = new addressModel({
      user: req.user.id, // Auth middleware se aayega
      firstName,
      lastName,
      country,
      flatColony,
      state,
      city,
      zipCode,
      mobileNumber
    });

    const savedAddress = await address.save();
    
    res.status(201).json({ 
      success: true, 
      message: "Address added successfully", 
      address: savedAddress 
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Server Error", 
      error: error.message 
    });
  }
};

/**
 * @desc    Get all addresses for a logged-in user
 * @route   GET /api/address
 * @access  Private
 */
exports.getAddresses = async (req, res) => {
  try {
    const addresses = await addressModel.find({ user: req.user._id }).sort({ createdAt: -1 });
    
    res.status(200).json({ 
      success: true, 
      count: addresses.length, 
      addresses 
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Could not fetch addresses", 
      error: error.message 
    });
  }
};

/**
 * @desc    Delete a specific address
 * @route   DELETE /api/address/:id
 * @access  Private
 */
exports.deleteAddress = async (req, res) => {
  try {
    const address = await addressModel.findById(req.params.id);

    if (!address) {
      return res.status(404).json({ 
        success: false, 
        message: "Address not found" 
      });
    }

    // Check if the address belongs to the user
    if (address.user.toString() !== req.user.id.toString()) {
      return res.status(401).json({ 
        success: false, 
        message: "Not authorized to delete this address" 
      });
    }

    await address.deleteOne();

    res.status(200).json({ 
      success: true, 
      message: "Address removed successfully" 
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Server Error", 
      error: error.message 
    });
  }
};


exports.updateAddress = async (req, res) => {
  try {
    const { id } = req.params; // URL se address ki ID milegi
    const { 
      firstName, 
      lastName, 
      country, 
      flatColony, 
      state, 
      city, 
      zipCode, 
      mobileNumber 
    } = req.body;

    // 1. Check karein ke address exist karta hai ya nahi
    let address = await addressModel.findById(id);

    if (!address) {
      return res.status(404).json({ 
        success: false, 
        message: "Address not found" 
      });
    }

    // 2. Security Check: Kya ye address usi user ka hai jo update kar raha hai?
    if (address.user.toString() !== req.user.id) {
      return res.status(401).json({ 
        success: false, 
        message: "You are not authorized to update this address" 
      });
    }

    // 3. Update karein
    address = await addressModel.findByIdAndUpdate(
      id, 
      {
        firstName,
        lastName,
        country,
        flatColony,
        state,
        city,
        zipCode,
        mobileNumber
      },
      { 
        new: true, // Taake update hone ke baad naya data return ho
        runValidators: true, // Schema validations check hon
        useFindAndModify: false 
      }
    );

    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      address
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};