import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getUserAdminDetails,
  deleteUser,
  updateUser,
  toggleWishlist,
  addRecentlyViewed,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.post('/wishlist/:productId', protect, toggleWishlist);
router.post('/recent/:productId', protect, addRecentlyViewed);
router.get('/', protect, admin, getUsers);
router.get('/:id/admin-details', protect, admin, getUserAdminDetails);
router.put('/:id', protect, admin, updateUser);
router.delete('/:id', protect, admin, deleteUser);

export default router;
