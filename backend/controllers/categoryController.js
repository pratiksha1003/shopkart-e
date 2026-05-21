import asyncHandler from 'express-async-handler';
import Category from '../models/Category.js';
import Product from '../models/Product.js';

// @desc    Get all main categories with nested subcategories
// @route   GET /api/categories
export const getCategories = asyncHandler(async (req, res) => {
  const mainOnly = req.query.main === 'true';
  if (mainOnly) {
    const mains = await Category.find({ parent: null }).sort({ order: 1, name: 1 });
    const result = await Promise.all(
      mains.map(async (main) => {
        const subcategories = await Category.find({ parent: main._id }).sort({ order: 1, name: 1 });
        return { ...main.toObject(), subcategories };
      })
    );
    return res.json(result);
  }
  const categories = await Category.find({}).sort({ order: 1, name: 1 }).populate('parent', 'name slug');
  res.json(categories);
});

// @desc    Get category page data by slug (main category + subcategories + products)
// @route   GET /api/categories/slug/:slug
export const getCategoryBySlug = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug });
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  let mainCategory = category;
  let subcategories = [];

  if (category.parent) {
    mainCategory = await Category.findById(category.parent);
    subcategories = await Category.find({ parent: mainCategory._id }).sort({ order: 1, name: 1 });
  } else {
    subcategories = await Category.find({ parent: category._id }).sort({ order: 1, name: 1 });
  }

  const subcategoryId = req.query.subcategory;
  let productQuery = {};

  if (subcategoryId) {
    productQuery.category = subcategoryId;
  } else {
    const ids = [mainCategory._id, ...subcategories.map((s) => s._id)];
    productQuery.category = { $in: ids };
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 12;
  const skip = (page - 1) * limit;
  const total = await Product.countDocuments(productQuery);
  const products = await Product.find(productQuery)
    .populate('category', 'name slug parent')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  // Product count per subcategory for badges
  const subcategoriesWithCount = await Promise.all(
    subcategories.map(async (sub) => {
      const count = await Product.countDocuments({ category: sub._id });
      return { ...sub.toObject(), productCount: count };
    })
  );

  res.json({
    mainCategory,
    activeSubcategory: subcategoryId
      ? subcategories.find((s) => s._id.toString() === subcategoryId) || null
      : null,
    subcategories: subcategoriesWithCount,
    products,
    page,
    pages: Math.ceil(total / limit),
    total,
  });
});

export const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id).populate('parent', 'name slug');
  if (category) res.json(category);
  else {
    res.status(404);
    throw new Error('Category not found');
  }
});

export const createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json(category);
});

export const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (category) {
    Object.assign(category, req.body);
    res.json(await category.save());
  } else {
    res.status(404);
    throw new Error('Category not found');
  }
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (category) {
    const subs = await Category.find({ parent: category._id });
    if (subs.length) {
      res.status(400);
      throw new Error('Delete subcategories first');
    }
    await category.deleteOne();
    res.json({ message: 'Category removed' });
  } else {
    res.status(404);
    throw new Error('Category not found');
  }
});
