const Order = require('../models/Order');
const Product = require('../models/Product');


exports.getVendorDashboard = async (req, res) => {
  try {
    const vendorId = req.user.id; 
    const orders = await Order.find({ vendor: vendorId })
      .populate('product')
      .populate('customer', 'name mobileNumber'); 
    
    let totalSales = 0;
    let totalProfit = 0;

    
    orders.forEach(order => {
      totalSales += order.totalPrice;
      totalProfit += (order.quantity * order.product.price) - order.totalPrice; 
    });

    res.json({ orders, totalSales, totalProfit });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
