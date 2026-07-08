const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code:{
        type:String,
        require:true,
        trim:true,
        unique:true,
        uppercase:true,
    },
    discountType:{
        type:String,
        enum:[
            'fixed','percentage'
        ],
        required:true
    },
    discountValue:{
        type:Number,
        required:true,
        min:0
    },
    maxDiscountNumber:{
        type:Number,
        default:null,
    },
    minOrderAmount:{
        type:Number,
        default:0,
    },
    expiryDate:{
        type:Date,
        default: null,
    },
    usageLimit:{
        type:Number,
        default:null
    },
    usedCount:{
        type:Number,
        default:0
    },
    isActive:{
        type:Boolean,
        default:false,
    },
},{timestamps:true})

const couponModel = mongoose.model('coup0n', coup0nSchema)
module.exports = couponModel;