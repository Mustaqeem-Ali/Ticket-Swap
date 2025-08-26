// controllers/adminController.js
import User from '../models/userModel.js';
import Ticket from '../models/ticketModel.js';
import Order from '../models/orderModel.js';

// --- User Management ---
export const getAllUsers = async (req, res) => {
  const users = await User.find();
  res.status(200).json({ status: 'success', results: users.length, data: { users } });
};

export const updateUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!user) return res.status(404).json({ message: 'No user found with that ID' });
  res.status(200).json({ status: 'success', data: { user } });
};

export const deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: 'No user found with that ID' });
  res.status(204).json({ status: 'success', data: null });
};


// --- Ticket Management ---
export const getAllTicketsAdmin = async (req, res) => {
  const tickets = await Ticket.find(); // Gets all tickets, regardless of status
  res.status(200).json({ status: 'success', results: tickets.length, data: { tickets } });
};

export const deleteTicketAdmin = async (req, res) => {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'No ticket found with that ID' });
    res.status(204).json({ status: 'success', data: null });
};

// --- Order Management ---
export const getAllOrdersAdmin = async (req, res) => {
  const orders = await Order.find();
  res.status(200).json({ status: 'success', results: orders.length, data: { orders } });
};

export const updateTicketAdmin = async (req, res) => {
  const ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!ticket) return res.status(404).json({ message: 'No ticket found with that ID' });
  res.status(200).json({ status: 'success', data: { ticket } });
};


// --- Order Management ---
// ... (existing function: getAllOrdersAdmin)

// 👇 New function to get a single order by its ID
export const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate('buyer seller ticket');
  if (!order) return res.status(404).json({ message: 'No order found with that ID' });
  res.status(200).json({ status: 'success', data: { order } });
};

// 👇 New function to get an order by the ticket's ID
export const getOrderByTicketId = async (req, res) => {
  const order = await Order.findOne({ ticket: req.params.ticketId }).populate('buyer seller ticket');
  if (!order) return res.status(404).json({ message: 'No order found for that Ticket ID' });
  res.status(200).json({ status: 'success', data: { order } });
};