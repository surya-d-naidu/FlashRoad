const mongoose = require('mongoose');
const Product = require('./models/Product');  // Adjust the path if necessary

// Connect to MongoDB
mongoose.connect('mongodb+srv://helio-fos:r2lOyiV07IqjtY85@flashroad.vd84a.mongodb.net/?retryWrites=true&w=majority&appName=Flashroad', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
    
    // Create test products
    const testProducts = [
      {
        name: 'Product 1',
        description: 'This is a description for product 1.',
        price: 100,
        stock: 50,
        vendor: new mongoose.Types.ObjectId('6744b72afa95961b518f8548'),  // Use 'new' to create ObjectId
        image: 'https://imgs.search.brave.com/ASCt6lXOYqXFcm8aQgN3JJJKvbRqmv8G8Eo3PY0-Z5o/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdC5k/ZXBvc2l0cGhvdG9z/LmNvbS8xODQzNjMx/LzIxMzYvdi8zODAv/ZGVwb3NpdHBob3Rv/c18yMTM2NjAyNS1z/dG9jay12aWRlby1t/b2Rlcm4tbWVkaXRl/cnJhbmVhbi1oZWFs/dGh5LWZvb2QuanBn',
      },
      {
        name: 'Product 2',
        description: 'This is a description for product 2.',
        price: 200,
        stock: 30,
        vendor: new mongoose.Types.ObjectId('6744b72afa95961b518f8548'),  // Use 'new' to create ObjectId
        image: 'https://imgs.search.brave.com/KBHn5ocYlHz8I7KyvPtUXPteSx_AJCvRnFPkqAPMX3I/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9kMW8y/cHdmbGluZTRndS5j/bG91ZGZyb250Lm5l/dC9tL3QvMTA5Ni85/MDg2NDA5L2EtMDEy/MC5qcGc',
      },
      {
        name: 'Product 3',
        description: 'This is a description for product 3.',
        price: 150,
        stock: 20,
        vendor: new mongoose.Types.ObjectId('6744b72afa95961b518f8548'),  // Use 'new' to create ObjectId
        image: 'https://depositphotos.com/stock-footage/healthy-food.html',
      },
    ];

    // Insert multiple products into the database
    Product.insertMany(testProducts)
      .then((products) => {
        console.log('Test products added:', products);
        mongoose.connection.close();  // Close the connection after inserting the products
      })
      .catch((error) => {
        console.error('Error adding products:', error);
        mongoose.connection.close();
      });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
