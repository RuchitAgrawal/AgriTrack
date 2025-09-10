const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [30, 'Username cannot exceed 30 characters']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    enum: ['farmer', 'distributor', 'retailer'],
    lowercase: true
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  aadhar: {
    type: String,
    required: [true, 'Aadhar number is required'],
    unique: true,
    match: [/^[0-9]{12}$/, 'Please enter a valid 12-digit Aadhar number']
  },
  walletId: {
    type: String,
    required: true,
    unique: true
  },
  isVerified: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

const User = mongoose.model('User', userSchema);

// Clean up any problematic email index on first connection
setTimeout(async () => {
  try {
    await User.collection.dropIndex('email_1');
    console.log('Dropped problematic email index');
  } catch (error) {
    // Index might not exist, ignore error
    console.log('Email index not found or already dropped');
  }
}, 1000);

module.exports = User;
