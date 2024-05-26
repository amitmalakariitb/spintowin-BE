// user.controller.js

const User = require('../models/user.model');
const UniqueCode = require('../models/uniqueCode.model');
const qr = require('qr-image');
const authController = require('./auth.controller');
const Winning = require('../models/winning.model');
const OTP = require('../models/otp.model');
const QRCodeReader = require('qrcode-reader');
const Jimp = require('jimp');
const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');


const getCodesAndPrizes = async (req, res) => {
    try {
        const codes = await UniqueCode.find({}, 'random_code prize');
        res.status(200).json(codes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const scanQRCode = async (req, res) => {
    try {
        const { qrCodeData } = req.body;

        const buffer = Buffer.from(qrCodeData, 'base64');

        const image = await Jimp.read(buffer);

        const qr = new QRCodeReader();

        qr.callback = async (err, result) => {
            if (err) {
                console.error('Failed to decode QR code:', err);
                return res.status(400).send({ message: 'Failed to decode QR code.' });
            }

            const decodedData = result.result;
            console.log('Decoded Data:', decodedData);

            try {
                const url = new URL(decodedData);
                const [randomCode, hashKey] = url.pathname.split('/')[1].split('|');

                console.log('Extracted randomCode:', randomCode);
                console.log('Extracted hashKey:', hashKey);

                const uniqueCode = await UniqueCode.findOne({ random_code: randomCode, hash_key: hashKey, status: 'unused' });
                if (!uniqueCode) {
                    return res.status(404).send({ message: 'Invalid or already used QR code.' });
                }

                uniqueCode.status = 'scanned';
                await uniqueCode.save();

                res.status(200).send({ link: decodedData, randomCode, hashKey });
            } catch (e) {
                console.error('Error processing URL:', e);
                res.status(400).send({ message: 'Invalid QR code format.' });
            }
        };

        qr.decode(image.bitmap);
    } catch (error) {
        console.error('Error in scanQRCode:', error);
        res.status(500).send({ message: error.message });
    }
};


const spinToWin = async (req, res) => {
    try {
        const { random_code, hash_key } = req.body;


        const uniqueCode = await UniqueCode.findOne({ random_code, hash_key });

        if (!uniqueCode || uniqueCode.status == 'used') {
            return res.status(404).send({ message: 'Invalid code or code already used.' });
        }

        const prize = uniqueCode.prize;
        res.status(200).send({ message: 'Wheel spun successfully.', prize });

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

const fillForm = async (req, res) => {
    try {
        const { name, mobile_number, location, random_code, hash_key } = req.body;

        const uniqueCode = await UniqueCode.findOne({ random_code, hash_key, status: 'unused' });
        if (!uniqueCode) {
            return res.status(404).send({ message: 'Invalid or not scanned QR code.' });
        }

        const otpEntry = await OTP.findOne({ mobile_number });
        if (otpEntry) {
            return res.status(400).send({ message: 'Mobile number is not verified.' });
        }

        let user = await User.findOne({ mobile_number });

        if (!user) {
            // Register the user if they don't exist
            const registerResponse = await authController.registerUser({ body: { name, mobile_number, location } });
            if (registerResponse.status !== 200) {
                return res.status(registerResponse.status).send({ message: registerResponse.message });
            }
            user = registerResponse.data;
        }

        const winning = new Winning({
            user_id: user._id,
            unique_code_id: uniqueCode._id,
            prize: uniqueCode.prize,
        });
        await winning.save();

        uniqueCode.status = 'used';
        await uniqueCode.save();

        const loginResponse = await authController.loginUser({ body: { mobile_number } });
        if (loginResponse.status !== 200) {
            return res.status(loginResponse.status).send({ message: loginResponse.message });
        }
        const token = loginResponse.data.accessToken;

        res.status(200).send({
            message: 'Form filled successfully, user registered and logged in.',
            token: token,
            user: {
                id: user._id,
                name: user.name,
                mobile_number: user.mobile_number,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};


const redeemWinnings = async (req, res) => {
    try {
        const { uniqueCodeId } = req.body;

        const winningRecord = await Winning.findOneAndUpdate(
            { unique_code_id: uniqueCodeId },
            { redemption_status: 'redeemed' },
            { new: true }
        );

        if (!winningRecord) {
            return res.status(404).send({ message: 'Winning record not found.' });
        }

        res.status(200).send({ message: 'Winnings redeemed successfully.', winningRecord });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

const viewProfile = async (req, res) => {
    try {
        const userId = req.userId;

        const userProfile = await User.findById(userId);

        if (!userProfile) {
            return res.status(404).send({ message: 'User profile not found.' });
        }

        res.status(200).send({ message: 'User profile fetched successfully.', userProfile });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

const editProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const { name, mobile_number, location } = req.body;

        const updatedUserProfile = await User.findByIdAndUpdate(
            userId,
            { name, mobile_number, location },
            { new: true }
        );

        if (!updatedUserProfile) {
            return res.status(404).send({ message: 'User profile not found.' });
        }

        res.status(200).send({ message: 'User profile updated successfully.', updatedUserProfile });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};


const viewWinnings = async (req, res) => {
    try {
        const winnings = await Winning.find({ user_id: req.userId });

        if (winnings.length === 0) {
            return res.status(404).send({ message: 'No winnings found for this user.' });
        }

        res.status(200).send({ winnings });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

module.exports = {
    getCodesAndPrizes,
    scanQRCode,
    spinToWin,
    fillForm,
    redeemWinnings,
    viewProfile,
    editProfile,
    viewWinnings
};
