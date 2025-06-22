const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();
const users = []; // in-memory temporary user storage

// Register
router.post('/register', async (req, res) => {
  const { fullName, email, password } = req.body;

  const userExists = users.find(u => u.email === email);
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ fullName, email, password: hashedPassword });

  res.status(201).json({ message: 'User registered successfully' });
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  res.json({ message: 'Login successful', token });
});

module.exports = router;
