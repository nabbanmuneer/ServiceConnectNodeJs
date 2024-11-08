const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        userName :{
            type :String ,
            trim :true,
        },
        phoneNo: {
            type: Number,
            trim: true,
        },
        email: {
            type: String,
            trim: true,
        },
        password: {
            type: String,
            trim: true,
        },
        role : {
            type: String,
            default: 'user',
        },
    },{ timestamps: true }
);

const user = mongoose.model("employee", userSchema);
module.exports = user ;