/**
 * One-time script: add visual tags to existing products in DB.
 * Run: node utils/enrichExistingProducts.js
 */
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Product from '../models/Product.js';
import { inferVisualMeta } from './enrichProductVisual.js';

dotenv.config();

const run = async () => {
  await connectDB();
  const products = await Product.find({});
  for (const p of products) {
    const visual = inferVisualMeta(p.name, p.description);
    p.colors = visual.colors;
    p.visualTags = visual.visualTags;
    p.tags = [...new Set([...(p.tags || []), ...visual.visualTags])];
    await p.save();
  }
  console.log(`Updated ${products.length} products with visual search tags`);
  process.exit();
};

run();
