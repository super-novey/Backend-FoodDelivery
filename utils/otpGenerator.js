const generateOtp = () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // OTP 6 chữ số
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // Hết hạn sau 10 phút
    return { otp, otpExpires };
  };
  
module.exports = { generateOtp };