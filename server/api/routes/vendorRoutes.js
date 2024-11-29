const express = require('express');
const Product = require('../../models/Product');
const authMiddleware = require('../../middleware/authMiddleware');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const path = require('path');
const fs = require('fs');  
const router = express.Router();


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'server/uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});

const upload = multer({ storage: storage });


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


router.post('/manage-products', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;

    let imageUrl = '';

    
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'products', 
        width: 800,  
        height: 800,
        crop: 'scale'
      });
      imageUrl = result.secure_url;  

      
      fs.unlinkSync(req.file.path);  
      console.log(`Deleted local file: ${req.file.path}`);
    }

    
    const product = new Product({
      name,
      description,
      price,
      stock,
      image: imageUrl,  
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
