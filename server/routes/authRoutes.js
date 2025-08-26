import express from 'express';
import { register, login } from '../controllers/authController.js';
import { registerRules, validate } from '../middlewares/validationMiddleware.js'; // 👈 Import

const router = express.Router();

// Apply the rules and the validator before the controller
router.post('/register', registerRules(), validate, register); // 👈 Use them here
router.post('/login', login);

export default router;

