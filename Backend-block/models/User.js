
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true},
  password: String,
  phone :{type: String,unique: true},
  otp:String,
  otpExpires:Date
});

const user = mongoose.model("User", userSchema);

module.exports = user
