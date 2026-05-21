import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';
import { enrichOrder, canCancelOrder, ORDER_STATUSES } from '../utils/orderHelpers.js';

const pushStatusHistory = (order, status, note = '') => {
  order.statusHistory = order.statusHistory || [];
  order.statusHistory.push({ status, note, updatedAt: new Date() });
};

// @desc    Create order
// @route   POST /api/orders
export const addOrderItems = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, couponCode } = req.body;
  if (!orderItems?.length) {
    res.status(400);
    throw new Error('No order items');
  }

  let itemsPrice = 0;
  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    if (!product || product.countInStock < item.qty) {
      res.status(400);
      throw new Error(`Insufficient stock for ${item.name}`);
    }
    itemsPrice += product.price * item.qty;
  }

  const shippingPrice = itemsPrice > 500 ? 0 : 49;
  const taxPrice = Number((0.18 * itemsPrice).toFixed(2));
  let discountAmount = 0;

  if (couponCode) {
    const coupon = await Coupon.findOne({
      code: couponCode.toUpperCase(),
      isActive: true,
      expiresAt: { $gt: new Date() },
    });
    if (coupon && coupon.usedCount < coupon.maxUses && itemsPrice >= coupon.minOrderAmount) {
      discountAmount = Number(((itemsPrice * coupon.discountPercent) / 100).toFixed(2));
      coupon.usedCount += 1;
      await coupon.save();
    }
  }

  const totalPrice = itemsPrice + shippingPrice + taxPrice - discountAmount;

  const order = await Order.create({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    discountAmount,
    couponCode: couponCode || '',
    totalPrice,
    status: 'processing',
    statusHistory: [{ status: 'processing', note: 'Order placed' }],
  });

  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    product.countInStock -= item.qty;
    await product.save();
  }

  res.status(201).json(enrichOrder(order));
});

// @desc    Get order by id
// @route   GET /api/orders/:id
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email phone');
  if (order) {
    if (order.user._id.toString() === req.user._id.toString() || req.user.isAdmin) {
      res.json(enrichOrder(order));
    } else {
      res.status(403);
      throw new Error('Not authorized');
    }
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get logged in user orders (with cancel eligibility)
// @route   GET /api/orders/myorders
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ updatedAt: -1 });
  res.json(orders.map(enrichOrder));
});

// @desc    Get all orders (admin) — full customer & payment details
// @route   GET /api/orders
export const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate('user', 'name email phone address')
    .sort({ createdAt: -1 });
  res.json(orders.map(enrichOrder));
});

// @desc    Cancel order (user, within 2 hours)
// @route   PUT /api/orders/:id/cancel
export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  if (order.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }
  if (!canCancelOrder(order)) {
    res.status(400);
    throw new Error('Order cannot be cancelled. Window is 2 hours after placing, and order must not be shipped.');
  }

  for (const item of order.orderItems) {
    const product = await Product.findById(item.product);
    if (product) {
      product.countInStock += item.qty;
      await product.save();
    }
  }

  order.status = 'cancelled';
  order.cancelledAt = new Date();
  pushStatusHistory(order, 'cancelled', 'Cancelled by customer');
  const updated = await order.save();
  res.json(enrichOrder(updated));
});

// @desc    Update order status (admin)
// @route   PUT /api/orders/:id/status
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, note } = req.body;
  if (!ORDER_STATUSES.includes(status)) {
    res.status(400);
    throw new Error('Invalid status');
  }

  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.status = status;
  pushStatusHistory(order, status, note || `Status updated to ${status}`);

  if (status === 'delivered') {
    order.isDelivered = true;
    order.deliveredAt = new Date();
  }
  if (status === 'cancelled') {
    order.cancelledAt = new Date();
  }

  const updated = await order.save();
  const populated = await Order.findById(updated._id).populate('user', 'name email phone');
  res.json(enrichOrder(populated));
});

export const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    if (req.body.status) order.status = req.body.status;
    const updated = await order.save();
    res.json(enrichOrder(updated));
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});
