const express = require('express');
const Product = require('../../models/Product');
const authMiddleware = require('../../middleware/authMiddleware');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const path = require('path');
const fs = require('fs');  
const router = express.Router();


const storage = multer.memoryStorage();  
const upload = multer({ storage: storage });  


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});


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
      
      cloudinary.uploader.upload_stream({
        folder: 'products',  
        width: 800,  
        height: 800,
        crop: 'scale',  
      }, async (error, result) => {
        if (error) {
          return res.status(500).json({ message: 'Error uploading image to Cloudinary' });
        }

        
        imageUrl = result.secure_url;  

        
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
      }).end(req.file.buffer);  
    } else {
      
      const product = new Product({
        name,
        description,
        price,
        stock,
        image: '',  
        vendor: req.user.id,  
      });

      
      await product.save();
      res.status(201).json({ message: 'Product added successfully without image', product });
    }
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
