const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const sendEmail = require('../services/emailService');

exports.createOrder = async (req, res) => {
  try {
    const { cart, totalPrice, userID } = req.body; 

    
    if (!userID || userID.length === 0) {
      return res.status(400).json({ message: 'Mobile number (userID) is required' });
    }

    
    if (!cart || cart.length === 0) {
      return res.status(400).json({ message: 'Cart cannot be empty' });
    }

    let totalOrderPrice = 0; 

    
    for (const item of cart) {
      const { productId, quantity, price } = item;

      
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      
      if (product.stock < quantity) {
        return res.status(400).json({ message: 'Not enough stock available' });
      }

      
      const newOrder = new Order({
        product: productId,
        customer: userID, 
        vendor: product.vendor,
        quantity,
        totalPrice: price * quantity, 
        status: 'pending', 
      });

      
      product.stock -= quantity;
      await product.save();

      
      await newOrder.save();

      
      const vendor = await User.findById(product.vendor);
      if (vendor && vendor.email) {
        await sendEmail(vendor.email, `New Order notification`, `You have received a new order of ${product.name} from ${userID}`);
      }

      
      totalOrderPrice += price * quantity;
    }

    
    res.status(201).json({ message: 'Order created successfully', totalPrice: totalOrderPrice });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};


exports.getOrdersForUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    let orders;
    if (role === 'customer') {
      
      orders = await Order.find({ customer: userId }).populate('product').populate('vendor');
    } else if (role === 'vendor') {
      
      orders = await Order.find({ vendor: userId }).populate('product').populate('customer');
    } else {
      return res.status(400).json({ message: 'Invalid role' });
    }

    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    const userId = req.user.id;
    const role = req.user.role;

    
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    
    if (role === 'vendor' && order.vendor.toString() !== userId) {
      return res.status(403).json({ message: 'You are not authorized to update this order' });
    }

    
    order.status = status;
    await order.save();

    res.status(200).json({ message: 'Order status updated successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
