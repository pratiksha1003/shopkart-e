import express from 'express';
import {
  getProducts,
  getProductById,
  getRelatedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
} from '../controllers/productController.js';
import { visualSearch } from '../controllers/visualSearchController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/visual-search', visualSearch);
router.get('/', getProducts);
router.get('/:id/related', getRelatedProducts);
router.get('/:id', getProductById);
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);
router.post('/:id/reviews', protect, createProductReview);

export default router;
