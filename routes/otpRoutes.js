const express = require('express');
const router = express.Router();
const otpController = require('../Controllers/otpController');
router.post('/send', otpController.sendOtp);
router.post('/verify', otpController.verifyOtp);

module.exports = router;
