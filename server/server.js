import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';


// Import local modules
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import globalErrorHandler from './middlewares/errorMiddleware.js';
import adminRoutes from './routes/adminRoutes.js';
// --- Initial Setup ---
// Load environment variables from config.env
dotenv.config();
// Initialize Express app
const app = express();

// Connect to the MongoDB database
connectDB();

// --- Core Middleware ---
// Enable Cross-Origin Resource Sharing for all origins
app.use(cors({
  credentials: true,
}));

// Parse incoming JSON requests
app.use(express.json());
app.use(cookieParser());

// --- API Routes ---

app.use('/auth', authRoutes);     // Login/Register
app.use('/users', userRoutes);    // User profile management
app.use('/tickets', ticketRoutes); // Ticket listings
app.use('/orders', orderRoutes);   // Orders
app.use('/admin', adminRoutes);

// --- Global Error Handling Middleware ---
// This must be the last middleware to catch all errors
app.use(globalErrorHandler);

// --- Start Server ---
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});