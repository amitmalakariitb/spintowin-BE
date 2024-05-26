const twilio = require('twilio');
const OTP = require('../models/otp.model');
const config = require('../config/twilio.config');
const client = new twilio(config.accountSid, config.authToken);

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOTP = async (req, res) => {
    try {
        let { mobile_number } = req.body;

        const formattedPhoneNumber = `+91${mobile_number}`;

        const otp = generateOTP();

        await client.messages.create({
            body: `Your OTP code is ${otp}`,
            from: config.serviceId,
            to: formattedPhoneNumber
        });

        const otpEntry = new OTP({
            mobile_number,
            otp
        });
        await otpEntry.save();

        res.status(200).send({ message: 'OTP sent successfully' });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};


const verifyOTP = async (req, res) => {
    try {
        const { mobile_number, otp } = req.body;

        const otpEntry = await OTP.findOne({ mobile_number, otp });

        if (!otpEntry) {
            return res.status(400).send({ message: 'Invalid OTP' });
        }


        await OTP.deleteMany({ mobile_number });

        res.status(200).send({ message: 'Mobile number verified successfully.' });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

module.exports = {
    sendOTP,
    verifyOTP
};
