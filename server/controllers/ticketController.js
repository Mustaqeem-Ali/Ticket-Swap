import Ticket from '../models/ticketModel.js';
import moment from 'moment';
import { catchAsync } from '../utils/catchAsync.js';


// @desc    Create a new ticket listing
// @route   POST /api/tickets
export const createTicket = catchAsync(async (req, res, next) => {
  const { category, date, sellingPrice,ticketId, details } = req.body;

  if (!category || !date || !sellingPrice || !details) {
    return res.status(400).json({ status: 'fail', message: 'Missing required fields: category, date, sellingPrice, or ' });
  }
  
  let existingTicket = await Ticket.findOne({'ticketId':ticketId });
  
  
  if (existingTicket) {
    return res.status(409).json({
      status: 'fail',
      message: 'This specific ticket (based on its unique identifiers) has already been listed.',
    });
  }

  const newTicket = await Ticket.create({
    category,
    date,
    sellingPrice,
    ticketId,
    details,
    seller: req.user.id,
  });

  res.status(201).json({
    status: 'success',
    data: {
      ticket: newTicket,
    },
  });
});


export const searchTickets = catchAsync(async (req, res, next) => {
  // 1. Build the base query object, starting with only the status
  console.log('Search query parameters:', req.query); // Debugging line
  const query = {
    status: 'available',
  };
  
  // 2. Add other search filters from req.query (category, title, location, etc.)
  
    for (const key in req.query) {
        if (req.query[key] && !['page', 'sort', 'limit', 'fields', 'date'].includes(key)) {
          // Check for the bracket notation (e.g., 'details[source]')
          if (key.includes('[') && key.includes(']')) {
            // Convert 'details[source]' into 'details.source' for Mongoose
            const mongoosePath = key.replace('[', '.').replace(']', '');
            query[mongoosePath] = { $regex: req.query[key], $options: 'i' };
          } else {
            // Handle normal, top-level fields (like category)
            query[key] = { $regex: req.query[key], $options: 'i' };
          }
        }
      }
  // 3. Handle date filtering logically
  // IMPORTANT: This code assumes the date field in your Ticket model is named 'eventDate'.
  // If you named it 'date', please change 'query.eventDate' to 'query.date' below.
  if (req.query.date) {
    // If a specific date is provided by the user, search for that entire day
    const startOfDay = moment(req.query.date).startOf('day').toDate();
    const endOfDay = moment(req.query.date).endOf('day').toDate();
    query.date = { $gte: startOfDay, $lte: endOfDay };
  } else {
    // If NO date is provided, *then* default to showing tickets from today onwards
    query.date = { $gte: moment().startOf('day').toDate() };
  }

  // 4. Execute a single, clean query to the database
  const tickets = await Ticket.find(query)
    .populate('seller', 'name')
    .sort({ date: 'asc' }); // Also sort by eventDate

  // 5. Send the response
  res.status(200).json({
    status: 'success',
    results: tickets.length,
    data: { tickets },
  });
});
// @desc    Get a single ticket by ID
// @route   GET /api/tickets/:id
export const getTicket = catchAsync(async (req, res, next) => {
  const ticket = await Ticket.findById(req.params.id).populate('seller', 'name email');

  if (!ticket) {
    return res.status(404).json({ status: 'fail', message: 'No ticket found with that ID' });
  }

  res.status(200).json({
    status: 'success',
    data: { ticket },
  });
});

// @desc    Update your ticket listing (including price)
// @route   PATCH /api/tickets/:id
export const updateTicket = catchAsync(async (req, res, next) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    return res.status(404).json({ status: 'fail', message: 'No ticket found with that ID' });
  }

  if (ticket.seller.toString() !== req.user.id) {
    return res.status(403).json({ status: 'fail', message: 'You are not authorized to update this ticket.' });
  }

  if (ticket.status === 'sold') {
    return res.status(400).json({ status: 'fail', message: 'Cannot update a ticket that has already been sold.' });
  }
  
  // Securely build the update object. Only allows price and details to be changed.
  const allowedUpdates = ['sellingPrice', 'details'];
  const updateData = {};
  Object.keys(req.body).forEach(key => {
    if (allowedUpdates.includes(key)) {
      updateData[key] = req.body[key];
    }
  });

  const updatedTicket = await Ticket.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: { ticket: updatedTicket },
  });
});

// @desc    Delete a ticket listing
// @route   DELETE /api/tickets/:id
export const deleteTicket = catchAsync(async (req, res, next) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    return res.status(404).json({ status: 'fail', message: 'No ticket found with that ID' });
  }

  if (ticket.seller.toString() !== req.user.id) {
    return res.status(403).json({ status: 'fail', message: 'You are not authorized to delete this ticket.' });
  }

  if (ticket.status === 'sold') {
    return res.status(400).json({ status: 'fail', message: 'Cannot delete a sold ticket.' });
  }
  
  await Ticket.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// @desc    Get all tickets listed by the current user
// @route   GET /api/tickets/my-listings
export const getMyListedTickets = catchAsync(async (req, res, next) => {
  const tickets = await Ticket.find({ seller: req.user.id }).sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    results: tickets.length,
    data: { tickets },
  });
});