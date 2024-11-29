const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['vendor'], default: 'vendor' },
  mobileNumber: { type: String, required: true },  
  emailVerified: { type: Boolean, default: false },
  emailVerificationToken: { type: String },
  banned: { type: Boolean, default: false },  
});

module.exports = mongoose.model('User', userSchema);