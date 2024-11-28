const express = require('express');
const router = express.Router();
const Order = require('../../models/Order');


const User = require('../../models/User');
const Product = require('../../models/Product');
const jwt = require('jsonwebtoken');


router.get('/', async (req, res) => {
    try {
      const products = await Product.find();  
  
      
      res.render('home', { products });  
    } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching products');
    }
  });

  router.get('/product/:id', async (req, res) => {
    const productId = req.params.id;
  
    try {
      const product = await Product.findById(productId); 
      if (!product) {
        return res.status(404).send('Product not found');
      }
      res.render('productDetail', { product }); 
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).send('Error fetching product');
    }
  });


router.get('/register', (req, res) => {
  res.render('register');  
});


router.get('/tos', (req, res) => {
  res.render('ToS');  
});


router.get('/usage-policy', (req, res) => {
  res.render('up');  
});


router.post('/register', async (req, res) => {
  const { name, email, password, mobileNumber, role } = req.body;

  try {
    
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).send('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      mobileNumber,
      role,
    });

    await newUser.save();
    res.redirect('/login');  
  } catch (error) {
    console.error(error);
    res.status(500).send('Error during registration');
  }
});


router.get('/login', (req, res) => {
  res.render('login');  
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send('User not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send('Invalid credentials');
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    
    res.cookie('token', token);
    res.redirect('/profile');
  } catch (error) {
    console.error(error);
    res.status(500).send('Login failed');
  }
});


router.get('/vendor-dashboard', async (req, res) => {
  try {
    res.render('vendor-dashboard');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Error accessing the dashboard');
  }
});

router.get('/logout', (req, res) => {
  res.redirect('/login');
});


router.get('/vendor-dashboard-api', async (req, res) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (user.role !== 'vendor') {
      return res.status(403).json({ message: 'Access denied' });
    }

    
    const orders = await Order.find({ vendor: user._id })
      .populate('product')
      .populate('customer');

    
    let totalSales = 0;
    let salesPerProduct = {};

    orders.forEach(order => {
      totalSales += order.totalPrice; 

      
      if (salesPerProduct[order.product._id]) {
        salesPerProduct[order.product._id].sales += order.totalPrice;
        salesPerProduct[order.product._id].quantity += order.quantity;
      } else {
        salesPerProduct[order.product._id] = {
          product: order.product,
          sales: order.totalPrice,
          quantity: order.quantity
        };
      }
    });

    res.json({
      orders,
      totalSales,
      salesPerProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Could not fetch vendor dashboard data' });
  }
});

router.get('/profile', async (req, res) => {
    res.render('user-profile');
  });

  router.get('/donate', async (req, res) => {
    res.render('donation');
  });

  router.get('/profile/getdata', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]; 
  
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' }); 
    }
  
    try {
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      
      const orders = await Order.find({ customer: user._id, status: { $ne: 'canceled' } }) 
        .populate('product');
  
      
      res.json({ user, orders });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Could not fetch profile data' });
    }
  });

  router.get('/profile/getdata', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]; 
  
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' }); 
    }
  
    try {
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      
      const orders = await Order.find({ customer: user._id, status: { $ne: 'canceled' } }) 
        .populate('product');
  
      
      res.json({ user, orders });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Could not fetch profile data' });
    }
  });    


router.post('/cart/add', (req, res) => {
    const { productId, name, price, quantity, image } = req.body;
  
    let cart = req.cookies.cart || [];
  
    const existingProductIndex = cart.findIndex(item => item.productId === productId);
    if (existingProductIndex !== -1) {
      cart[existingProductIndex].quantity += quantity;
    } else {
      cart.push({ productId, name, price, quantity, image });
    }
  
    res.cookie('cart', cart, { maxAge: 86400000 }); 
    res.json({ message: 'Product added to cart', cart });
  });
  
  
  router.get('/cart', (req, res) => {
    const cart = req.cookies.cart || [];
    res.render('cart', { cart }); 
  });
  
  
  router.get('/checkout', (req, res) => {
    const cart = req.cookies.cart || [];
    if (cart.length === 0) {
      return res.redirect('/cart'); 
    }
    res.render('checkout', { cart }); 
  });
  
  
  router.post('/checkout', async (req, res) => {
    const cart = req.cookies.cart || [];
    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const userId = req.user.id;
  
    try {
      const newOrder = new Order({
        customer: userId,
        items: cart,
        totalAmount,
        status: 'Pending', 
      });
  
      await newOrder.save();
      res.clearCookie('cart'); 
  
      res.json({ message: 'Order created successfully', order: newOrder });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error creating order');
    }
  });

  
router.post('/profile/cancel-order/:orderId', async (req, res) => {
  const orderId = req.params.orderId;
  const token = req.headers.authorization?.split(' ')[1]; 

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' }); 
  }

  try {
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.customer.toString() !== user._id.toString()) {
      return res.status(403).json({ error: 'You are not authorized to cancel this order' });
    }

    
    order.status = 'canceled';
    await order.save();

    res.json({ success: true, message: 'Order cancelled successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not cancel the order' });
  }
});


router.use((req, res) => {
  res.status(404).render('404');  
});

router.post('/donate/confirm', async (req, res) => {
  const { amount, transactionId } = req.body;
  const token = req.headers.authorization?.split(' ')[1]; 

  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' }); 
  }

  
  if (!amount || !transactionId) {
    return res.status(400).json({ error: 'Donation amount and transaction ID are required' });
  }

  try {
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;  

    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    
    const newDonation = new Donation({
      user: userId,  
      amount,
      transactionId,
    });

    await newDonation.save();  

    
    res.json({
      message: `Thank you for your donation of ₹${amount}. Your transaction ID is ${transactionId}.`,
      donation: newDonation,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while processing your donation' });
  }
});

module.exports = router;