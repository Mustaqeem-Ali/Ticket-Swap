
import { body, validationResult } from 'express-validator';

// Middleware to handle validation results
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  // Format errors for a cleaner response
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.path]: err.msg }));

  return res.status(422).json({
    status: 'fail',
    errors: extractedErrors,
  });
};

// Define validation rules for user registration
export const registerRules = () => {
  return [
    body('name').notEmpty().withMessage('Name is required.'),
    body('email').isEmail().withMessage('Must be a valid email address.'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long.'),
  ];
};

// Define validation rules for creating a ticket
export const createTicketRules = () => {
  return [
    // If the category is NOT a transport type, require a title
    body("details['title']").if(body('category').not().isIn(['FLIGHT', 'TRAIN', 'BUS'])).notEmpty().withMessage('Title is required for non-transport tickets.'),

    // If the category IS a transport type, require departure and destination
    body("details['source']").if(body('category').isIn(['FLIGHT', 'TRAIN', 'BUS'])).notEmpty().withMessage('Departure is required for transport tickets.'),
    body("details['destination']").if(body('category').isIn(['FLIGHT', 'TRAIN', 'BUS'])).notEmpty().withMessage('Destination is required for transport tickets.'),

    body('category')
      .isIn(['MOVIE', 'CONCERT', 'FLIGHT', 'TRAIN', 'BUS', 'OTHER'])
      .withMessage('Invalid category provided.'),
    body('date').isISO8601().toDate().withMessage('Event date must be a valid date format.'),
    body('sellingPrice').isFloat({ gt: 0 }).withMessage('Selling price must be a positive number.'),
    body('ticketId').notEmpty().withMessage('Original Ticket ID is required.'),
  ];
};