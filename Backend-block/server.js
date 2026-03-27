require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const mongoose = require('mongoose');


const User = require('./models/User.js'); 

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// ================== DB CONNECT ==================

mongoose.connect('mongodb+srv://admin:billing123@cluster0.thv9zpf.mongodb.net/billing_db')

.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

// ================== TEST ==================

app.get('/', (req, res) => {
  res.send('Server running');
});

// ================== SIGNUP (FIXED) ==================

app.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // save user
    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    res.json({ message: 'Signup successful' });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});


// ================== LOGIN (FIXED) ==================

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Wrong password' });
    }

    // generate token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Login successful',
      token
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

// ================== VERIFY TOKEN ==================

function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];

  if (!bearerHeader) {
    return res.status(403).json({ message: 'Token required' });
  }

  const token = bearerHeader.split(' ')[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = decoded;
    next();
  });
}

// ================== PROTECTED ROUTE ==================

app.get('/profile', verifyToken, (req, res) => {
  res.json({
    message: "User profile data",
    user: req.user
  });
});

// ================== SERVER ==================

app.listen(4000, () => {
  console.log('Server running on port 4000');
});