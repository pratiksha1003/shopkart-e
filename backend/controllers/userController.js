import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Order from '../models/Order.js';
import generateToken from '../utils/generateToken.js';
import { enrichOrder } from '../utils/orderHelpers.js';

// @desc    Register user
// @route   POST /api/users/register
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) {
    res.status(400);
    throw new Error('User already exists');
  }
  const user = await User.create({ name, email, password });
  const token = generateToken(user._id);
  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    token,
  });
});

// @desc    Login user
// @route   POST /api/users/login
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (user && (await user.matchPassword(password))) {
    const token = generateToken(user._id);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      avatar: user.avatar,
      token,
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist');
  res.json(user);
});

// @desc    Update user profile
// @route   PUT /api/users/profile
export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone ?? user.phone;
    user.avatar = req.body.avatar ?? user.avatar;
    if (req.body.address) user.address = { ...user.address, ...req.body.address };
    if (req.body.password) user.password = req.body.password;
    const updated = await user.save();
    res.json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      phone: updated.phone,
      address: updated.address,
      avatar: updated.avatar,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get all users (admin)
// @route   GET /api/users
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password');
  const enriched = await Promise.all(
    users.map(async (u) => {
      const orderCount = await Order.countDocuments({ user: u._id });
      const totalSpent = await Order.aggregate([
        { $match: { user: u._id, status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } },
      ]);
      return {
        ...u.toObject(),
        orderCount,
        totalSpent: totalSpent[0]?.total || 0,
      };
    })
  );
  res.json(enriched);
});

// @desc    Get user full details for admin (orders, addresses, products)
// @route   GET /api/users/:id/admin-details
export const getUserAdminDetails = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  const orders = await Order.find({ user: user._id })
    .sort({ createdAt: -1 })
    .populate('orderItems.product', 'name slug images');

  const purchasedProducts = [];
  orders.forEach((o) => {
    o.orderItems.forEach((item) => {
      purchasedProducts.push({
        orderId: o._id,
        orderDate: o.createdAt,
        name: item.name,
        qty: item.qty,
        price: item.price,
        image: item.image,
      });
    });
  });

  res.json({
    user,
    orders: orders.map(enrichOrder),
    purchasedProducts,
    stats: {
      totalOrders: orders.length,
      totalSpent: orders.filter((o) => o.status !== 'cancelled').reduce((a, o) => a + o.totalPrice, 0),
      cancelledOrders: orders.filter((o) => o.status === 'cancelled').length,
    },
  });
});

// @desc    Delete user (admin)
// @route   DELETE /api/users/:id
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error('Cannot delete admin user');
    }
    await user.deleteOne();
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user (admin)
// @route   PUT /api/users/:id
export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = req.body.isAdmin ?? user.isAdmin;
    const updated = await user.save();
    res.json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      isAdmin: updated.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Toggle wishlist
// @route   POST /api/users/wishlist/:productId
export const toggleWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const productId = req.params.productId;
  const index = user.wishlist.indexOf(productId);
  if (index > -1) {
    user.wishlist.splice(index, 1);
  } else {
    user.wishlist.push(productId);
  }
  await user.save();
  const populated = await User.findById(user._id).populate('wishlist');
  res.json(populated.wishlist);
});

// @desc    Add recently viewed
// @route   POST /api/users/recent/:productId
export const addRecentlyViewed = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const productId = req.params.productId;
  user.recentlyViewed = user.recentlyViewed.filter((id) => id.toString() !== productId);
  user.recentlyViewed.unshift(productId);
  user.recentlyViewed = user.recentlyViewed.slice(0, 10);
  await user.save();
  const populated = await User.findById(user._id).populate('recentlyViewed');
  res.json(populated.recentlyViewed);
});
