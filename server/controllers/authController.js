// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const registerUser = async (req, res) => {
  console.log('⭐ Register attempt:', req.body);
  try {
    const { name, email, password, role } = req.body;

    console.log('📝 Checking for existing user with email:', email);
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      console.log('❌ User already exists');
      return res.status(400).json({ message: 'User already exists' });
    }

    if (role === 'admin') {
      console.log('❌ Attempted admin registration');
      return res.status(403).json({ message: 'Admin cannot self-register' });
    }

    console.log('🔒 Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log('👤 Creating new user with role:', role);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    console.log('✅ User created successfully:', user.id);
    res.status(201).json({
      message: 'Registration successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
    });
  } catch (err) {
    console.error('❌ Registration error:', err);
    res.status(500).json({ message: err.message, stack: err.stack });
  }
};

const loginUser = async (req, res) => {
  console.log('🔑 Login attempt:', { email: req.body.email });
  try {
    const { email, password } = req.body;

    console.log('🔍 Finding user...');
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log('❌ User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('🔒 Verifying password...');
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      console.log('❌ Invalid password');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('📝 Generating JWT token...');
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    console.log('✅ Login successful for user:', user.id);
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
    });
  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ message: err.message, stack: err.stack });
  }
};

const getProfile = async (req, res) => {
  console.log('👤 Getting profile for user:', req.user.id);
  res.json(req.user);
};

module.exports = {
  registerUser,
  loginUser,
  getProfile
};
