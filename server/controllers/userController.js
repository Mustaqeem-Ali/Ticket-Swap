
import User from '../models/userModel.js';

// @desc    Get current logged-in user's data
// @route   GET /users/me
export const getMe = async (req, res, next) => {
  // The user's ID is attached to req.user by the authMiddleware
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({ status: 'fail', message: 'User not found.' });
  }

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
};
export const updateMe = async (req, res, next) => {
  // 1) Filter out unwanted field names that are not allowed to be updated (like password)
  const filteredBody = filterObj(req.body, 'name', 'email');

  // 2) Find user by ID and update their data
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
};

// @desc    Deactivate current user's account
// @route   DELETE /api/users/me
export const deleteMe = async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: "deleted"
  });
};


// Add other user management functions like updateMe, deleteMe as needed.