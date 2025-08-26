import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  // --- Core Fields (Common to all categories) ---
  category: {
    type: String,
    required: [true, 'Please specify a ticket category.'],
    enum: ['BUS', 'TRAIN', 'FLIGHT', 'MOVIE', 'CONCERT', 'OTHER'],
  },
  
  date: {
    type: Date,
    required: [true, 'Please provide the ticket date.'],
    index: true, // Adds an index for faster date-based queries
  },
  
  sellingPrice: {
    type: Number,
    required: [true, 'A ticket must have a selling price.'],
  },
  
  seller: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  
  status: {
    type: String,
    enum: ['available', 'sold'], // 'expired' is now handled dynamically
    default: 'available',
  },

  // --- Flexible Details Object ---
  // This object holds all category-specific information.
  ticketId: {
    type: String,
    required: [true, 'Original Ticket ID is required.'],
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    required: [true, 'Ticket details are required.'],
  },
}, { 
  timestamps: true,
  toJSON: { virtuals: true }, // Ensure virtuals are included when sending JSON
  toObject: { virtuals: true } 
});

// --- Mongoose Virtual Property ---
// A virtual property is not stored in the database.
// It's calculated on the fly, which is perfect for a status like 'isExpired'.
ticketSchema.virtual('isExpired').get(function() {
  // A ticket is expired if its date is in the past and it's still available.
  return this.date < new Date() && this.status === 'available';
});


const Ticket = mongoose.model('Ticket', ticketSchema);
export default Ticket;