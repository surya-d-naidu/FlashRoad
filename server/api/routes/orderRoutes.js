const express = require('express');
const { createOrder, getOrdersForUser, updateOrderStatus } = require('../../controllers/orderController');
const authMiddleware = require('../../middleware/authMiddleware');
const router = express.Router();

router.post('/create', authMiddleware, createOrder);

router.get('/', authMiddleware, getOrdersForUser);

router.put('/update-status', authMiddleware, updateOrderStatus);

module.exports = router;
