const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const sendOtp = require('../utils/sendOtp');

// ===== REQUEST OTP =====
router.post('/request-otp', async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: "Phone number required" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 min expiry

    let user = await User.findOne({ phone });
    if (!user) {
      user = new User({ phone, otp, otpExpires });
    } else {
      user.otp = otp;
      user.otpExpires = otpExpires;
    }

    await user.save();          // OTP saved in DB
    await sendOtp(phone, otp);  // OTP sent via Twilio

    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ===== VERIFY OTP =====
router.post('/verify-otp', async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) return res.status(400).json({ message: "Phone & OTP required" });

    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otp !== otp) return res.status(401).json({ message: "Invalid OTP" });
    if (user.otpExpires < new Date()) return res.status(401).json({ message: "OTP expired" });

    // Nullify OTP after successful verification
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ id: user._id, phone: user.phone }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: "OTP verified successfully", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;