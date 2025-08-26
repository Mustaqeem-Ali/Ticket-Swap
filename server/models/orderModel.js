import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    // --- Core References ---
    ticketId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Ticket',
      required: true,
    },
    buyer: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    seller: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },

    // --- Financial Details ---
    purchasePrice: {
      type: Number,
      required: [true, 'An order must have a purchase price.'],
    },
    platformFee: {
      type: Number,
      required: true,
    },
    sellerPayoutAmount: {
      type: Number,
      required: true,
    },

    // --- Status Tracking ---
    orderStatus: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'cancelled', 'refunded'],
      default: 'pending',
    },

    // --- Payment Gateway Information ---
    paymentDetails: {
      gateway: { type: String, required: true, default: 'Stripe' }, // e.g., 'Stripe', 'Razorpay'
      transactionId: { type: String, required: true },
      status: { type: String, required: true }, // e.g., 'succeeded', 'failed'
    },
    
    // --- Payout Information for the Seller ---
    payoutDetails: {
      payoutId: { type: String }, // The ID from the payout transaction
      status: { 
        type: String, 
        enum: ['pending', 'completed', 'failed'], 
        default: 'pending' 
      },
      payoutDate: { type: Date },
    },

    // --- Data Integrity Snapshot ---
    // Stores a copy of ticket info at the time of purchase.
    // This is crucial for history, even if the original ticket is deleted.
    ticketSnapshot: {
      category: String,
      date: Date,
      details: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// --- Mongoose Middleware to Calculate financials ---
// Before saving any order, automatically calculate the fee and final payout amount.
orderSchema.pre('validate', function(next) {
  if (this.isNew) { // Only run on creation
    const PLATFORM_FEE_PERCENTAGE = 0.10; // Example: 10% fee
    this.platformFee = this.purchasePrice * PLATFORM_FEE_PERCENTAGE;
    this.sellerPayoutAmount = this.purchasePrice - this.platformFee;
  }
  next();
});


const Order = mongoose.model('Order', orderSchema);

export default Order;