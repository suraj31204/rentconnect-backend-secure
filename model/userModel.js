const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  userType: {
    type: String,
    enum: ['guest', 'Car Owner', 'Driver', 'Admin'],
    required: true
  },

  // 🔥 RAZORPAY PAYOUT FIELDS (ADDED)
  razorpayContactId: { type: String },
  razorpayFundAccountId: { type: String },


  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);