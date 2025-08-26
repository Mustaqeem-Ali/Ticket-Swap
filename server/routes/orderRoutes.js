
import express from 'express';
import { createOrder, getMyOrders } from '../controllers/orderController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// All order routes should be protected
router.use(protect);

router.post('/', createOrder);
router.get('/my-orders', getMyOrders);

export default router;