const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  transactionId: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const Donation = mongoose.model('Donation', donationSchema);

module.exports = Donation;
