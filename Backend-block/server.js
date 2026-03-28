require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User.js'); 
const authRoutes = require('./routes/auth');

const app = express();

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json());

// DB Connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB connection error:", err));


// ====== TEST ROUTE ======
app.get('/', (req, res) => {
  res.send('Server running');
});

// ====== SIGNUP ======
app.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.json({ message: 'Signup successful' });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

// ====== LOGIN ======
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Wrong password' });

    // Generate token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ message: 'Login successful', token });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

// ====== VERIFY TOKEN ======
function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];
  if (!bearerHeader) return res.status(403).json({ message: 'Token required' });

  const token = bearerHeader.split(' ')[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Invalid token' });

    req.user = decoded;
    next();
  });
}

// ====== PROTECTED ROUTE ======
app.get('/profile', verifyToken, (req, res) => {
  res.json({ message: 'User profile data', user: req.user });
});

// ====== AUTH ROUTES ======
app.use('/api/auth', authRoutes);

// ====== SERVER ======
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  //console.log("Mongo URI:", process.env.MONGO_URI);
});