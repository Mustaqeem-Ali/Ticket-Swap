
import express from 'express';
import { getMe,updateMe,deleteMe } from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// All routes after this middleware are protected
router.use(protect);

router.get('/me', getMe);
router.patch('/me', updateMe);
router.delete('/me', deleteMe);

// You can add routes for updateUser, deleteUser etc. here

export default router;