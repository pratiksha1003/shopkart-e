import asyncHandler from 'express-async-handler';
import SupportTicket from '../models/SupportTicket.js';

const MAX_ATTACHMENT_CHARS = 2_000_000; // ~2MB base64 guard

// @desc    Get or create user's active ticket
// @route   GET /api/support/my-ticket
export const getMyTicket = asyncHandler(async (req, res) => {
  let ticket = await SupportTicket.findOne({
    user: req.user._id,
    status: { $in: ['open', 'in_progress'] },
  }).sort({ updatedAt: -1 });

  if (!ticket) {
    ticket = await SupportTicket.create({
      user: req.user._id,
      subject: 'Live Support',
      messages: [
        {
          sender: 'admin',
          text: 'Hello! Welcome to ShopKart Support. Type a message, use voice, or share a photo from your camera.',
          messageType: 'text',
        },
      ],
    });
  }

  res.json(ticket);
});

// @desc    Send support message (text / voice / image)
// @route   POST /api/support/message
export const sendMessage = asyncHandler(async (req, res) => {
  const { ticketId, text, audioData, imageData, messageType = 'text' } = req.body;

  if (audioData?.length > MAX_ATTACHMENT_CHARS || imageData?.length > MAX_ATTACHMENT_CHARS) {
    res.status(400);
    throw new Error('Attachment too large');
  }

  let ticket;
  if (ticketId) {
    ticket = await SupportTicket.findById(ticketId);
    if (!ticket || ticket.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized');
    }
  } else {
    ticket = await SupportTicket.create({
      user: req.user._id,
      subject: req.body.subject || 'Live Support',
      messages: [],
    });
  }

  ticket.messages.push({
    sender: 'user',
    text: text || '',
    audioData: audioData || '',
    imageData: imageData || '',
    messageType,
  });
  ticket.status = 'open';
  await ticket.save();
  res.status(201).json(ticket);
});

// @desc    Poll ticket updates
// @route   GET /api/support/ticket/:id
export const getTicketById = asyncHandler(async (req, res) => {
  const ticket = await SupportTicket.findById(req.params.id).populate('user', 'name email');
  if (!ticket) {
    res.status(404);
    throw new Error('Ticket not found');
  }
  if (ticket.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    res.status(403);
    throw new Error('Not authorized');
  }
  res.json(ticket);
});

// @desc    All support tickets (admin)
// @route   GET /api/support
export const getAllTickets = asyncHandler(async (req, res) => {
  const tickets = await SupportTicket.find({})
    .populate('user', 'name email')
    .sort({ updatedAt: -1 });
  res.json(tickets);
});

// @desc    Admin reply
// @route   POST /api/support/:id/reply
export const adminReply = asyncHandler(async (req, res) => {
  const { text } = req.body;
  const ticket = await SupportTicket.findById(req.params.id);
  if (!ticket) {
    res.status(404);
    throw new Error('Ticket not found');
  }
  ticket.messages.push({ sender: 'admin', text, messageType: 'text' });
  ticket.status = req.body.status || 'in_progress';
  await ticket.save();
  res.json(ticket);
});
