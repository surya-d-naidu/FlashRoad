const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true, min: [0, 'Stock cannot be negative'] }, 
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  image: { type: String },  
});

module.exports = mongoose.model('Product', productSchema);

