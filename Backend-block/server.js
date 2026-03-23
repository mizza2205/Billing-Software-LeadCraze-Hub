const express = require('express');
const bcrypt = require('bcrypt');
const db = require('./db');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

// test route
app.get('/', (req, res) => {
  res.send('Server running ');
});

// DB test
app.get('/test-db', (req, res) => {
  db.query('SELECT 1', (err, result) => {
    if (err) return res.send(err);
    res.send('DB Connected done here');
  });
});


app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM users WHERE email = ?';

  db.query(sql, [email], async (err, result) => {
    if (err) return res.send(err);

    if (result.length === 0) {
      return res.send('User not found ');
    }

    const user = result[0];

    // password compare
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.send('Wrong password ');
    }

    // JWT token generate
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


app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // password hash
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';

    db.query(sql, [name, email, hashedPassword], (err, result) => {
      if (err) return res.send(err);

      res.send('User created (secure) ');
    });

  } catch (err) {
    res.send(err);
  }
});
app.listen(5000, () => {
  console.log('Server running on port 5000');
});