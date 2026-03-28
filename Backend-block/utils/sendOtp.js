// utils/sendOtp.js
require('dotenv').config(); // ensure env loaded

const twilio = require('twilio');

// ✅ initialize with SID + Auth Token
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

async function sendOtp(phone, otp) {
  try {
    const message = await client.messages.create({
      body: `Your OTP is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone
    });
    console.log("OTP sent:", message.sid);
  } catch (err) {
    console.error("Error Sending OTP:", err);
    throw err;
  }
}

module.exports = sendOtp;