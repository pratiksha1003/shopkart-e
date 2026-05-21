import Category from '../models/Category.js';

/** Returns category IDs to query products (main + all subcategories, or single subcategory) */
export const getCategoryProductIds = async (categoryId) => {
  const category = await Category.findById(categoryId);
  if (!category) return [];
  if (!category.parent) {
    const subs = await Category.find({ parent: category._id }).select('_id');
    return [category._id, ...subs.map((s) => s._id)];
  }
  return [category._id];
};
