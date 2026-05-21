import asyncHandler from 'express-async-handler';
import Coupon from '../models/Coupon.js';

export const validateCoupon = asyncHandler(async (req, res) => {
  const { code, orderAmount } = req.body;
  const coupon = await Coupon.findOne({
    code: code.toUpperCase(),
    isActive: true,
    expiresAt: { $gt: new Date() },
  });
  if (!coupon) {
    res.status(404);
    throw new Error('Invalid or expired coupon');
  }
  if (coupon.usedCount >= coupon.maxUses) {
    res.status(400);
    throw new Error('Coupon usage limit reached');
  }
  if (orderAmount < coupon.minOrderAmount) {
    res.status(400);
    throw new Error(`Minimum order amount is ₹${coupon.minOrderAmount}`);
  }
  const discount = Number(((orderAmount * coupon.discountPercent) / 100).toFixed(2));
  res.json({
    code: coupon.code,
    discountPercent: coupon.discountPercent,
    discountAmount: discount,
  });
});

export const getCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find({});
  res.json(coupons);
});

export const createCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.create(req.body);
  res.status(201).json(coupon);
});

export const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (coupon) {
    await coupon.deleteOne();
    res.json({ message: 'Coupon removed' });
  } else {
    res.status(404);
    throw new Error('Coupon not found');
  }
});
