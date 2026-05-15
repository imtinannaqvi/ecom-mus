const express = require('express');
const router = express.Router();
const {
    addAddress,
    getAddresses,
    deleteAddress,
    updateAddress
} = require('../controllers/address.controller');
const authUser = require('../middlewares/auth.middleware')
router.post('/add', authUser, addAddress)
router.get('/get-address', authUser, getAddresses)
router.delete('/delete/:id', authUser, deleteAddress)
router.put('/update/:id' , authUser, updateAddress )



module.exports = router;