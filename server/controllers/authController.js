import User from '../models/User.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

// @desc    Register a new user / athlete / team owner
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const {
      fullName,
      username,
      email,
      mobileNumber,
      password,
      country,
      gamingExperience,
      favoriteGames,
      inGameId,
      role,
      profilePicture,
    } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }],
    });

    if (userExists) {
      return errorResponse(res, 'User with this email or username already exists', 400);
    }

    const user = await User.create({
      fullName,
      username,
      email,
      mobileNumber,
      password,
      country: country || 'India',
      gamingExperience: gamingExperience || 'Intermediate',
      favoriteGames: favoriteGames || [],
      inGameId,
      role: role || 'gamer',
      profilePicture:
        profilePicture ||
        'https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=400&auto=format&fit=crop',
    });

    const token = user.getSignedJwtToken();

    return successResponse(
      res,
      'Registration successful',
      {
        user: {
          _id: user._id,
          fullName: user.fullName,
          username: user.username,
          email: user.email,
          role: user.role,
          inGameId: user.inGameId,
          country: user.country,
          profilePicture: user.profilePicture,
        },
        token,
      },
      201
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Login user with email or username
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return errorResponse(res, 'Please provide email/username and password', 400);
    }

    // Find user by email or username
    const user = await User.findOne({
      $or: [{ email: identifier.toLowerCase() }, { username: identifier.toLowerCase() }],
    }).select('+password');

    if (!user) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    if (user.isBlocked) {
      return errorResponse(res, 'Your esports account has been suspended by administration', 403);
    }

    const token = user.getSignedJwtToken();

    return successResponse(res, 'Login successful', {
      user: {
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        role: user.role,
        inGameId: user.inGameId,
        country: user.country,
        profilePicture: user.profilePicture,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    return successResponse(res, 'Profile retrieved', user);
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {};
    const allowed = ['fullName', 'mobileNumber', 'country', 'inGameId', 'favoriteGames', 'gamingExperience', 'profilePicture'];

    allowed.forEach((field) => {
      if (req.body[field] !== undefined) {
        fieldsToUpdate[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    return successResponse(res, 'Profile updated successfully', user);
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return errorResponse(res, 'No account found with this email', 404);
    }

    // In production, dispatch nodemailer token
    return successResponse(res, 'Password reset link sent to your email');
  } catch (error) {
    next(error);
  }
};

