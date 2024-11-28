const express = require('express');
const Product = require('../models/Product');
const authMiddleware = require('../middleware/authMiddleware'); 
const router = express.Router();

router.get('/inventory', (req, res) => {
  res.render('inventory');
});


router.get('/manage-products', authMiddleware, async (req, res) => {
  try {
    const vendorId = req.user.id; 
    const products = await Product.find({ vendor: vendorId });
    res.json({ products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching products' });
  }
});


router.post('/manage-products', authMiddleware, async (req, res) => {
  try {
    const { name, description, price, stock, image } = req.body;
    const product = new Product({
      name,
      description,
      price,
      stock,
      image,
      vendor: req.user.id, 
    });
    await product.save();
    res.status(201).json({ message: 'Product added successfully', product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding product' });
  }
});


router.post('/update-stock/:id', authMiddleware, async (req, res) => {
  try {
    const { stock } = req.body;
    const product = await Product.findByIdAndUpdate(req.params.id, { stock }, { new: true });
    res.json({ message: 'Stock updated successfully', product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating stock' });
  }
});

module.exports = router;
