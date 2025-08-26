import mongoose from 'mongoose';
import Ticket from '../models/ticketModel.js';
import Order from '../models/orderModel.js';
import User from '../models/userModel.js';
import { sendTicketConfirmation, sendPayoutConfirmation } from '../utils/email.js';
import { catchAsync } from '../utils/catchAsync.js';
import crypto from 'crypto';

// @desc    Create a new order after successful payment
// @route   POST /api/orders
export const createOrder = catchAsync(async (req, res, next) => {
  const { ticketId } = req.body;
  const buyerId = req.user.id;
  console.log("buyer id is ",buyerId);
  console.log("ticket id is ",ticketId);

  const session = await mongoose.startSession();
  session.startTransaction();

  let order;

  try {
    const ticket = await Ticket.findById(ticketId).session(session).populate('seller');
    
    if (!ticket) throw new Error('Ticket not found.');
    if (ticket.status !== 'available') throw new Error('This ticket is no longer available.');
    if (ticket.seller.id.toString() === buyerId) throw new Error('You cannot purchase your own ticket.');

    const orderData = {
      ticketId: ticket.id,
      buyer: buyerId,
      seller: ticket.seller.id,
      purchasePrice: ticket.sellingPrice,
      paymentDetails: {
        gateway: 'Stripe',
        transactionId: `PAY-${Date.now()}`,
        status: 'succeeded',
      },
      ticketSnapshot: {
        category: ticket.category,
        date: ticket.date,
        details: ticket.details,
      },
      payoutDetails: { status: 'pending' }, // Status is initially pending
      orderStatus: 'completed',
    };
    
    [order] = await Order.create([orderData], { session });

    ticket.status = 'sold';
    await ticket.save({ session });

    // If all operations succeed, commit the transaction
    await session.commitTransaction();

    // --- Post-Transaction Actions ---
    
    // 1. Send confirmation email to the buyer
    await sendTicketConfirmation(req.user, ticket, order);

    // 2. Process and record the seller's payout
    try {
      const seller = ticket.seller;
      const payoutId = `POUT-${Date.now()}${crypto.randomBytes(4).toString('hex')}`;

      // Update the order with payout details in the database
      const paidOrder = await Order.findByIdAndUpdate(
        order.id,
        {
          'payoutDetails.payoutId': payoutId,
          'payoutDetails.status': 'completed',
          'payoutDetails.payoutDate': new Date(),
        },
        { new: true }
      );
      
      // Send the payout confirmation email to the seller
      await sendPayoutConfirmation(seller, paidOrder, paidOrder.sellerPayoutAmount, paidOrder.platformFee);

    } catch (payoutError) {
      // If payout/email fails, log it for manual review. The sale is already complete.
      console.error(`CRITICAL: Payout processing or email failed for Order ID: ${order.id}. Please review manually.`, payoutError);
    }

    res.status(201).json({
      status: 'success',
      data: { order },
    });

  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ status: 'fail', message: error.message });
  } finally {
    session.endSession();
  }
});

// @desc    Get orders for the logged-in user (as a buyer)
// @route   GET /api/orders/my-orders
export const getMyOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find({ buyer: req.user.id })
    .populate({
      path: 'ticketId',
      select: 'category details date',
    })
    .sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    results: orders.length,
    data: { orders },
  });
});

// @desc    Get sales for the logged-in user (as a seller)
// @route   GET /api/orders/my-sales
export const getMySales = catchAsync(async (req, res, next) => {
  const sales = await Order.find({ seller: req.user.id })
    .populate({
      path: 'buyer',
      select: 'name email',
    })
    .sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    results: sales.length,
    data: { sales },
  });
});