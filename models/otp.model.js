const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const otpSchema = new Schema({
    mobile_number: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300
    }
});

const OTP = mongoose.model('OTP', otpSchema);
module.exports = OTP;
