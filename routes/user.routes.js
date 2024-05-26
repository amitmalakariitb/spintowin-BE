const express = require('express');
const router = express.Router();
const authJwt = require('../middleware/authJwt');
const userController = require('../controllers/user.controller');
const otpController = require('../controllers/otp.controller');


router.get('/codes', userController.getCodesAndPrizes);
router.post('/scan-qr-code', userController.scanQRCode);
router.post('/spin-to-win', userController.spinToWin);
router.post('/fill-form', userController.fillForm);
router.post('/send-otp', otpController.sendOTP);
router.post('/verify-otp', otpController.verifyOTP);
router.post('/redeem-winnings', authJwt.verifyToken, userController.redeemWinnings);
router.get('/profile', authJwt.verifyToken, userController.viewProfile);
router.put('/profile', authJwt.verifyToken, userController.editProfile);
router.get('/winning-page', authJwt.verifyToken, userController.viewWinnings);

module.exports = router;
