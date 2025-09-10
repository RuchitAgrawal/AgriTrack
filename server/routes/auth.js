const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const {
      username,
      type,
      address,
      aadhar,
      walletId,
      password
    } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({
      $or: [{ username }, { aadhar }, { walletId }]
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'User already exists with this username, aadhar, or wallet ID'
      });
    }

    // Generate wallet ID if not provided
    const finalWalletId = walletId || `wallet_${type}_${Date.now()}`;

    // Create new user
    const user = new User({
      username,
      password,
      role: type,
      address,
      aadhar,
      walletId: finalWalletId
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        address: user.address,
        aadhar: user.aadhar,
        walletId: user.walletId
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      message: 'Server error during registration',
      error: error.message
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { aadhar, password } = req.body;
    
    console.log('Login attempt for aadhar:', aadhar);

    // Check if user exists by aadhar number
    const user = await User.findOne({ aadhar });
    if (!user) {
      console.log('User not found with aadhar:', aadhar);
      return res.status(400).json({ 
        success: false,
        message: 'Invalid credentials - user not found' 
      });
    }

    console.log('User found:', user.username, 'Role:', user.role);

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('Password mismatch for user:', user.username);
      return res.status(400).json({ 
        success: false,
        message: 'Invalid credentials - password mismatch' 
      });
    }

    // Generate token
    const token = generateToken(user._id);

    console.log('Login successful for user:', user.username, 'Role:', user.role);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        address: user.address,
        aadhar: user.aadhar,
        walletId: user.walletId
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      message: 'Server error during login',
      error: error.message
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update other allowed fields
    const allowedUpdates = ['username', 'address'];
    allowedUpdates.forEach(field => {
      if (updates[field]) {
        user[field] = updates[field];
      }
    });

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      message: 'Server error during profile update',
      error: error.message
    });
  }
});

// @route   GET /api/auth/users
// @desc    Get all users (Admin only)
// @access  Private
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    
    res.json({
      success: true,
      users
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      message: 'Server error while fetching users',
      error: error.message
    });
  }
});

module.exports = router;
