const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // apna password daal agar hai
  database: "billing_system",
});

db.connect((err) => {
  if (err) {
    console.log("DB Error:", err);
  } else {
    console.log("MySQL Connected");
  }
});

// ---------------- SIGNUP ----------------
app.post("/signup", (req, res) => {
  const { name, email, password } = req.body;

  const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

  db.query(sql, [name, email, password], (err, result) => {
    if (err) {
      res.send({ message: "Error" });
    } else {
      res.send({ message: "User registered successfully" });
    }
  });
});

// ---------------- LOGIN ----------------
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ? AND password = ?";

  db.query(sql, [email, password], (err, result) => {
    if (err) {
      res.send({ message: "Error" });
    } else {
      if (result.length > 0) {
        res.send({ message: "Login successful" });
      } else {
        res.send({ message: "Invalid email or password" });
      }
    }
  });
});

// ---------------- OTP SYSTEM ----------------
let generatedOTP = "";

// SEND OTP
app.post("/send-otp", async (req, res) => {
  const { email } = req.body;

  generatedOTP = Math.floor(1000 + Math.random() * 9000).toString();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "YOUR_EMAIL@gmail.com", // 👈 apna gmail
      pass: "YOUR_APP_PASSWORD", // 👈 app password
    },
  });

  try {
    await transporter.sendMail({
      from: "YOUR_EMAIL@gmail.com",
      to: email,
      subject: "Your OTP",
      text: `Your OTP is ${generatedOTP}`,
    });

    res.send({ message: "OTP sent to email" });
  } catch (error) {
    console.log(error);
    res.send({ message: "Error sending OTP" });
  }
});

// VERIFY OTP
app.post("/verify-otp", (req, res) => {
  const { otp } = req.body;

  if (otp === generatedOTP) {
    res.send({ message: "OTP Verified" });
  } else {
    res.send({ message: "Invalid OTP" });
  }
});

// ---------------- SERVER ----------------
app.listen(5000, () => {
  console.log("Server running on port 5000");
});