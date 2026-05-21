import dotenv from 'dotenv';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';
import connectDB from '../config/db.js';
import { mainCategories, subcategories, productsBySubcategory } from './seed/catalogData.js';
import { inferVisualMeta } from './enrichProductVisual.js';

dotenv.config();

const seed = async () => {
  try {
    await connectDB();
    await User.deleteMany();
    await Category.deleteMany();
    // Drop legacy unique index on name if present (allows same name under different parents)
    try {
      await Category.collection.dropIndex('name_1');
    } catch {
      /* index may not exist */
    }
    await Product.deleteMany();
    await Coupon.deleteMany();

    await User.create({
      name: 'Admin User',
      email: 'admin@shopkart.com',
      password: 'admin123',
      isAdmin: true,
    });

    await User.create({
      name: 'Demo User',
      email: 'user@shopkart.com',
      password: 'user123',
    });

    const subSlugToId = {};

    for (const main of mainCategories) {
      const createdMain = await Category.create({ ...main, parent: null });
      const subs = subcategories[main.slug] || [];

      for (const sub of subs) {
        const createdSub = await Category.create({
          ...sub,
          parent: createdMain._id,
        });
        subSlugToId[sub.slug] = createdSub._id;
      }
    }

    const allProducts = [];
    for (const [subSlug, products] of Object.entries(productsBySubcategory)) {
      const categoryId = subSlugToId[subSlug];
      if (!categoryId) {
        console.warn(`Missing subcategory: ${subSlug}`);
        continue;
      }
      for (const p of products) {
        const visual = inferVisualMeta(p.name, p.description);
        allProducts.push({
          ...p,
          category: categoryId,
          colors: visual.colors,
          visualTags: visual.visualTags,
          tags: [...new Set([...(p.tags || []), ...visual.visualTags])],
        });
      }
    }

    await Product.insertMany(allProducts);

    await Coupon.insertMany([
      { code: 'SAVE10', discountPercent: 10, minOrderAmount: 500, maxUses: 1000, expiresAt: new Date('2027-12-31') },
      { code: 'FLAT20', discountPercent: 20, minOrderAmount: 2000, maxUses: 500, expiresAt: new Date('2027-12-31') },
      { code: 'WELCOME15', discountPercent: 15, minOrderAmount: 0, maxUses: 10000, expiresAt: new Date('2027-12-31') },
    ]);

    const mainCount = await Category.countDocuments({ parent: null });
    const subCount = await Category.countDocuments({ parent: { $ne: null } });
    const productCount = await Product.countDocuments();

    console.log('Seed completed successfully!');
    console.log(`  ${mainCount} main categories, ${subCount} subcategories, ${productCount} products`);
    console.log('Admin: admin@shopkart.com / admin123');
    console.log('User:  user@shopkart.com / user123');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
