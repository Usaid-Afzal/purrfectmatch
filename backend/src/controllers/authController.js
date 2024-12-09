// src/controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const Activity = require('../models/Activity');
const { validationResult } = require('express-validator');
const { sendWelcomeEmail } = require('../utils/emailService');

class AuthController {
  // Generate JWT Token
  static generateToken(user) {
    return jwt.sign(
      { 
        id: user._id, 
        email: user.email, 
        role: user.role 
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );
  }

  // User Registration
  async register(req, res) {
    try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { username, email, password} = req.body;

      // Check for existing user
      const existingUser = await User.findOne({ 
        $or: [{ email }, { username }] 
      });

      if (existingUser) {
        return res.status(400).json({ 
          message: 'User already exists with this email or username' 
        });
      }

      // Create new user
      const user = new User({
        username,
        email,
        password
      });

      await user.save();

      await Activity.create({ type: 'user_registered', details: `User ${user._id} registered` });


      // Generate token
      const token = AuthController.generateToken(user);

      res.status(201).json({
        message: 'User registered successfully',
        user: user.toJSON(),
        token,
        nextSteps: {
          profileCompletion: false,
          verificationRequired: true
        }
      });

      
      // Send the welcome email
      await sendWelcomeEmail(user.email, user.username);
      
    } catch (error) {
      res.status(500).json({ 
        message: 'Registration failed', 
        error: error.message 
      });
    }
  }

  // User Login
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Find user by email
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(401).json({ 
          message: 'Invalid credentials' 
        });
      }

      // Check password
      const isMatch = await user.comparePassword(password);

      if (!isMatch) {
        return res.status(401).json({ 
          message: 'Invalid credentials' 
        });
      }

      // Check user status
      if (!user.isActive) {
        return res.status(403).json({
          message: 'Account is inactive. Please contact support.'
        });
      }

      // Generate token
      const token = AuthController.generateToken(user);

      await Activity.create({ type: 'user_sign_in', details: `User ${user._id} logged in` });


      res.json({
        message: 'Login successful',
        user: user.toJSON(),
        token,
        profileStatus: {
          isProfileComplete: user.profileCompletionStatus.basic,
          requiredNextSteps: !user.profileCompletionStatus.basic 
            ? ['Complete Profile'] 
            : []
        }
      });
    } catch (error) {
      res.status(500).json({ 
        message: 'Login failed', 
        error: error.message 
      });
    }
  }

  // Profile Completion
  async completeProfile(req, res) {
    try {
      const userId = req.user.id;
      const profileData = req.body;

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Update user profile
      Object.assign(user, {
        ...profileData,
        profileCompletionStatus: {
          basic: true,
          advanced: false
        }
      });

      await user.save();

      res.json({
        message: 'Profile updated successfully',
        user: user.toJSON(),
        nextSteps: user.role === 'seller' 
          ? ['Complete Seller Profile'] 
          : []
      });
    } catch (error) {
      res.status(500).json({ 
        message: 'Profile completion failed', 
        error: error.message 
      });
    }
  }
}

module.exports = new AuthController();