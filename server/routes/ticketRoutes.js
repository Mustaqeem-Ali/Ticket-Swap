
import express from 'express';
import {
  searchTickets,
  createTicket,
  getTicket,
  updateTicket,
  deleteTicket,
  getMyListedTickets,

} from '../controllers/ticketController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { createTicketRules, validate } from '../middlewares/validationMiddleware.js'; // 👈 Import

const router = express.Router();

// Public routes
router.get('/', searchTickets);
router.get('/my-tickets',protect,getMyListedTickets);

router.get('/:id', getTicket);

// Protected routes
router.use(protect); // Protect all routes below this middleware

router.post('/',createTicketRules(), validate, createTicket);
router.patch('/:id', updateTicket);
router.delete('/:id',deleteTicket);

export default router;