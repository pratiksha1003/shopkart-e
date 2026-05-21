import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    image: { type: String, default: '' },
    description: { type: String, default: '' },
    // Parent category — null means this is a main/top-level category
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

categorySchema.index({ parent: 1, order: 1 });

const Category = mongoose.model('Category', categorySchema);
export default Category;
