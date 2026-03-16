const express = require("express");
const cors = require("cors");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("Billing Software Backend Running 🚀");
});

// example API
app.get("/api/test", (req, res) => {
  res.json({ message: "API working successfully" });
});

// server start
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});