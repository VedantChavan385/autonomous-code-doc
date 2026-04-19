import User from '../user/user.model.js';
import generateToken from '../../utils/generateToken.js';

// @desc    Register a new user
// @route   POST /api/auth/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 2. Create the user (remember, our userSchema automatically hashes the password!)
    const user = await User.create({
      name,
      email,
      passwordHash: password, 
    });

    // 3. Send back the secure token and basic user info
    if (user) {
      res.status(201).json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate user & get token (Login)
// @route   POST /api/auth/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user by email (we must explicitly select passwordHash because we hid it by default in the model)
    const user = await User.findOne({ email }).select('+passwordHash');

    // 2. Check if user exists AND password matches
    if (user && (await user.matchPassword(password))) {
      res.json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current logged-in user's profile
// @route   GET /api/auth/me
export const getMe = async (req, res) => {
  // req.user was already set by the auth middleware (the bouncer)
  res.json({
    user: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
    }
  });
};
