import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const signToken = (userId, email) => {
  return jwt.sign({ id: userId, email }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// @desc    Register a new user
export const register = async (req, res) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      upiId: req.body.upiId,
    });

    const token = signToken(newUser._id, newUser.email);
    newUser.password = undefined;
    console.log(newUser);

    res.status(201).json({
      status: 'success',
      token, // Send token in the response body
      data: { user: newUser },
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

// @desc    Login a user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ status: 'fail', message: 'Please provide email and password!' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({ status: 'fail', message: 'Incorrect email or password' });
    }

    const token = signToken(user._id, user.email);
    user.password = undefined;

    res.status(200).json({
      status: 'success',
      token, // 👈 Send token in the response body
      data: { user },
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Something went wrong.' });
  }
};