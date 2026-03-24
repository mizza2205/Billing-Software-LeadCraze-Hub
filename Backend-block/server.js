const express = require('express'); // API server banane ke liye
const bcrypt = require('bcrypt'); // password hash karne ke liye
const db = require('./db'); // database connection
const jwt = require('jsonwebtoken'); // token generate karne ke liye
const cors = require('cors'); // frontend connect ke liye
const app = express();

//  FIX: CORS enable (IMPORTANT)
app.use(cors());

// JSON data read
app.use(express.json());


// ================== STEP 0: TEST ==================

// server check
app.get('/', (req, res) => {
  res.send('Server running ');
});

// DB check
app.get('/test-db', (req, res) => {
  db.query('SELECT 1', (err, result) => {
    if (err) return res.send(err);
    res.send('DB Connected ');
  });
});


// ================== STEP 1: SIGNUP ==================

app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // check email exist
    const checkSql = 'SELECT * FROM users WHERE email = ?';
    db.query(checkSql, [email], async (err, result) => {
      if (err) return res.status(500).json({ error: err });

      if (result.length > 0) {
        return res.status(400).json({ message: 'Email already exists ❌' });
      }

      // password hash
      const hashedPassword = await bcrypt.hash(password, 10);

      // insert user
      const insertSql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
      db.query(insertSql, [name, email, hashedPassword], (err, result) => {
        if (err) return res.status(500).json({ error: err });

        res.json({ message: 'Signup successful 🎉' });
      });
    });

  } catch (err) {
    res.status(500).json({ error: err });
  }
});


// ================== STEP 2: LOGIN ==================

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM users WHERE email = ?';

  db.query(sql, [email], async (err, result) => {
    if (err) return res.status(500).json({ error: err });

    if (result.length === 0) {
      return res.status(404).json({ message: 'User not found ' });
    }

    const user = result[0];

    // password compare
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Wrong password ' });
    }

    // token generate
    const token = jwt.sign(
      { id: user.id, email: user.email },
      'secretkey',
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Login successful ',
      token: token
    });
  });
});


// ================== STEP 3: SERVER ==================

app.listen(5000, () => {
  console.log('Server running on port 5000 ');
});