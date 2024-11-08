const mongoose = require("mongoose");
const validator=require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const otpSchema = new Schema(
    {
        email:{
            type:String,
            unique:true
        },
        phoneNo: {
            type: Number,
            trim: true,
        },
        otp:{
            type:String,
            require:true
        },
        createdAt:{type:Date,default:Date.now,index:{expires:300}},
        
    }
)
otpSchema.plugin(validator);
module.exports=mongoose.model('OtpModel',otpSchema)