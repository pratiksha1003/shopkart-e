import express from 'express';
import {
  getMyTicket,
  sendMessage,
  getTicketById,
  getAllTickets,
  adminReply,
} from '../controllers/supportController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/my-ticket', protect, getMyTicket);
router.post('/message', protect, sendMessage);
router.get('/ticket/:id', protect, getTicketById);
router.get('/', protect, admin, getAllTickets);
router.post('/:id/reply', protect, admin, adminReply);

export default router;
