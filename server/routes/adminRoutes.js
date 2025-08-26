// routes/adminRoutes.js
import express from 'express';
import {
  getAllUsers,
  updateUser,
  deleteUser,
  getAllTicketsAdmin,
  deleteTicketAdmin,
  getAllOrdersAdmin,
  updateTicketAdmin,      
  getOrderById,           
  getOrderByTicketId 
} from '../controllers/adminController.js';
import { protect, restrictTo } from '../middlewares/authMiddleware.js';

const router = express.Router();

// 🔐 IMPORTANT: Protect all routes below and restrict them to admins only
router.use(protect, restrictTo('admin'));

router.route('/users')
  .get(getAllUsers);

router.route('/users/:id')
  .patch(updateUser)
  .delete(deleteUser);

router.route('/tickets')
    .get(getAllTicketsAdmin);

router.route('/tickets/:id')
    .patch(updateTicketAdmin)
    .delete(deleteTicketAdmin);

router.route('/orders')
    .get(getAllOrdersAdmin);
router.route('/orders/:id')
    .get(getOrderById);
router.route('/orders/ticket/:ticketId')
    .get(getOrderByTicketId);

export default router;