const crypto = require('crypto');
exports.generateOtp = (email, length = 6) => {
  const otp = crypto.randomBytes(length).toString('hex').slice(0, length); // يولد OTP عشوائي
    if (otp.length !== length) {
        console.error("Error: OTP length mismatch");
    }
    return otp;
};


